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
import { Environment, useGLTF } from "@react-three/drei";
import { useMotionValue, useSpring } from "framer-motion";
import {
  ACESFilmicToneMapping,
  Box3,
  LinearFilter,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
  VideoTexture,
  type Group,
  type Object3D,
  type Texture,
} from "three";
import type { SiteMode } from "../../data/liveContent";
import { DRACO_PATH } from "../../lib/heroModel";
import { cn } from "../../lib/cn";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const MODEL_PATH = "/channels/oem/tv.glb";
const TV_SCREEN_VIDEO = "/channels/oem/screens/ctv-spot.mp4";
const TV_SCREEN_STILL = "/channels/oem/screens/ctv-spot.png";

const REST_Y = 0.05;
const REST_X = 0.01;

/** Screen plane in the already-scaled face-forward space (TV height ≈ 1.91). */
const SCREEN_W = 2.70;
const SCREEN_H = 1.51;
const SCREEN_Z = 0.11;
const SCREEN_Y = 0.06;

// ─── Compute model centre + scale BEFORE the scene is parented ────────────────
// We call this once after useGLTF resolves. At that point the scene is a
// standalone THREE.Group (no parent), so scene.matrixWorld = scene.matrix.
// scene.updateMatrixWorld(true) propagates transforms down to every mesh, which
// lets Box3.setFromObject read correct world-space vertex positions.
//
// Target: TV height fills ~57 % of the visible area on desktop.
// On narrow screens (mobile/portrait), we must scale down so the 16:9 TV width fits.
function getTargetHeight() {
  if (typeof window === "undefined") return 1.7;
  const aspect = window.innerWidth / window.innerHeight;
  // If aspect is less than ~1.2 (narrow window), scale down the height to fit width
  return Math.min(1.7, 1.5 * aspect);
}

function computeTransform(scene: Object3D): {
  scale: number;
  cx: number;
  cy: number;
  cz: number;
} {
  scene.updateMatrixWorld(true);
  const box = new Box3().setFromObject(scene, /* precise */ true);

  if (box.isEmpty()) {
    // Fallback from accessor analysis (FBX +180°X + Sketchfab −90°X net = +90°X)
    return { scale: 0.022 * (getTargetHeight() / 1.7), cx: 99.25, cy: -69.52, cz: -2.13 };
  }

  const size = new Vector3();
  const center = new Vector3();
  box.getSize(size);
  box.getCenter(center);

  const scale = getTargetHeight() / Math.max(size.y, 0.001);
  return { scale, cx: center.x, cy: center.y, cz: center.z };
}

type Tv3DProps = {
  mode: SiteMode;
  formatId?: string;
  className?: string;
};

function hasCtvScreen(formatId?: string) {
  return formatId === "ctv-spot" || formatId === "ctv-video";
}

// ─── Inner scene (runs inside <Canvas className="tv-glb-canvas">) ──────────────────────────────────────

// Node names to hide in the TV model — stand / leg geometry.
//
// Layer 03 / Object_22: the actual leg — 13k verts extending ~7 % below the
//   TV body bounding box (world Y < body minimum). Identified via manual bbox
//   calculation: centered Y ≈ [−54.4, −52.7] vs body min ≈ −51.5.
// Layer 05: tiny plastic-2 corner nub (440 verts) at far right-bottom edge.
// Layer 06: thin metal back-surface strip (169 verts).
const HIDDEN_NODE_NAMES = new Set([
  "Layer 03", "Object_22", "Object_22_Custom_0",
  "Layer 05",
  "Object_5", "Object_6", "Object_7", "Object_8",
  "Object_5_Plastic (2)_0", "Object_6_Plastic (2)_0",
  "Object_7_Plastic (2)_0", "Object_8_Plastic (2)_0",
]);

