import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment, useGLTF, useTexture } from "@react-three/drei";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import {
  ACESFilmicToneMapping,
  ClampToEdgeWrapping,
  Color,
  LinearFilter,
  SRGBColorSpace,
  VideoTexture,
  type Group,
  type Material,
  type Mesh,
  type MeshStandardMaterial,
  type Object3D,
  type Texture,
} from "three";
import type { SiteMode } from "../../data/liveContent";
import { cn } from "../../lib/cn";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { DRACO_PATH } from "../../lib/heroModel";
import type { MotionValue } from "framer-motion";
import { InterstitialVideo } from "./InterstitialVideo";

import "../../styles/phone-css-3d.css";

/** Theme chassis — Draco-compressed (~1.9MB each). */
export const MODEL_LIGHT = "/phones/deep-blue.glb";
export const MODEL_DARK = "/phones/orange.glb";

/**
 * After normalizing the iPhone node quaternion, both GLBs share:
 * X=width, Y=thickness (screen faces −Y), Z=height (island / cameras at −Z).
 */
const SHARED_ORIENT: [number, number, number] = [Math.PI / 2, 0, Math.PI];

const SCREEN_VIDEO: Record<string, string> = {
  // App Growth lane
  banner:       "/channels/programmatic-feed/formats/banner.mp4",
  native:       "/channels/programmatic-feed/formats/native.mp4",
  interstitial: "/channels/programmatic-feed/formats/interstitial.mp4",
  rich:         "/channels/programmatic-feed/formats/rich.mp4",
  video:        "/channels/programmatic-feed/formats/video.mp4",
  // OEM lane — setup wizard, store featured, system notification
  "pre-install": "/channels/oem/screens/pre-install.mp4",
  "oem-store":   "/channels/oem/screens/oem-store.mp4",
  "system-ui":   "/channels/oem/screens/system-ui.mp4",
};

/** Instant glass content until the format MP4 is ready (no blank, no Suspense swap). */
const SCREEN_STILL: Record<string, string> = {
  // App Growth lane
  banner:       "/channels/programmatic-refs/screens/banner.png",
  native:       "/channels/programmatic-refs/screens/native.png",
  interstitial: "/channels/programmatic-refs/screens/interstitial.png",
  rich:         "/channels/programmatic-refs/screens/rich-media.png",
  video:        "/channels/programmatic-refs/screens/video.png",
  // OEM lane
  "pre-install": "/channels/oem/screens/pre-install.png",
  "oem-store":   "/channels/oem/screens/oem-store.png",
  "system-ui":   "/channels/oem/screens/system-ui.png",
};

/** Stable URL list — must not be recreated each render (breaks useTexture/useLoader). */
const FORMAT_IDS = ["banner", "native", "interstitial", "rich", "video"] as const;
const STILL_URLS = FORMAT_IDS.map((id) => SCREEN_STILL[id]);

/**
 * Warm the active chassis first (critical path). Alternate GLB + remaining stills
 * ride idle — never blast all five format MP4s on mount (was ~7MB competing).
 */
export function preloadPhone3DAssets(mode: SiteMode = "growth") {
  const primary = mode === "growth" ? MODEL_LIGHT : MODEL_DARK;
  const secondary = mode === "growth" ? MODEL_DARK : MODEL_LIGHT;
  void useGLTF.preload(primary, DRACO_PATH);
  void useTexture.preload([SCREEN_STILL.banner!]);

  const warmRest = () => {
    void useGLTF.preload(secondary, DRACO_PATH);
    void useTexture.preload(STILL_URLS);
  };

  if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(warmRest, { timeout: 2200 });
  } else {
    window.setTimeout(warmRest, 900);
  }
}

const REST_Y = 0.07;   // ~4° — subtle depth hint, phone stays face-forward
const REST_X = -0.04;  // slight backward tilt for 3D feel

