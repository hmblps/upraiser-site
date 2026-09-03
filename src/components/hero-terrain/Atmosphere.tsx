import { useLayoutEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { DirectionalLight, Object3D, PointLight } from "three";
import { Color, MathUtils } from "three";
import { useHeroFlyOptional } from "../../context/HeroFlyContext";
import { FOG, EXPEDITION_FOG, TRACK_FOLLOW, easeOutCubic, readProgress, type ThemeMode } from "./shared";
import { heroCapture } from "../../lib/heroCapture";

export function Atmosphere({ theme, fogProfile = "home" }: { theme: ThemeMode; fogProfile?: "home" | "expedition" }) {
  const isLight = theme === "light";
  const table = fogProfile === "expedition" ? EXPEDITION_FOG : FOG;
  const fog = isLight ? table.light : table.dark;
  const heroFly = useHeroFlyOptional();
  const progressSmooth = useRef(0);
  const { scene } = useThree();

  useFrame((_, delta) => {
    progressSmooth.current = heroCapture.snap
      ? readProgress(heroFly)
      : MathUtils.damp(progressSmooth.current, readProgress(heroFly), TRACK_FOLLOW, delta);
    const p = progressSmooth.current;
    const open = easeOutCubic(p);
    const finale = MathUtils.smoothstep(p, 0.8, 1);
    const f = scene.fog;
    if (!f) return;
    // For FogExp2, we interpolate density instead of near/far
    const densityStart = 0.005;
    const densityEnd = 0.002;
    const densityFinale = 0.003;
    if ('density' in f) {
      f.density = MathUtils.lerp(MathUtils.lerp(densityStart, densityEnd, open), densityFinale, finale);
    }
  });

  return (
    <>
      <fogExp2 attach="fog" args={[fog.color, 0.005]} />
      <ambientLight color={isLight ? "#eef4ff" : "#ffffff"} intensity={isLight ? 0.02 : 0.05} />
      <hemisphereLight
        args={[
          isLight ? "#eef4ff" : "#241d11",
          isLight ? "#ffffff" : "#322716",
          isLight ? 0.15 : 0.25,
        ]}
      />
      {isLight ? <LightRimBounce /> : null}
    </>
  );
}

/** Ice-blue rim from behind-left — grazes ridges, does not fill the key side. */
function LightRimBounce() {
  const lightRef = useRef<DirectionalLight>(null);
  const targetRef = useRef<Object3D>(null);

  useLayoutEffect(() => {
    const light = lightRef.current;
    const target = targetRef.current;
    if (!light || !target) return;
    light.target = target;
    light.target.updateMatrixWorld();
  }, []);

  return (
    <group>
      <object3D ref={targetRef} position={[-4, 18, -8]} />
      <directionalLight ref={lightRef} color="#a5bce6" intensity={0.65} position={[-80, 20, -60]} />
    </group>
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
      rimRef.current.intensity = MathUtils.lerp(isLight ? 0.1 : 0.08, isLight ? 0.18 : 0.14, elev);
    }
    if (glowRef.current) {
      glowRef.current.intensity = MathUtils.lerp(0.12, 0.2, elev);
    }
  });

  return (
    <group>
      {/* Soft backlight — enough rim, not a wash on photo albedo */}
      <directionalLight ref={rimRef} color={accent} intensity={isLight ? 0.22 : 0.35} position={[8, 36, -90]} />
      {isLight ? (
        <pointLight ref={glowRef} color="#ffe2b8" intensity={0.16} distance={140} decay={2} position={[0, 22, -48]} />
      ) : null}
    </group>
  );
}

const SUNRISE = {
  keyDawn: new Color("#8fa6c4"), // Gloomy, blizzard grey-blue
  keyNoon: new Color("#ffe4bc"), // Bright warm sun
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
    
    // АГРЕССИВНЫЙ БОКОВОЙ СВЕТ (Sculpting Light)
    // Свет бьет резко слева и немного сверху, прорисовывая каждый изгиб геометрии
    const x = MathUtils.lerp(-60, -30, rise);
    const y = MathUtils.lerp(20, 10, rise); 
    const z = MathUtils.lerp(5, 15, rise);

    if (keyLightRef.current) {
      keyLightRef.current.position.set(x, y, z);
      // Компенсируем кромешную тьму от убитого envMapIntensity мощнейшим солнцем
      keyLightRef.current.intensity = MathUtils.lerp(2.0, 3.8, rise); 
      keyLightRef.current.color.lerpColors(SUNRISE.keyDawn, SUNRISE.keyNoon, rise);
      keyLightRef.current.shadow.camera.updateMatrixWorld();
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
      <directionalLight
        ref={keyLightRef}
        color="#ffd4a0"
        intensity={3.5}
        position={[-30, 10, 15]} // Начальная позиция слева
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        shadow-normalBias={0.07}
        shadow-camera-near={1}
        shadow-camera-far={520}
        shadow-camera-left={-220}
        shadow-camera-right={220}
        shadow-camera-top={180}
        shadow-camera-bottom={-180}
      />
    </group>
  );
}
