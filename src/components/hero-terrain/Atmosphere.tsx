import { useLayoutEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { DirectionalLight, Fog, Object3D, PointLight } from "three";
import { Color, MathUtils } from "three";
import { useHeroFlyOptional } from "../../context/HeroFlyContext";
import { FOG, TRACK_FOLLOW, easeOutCubic, readProgress, type ThemeMode } from "./shared";

export function Atmosphere({ theme }: { theme: ThemeMode }) {
  const isLight = theme === "light";
  const fog = isLight ? FOG.light : FOG.dark;
  const heroFly = useHeroFlyOptional();
  const progressSmooth = useRef(0);
  const { scene } = useThree();

  useFrame((_, delta) => {
    progressSmooth.current = MathUtils.damp(progressSmooth.current, readProgress(heroFly), TRACK_FOLLOW, delta);
    const p = progressSmooth.current;
    const open = easeOutCubic(p);
    const finale = MathUtils.smoothstep(p, 0.8, 1);
    const f = scene.fog as Fog | null;
    if (!f) return;
    f.near = MathUtils.lerp(MathUtils.lerp(fog.nearStart, fog.nearEnd, open), fog.nearFinale, finale);
    f.far = MathUtils.lerp(MathUtils.lerp(fog.farStart, fog.farEnd, open), fog.farFinale, finale);
  });

  return (
    <>
      <fog attach="fog" args={[fog.color, fog.nearStart, fog.farStart]} />
      {/* Light: keep fill low so photo maps + key/rim can sculpt volume (was washing to clay). */}
      <ambientLight intensity={isLight ? 0.22 : 0.26} />
      <hemisphereLight
        args={[
          isLight ? "#f4f7fb" : "#241d11",
          isLight ? "#c8d0dc" : "#0a0805",
          isLight ? 0.26 : 0.3,
        ]}
      />
      {isLight ? (
        <>
          {/* Raking Light — strong side angle to highlight normal map details */}
          <directionalLight color="#f2f6ff" intensity={1.5} position={[-80, 20, 60]} />
          {/* Fill light to soften harsh shadows */}
          <directionalLight color="#dce8ff" intensity={0.4} position={[48, 28, 42]} />
        </>
      ) : null}
    </>
  );
}

export function HorizonGlow({ theme }: { theme: ThemeMode }) {
  const heroFly = useHeroFlyOptional();
  const rimRef = useRef<DirectionalLight>(null);
  const glowRef = useRef<PointLight>(null);
  const progressSmooth = useRef(0);
  const isLight = theme === "light";
  const accent = isLight ? "#c8dcff" : "#a8842e";

  useFrame((_, delta) => {
    progressSmooth.current = MathUtils.damp(progressSmooth.current, readProgress(heroFly), TRACK_FOLLOW, delta);
    const elev = isLight ? easeOutCubic(progressSmooth.current) : 0.5;
    if (rimRef.current) {
      rimRef.current.intensity = MathUtils.lerp(isLight ? 0.55 : 0.08, isLight ? 0.85 : 0.14, elev);
    }
    if (glowRef.current) {
      glowRef.current.intensity = MathUtils.lerp(0.35, 0.55, elev);
    }
  });

  return (
    <group>
      {/* Soft backlight — enough rim, not a wash on photo albedo */}
      <directionalLight ref={rimRef} color={accent} intensity={isLight ? 0.6 : 0.35} position={[8, 36, -90]} />
      {isLight ? (
        <pointLight ref={glowRef} color="#ffe2b8" intensity={0.4} distance={140} decay={2} position={[0, 22, -48]} />
      ) : null}
    </group>
  );
}

const SUNRISE = {
  keyDawn: new Color("#ffe0b8"),
  keyNoon: new Color("#eef4ff"),
} as const;

export function SunRig({ theme }: { theme: ThemeMode }) {
  const heroFly = useHeroFlyOptional();
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
  }, [isLight]);

  useFrame((_, delta) => {
    if (!isLight) return;
    progressSmooth.current = MathUtils.damp(progressSmooth.current, readProgress(heroFly), TRACK_FOLLOW, delta);
    const rise = easeOutCubic(progressSmooth.current);
    const x = MathUtils.lerp(42, 58, rise);
    const y = MathUtils.lerp(28, 64, rise);
    const z = -52;

    if (keyLightRef.current) {
      keyLightRef.current.position.set(x, y, z);
      keyLightRef.current.intensity = MathUtils.lerp(1.35, 1.75, rise);
      keyLightRef.current.color.lerpColors(SUNRISE.keyDawn, SUNRISE.keyNoon, rise);
    }
    if (targetRef.current) {
      targetRef.current.position.set(0, 14, 0);
      keyLightRef.current?.target.updateMatrixWorld();
    }
  });

  if (!isLight) {
    return (
      <group>
        <directionalLight color="#a08448" intensity={0.55} position={[36, 58, 24]} />
        <directionalLight color="#46424e" intensity={0.3} position={[-42, 34, -30]} />
      </group>
    );
  }

  return (
    <group>
      <object3D ref={targetRef} position={[0, 14, 0]} />
      <directionalLight ref={keyLightRef} color="#eef4ff" intensity={1.4} position={[42, 28, -52]} />
    </group>
  );
}