type Phone3DProps = {
  mode: SiteMode;
  formatId: string;
  entranceProgress?: MotionValue<number>;
  className?: string;
};

function normalizePhoneRoot(root: Object3D) {
  root.traverse((obj) => {
    if (!/iphone/i.test(obj.name)) return;
    obj.position.set(0, 0, 0);
    obj.scale.set(1, 1, 1);
    obj.rotation.set(0, 0, 0);
    obj.quaternion.identity();
    obj.updateMatrix();
  });
  root.updateMatrixWorld(true);
}

function configureMap(map: Texture, isVideo: boolean) {
  map.colorSpace = SRGBColorSpace;
  map.flipY = false;
  map.wrapS = ClampToEdgeWrapping;
  map.wrapT = ClampToEdgeWrapping;
  map.anisotropy = isVideo ? 1 : 8;
  map.generateMipmaps = !isVideo;
  if (isVideo) {
    map.minFilter = LinearFilter;
    map.magFilter = LinearFilter;
  }
  map.needsUpdate = true;
}

function applyScreenTexture(root: Object3D, map: Texture) {
  const isVideo =
    Boolean((map as Texture & { isVideoTexture?: boolean }).isVideoTexture) ||
    map.image instanceof HTMLVideoElement;
  configureMap(map, isVideo);

  root.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const apply = (mat: Material) => {
      const name = mat.name || "";

      if (/glass/i.test(name) && !/screen/i.test(name)) {
        // Already patched on a prior pass — don't clone forever.
        if ((mat as MeshStandardMaterial & { userData: { upraiserGlass?: boolean } }).userData?.upraiserGlass) {
          return mat;
        }
        const glass = mat.clone() as MeshStandardMaterial;
        glass.transparent = true;
        glass.opacity = 0.06;
        glass.depthWrite = false;
        glass.roughness = 0.12;
        glass.metalness = 0;
        glass.color = new Color("#ffffff");
        glass.envMapIntensity = 0.3;
        glass.userData = { ...glass.userData, upraiserGlass: true };
        glass.needsUpdate = true;
        return glass;
      }

      if (!/screen/i.test(name)) return mat;

      const screen = mat as MeshStandardMaterial;
      screen.map = map;
      screen.emissiveMap = map;
      screen.color = new Color("#ffffff");
      screen.emissive = new Color("#ffffff");
      screen.emissiveIntensity = 1.25;
      screen.roughness = 0.9;
      screen.metalness = 0;
      screen.transparent = false;
      screen.opacity = 1;
      screen.depthWrite = true;
      screen.needsUpdate = true;
      return screen;
    };

    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map(apply);
    } else if (mesh.material) {
      mesh.material = apply(mesh.material);
    }
  });
}

