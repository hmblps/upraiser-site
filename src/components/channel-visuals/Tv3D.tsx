import {
  Suspense,
  useCallback,
  useEffect,
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
  SRGBColorSpace,
  Vector3,
  type Group,
  type Object3D,
} from "three";
import type { SiteMode } from "../../data/liveContent";
import { cn } from "../../lib/cn";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const MODEL_PATH = "/channels/oem/tv.glb";

const REST_Y = 0.05;
const REST_X = 0.01;

// ─── Compute model centre + scale BEFORE the scene is parented ────────────────
// We call this once after useGLTF resolves. At that point the scene is a
// standalone THREE.Group (no parent), so scene.matrixWorld = scene.matrix.
// scene.updateMatrixWorld(true) propagates transforms down to every mesh, which
// lets Box3.setFromObject read correct world-space vertex positions.
//
// Target: TV height fills ~57 % of the visible area — leaves room so the TV
// doesn't clip the canvas edges when rotated ±0.45 rad (the drag limit).
// At camera z=5.5, fov=34°: visible_h ≈ 3.35 u  →  0.57·3.35 = 1.91 u.
const TARGET_HEIGHT = 1.91;

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
    return { scale: 0.022, cx: 99.25, cy: -69.52, cz: -2.13 };
  }

  const size = new Vector3();
  const center = new Vector3();
  box.getSize(size);
  box.getCenter(center);

  const scale = TARGET_HEIGHT / Math.max(size.y, 0.001);
  return { scale, cx: center.x, cy: center.y, cz: center.z };
}

type Tv3DProps = {
  mode: SiteMode;
  className?: string;
};

// ─── Inner scene (runs inside <Canvas>) ──────────────────────────────────────

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
  onReady,
}: {
  rotX: { get: () => number };
  rotY: { get: () => number };
  onReady?: () => void;
}) {
  const outerRef = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_PATH);

  // Compute transform once, synchronously after the GLTF scene is available.
  // Using useState with an initialiser that runs once avoids any timing issues.
  const [xf] = useState(() => computeTransform(scene));

  // Hide the stand / leg node and call onReady once after mount.
  useEffect(() => {
    scene.traverse((obj) => {
      if (HIDDEN_NODE_NAMES.has(obj.name)) {
        obj.visible = false;
      }
    });
    onReady?.();
  }, [scene, onReady]);

  useFrame((state) => {
    if (!outerRef.current) return;
    const t = state.clock.elapsedTime;
    outerRef.current.rotation.x = rotX.get() + Math.sin(t * 0.8) * 0.02;
    outerRef.current.rotation.y = rotY.get() + Math.cos(t * 0.6) * 0.03;
    outerRef.current.position.y = Math.sin(t * 1.2) * 0.03;
  });

  return (
    // Outer group: carries floating animation + drag rotation.
    // rotation[1] = π flips TV to face-forward (screen faces +Z / toward camera).
    <group ref={outerRef} rotation={[0.06, 0, 0]}>
      {/* Scale + face-forward flip */}
      <group scale={xf.scale} rotation={[0, Math.PI, 0]}>
        {/* Centering: negate the computed world-space centre */}
        <group position={[-xf.cx, -xf.cy, -xf.cz]}>
          <primitive object={scene} dispose={null} />
        </group>
      </group>
    </group>
  );
}

function TvScene({
  rotX,
  rotY,
  isDark,
  onMeshReady,
}: {
  rotX: { get: () => number };
  rotY: { get: () => number };
  isDark: boolean;
  onMeshReady?: () => void;
}) {
  return (
    <>
      {/* Boost ambient + direct light — the TV materials are very dark (albedo ~4 %) */}
      <ambientLight intensity={isDark ? 1.8 : 2.2} />
      <directionalLight position={[3, 4, 4]} intensity={isDark ? 2.5 : 3.0} />
      <directionalLight position={[-3, 2, -1]} intensity={0.8} color={isDark ? "#ffb070" : "#cce0ff"} />
      <spotLight position={[0, 6, 4]} angle={0.4} penumbra={0.8} intensity={1.5} />

      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={isDark ? 1.0 : 1.3} frames={1} />
        <TvMesh rotX={rotX} rotY={rotY} onReady={onMeshReady} />
      </Suspense>
    </>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export function Tv3D({ mode, className }: Tv3DProps) {
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
        <Canvas
          dpr={[1, 1.5]}
          frameloop={inView ? "always" : "demand"}
          gl={{
            antialias: true,
            alpha: true,
            premultipliedAlpha: false,
            powerPreference: "high-performance",
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
            rotX={springX}
            rotY={springY}
            onMeshReady={markMeshReady}
          />
        </Canvas>
      </div>
    </div>
  );
}

useGLTF.preload(MODEL_PATH);
