import { Suspense, useEffect, useLayoutEffect, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { DirectionalLight, Group, Object3D, PointLight } from "three";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";
import { useTheme } from "../context/ThemeContext";
import { useHeroFlyOptional } from "../context/HeroFlyContext";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { Everest, MODEL_URL, DRACO_PATH } from "./Everest";

const POINTER_FOLLOW = 3.2;
const TRACK_FOLLOW = 4.2;
const CAM_SETTLE = 5.2;
const LOOK_SETTLE = 4.4;

/** Brand-warm fog — paper / near-black (no cool slate). */
const FOG = {
  light: { color: "#f3eee6", near: 70, far: 195 },
  dark: { color: "#0a0a0a", near: 75, far: 210 },
} as const;

/** Drone ascent from the left — far on Z, rise on Y, pitch down as we climb. */
export const HERO_ASCENT_DEFAULTS = {
  startPos: [-22, 14, 150] as [number, number, number],
  endPos: [-16, 78, 128] as [number, number, number],
  startLook: [-10, 12, 18] as [number, number, number],
  endLook: [-8, -2, 36] as [number, number, number],
  startFov: 44,
  endFov: 38,
} as const;

type AscentPath = typeof HERO_ASCENT_DEFAULTS;

type ScrollState = {
  pointerX: number;
  pointerY: number;
};

type ThemeMode = "light" | "dark";

function readProgress(heroFly: ReturnType<typeof useHeroFlyOptional>) {
  return MathUtils.clamp(heroFly?.progressRef.current ?? 0, 0, 1);
}

function Atmosphere({ theme }: { theme: ThemeMode }) {
  const isLight = theme === "light";
  const fog = isLight ? FOG.light : FOG.dark;

  return (
    <>
      <fog attach="fog" args={[fog.color, fog.near, fog.far]} />
      <ambientLight intensity={isLight ? 0.34 : 0.26} />
      <hemisphereLight
        args={[
          isLight ? "#fff8ec" : "#2a241c",
          isLight ? "#c4a882" : "#0c0a08",
          isLight ? 0.4 : 0.34,
        ]}
      />
      <mesh position={[0, 8, -70]} renderOrder={-2}>
        <planeGeometry args={[420, 180]} />
        <meshBasicMaterial color={fog.color} transparent opacity={isLight ? 0.5 : 0.72} depthWrite={false} />
      </mesh>
      <mesh position={[0, -18, 20]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-2}>
        <circleGeometry args={[220, 64]} />
        <meshBasicMaterial color={fog.color} transparent opacity={isLight ? 0.35 : 0.55} depthWrite={false} />
      </mesh>
    </>
  );
}

function HorizonGlow({ theme }: { theme: ThemeMode }) {
  const heroFly = useHeroFlyOptional();
  const rimRef = useRef<DirectionalLight>(null);
  const glowRef = useRef<PointLight>(null);
  const progressSmooth = useRef(0);
  const isLight = theme === "light";
  const accent = isLight ? "#f8c800" : "#ffcc00";

  useFrame((_, delta) => {
    progressSmooth.current = MathUtils.damp(progressSmooth.current, readProgress(heroFly), TRACK_FOLLOW, delta);
    const elev = Math.sin(MathUtils.lerp(0.15, Math.PI - 0.15, progressSmooth.current));
    if (rimRef.current) {
      rimRef.current.intensity = MathUtils.lerp(isLight ? 0.2 : 0.28, isLight ? 0.42 : 0.55, elev);
    }
    if (glowRef.current) {
      glowRef.current.intensity = MathUtils.lerp(isLight ? 0.3 : 0.55, isLight ? 0.75 : 1.2, elev);
    }
  });

  return (
    <group>
      <directionalLight ref={rimRef} color={accent} intensity={0.35} position={[8, 22, -90]} />
      <pointLight ref={glowRef} color={accent} intensity={0.7} distance={140} decay={2} position={[0, 14, -48]} />
      <mesh position={[0, 10, -55]} renderOrder={-1}>
        <planeGeometry args={[220, 48]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={isLight ? 0.06 : 0.1}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function SunRig({ theme }: { theme: ThemeMode }) {
  const heroFly = useHeroFlyOptional();
  const sunRef = useRef<Group>(null);
  const keyLightRef = useRef<DirectionalLight>(null);
  const targetRef = useRef<Object3D>(null);
  const progressSmooth = useRef(0);
  const isLight = theme === "light";

  useLayoutEffect(() => {
    const light = keyLightRef.current;
    const target = targetRef.current;
    if (!light || !target) return;
    light.target = target;
    light.target.updateMatrixWorld();
  }, []);

  useFrame((_, delta) => {
    progressSmooth.current = MathUtils.damp(progressSmooth.current, readProgress(heroFly), TRACK_FOLLOW, delta);
    const p = progressSmooth.current;
    const theta = MathUtils.lerp(Math.PI, 0, p);
    const radius = 110;
    const x = Math.cos(theta) * radius;
    const y = 8 + Math.sin(theta) * radius;
    const z = 28;

    if (sunRef.current) sunRef.current.position.set(x, y, z);
    if (keyLightRef.current) {
      keyLightRef.current.position.set(x, y, z);
      keyLightRef.current.intensity = MathUtils.lerp(
        isLight ? 0.9 : 1.15,
        isLight ? 2.2 : 2.6,
        Math.sin(theta),
      );
    }
    if (targetRef.current) {
      targetRef.current.position.set(0, 14, 0);
      keyLightRef.current?.target.updateMatrixWorld();
    }
  });

  const sunColor = isLight ? "#fff1d6" : "#ffd28a";
  const keyColor = isLight ? "#ffe8c2" : "#ffe08a";

  return (
    <group>
      <object3D ref={targetRef} position={[0, 14, 0]} />
      <directionalLight
        ref={keyLightRef}
        color={keyColor}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.00025}
        shadow-normalBias={0.04}
        shadow-camera-near={4}
        shadow-camera-far={220}
        shadow-camera-left={-90}
        shadow-camera-right={90}
        shadow-camera-top={90}
        shadow-camera-bottom={-90}
      />
      <group ref={sunRef}>
        <mesh>
          <sphereGeometry args={[3.2, 24, 24]} />
          <meshBasicMaterial color={sunColor} toneMapped={false} />
        </mesh>
        <mesh scale={2.2}>
          <sphereGeometry args={[3.2, 16, 16]} />
          <meshBasicMaterial
            color={sunColor}
            transparent
            opacity={isLight ? 0.14 : 0.26}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

function HeroCamera({
  scrollRef,
  path,
}: {
  scrollRef: MutableRefObject<ScrollState>;
  path: AscentPath;
}) {
  const { camera } = useThree();
  const heroFly = useHeroFlyOptional();
  const look = useRef(new Vector3(...path.startLook));
  const progressSmooth = useRef(0);
  const sway = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const p = (progressSmooth.current = MathUtils.damp(
      progressSmooth.current,
      readProgress(heroFly),
      TRACK_FOLLOW,
      delta,
    ));

    const [sx0, sy0, sz0] = path.startPos;
    const [sx1, sy1, sz1] = path.endPos;
    const [lx0, ly0, lz0] = path.startLook;
    const [lx1, ly1, lz1] = path.endLook;

    sway.current.x = MathUtils.damp(sway.current.x, scrollRef.current.pointerX, POINTER_FOLLOW, delta);
    sway.current.y = MathUtils.damp(sway.current.y, scrollRef.current.pointerY, POINTER_FOLLOW, delta);
    const swayX = sway.current.x * 1.6;
    const swayY = sway.current.y * 0.85;

    const camAlpha = 1 - Math.exp(-CAM_SETTLE * delta);
    const lookAlpha = 1 - Math.exp(-LOOK_SETTLE * delta);

    camera.position.x = MathUtils.lerp(camera.position.x, MathUtils.lerp(sx0, sx1, p) + swayX, camAlpha);
    camera.position.y = MathUtils.lerp(camera.position.y, MathUtils.lerp(sy0, sy1, p) + swayY * 0.3, camAlpha);
    camera.position.z = MathUtils.lerp(camera.position.z, MathUtils.lerp(sz0, sz1, p), camAlpha);

    look.current.x = MathUtils.lerp(look.current.x, MathUtils.lerp(lx0, lx1, p) + swayX * 0.12, lookAlpha);
    look.current.y = MathUtils.lerp(look.current.y, MathUtils.lerp(ly0, ly1, p), lookAlpha);
    look.current.z = MathUtils.lerp(look.current.z, MathUtils.lerp(lz0, lz1, p), lookAlpha);
    camera.lookAt(look.current);

    if (camera instanceof PerspectiveCamera) {
      camera.fov = MathUtils.lerp(camera.fov, MathUtils.lerp(path.startFov, path.endFov, p), camAlpha);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

function Scene({
  theme,
  scrollRef,
  path,
}: {
  theme: ThemeMode;
  scrollRef: MutableRefObject<ScrollState>;
  path: AscentPath;
}) {
  return (
    <>
      <Atmosphere theme={theme} />
      <HorizonGlow theme={theme} />
      <SunRig theme={theme} />
      <HeroCamera scrollRef={scrollRef} path={path} />
      <Suspense fallback={null}>
        <Everest theme={theme} castShadow receiveShadow />
      </Suspense>
    </>
  );
}

type HeroTerrainCanvasProps = {
  className?: string;
};

/** Brand-warm Everest wireframe — drone ascent + sun arc on Lenis sticky runway. */
export function HeroTerrainCanvas({ className }: HeroTerrainCanvasProps) {
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const scrollRef = useRef<ScrollState>({ pointerX: 0, pointerY: 0 });
  const shellRef = useRef<HTMLDivElement>(null);
  const path = HERO_ASCENT_DEFAULTS;

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const onMove = (event: PointerEvent) => {
      const shell = shellRef.current;
      if (!shell) return;
      const rect = shell.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      scrollRef.current.pointerX = Math.max(-1, Math.min(1, nx));
      scrollRef.current.pointerY = Math.max(-1, Math.min(1, ny));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    void useGLTF.preload(MODEL_URL, DRACO_PATH);
  }, [reduced]);

  if (reduced) return null;

  const [cx, cy, cz] = path.startPos;

  return (
    <div ref={shellRef} className={className} aria-hidden>
      <Canvas
        className="hero-terrain-canvas"
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [cx, cy, cz], fov: path.startFov, near: 0.5, far: 500 }}
        style={{ width: "100%", height: "100%", display: "block", background: "transparent" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Scene theme={theme} scrollRef={scrollRef} path={path} />
      </Canvas>
    </div>
  );
}