function PhoneMesh({
  url,
  formatId,
  inView,
  rotX,
  rotY,
  entranceProgress,
  onReady,
}: {
  url: string;
  formatId: string;
  inView: boolean;
  rotX: { get: () => number };
  rotY: { get: () => number };
  entranceProgress?: MotionValue<number>;
  onReady?: () => void;
}) {
  const { scene } = useGLTF(url, DRACO_PATH);
  // All stills once — format changes never re-suspend.
  const stillMaps = useTexture(STILL_URLS) as Texture[];
  const stillIndex = Math.max(
    0,
    FORMAT_IDS.findIndex((id) => id === formatId),
  );
  const still = stillMaps[stillIndex] ?? stillMaps[0]!;

  const group = useRef<Group>(null);
  const rootRef = useRef<Object3D | null>(null);
  const visitToken = useRef(0);
  const modeRef = useRef<"still" | "video">("still");

  // Create video and texture EXACTLY ONCE to prevent GPU memory leaks and Context Lost.
  const { video, videoTex } = useMemo(() => {
    const v = document.createElement("video");
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "true");
    v.setAttribute("muted", "true");
    v.preload = "auto";
    v.loop = false;
    v.crossOrigin = "anonymous";
    const t = new VideoTexture(v);
    configureMap(t, true);
    return { video: v, videoTex: t };
  }, []);

  const prepared = useMemo(() => {
    const cloned = scene.clone(true);
    normalizePhoneRoot(cloned);
    rootRef.current = cloned;
    return cloned;
  }, [scene]);

  // Still first — never blank glass.
  useEffect(() => {
    if (!rootRef.current) return;
    modeRef.current = "still";
    applyScreenTexture(rootRef.current, still);
    onReady?.();
  }, [still, prepared, onReady]);

  // Video promotes onto the same materials (no remount → no flash).
  useEffect(() => {
    visitToken.current += 1;
    const token = visitToken.current;
    const root = rootRef.current;

    if (root) {
      modeRef.current = "still";
      applyScreenTexture(root, still);
    }

    const src = SCREEN_VIDEO[formatId];
    if (!src || !inView || !root) {
      video.pause();
      return;
    }

    let promoted = false;
    const promote = () => {
      if (token !== visitToken.current || promoted || !rootRef.current) return;
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      promoted = true;
      modeRef.current = "video";
      applyScreenTexture(rootRef.current, videoTex);
      void video.play().catch(() => {
        if (token !== visitToken.current || !rootRef.current) return;
        modeRef.current = "still";
        applyScreenTexture(rootRef.current, still);
      });
    };

    video.src = src;
    video.addEventListener("loadeddata", promote);
    video.addEventListener("canplay", promote);
    video.addEventListener("playing", promote);
    video.addEventListener("ended", () => video.pause());

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) promote();
    else video.load();

    return () => {
      video.removeEventListener("loadeddata", promote);
      video.removeEventListener("canplay", promote);
      video.removeEventListener("playing", promote);
      video.pause();
      video.removeAttribute("src");
      video.load();
      
      if (modeRef.current === "video" && rootRef.current) {
        applyScreenTexture(rootRef.current, still);
        modeRef.current = "still";
      }
    };
  }, [formatId, inView, still, video, videoTex]);

  useFrame((state) => {
    if (!group.current) return;

    const t = state.clock.elapsedTime;
    const p = entranceProgress ? Math.max(0, Math.min(1, entranceProgress.get())) : 1;

    // --- easing helpers (no allocations each frame) ---
    const easeOut3  = (x: number) => 1 - Math.pow(1 - x, 3);
    const easeIO3   = (x: number) => x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3) / 2;
    const rangeCl   = (v: number, a: number, b: number) => Math.max(0, Math.min(1, (v - a) / (b - a)));

    // Map p through [inA, inB] → [outA, outB] with optional ease
    const mr = (v: number, a: number, b: number, c: number, d: number, e = (x: number) => x) =>
      c + (d - c) * e(rangeCl(v, a, b));

    // Float amplitude: zero while phone is flying, fades in on settle (p 0.72→1.0)
    // Float fades in as phone settles (p: 0.60 → 0.90)
    const floatAmp  = mr(p, 0.60, 0.90, 0, 1, easeOut3);
    const floatRotX = Math.sin(t * 0.8) * 0.03 * floatAmp;
    const floatRotY = Math.cos(t * 0.6) * 0.04 * floatAmp;
    const floatPosY = Math.sin(t * 1.2) * 0.04 * floatAmp;

    // rotX — flat (−π/2) → interactive spring target
    // Completes at p=0.72 so the phone is upright well before copy is read
    const flatX   = -Math.PI / 2;
    const liftT   = mr(p, 0.04, 0.72, 0, 1, easeIO3);
    const baseRotX = flatX + (rotX.get() - flatX) * liftT;

    // rotY — 0 → spring target + micro overshoot at p≈0.75
    const rotateT   = mr(p, 0.14, 0.78, 0, 1, easeIO3);
    const overshoot = Math.sin(rangeCl(p, 0.68, 0.92) * Math.PI) * 0.06;
    const baseRotY  = rotY.get() * rotateT + overshoot;

    // posZ — dolly from far (3.2) → settled (0.5)
    const targetPosZ = mr(p, 0, 0.78, 3.2, 0.5, easeIO3);

    // posY — slide up from off-bottom (−1.2) → centre (0)
    const targetPosY = mr(p, 0.02, 0.65, -1.2, 0, easeOut3);

    group.current.rotation.x = baseRotX + floatRotX;
    group.current.rotation.y = baseRotY + floatRotY;
    group.current.position.y = targetPosY + floatPosY;
    group.current.position.z = targetPosZ;

    if (modeRef.current === "video") {
      videoTex.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      <Center>
        <group rotation={SHARED_ORIENT} scale={8.5} position={[0, -0.6, 0]}>
          <primitive object={prepared} />
        </group>
      </Center>
    </group>
  );
}

