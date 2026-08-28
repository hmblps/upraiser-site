import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment, useGLTF } from "@react-three/drei";
import { useMotionValue, useSpring } from "framer-motion";
import {
  ACESFilmicToneMapping,
  Color,
  MeshStandardMaterial,
  SRGBColorSpace,
  VideoTexture,
  type Group,
} from "three";
import type { SiteMode } from "../../data/liveContent";
import { cn } from "../../lib/cn";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { DRACO_PATH } from "../../lib/heroModel";
import { Model as TabletModel } from "./Tablet3DModel";

const REST_Y = 0.06;
const REST_X = -0.03;

/** Screen assets for the tablet — OEM formats (setup wizard, store, system notification). */
const TABLET_SCREEN_VIDEO: Record<string, string> = {
  "pre-install": "/channels/oem/screens/pre-install.mp4",
  "oem-store":   "/channels/oem/screens/oem-store.mp4",
  "system-ui":   "/channels/oem/screens/system-ui.mp4",
};
const TABLET_SCREEN_STILL: Record<string, string> = {
  "pre-install": "/channels/oem/screens/pre-install.png",
  "oem-store":   "/channels/oem/screens/oem-store.png",
  "system-ui":   "/channels/oem/screens/system-ui.png",
};

type Tablet3DProps = {
  mode: SiteMode;
  formatId?: string;
  className?: string;
};

function applyScreenTexture(
  root: Group | null,
  tex: VideoTexture | { image: HTMLImageElement },
) {
  if (!root) return;
  root.traverse((obj) => {
    if (!("material" in obj)) return;
    const mat = (obj as { material: unknown }).material;
    if (!mat || typeof mat !== "object") return;
    const m = mat as MeshStandardMaterial;
    // Target the `glass` material which is the tablet screen
    if (m.name !== "glass") return;
    m.map = tex as MeshStandardMaterial["map"];
    m.emissiveMap = tex as MeshStandardMaterial["map"];
    m.color = new Color("#ffffff");
    m.emissive = new Color("#ffffff");
    m.emissiveIntensity = 1.1;
    m.roughness = 0.05;
    m.metalness = 0;
    m.transparent = false;
    m.opacity = 1;
    m.needsUpdate = true;
  });
}

function TabletMesh({
  rotX,
  rotY,
  mode,
  formatId,
  onReady,
}: {
  rotX: { get: () => number };
  rotY: { get: () => number };
  mode: SiteMode;
  formatId?: string;
  onReady?: () => void;
}) {
  const group = useRef<Group>(null);
  const modeRef = useRef<"still" | "video">("still");

  const { video, videoTex } = (() => {
    const v = document.createElement("video");
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.preload = "auto";
    const t = new VideoTexture(v);
    t.colorSpace = SRGBColorSpace;
    return { video: v, videoTex: t };
  })();

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    if (!formatId) return;
    const src = TABLET_SCREEN_VIDEO[formatId];
    const stillSrc = TABLET_SCREEN_STILL[formatId];

    // Fallback to still while video loads
    if (stillSrc && group.current) {
      const img = new Image();
      img.onload = () => applyScreenTexture(group.current, { image: img } as never);
      img.src = stillSrc;
    }

    if (!src) return;

    const promote = () => {
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      modeRef.current = "video";
      applyScreenTexture(group.current, videoTex);
      void video.play().catch(() => { /* autoplay blocked */ });
    };

    video.src = src;
    video.addEventListener("loadeddata", promote);
    video.addEventListener("canplay", promote);
    video.addEventListener("ended", () => video.pause());
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) promote();
    else video.load();

    return () => {
      video.removeEventListener("loadeddata", promote);
      video.removeEventListener("canplay", promote);
      video.pause();
      video.removeAttribute("src");
      video.load();
      modeRef.current = "still";
    };
  }, [formatId, video, videoTex]);

  useFrame((state) => {
    if (!group.current) return;

    const t = state.clock.elapsedTime;
    const floatRotX = Math.sin(t * 0.7) * 0.025;
    const floatRotY = Math.cos(t * 0.5) * 0.03;

    group.current.rotation.x = rotX.get() + floatRotX;
    group.current.rotation.y = rotY.get() + floatRotY;
    group.current.position.y = Math.sin(t * 1.0) * 0.035;

    if (modeRef.current === "video") {
      videoTex.needsUpdate = true;
    }
  });

  return (
    <group ref={group}>
      <Center>
        {/* iPad — slightly tilted for depth */}
        <group rotation={[0.08, 0, 0]}>
          <group rotation={[Math.PI / 2, 0, 0]} scale={6.8}>
            <TabletModel mode={mode} />
          </group>
        </group>
      </Center>
    </group>
  );
}

function TabletScene({
  rotX,
  rotY,
  isDark,
  formatId,
  onMeshReady,
}: {
  rotX: { get: () => number };
  rotY: { get: () => number };
  isDark: boolean;
  formatId?: string;
  onMeshReady?: () => void;
}) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.6 : 0.75} />
      <directionalLight position={[2.5, 4, 3]} intensity={isDark ? 1.7 : 1.95} castShadow />
      <directionalLight position={[-2.5, 2, -1]} intensity={0.5} color={isDark ? "#ffb070" : "#8eb0e8"} />
      <spotLight position={[0, 5, 3]} angle={0.4} penumbra={0.7} intensity={1.0} />

      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={isDark ? 0.7 : 0.85} frames={1} />
        <TabletMesh
          rotX={rotX}
          rotY={rotY}
          mode={isDark ? "infrastructure" : "growth"}
          formatId={formatId}
          onReady={onMeshReady}
        />
      </Suspense>

      {/* ContactShadows removed — white oval artefact on transparent canvas */}
    </>
  );
}

export function Tablet3D({ mode, formatId, className }: Tablet3DProps) {
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
    const io = new IntersectionObserver(([e]) => setInView(e!.isIntersecting), {
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
      aria-label="Interactive iPad mockup — drag to rotate"
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
            stencil: false,
          }}
          camera={{ position: [0, 0.2, 3.8], fov: 30, near: 0.1, far: 80 }}
          style={{ background: "transparent" }}
          onCreated={({ gl }) => {
            gl.toneMapping = ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
            gl.outputColorSpace = SRGBColorSpace;
            gl.setClearColor(0x000000, 0);
          }}
        >
          <TabletScene
            isDark={isDark}
            rotX={springX}
            rotY={springY}
            formatId={formatId}
            onMeshReady={markMeshReady}
          />
        </Canvas>
      </div>
    </div>
  );
}

useGLTF.preload("/channels/oem/tablet.glb", DRACO_PATH);
