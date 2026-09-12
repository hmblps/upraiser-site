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
import { DeviceLoadStage } from "../solutions/DeviceLoadStage";
import { FORMAT_STILL, FORMAT_VIDEO } from "../../data/deviceScreens";

const MODEL_PATH = "/channels/oem/tv-draco.glb";

const REST_Y = 0.04;
const REST_X = 0.008;

// Larger living-room read — still leave frustum room for Plastic bezel + stand.
function getTargetHeight() {
  return 1.65;
}

function computeTransform(scene: Object3D): {
  scale: number;
  cx: number;
  cy: number;
  cz: number;
} {
  // Temporarily hide nodes to compute accurate bounding box
  const hidden: Object3D[] = [];
  scene.traverse((obj) => {
    if (HIDDEN_NODE_NAMES.has(obj.name) && obj.visible) {
      obj.visible = false;
      hidden.push(obj);
    }
  });

  scene.updateMatrixWorld(true);
  
  // Calculate bounding box MANUALLY to respect visibility!
  const box = new Box3();
  box.makeEmpty();
  scene.traverse((obj) => {
    // If it's in the hidden list, we skip it and all its children!
    if (HIDDEN_NODE_NAMES.has(obj.name)) {
      obj.visible = false;
      return; // But Box3 traversal can't be stopped easily with early return, so we compute manually
    }
  });

  // Second pass: actually compute box on visible meshes
  scene.traverse((obj) => {
    if (!obj.visible) return;
    if ((obj as any).isMesh) {
      const geometry = (obj as any).geometry;
      if (geometry) {
        geometry.computeBoundingBox();
        const meshBox = geometry.boundingBox.clone();
        meshBox.applyMatrix4(obj.matrixWorld);
        box.expandByPoint(meshBox.min);
        box.expandByPoint(meshBox.max);
      }
    }
  });

  if (box.isEmpty()) {
    return { scale: 0.022 * (getTargetHeight() / 2.05), cx: 99.25, cy: -69.52, cz: -2.13 };
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
  active?: boolean;
  flat?: boolean;
};

// ─── Inner scene (runs inside <Canvas className="tv-glb-canvas">) ──────────────────────────────────────

/**
 * Legs + stock crystal screen (Object_1). Ad lives on an inset OUTER plane so
 * Spot still + CTV Video read inside the bezel (not floating past Plastic).
 */
const HIDDEN_NODE_NAMES = new Set([
  "Layer 03", "Object_22", "Object_22_Custom_0",
  "Layer 05",
  "Object_5", "Object_6", "Object_7", "Object_8",
  "Object_5_Plastic (2)_0", "Object_6_Plastic (2)_0",
  "Object_7_Plastic (2)_0", "Object_8_Plastic (2)_0",
  "Front",
  "Object_65",
  "Layer 04",
  "Object_1",
  "Object_1_Custom (1)_0",
]);

/**
 * Ad plane inset inside Plastic aperture — must leave bezel visible.
 * Oversized planes swallow the chassis and read as a naked floating rectangle.
 */
function screenPlaneForHeight(h: number) {
  const ratio = h / 2.15;
  return {
    w: 3.42 * ratio,
    h: 1.93 * ratio,
    y: 0.045 * ratio,
    z: 0.088 * ratio,
  };
}

function TvMesh({
  rotX,
  rotY,
  formatId,
  inView,
  onReady,
  flat = false,
}: {
  rotX: { get: () => number };
  rotY: { get: () => number };
  formatId?: string;
  inView: boolean;
  onReady?: () => void;
  flat?: boolean;
}) {
  const outerRef = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_PATH, DRACO_PATH);
  const videoSrc = formatId ? FORMAT_VIDEO[formatId] : undefined;
  const stillSrc = (formatId && FORMAT_STILL[formatId]) || FORMAT_STILL["ctv-spot"];
  const showScreen = Boolean(videoSrc || stillSrc);
  const modeRef = useRef<"still" | "video">("still");
  const [screenMap, setScreenMap] = useState<Texture | null>(null);

  const [xf] = useState(() => computeTransform(scene));
  const screen = screenPlaneForHeight(getTargetHeight());

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
    t.flipY = true;
    return { video: v, videoTex: t };
  }, []);

  useEffect(() => {
    document.body.appendChild(video);
    return () => {
      video.pause();
      video.remove();
    };
  }, [video]);

  useEffect(() => {
    scene.traverse((obj) => {
      if (HIDDEN_NODE_NAMES.has(obj.name)) obj.visible = false;
    });
    let id2 = 0;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => onReady?.());
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, [scene, onReady]);

  useEffect(() => {
    if (!showScreen) {
      setScreenMap(null);
      video.pause();
      return;
    }
    let cancelled = false;
    const loader = new TextureLoader();
    loader.load(stillSrc!, (tex) => {
      if (cancelled) {
        tex.dispose();
        return;
      }
      tex.colorSpace = SRGBColorSpace;
      tex.minFilter = LinearFilter;
      tex.magFilter = LinearFilter;
      tex.flipY = true;
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
  }, [showScreen, stillSrc, video, videoTex]);

  useEffect(() => {
    if (!showScreen || !inView || !videoSrc) {
      video.pause();
      return;
    }

    let promoted = false;
    const promote = () => {
      if (promoted || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      promoted = true;
      modeRef.current = "video";
      videoTex.flipY = true;
      videoTex.needsUpdate = true;
      setScreenMap((prev) => {
        if (prev && prev !== videoTex) prev.dispose();
        return videoTex;
      });
      void video.play().catch(() => {
        modeRef.current = "still";
      });
    };

    video.src = videoSrc;
    video.addEventListener("loadeddata", promote);
    video.addEventListener("canplay", promote);
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) promote();
    else video.load();

    return () => {
      video.removeEventListener("loadeddata", promote);
      video.removeEventListener("canplay", promote);
      video.pause();
    };
  }, [showScreen, inView, videoSrc, video, videoTex]);

  useFrame(() => {
    if (!outerRef.current) return;
    if (flat) {
      outerRef.current.rotation.x = 0;
      outerRef.current.rotation.y = 0;
      outerRef.current.position.y = 0.0;
      if (modeRef.current === "video") videoTex.needsUpdate = true;
      return;
    }
    outerRef.current.rotation.x = rotX.get();
    outerRef.current.rotation.y = rotY.get();
    /* Снять лишний подъем по Y, который выталкивал верх телевизора за срез */
    outerRef.current.position.y = 0.0;
    if (modeRef.current === "video") videoTex.needsUpdate = true;
  });

  return (
    <group ref={outerRef} rotation={flat ? [0, 0, 0] : [0.06, 0, 0]}>
      {/* Корпус телевизора */}
      <group scale={xf.scale} rotation={[0, Math.PI, 0]}>
        <group position={[-xf.cx, -xf.cy, -xf.cz]}>
          <primitive object={scene} dispose={null} />
        </group>
      </group>

      {/* Плоскость экрана: строго по центру апертуры */}
      {showScreen && screenMap && (
        <mesh position={[0, screen.y, screen.z]} renderOrder={1}>
          <planeGeometry args={[screen.w, screen.h]} />
          <meshBasicMaterial
            map={screenMap}
            toneMapped={false}
            depthWrite
            depthTest
          />
        </mesh>
      )}
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
  flat = false,
}: {
  rotX: { get: () => number };
  rotY: { get: () => number };
  isDark: boolean;
  formatId?: string;
  inView: boolean;
  onMeshReady?: () => void;
  flat?: boolean;
}) {
  return (
    <>
      <ambientLight intensity={isDark ? 1.8 : 2.2} />
      <directionalLight position={[3, 4, 4]} intensity={isDark ? 2.5 : 3.0} />
      <directionalLight position={[-3, 2, -1]} intensity={0.8} color={isDark ? "#ffb070" : "#cce0ff"} />
      <spotLight position={[0, 6, 4]} angle={0.4} penumbra={0.8} intensity={1.5} />

      <Suspense fallback={null}>
        <TvMesh rotX={rotX} rotY={rotY} formatId={formatId} inView={inView} onReady={onMeshReady} flat={flat} />
      </Suspense>
      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={isDark ? 1.0 : 1.3} frames={1} />
      </Suspense>
    </>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export function Tv3D({ mode, formatId, className, active = true, flat = false }: Tv3DProps) {
  const reduced = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const rotY = useMotionValue(flat ? 0 : REST_Y);
  const rotX = useMotionValue(flat ? 0 : REST_X);
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
    if (reduced || flat) return;
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
    rotY.set(Math.max(-0.12, Math.min(0.12, rotY.get() + dx * 0.004)));
    rotX.set(Math.max(-0.06, Math.min(0.06, rotX.get() - dy * 0.0025)));
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
      <DeviceLoadStage ready={meshReady} placeholder={null} instant>
        <Canvas className="tv-glb-canvas"
          style={{ pointerEvents: active ? "auto" : "none" }}
          dpr={[1, 1.5]}
          frameloop={reduced ? "never" : active && inView ? "always" : "demand"}
          gl={{
            antialias: true,
            alpha: true,
            premultipliedAlpha: false,
            powerPreference: "high-performance",
            stencil: false,
          }}
          camera={{ position: [0, 0.02, flat ? 4.4 : 4.65], fov: flat ? 30 : 31, near: 0.1, far: 100 }}
          style={{ width: "100%", height: "100%", display: "block", background: "transparent", pointerEvents: "none" }}
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
            inView={active && !reduced}
            rotX={springX}
            rotY={springY}
            onMeshReady={markMeshReady}
            flat={flat}
          />
        </Canvas>
      </DeviceLoadStage>
    </div>
  );
}

useGLTF.preload(MODEL_PATH, DRACO_PATH);