function PhoneScene({
  url,
  formatId,
  inView,
  rotX,
  rotY,
  entranceProgress,
  isDark,
  onMeshReady,
}: {
  url: string;
  formatId: string;
  inView: boolean;
  rotX: { get: () => number };
  rotY: { get: () => number };
  entranceProgress?: MotionValue<number>;
  isDark: boolean;
  onMeshReady?: () => void;
}) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.55 : 0.5} />
      <directionalLight position={[2.8, 4.2, 3.2]} intensity={isDark ? 1.85 : 1.7} castShadow />
      <directionalLight position={[-3, 2.2, -1]} intensity={0.55} color={isDark ? "#ffb070" : "#8eb0e8"} />
      <spotLight position={[0, 5.2, 3.2]} angle={0.42} penumbra={0.7} intensity={1.05} />
      {/* Suspense only for initial GLB/texture resolve — never Still↔Video remount.
          Fallback stays null; Phone3D’s dark boot layer covers the transparent hole. */}
      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={isDark ? 0.7 : 0.55} frames={1} />
        <PhoneMesh
          url={url}
          formatId={formatId}
          inView={inView}
          rotX={rotX}
          rotY={rotY}
          entranceProgress={entranceProgress}
          onReady={onMeshReady}
        />
      </Suspense>
    </>
  );
}

/** Rich-media iframe native size. Scale to screen width; layout is absolute so the unscaled box cannot cast a square. */
const AD_W = 320;
const AD_H = 630;

/** Interstitial close — 44px hit, 28px glyph. Visual only (demo). */
function AdCloseButton({ onClick }: { onClick?: () => void }) {
  return (
    <motion.button
      type="button"
      aria-label="Close ad"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 520, damping: 28 }}
      style={{
        position: "absolute",
        top: "clamp(1.35rem, 3.2vw, 1.85rem)",
        right: "clamp(0.45rem, 1.4vw, 0.7rem)",
        zIndex: 6,
        width: 44,
        height: 44,
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        touchAction: "manipulation",
        userSelect: "none",
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "rgba(12,12,12,0.55)",
          border: "1px solid rgba(255,255,255,0.45)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 15,
          fontWeight: 500,
          lineHeight: 1,
          boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
        }}
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M1.2 1.2l9.6 9.6M10.8 1.2L1.2 10.8" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
    </motion.button>
  );
}

/**
 * CSS chassis for formats that need real HTML (rich iframe, video interstitial).
 * Drop-shadow lives on the untransformed wrapper so perspective cannot square the shadow.
 */
