import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, Center, ContactShadows, Environment, useGLTF, useTexture } from "@react-three/drei";
import { useMotionValue, useSpring } from "framer-motion";
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
import "../../styles/phone-css-3d.css";

/** Theme chassis — no Draco dependency (copper-opt needs DRACOLoader). */
export const MODEL_LIGHT = "/phones/deep-blue.glb";
export const MODEL_DARK = "/phones/orange.glb";

/**
 * After normalizing the iPhone node quaternion, both GLBs share:
 * X=width, Y=thickness (screen faces −Y), Z=height (island / cameras at −Z).
 */
const SHARED_ORIENT: [number, number, number] = [Math.PI / 2, 0, Math.PI];

const SCREEN_VIDEO: Record<string, string> = {
  banner: "/channels/programmatic-feed/formats/banner.mp4",
  native: "/channels/programmatic-feed/formats/native.mp4",
  interstitial: "/channels/programmatic-feed/formats/interstitial.mp4",
  rich: "/channels/programmatic-feed/formats/rich.mp4",
  video: "/channels/programmatic-feed/formats/video.mp4",
};

/** Instant glass content until the format MP4 is ready (no blank, no Suspense swap). */
const SCREEN_STILL: Record<string, string> = {
  banner: "/channels/programmatic-refs/screens/banner.png",
  native: "/channels/programmatic-refs/screens/native.png",
  interstitial: "/channels/programmatic-refs/screens/interstitial.png",
  rich: "/channels/programmatic-refs/screens/rich-media.png",
  video: "/channels/programmatic-refs/screens/video.png",
};

/** Stable URL list — must not be recreated each render (breaks useTexture/useLoader). */
const FORMAT_IDS = ["banner", "native", "interstitial", "rich", "video"] as const;
const STILL_URLS = FORMAT_IDS.map((id) => SCREEN_STILL[id]);

/** Warm GLB + stills + format MP4s so Suspense rarely shows the silhouette. */
export function preloadPhone3DAssets() {
  void useGLTF.preload(MODEL_LIGHT);
  void useGLTF.preload(MODEL_DARK);
  void useTexture.preload(STILL_URLS);
  FORMAT_IDS.forEach((id) => {
    const src = SCREEN_VIDEO[id];
    if (!src) return;
    const video = document.createElement("video");
    video.muted = true;
    video.preload = "auto";
    video.playsInline = true;
    video.src = src;
    video.load();
  });
}

const REST_Y = 0.32;
const REST_X = -0.06;

type Phone3DProps = {
  mode: SiteMode;
  formatId: string;
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
      screen.emissive = new Color("#111111");
      screen.emissiveIntensity = 0.55;
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
  onReady,
}: {
  url: string;
  formatId: string;
  inView: boolean;
  rotX: { get: () => number };
  rotY: { get: () => number };
  onReady?: () => void;
}) {
  const { scene } = useGLTF(url);
  // All stills once — format changes never re-suspend.
  const stillMaps = useTexture(STILL_URLS) as Texture[];
  const stillIndex = Math.max(
    0,
    FORMAT_IDS.findIndex((id) => id === formatId),
  );
  const still = stillMaps[stillIndex] ?? stillMaps[0]!;

  const group = useRef<Group>(null);
  const rootRef = useRef<Object3D | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoTexRef = useRef<VideoTexture | null>(null);
  const visitToken = useRef(0);
  const modeRef = useRef<"still" | "video">("still");

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

    const prevVideo = videoRef.current;
    const prevTex = videoTexRef.current;
    videoRef.current = null;
    videoTexRef.current = null;
    if (prevVideo) {
      prevVideo.pause();
      prevVideo.removeAttribute("src");
      prevVideo.load();
    }
    if (prevTex) prevTex.dispose();

    if (root) {
      modeRef.current = "still";
      applyScreenTexture(root, still);
    }

    const src = SCREEN_VIDEO[formatId];
    if (!src || !inView || !root) return;

    const video = document.createElement("video");
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("muted", "true");
    video.preload = "auto";
    video.loop = false;
    video.src = src;
    videoRef.current = video;

    const tex = new VideoTexture(video);
    configureMap(tex, true);
    videoTexRef.current = tex;

    let promoted = false;
    const promote = () => {
      if (token !== visitToken.current || promoted || !rootRef.current) return;
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      promoted = true;
      modeRef.current = "video";
      applyScreenTexture(rootRef.current, tex);
      void video.play().catch(() => {
        if (token !== visitToken.current || !rootRef.current) return;
        modeRef.current = "still";
        applyScreenTexture(rootRef.current, still);
      });
    };

    video.addEventListener("loadeddata", promote);
    video.addEventListener("canplay", promote);
    video.addEventListener("playing", promote);
    video.addEventListener("ended", () => {
      video.pause();
    });

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) promote();
    else video.load();

    return () => {
      video.removeEventListener("loadeddata", promote);
      video.removeEventListener("canplay", promote);
      video.removeEventListener("playing", promote);
      video.pause();
      video.removeAttribute("src");
      video.load();
      tex.dispose();
      if (videoRef.current === video) videoRef.current = null;
      if (videoTexRef.current === tex) videoTexRef.current = null;
    };
  }, [formatId, inView, still]);

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.x = rotX.get();
    group.current.rotation.y = rotY.get();
    if (modeRef.current === "video" && videoTexRef.current) {
      videoTexRef.current.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      <Bounds fit clip observe margin={0.8}>
        <Center>
          <group rotation={SHARED_ORIENT}>
            <primitive object={prepared} />
          </group>
        </Center>
      </Bounds>
    </group>
  );
}

