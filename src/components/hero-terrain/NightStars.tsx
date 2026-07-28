import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Object3D } from "three";

/**
 * Camera-centered star dome. Counts trimmed ~35% vs original — still dense,
 * cheaper to upload/draw each frame.
 */
export function NightStars() {
  const groupRef = useRef<Object3D>(null);
  const { camera } = useThree();

  const layers = useMemo(() => {
    const make = (count: number, r0: number, r1: number, skyBias: number) => {
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i += 1) {
        const theta = (i * 2.399963229728653 + Math.random() * 0.35) % (Math.PI * 2);
        const v = Math.random();
        const cosPhi = Math.max(-0.35, 1 - Math.pow(v, skyBias) * 1.35);
        const phi = Math.acos(cosPhi);
        const r = r0 + Math.random() * (r1 - r0);
        const i3 = i * 3;
        arr[i3] = r * Math.sin(phi) * Math.cos(theta);
        arr[i3 + 1] = r * Math.cos(phi);
        arr[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      }
      return arr;
    };

    return {
      deep: make(4200, 380, 560, 0.92),
      mid: make(2800, 300, 420, 0.85),
      near: make(1200, 240, 340, 0.78),
    };
  }, []);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    g.position.copy(camera.position);
  });

  return (
    <group ref={groupRef} frustumCulled={false} renderOrder={-20}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[layers.deep, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#c5d2ef"
          size={1.45}
          sizeAttenuation={false}
          depthWrite={false}
          depthTest
          transparent
          opacity={0.72}
          fog={false}
          toneMapped={false}
        />
      </points>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[layers.mid, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#e2e9ff"
          size={2.05}
          sizeAttenuation={false}
          depthWrite={false}
          depthTest
          transparent
          opacity={0.9}
          fog={false}
          toneMapped={false}
        />
      </points>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[layers.near, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#f5f8ff"
          size={2.5}
          sizeAttenuation={false}
          depthWrite={false}
          depthTest
          transparent
          opacity={1}
          fog={false}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