function CssFormatPhone({ mode, formatId }: { mode: SiteMode; formatId: "rich" | "video" }) {
  const isDark = mode !== "growth";
  const wrapRef = useRef<HTMLDivElement>(null);
  const [adScale, setAdScale] = useState(0.64);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    setClosed(false);
  }, [formatId]);

  useEffect(() => {
    if (!closed) return;
    const t = window.setTimeout(() => setClosed(false), 1800);
    return () => window.clearTimeout(t);
  }, [closed]);

  useEffect(() => {
    if (formatId !== "rich") return;
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect;
      if (width > 0) setAdScale(Math.min(1, width / AD_W));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [formatId]);

  const phoneGrad = isDark
    ? "linear-gradient(155deg, #f0a06a, #c96f3a 42%, #9a5228)"
    : "linear-gradient(155deg, #5a7498 0%, #2a4060 34%, #152238 68%, #0c1524 100%)";

  return (
    <motion.div
      key={`css-phone-${formatId}`}
      initial={false}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: -16 }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
        pointerEvents: "all",
      }}
    >
      {/* Shadow on this untransformed box so perspective cannot square it */}
      <div
        style={{
          width: "clamp(180px, min(38vw, 17rem), 240px)",
          aspectRatio: "430 / 879",
          flexShrink: 0,
          borderRadius: "clamp(1.55rem, 2.6vw, 2.2rem)",
        }}
      >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: phoneGrad,
          borderRadius: "clamp(1.55rem, 2.6vw, 2.2rem)",
          padding: "clamp(0.14rem, 0.4vw, 0.22rem)",
          boxShadow: isDark
            ? "inset 0 1px 0 rgba(255,220,160,0.35), inset 0 -1px 0 rgba(0,0,0,0.45)"
            : "inset 0 1px 0 rgba(210,230,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.45)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          ref={wrapRef}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: "clamp(1.3rem, 2.3vw, 1.95rem)",
            overflow: "hidden",
            background: "#000",
            border: "2px solid rgba(0,0,0,0.84)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "clamp(0.45rem, 1.2vw, 0.65rem)",
              left: "50%",
              transform: "translateX(-50%)",
              width: "clamp(2.2rem, 20%, 3.1rem)",
              height: "clamp(0.5rem, 1.4vw, 0.7rem)",
              borderRadius: "999px",
              background: "#000",
              zIndex: 5,
              pointerEvents: "none",
            }}
          />

          {formatId === "rich" ? (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                width: AD_W,
                height: AD_H,
                transformOrigin: "top center",
                transform: `translateX(-50%) scale(${adScale})`,
                overflow: "hidden",
              }}
            >
              <iframe
                src="/rich-media-ad.html"
                style={{ width: AD_W, height: AD_H, border: "none", display: "block", cursor: "none" }}
                allow="autoplay; encrypted-media"
                title="Rich Media Ad"
              />
            </div>
          ) : closed ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "#0a0a0a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.45)",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Ad closed
            </div>
          ) : (
            <>
              <InterstitialVideo
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <AdCloseButton onClick={() => setClosed(true)} />
            </>
          )}

          {formatId === "rich" && (
            <div
              style={{
                pointerEvents: "none",
                position: "absolute",
                inset: 0,
                zIndex: 4,
                background:
                  "linear-gradient(125deg, rgba(255,255,255,0.14) 0%, transparent 28%, transparent 74%, rgba(255,255,255,0.04) 100%)",
                mixBlendMode: "soft-light",
              }}
            />
          )}
        </div>
      </div>
      </div>
    </motion.div>
  );
}

/**
 * 3D iPhone chassis.
 * Glass: still PNG instantly → format MP4 on the same materials (no remount flash).
 * For "rich" format: CSS phone frame with live Vidout HTML ad iframe.
 */
