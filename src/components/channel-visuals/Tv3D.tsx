import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, ContactShadows, Environment, useGLTF } from "@react-three/drei";
import { useMotionValue, useSpring } from "framer-motion";
import {
  ACESFilmicToneMapping,
  SRGBColorSpace,
  type Group,
} from "three";
import type { SiteMode } from "../../data/liveContent";
import { cn } from "../../lib/cn";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { DRACO_PATH } from "../../lib/heroModel";

const MODEL_PATH = "/channels/oem/tv.glb";

const REST_Y = 0.05;
const REST_X = 0.05;

type Tv3DProps = {
  mode: SiteMode;
  className?: string;
};

import { Model as TvModel } from "./Tv3DModel";
import { Model as TabletModel } from "./Tablet3DModel";

function TvMesh({
  rotX,
  rotY,
  mode,
  onReady,
}: {
  rotX: { get: () => number };
  rotY: { get: () => number };
  mode: SiteMode;
  onReady?: () => void;
}) {
  const group = useRef<Group>(null);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useFrame((state) => {
    if (!group.current) return;
    
    const t = state.clock.elapsedTime;
    const floatRotX = Math.sin(t * 0.8) * 0.03;
    const floatRotY = Math.cos(t * 0.6) * 0.04;
    
    group.current.rotation.x = rotX.get() + floatRotX;
    group.current.rotation.y = rotY.get() + floatRotY;
    group.current.position.y = Math.sin(t * 1.2) * 0.04;
  });

  return (
    <group ref={group}>
      <Center>
        <group>
          <group rotation={[0, -Math.PI / 2, 0]} scale={3.4} position={[0, -0.1, -0.5]}>
            <TvModel mode={mode} />
          </group>
          <group rotation={[Math.PI / 2, 0, 0]} scale={5.8} position={[1.4, 0.4, 1.0]}>
            <TabletModel mode={mode} />
          </group>
        </group>
      </Center>
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
      <ambientLight intensity={isDark ? 0.55 : 0.7} />
      <directionalLight position={[2.8, 4.2, 3.2]} intensity={isDark ? 1.85 : 2.0} castShadow />
      <directionalLight position={[-3, 2.2, -1]} intensity={0.55} color={isDark ? "#ffb070" : "#8eb0e8"} />
      <spotLight position={[0, 5.2, 3.2]} angle={0.42} penumbra={0.7} intensity={1.05} />
      
      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={isDark ? 0.7 : 0.85} frames={1} />
        <TvMesh
          rotX={rotX}
          rotY={rotY}
          mode={isDark ? "infrastructure" : "growth"}
          onReady={onMeshReady}
        />
      </Suspense>

      <ContactShadows position={[0, -1.1, 0]} opacity={0.35} scale={6.5} blur={2.6} far={4.2} />
    </>
  );
}

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

  const markMeshReady = useCallback(() => {
    setMeshReady(true);
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
    rotY.set(Math.max(-0.8, Math.min(0.8, rotY.get() + dx * 0.006)));
    rotX.set(Math.max(-0.4, Math.min(0.4, rotX.get() - dy * 0.004)));
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
        "relative w-full h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="img"
      aria-label="Interactive Tv mockup — drag to rotate"
      data-dragging={isDragging ? "true" : "false"}
    >
      <div className={cn("absolute inset-0 transition-opacity duration-700 ease-out", meshReady ? "opacity-100" : "opacity-0")}>
        <Canvas
          dpr={[1, 1.5]}
          frameloop={inView ? "always" : "demand"}
          gl={{
            antialias: true,
            alpha: true,
            premultipliedAlpha: false,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, 1.5, 6], fov: 40, near: 0.1, far: 80 }}
          style={{ background: "transparent" }}
          onCreated={({ gl }) => {
            gl.toneMapping = ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
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

useGLTF.preload(MODEL_PATH, DRACO_PATH);
