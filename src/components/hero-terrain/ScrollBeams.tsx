import { useRef } from "react";
import { SpotLight } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type { SpotLight as ThreeSpotLight } from "three";
import { MathUtils, Vector3 } from "three";
import { useHeroFlyOptional } from "../../context/HeroFlyContext";
import { heroCapture } from "../../lib/heroCapture";
import { TRACK_FOLLOW, easeInOutCubic, idle01, readProgress } from "./shared";

/**
 * Light-theme counterpart to NightStars: gold beams from viewport corners,
 * sweeping the wire with HeroFly progress + ~7s idle breathe.
 */
export function ScrollBeams() {
  const heroFly = useHeroFlyOptional();
  const { camera } = useThree();
  const progressSmooth = useRef(0);
  const aRef = useRef<ThreeSpotLight>(null);
  const bRef = useRef<ThreeSpotLight>(null);
  const fwd = useRef(new Vector3());
  const left = useRef(new Vector3());
  const up = useRef(new Vector3());

  useFrame((state, delta) => {
    const snap = heroCapture.snap;
    const desired = readProgress(heroFly);
    progressSmooth.current = snap
      ? desired
      : MathUtils.damp(progressSmooth.current, desired, TRACK_FOLLOW, delta);
    const p = progressSmooth.current;
    const climb = easeInOutCubic(p);
    const climbB = easeInOutCubic(MathUtils.clamp(p * 1.08 - 0.06, 0, 1));
    const t = snap ? 0 : state.clock.elapsedTime;
    const idle = snap ? 0.5 : idle01(t);
    const idleB = snap ? 0.5 : idle01(t, 1.15);
    const flutter = snap ? 0 : Math.sin(t * 0.55) * 0.5 + Math.sin(t * 0.21 + 1.1) * 0.5;

    camera.getWorldDirection(fwd.current);
    up.current.set(0, 1, 0);
    left.current.crossVectors(up.current, fwd.current).normalize();
    up.current.crossVectors(fwd.current, left.current).normalize();

    const a = aRef.current;
    if (a) {
      a.position
        .copy(camera.position)
        .addScaledVector(left.current, 26 + flutter * 0.8)
        .addScaledVector(up.current, 18 + flutter * 0.4)
        .addScaledVector(fwd.current, 22);
      a.target.position.set(
        MathUtils.lerp(-36, 42, climb) + flutter * 2,
        MathUtils.lerp(2, 52, climb),
        MathUtils.lerp(55, -70, climb),
      );
      a.target.updateMatrixWorld();
      a.intensity = MathUtils.lerp(0.45, 0.75, climb) * (0.78 + 0.28 * idle);
      a.angle = 0.3 + idle * 0.05;
    }

    const b = bRef.current;
    if (b) {
      b.position
        .copy(camera.position)
        .addScaledVector(left.current, -(22 + flutter * 0.6))
        .addScaledVector(up.current, 14 + flutter * 0.3)
        .addScaledVector(fwd.current, 26);
      b.target.position.set(
        MathUtils.lerp(40, -28, climbB) - flutter * 1.5,
        MathUtils.lerp(8, 44, climbB),
        MathUtils.lerp(40, -55, climbB),
      );
      b.target.updateMatrixWorld();
      b.intensity = MathUtils.lerp(0.28, 0.5, climbB) * (0.8 + 0.26 * idleB);
      b.angle = 0.26 + idleB * 0.045;
    }
  });

  return (
    <group>
      <SpotLight
        ref={aRef}
        color="#b8d0ff"
        intensity={3.6}
        distance={260}
        angle={0.32}
        penumbra={0.55}
        decay={1.35}
        castShadow={false}
        volumetric
        opacity={0.38}
        attenuation={90}
        anglePower={2.4}
        position={[-40, 40, 160]}
      />
      <SpotLight
        ref={bRef}
        color="#ffe6c8"
        intensity={2.2}
        distance={230}
        angle={0.28}
        penumbra={0.65}
        decay={1.4}
        castShadow={false}
        volumetric
        opacity={0.26}
        attenuation={75}
        anglePower={2.8}
        position={[40, 36, 155]}
      />
    </group>
  );
}
