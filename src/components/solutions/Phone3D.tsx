import {
  Suspense,
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
  SRGBColorSpace,
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
const MODEL_LIGHT = "/phones/deep-blue.glb";
const MODEL_DARK = "/phones/orange.glb";

/**
 * After normalizing the iPhone node quaternion, both GLBs share:
 * X=width, Y=thickness (screen faces −Y), Z=height (island / cameras at −Z).
 */
const SHARED_ORIENT: [number, number, number] = [Math.PI / 2, 0, Math.PI];

const SCREEN_MAP: Record<string, string> = {
  banner: "/channels/programmatic-refs/screens/banner.png?v=solo6",
  native: "/channels/programmatic-refs/screens/native.png?v=solo6",
  interstitial: "/channels/programmatic-refs/screens/interstitial.png?v=solo6",
  rich: "/channels/programmatic-refs/screens/rich-media.png?v=solo6",
  video: "/channels/programmatic-refs/screens/video.png?v=solo6",
};

const REST_Y = 0.32;
const REST_X = -0.06;

type Phone3DProps = {
  mode: SiteMode;
  formatId: string;
  className?: string;
};

/** orange.glb ships with a 180° Z node rot — clear it so both models match. */
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

function applyScreenTexture(root: Object3D, map: Texture | null) {
  root.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const apply = (mat: Material) => {
      const name = mat.name || "";

      if (/glass/i.test(name) && !/screen/i.test(name)) {
        const glass = mat.clone() as MeshStandardMaterial;
        glass.transparent = true;
        glass.opacity = 0.06;
        glass.depthWrite = false;
        glass.roughness = 0.12;
        glass.metalness = 0;
        glass.color = new Color("#ffffff");
        glass.envMapIntensity = 0.3;
        glass.needsUpdate = true;
        return glass;
      }

      if (!/screen/i.test(name)) return mat;

      const next = mat.clone() as MeshStandardMaterial;
      if (map) {
        map.colorSpace = SRGBColorSpace;
        map.flipY = false;
        map.wrapS = ClampToEdgeWrapping;
        map.wrapT = ClampToEdgeWrapping;
        map.anisotropy = 8;
        map.generateMipmaps = true;
        map.needsUpdate = true;
        next.map = map;
        next.color = new Color("#ffffff");
        next.emissive = new Color("#111111");
        next.emissiveMap = map;
        next.emissiveIntensity = 0.55;
      } else {
        next.map = null;
        next.emissiveMap = null;
        next.color = new Color("#050505");
        next.emissive = new Color("#050505");
        next.emissiveIntensity = 0;
      }
      next.roughness = 0.9;
      next.metalness = 0;
      next.transparent = false;
      next.opacity = 1;
      next.needsUpdate = true;
      return next;
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
  screenUrl,
  rotX,
  rotY,
}: {
  url: string;
  screenUrl: string;
  rotX: { get: () => number };
  rotY: { get: () => number };
}) {
  const { scene } = useGLTF(url);
  const map = useTexture(screenUrl);
  const group = useRef<Group>(null);

  const prepared = useMemo(() => {
    const cloned = scene.clone(true);
    normalizePhoneRoot(cloned);
    applyScreenTexture(cloned, map);
    return cloned;
  }, [scene, map]);

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.x = rotX.get();
    group.current.rotation.y = rotY.get();
  });

  return (
    <group ref={group}>
      <Bounds fit clip observe margin={0.88}>
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
  screenUrl,
  rotX,
  rotY,
  isDark,
}: {
  url: string;
  screenUrl: string;
  rotX: { get: () => number };
  rotY: { get: () => number };
  isDark: boolean;
}) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.55 : 0.5} />
      <directionalLight position={[2.8, 4.2, 3.2]} intensity={isDark ? 1.85 : 1.7} castShadow />
      <directionalLight position={[-3, 2.2, -1]} intensity={0.55} color={isDark ? "#ffb070" : "#8eb0e8"} />
      <spotLight position={[0, 5.2, 3.2]} angle={0.42} penumbra={0.7} intensity={1.05} />
      <Environment preset="city" environmentIntensity={isDark ? 0.7 : 0.55} />

      <Suspense fallback={null}>
        <PhoneMesh url={url} screenUrl={screenUrl} rotX={rotX} rotY={rotY} />
      </Suspense>

      <ContactShadows position={[0, -2.15, 0]} opacity={0.28} scale={4.4} blur={2.6} far={4.2} />
    </>
  );
}

/**
 * Real iPhone GLB. Screen = PNG texture on the glass material
 * (HTML overlays misalign with the bezel — keep live feed on CssPhone / mobile).
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

  const isDark = mode !== "growth";
  const url = isDark ? MODEL_DARK : MODEL_LIGHT;
  const screenUrl = SCREEN_MAP[formatId] ?? SCREEN_MAP.banner!;

  useLayoutEffect(() => {
    void useGLTF.preload(MODEL_LIGHT);
    void useGLTF.preload(MODEL_DARK);
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
          camera={{ position: [0, 0.06, 4.05], fov: 28, near: 0.05, far: 80 }}
          style={{ background: "transparent" }}
          onCreated={({ gl }) => {
            gl.toneMapping = ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
            gl.outputColorSpace = SRGBColorSpace;
            gl.setClearColor(0x000000, 0);
          }}
        >
          <PhoneScene url={url} screenUrl={screenUrl} isDark={isDark} rotX={springX} rotY={springY} />
        </Canvas>
      </div>
    </div>
  );
}

useGLTF.preload(MODEL_LIGHT);
useGLTF.preload(MODEL_DARK);