function PhoneScene({
  url,
  formatId,
  inView,
  rotX,
  rotY,
  isDark,
  onMeshReady,
}: {
  url: string;
  formatId: string;
  inView: boolean;
  rotX: { get: () => number };
  rotY: { get: () => number };
  isDark: boolean;
  onMeshReady?: () => void;
}) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.55 : 0.5} />
      <directionalLight position={[2.8, 4.2, 3.2]} intensity={isDark ? 1.85 : 1.7} castShadow />
      <directionalLight position={[-3, 2.2, -1]} intensity={0.55} color={isDark ? "#ffb070" : "#8eb0e8"} />
      <spotLight position={[0, 5.2, 3.2]} angle={0.42} penumbra={0.7} intensity={1.05} />
      <Environment preset="city" environmentIntensity={isDark ? 0.7 : 0.55} />

      {/* Suspense only for initial GLB/texture resolve — never Still↔Video remount.
          Fallback stays null; Phone3D’s dark boot layer covers the transparent hole. */}
      <Suspense fallback={null}>
        <PhoneMesh
          url={url}
          formatId={formatId}
          inView={inView}
          rotX={rotX}
          rotY={rotY}
          onReady={onMeshReady}
        />
      </Suspense>

      <ContactShadows position={[0, -2.15, 0]} opacity={0.28} scale={4.4} blur={2.6} far={4.2} />
    </>
  );
}

/**
 * 3D iPhone chassis.
 * Glass: still PNG instantly → format MP4 on the same materials (no remount flash).
 * Live HTML feed stays on CssPhone (mobile); desktop uses baked MP4 of those scenes.
 */
export function Phone3D({ mode, formatId, className }: Phone3DProps) {
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

  useLayoutEffect(() => {
    void useGLTF.preload(MODEL_LIGHT);
    void useGLTF.preload(MODEL_DARK);
    void useTexture.preload(STILL_URLS);
    const warmers = FORMAT_IDS.map((id) => {
      const src = SCREEN_VIDEO[id];
      if (!src) return null;
      const video = document.createElement("video");
      video.muted = true;
      video.preload = "auto";
      video.playsInline = true;
      video.src = src;
      video.load();
      return video;
    });
    return () => {
      warmers.forEach((video) => {
        if (!video) return;
        video.removeAttribute("src");
        video.load();
      });
    };
  }, []);

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
    rotY.set(Math.max(-0.95, Math.min(0.95, rotY.get() + dx * 0.007)));
    rotX.set(Math.max(-0.35, Math.min(0.28, rotX.get() - dy * 0.005)));
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

  return (
    <div
      ref={stageRef}
      className={cn(
        "phone-css-stage phone-glb-stage",
        isDark ? "phone-glb-stage--tint" : "phone-glb-stage--deepblue",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="img"
      aria-label="Interactive phone mockup — drag to rotate"
      data-dragging={isDragging ? "true" : "false"}
    >
      <span className="phone-css-light phone-css-light--key" aria-hidden />
      <span className="phone-css-light phone-css-light--rim" aria-hidden />
      <span className="phone-css-light phone-css-light--floor" aria-hidden />

      {/* Dark stand-in while GLB/stills suspend — no white flash, no nested CssPhone tree */}
      {!meshReady ? <div className="phone-glb-boot-fallback" aria-hidden /> : null}

      <div className="phone-glb-canvas-wrap">
        <Canvas
          key={url}
          className="phone-glb-canvas"
          dpr={[1, 1.75]}
          frameloop={inView ? "always" : "never"}
          gl={{
            antialias: true,
            alpha: true,
            premultipliedAlpha: false,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, -0.08, 3.75], fov: 28, near: 0.05, far: 80 }}
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
            inView={inView}
            isDark={isDark}
            rotX={springX}
            rotY={springY}
            onMeshReady={markMeshReady}
          />
        </Canvas>
      </div>
    </div>
  );
}

useGLTF.preload(MODEL_LIGHT);
useGLTF.preload(MODEL_DARK);
useTexture.preload(STILL_URLS);