function TvMesh({
  rotX,
  rotY,
  formatId,
  inView,
  onReady,
}: {
  rotX: { get: () => number };
  rotY: { get: () => number };
  formatId?: string;
  inView: boolean;
  onReady?: () => void;
}) {
  const outerRef = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_PATH, DRACO_PATH);
  const showScreen = hasCtvScreen(formatId);
  const modeRef = useRef<"still" | "video">("still");
  const [screenMap, setScreenMap] = useState<Texture | null>(null);

  const [xf] = useState(() => computeTransform(scene));

  const { video, videoTex } = useMemo(() => {
    const v = document.createElement("video");
    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.setAttribute("muted", "true");
    v.preload = "auto";
    const t = new VideoTexture(v);
    t.colorSpace = SRGBColorSpace;
    t.minFilter = LinearFilter;
    t.magFilter = LinearFilter;
    t.generateMipmaps = false;
    return { video: v, videoTex: t };
  }, []);

  useEffect(() => {
    scene.traverse((obj) => {
      if (HIDDEN_NODE_NAMES.has(obj.name)) {
        obj.visible = false;
      }
    });
    onReady?.();
  }, [scene, onReady]);

  useEffect(() => {
    if (!showScreen) {
      setScreenMap(null);
      video.pause();
      return;
    }
    let cancelled = false;
    const loader = new TextureLoader();
    loader.load(TV_SCREEN_STILL, (tex) => {
      if (cancelled) {
        tex.dispose();
        return;
      }
      tex.colorSpace = SRGBColorSpace;
      tex.minFilter = LinearFilter;
      tex.magFilter = LinearFilter;
      tex.needsUpdate = true;
      modeRef.current = "still";
      setScreenMap((prev) => {
        if (prev && prev !== videoTex) prev.dispose();
        return tex;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [showScreen, video]);

  useEffect(() => {
    if (!showScreen || !inView) {
      video.pause();
      return;
    }

    let promoted = false;
    const promote = () => {
      if (promoted || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      promoted = true;
      modeRef.current = "video";
      setScreenMap((prev) => {
        if (prev && prev !== videoTex) prev.dispose();
        return videoTex;
      });
      void video.play().catch(() => {
        modeRef.current = "still";
      });
    };

    video.src = TV_SCREEN_VIDEO;
    video.addEventListener("loadeddata", promote);
    video.addEventListener("canplay", promote);
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) promote();
    else video.load();

    return () => {
      video.removeEventListener("loadeddata", promote);
      video.removeEventListener("canplay", promote);
      video.pause();
    };
  }, [showScreen, inView, video, videoTex]);

  useFrame((state) => {
    if (!outerRef.current) return;
    const t = state.clock.elapsedTime;
    outerRef.current.rotation.x = rotX.get() + Math.sin(t * 0.8) * 0.02;
    outerRef.current.rotation.y = rotY.get() + Math.cos(t * 0.6) * 0.03;
    outerRef.current.position.y = Math.sin(t * 1.2) * 0.03;
    if (modeRef.current === "video") videoTex.needsUpdate = true;
  });

  return (
    <group ref={outerRef} rotation={[0.06, 0, 0]}>
      <group scale={xf.scale} rotation={[0, Math.PI, 0]}>
        <group position={[-xf.cx, -xf.cy, -xf.cz]}>
          <primitive object={scene} dispose={null} />
        </group>
      </group>
      {showScreen && screenMap ? (
        <mesh position={[0, SCREEN_Y, SCREEN_Z]} renderOrder={2}>
          <planeGeometry args={[SCREEN_W, SCREEN_H]} />
          <meshBasicMaterial map={screenMap} toneMapped={false} />
        </mesh>
      ) : null}
    </group>
  );
}

function TvScene({
  rotX,
  rotY,
  isDark,
  formatId,
  inView,
  onMeshReady,
}: {
  rotX: { get: () => number };
  rotY: { get: () => number };
  isDark: boolean;
  formatId?: string;
  inView: boolean;
  onMeshReady?: () => void;
}) {
  return (
    <>
      <ambientLight intensity={isDark ? 1.8 : 2.2} />
      <directionalLight position={[3, 4, 4]} intensity={isDark ? 2.5 : 3.0} />
      <directionalLight position={[-3, 2, -1]} intensity={0.8} color={isDark ? "#ffb070" : "#cce0ff"} />
      <spotLight position={[0, 6, 4]} angle={0.4} penumbra={0.8} intensity={1.5} />

      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={isDark ? 1.0 : 1.3} frames={1} />
        <TvMesh rotX={rotX} rotY={rotY} formatId={formatId} inView={inView} onReady={onMeshReady} />
      </Suspense>
    </>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export function Tv3D({ mode, formatId, className }: Tv3DProps) {
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
  const markMeshReady = useCallback(() => setMeshReady(true), []);

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
    try { stageRef.current?.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
    rotY.set(REST_Y + (rotY.get() - REST_Y) * 0.35);
    rotX.set(REST_X + (rotX.get() - REST_X) * 0.35);
  };

  return (
    <div
      ref={stageRef}
      className={cn(
        "relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="img"
      aria-label="Interactive TV mockup — drag to rotate"
      data-dragging={isDragging ? "true" : "false"}
    >
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700 ease-out",
          meshReady ? "opacity-100" : "opacity-0",
        )}
      >
        <Canvas className="tv-glb-canvas"
          dpr={[1, 1.5]}
          frameloop={(!inView || reduced) ? "never" : "always"}
          gl={{
            antialias: true,
            alpha: true,
            premultipliedAlpha: false,
            powerPreference: "high-performance",
            stencil: false,
          }}
          camera={{ position: [0, 0.2, 5.5], fov: 34, near: 0.1, far: 100 }}
          style={{ background: "transparent" }}
          onCreated={({ gl }) => {
            gl.toneMapping = ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.15;
            gl.outputColorSpace = SRGBColorSpace;
            gl.setClearColor(0x000000, 0);
          }}
        >
          <TvScene
            isDark={isDark}
            formatId={formatId}
            inView={inView}
            rotX={springX}
            rotY={springY}
            onMeshReady={markMeshReady}
          />
        </Canvas>
      </div>
    </div>
  );
}

useGLTF.preload(MODEL_PATH, DRACO_PATH);