export function Phone3D({ mode, formatId, entranceProgress, className }: Phone3DProps) {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const rotY = useMotionValue(REST_Y);
  const rotX = useMotionValue(REST_X);
  const springY = useSpring(rotY, { stiffness: 260, damping: 30, mass: 0.7 });
  const springX = useSpring(rotX, { stiffness: 260, damping: 30, mass: 0.7 });

  const [isDragging, setIsDragging] = useState(false);
  const [inView, setInView] = useState(true);
  const [meshReady, setMeshReady] = useState(false);

  const isDark = mode !== "growth";
  const url = isDark ? MODEL_DARK : MODEL_LIGHT;

  useEffect(() => {
    setMeshReady(false);
  }, [url]);

  const markMeshReady = useCallback(() => {
    setMeshReady(true);
  }, []);

  useEffect(() => {
    preloadPhone3DAssets(mode);
  }, [mode]);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "10% 0px",
      threshold: 0,
    });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const onPointerDown = (e: ReactPointerEvent) => {
    if (reduced) return;
    dragging.current = true;
    setIsDragging(true);
    last.current = { x: e.clientX, y: e.clientY };
    stageRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    rotY.set(Math.max(-0.45, Math.min(0.45, rotY.get() + dx * 0.006)));
    rotX.set(Math.max(-0.15, Math.min(0.15, rotX.get() - dy * 0.004)));
  };

  const endDrag = (e: ReactPointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    setIsDragging(false);
    try {
      stageRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    rotY.set(REST_Y + (rotY.get() - REST_Y) * 0.35);
    rotX.set(REST_X + (rotX.get() - REST_X) * 0.35);
  };

  const isCssFormat = formatId === "rich" || formatId === "video";

  return (
    <div
      ref={stageRef}
      className={cn(
        "phone-css-stage phone-glb-stage",
        isDark ? "phone-glb-stage--tint" : "phone-glb-stage--deepblue",
        className,
      )}
      style={isCssFormat ? { cursor: "auto" } : undefined}
      onPointerDown={isCssFormat ? undefined : onPointerDown}
      onPointerMove={isCssFormat ? undefined : onPointerMove}
      onPointerUp={isCssFormat ? undefined : endDrag}
      onPointerCancel={isCssFormat ? undefined : endDrag}
      role="img"
      aria-label="Interactive phone mockup — drag to rotate"
      data-dragging={isDragging ? "true" : "false"}
    >
      {!isCssFormat && (
        <>
          <span className="phone-css-light phone-css-light--key" aria-hidden />
          <span className="phone-css-light phone-css-light--rim" aria-hidden />
          <span className="phone-css-light phone-css-light--floor" aria-hidden />
        </>
      )}

      {/* 3D canvas — always mounted (keep WebGL context), hidden behind CSS formats */}
      <div
        className={cn(
          "phone-glb-canvas-wrap transition-opacity duration-700 ease-out",
          meshReady && !isCssFormat ? "opacity-100" : "opacity-0",
        )}
        style={{
          pointerEvents: isCssFormat ? "none" : "auto",
          visibility: isCssFormat ? "hidden" : "visible",
        }}
      >
        <Canvas
          className="phone-glb-canvas"
          dpr={[1, 1.5]}
          frameloop={inView && !isCssFormat ? "always" : "demand"}
          gl={{
            antialias: true,
            alpha: true,
            premultipliedAlpha: false,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, -0.08, 3.78], fov: 28, near: 0.05, far: 80 }}
          style={{ background: "transparent" }}
          onCreated={({ gl }) => {
            gl.toneMapping = ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
            gl.outputColorSpace = SRGBColorSpace;
            gl.setClearColor(0x000000, 0);
          }}
        >
          <PhoneScene
            url={url}
            formatId={formatId}
            inView={inView && !isCssFormat}
            isDark={isDark}
            rotX={springX}
            rotY={springY}
            entranceProgress={entranceProgress}
            onMeshReady={markMeshReady}
          />
        </Canvas>
      </div>

      <AnimatePresence>
        {isCssFormat && <CssFormatPhone mode={mode} formatId={formatId as "rich" | "video"} />}
      </AnimatePresence>
    </div>
  );
}

/* Active growth chassis only at module eval — dark / stills warm on idle via preloadPhone3DAssets */
useGLTF.preload(MODEL_LIGHT, DRACO_PATH);
useTexture.preload([SCREEN_STILL.banner!]);
