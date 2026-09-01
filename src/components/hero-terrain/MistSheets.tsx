import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, ShaderMaterial } from "three";
import { heroCapture } from "../../lib/heroCapture";

/** Noise cards in the couloirs — not a windshield, not volumetric fog. */
function makeMistMaterial() {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    fog: false,
    side: DoubleSide,
    toneMapped: true,
    uniforms: {
      uTime: { value: 0 },
      uGain: { value: 0.1 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uGain;
      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }
      float fbm(vec2 p) {
        return noise(p) * 0.5 + noise(p * 2.13) * 0.32 + noise(p * 4.7) * 0.18;
      }

      void main() {
        float oval = smoothstep(0.0, 0.28, vUv.x) * smoothstep(1.0, 0.72, vUv.x)
          * smoothstep(0.0, 0.34, vUv.y) * smoothstep(1.0, 0.62, vUv.y);
        float n = fbm(vUv * 3.2 + vec2(uTime * 0.018, uTime * 0.011));
        float alpha = oval * mix(0.12, 1.0, n) * uGain;
        gl_FragColor = vec4(vec3(0.96, 0.975, 0.995), alpha);
      }
    `,
  });
}

const HOME_SHEETS = [
  { pos: [28, -8, 6] as const, rot: [-0.18, 0.42, 0.04] as const, size: [46, 14] as const },
  { pos: [-22, -6, 2] as const, rot: [-0.14, -0.38, -0.03] as const, size: [40, 12] as const },
  { pos: [8, -4, -24] as const, rot: [-0.22, 0.12, 0] as const, size: [36, 11] as const },
] as const;

const CLIMB_SHEETS = [
  { pos: [16, 4, 78] as const, rot: [-0.12, 0.08, 0] as const, size: [48, 18] as const },
  { pos: [16, 10, 52] as const, rot: [-0.16, 0.12, 0] as const, size: [42, 16] as const },
  { pos: [15, 16, 28] as const, rot: [-0.2, 0.2, 0] as const, size: [36, 14] as const },
] as const;

export function MistSheets({ lite = false }: { lite?: boolean }) {
  const sheets = lite ? CLIMB_SHEETS : HOME_SHEETS;
  const material = useMemo(() => makeMistMaterial(), []);

  useEffect(
    () => () => {
      material.dispose();
    },
    [material],
  );

  useFrame((state) => {
    material.uniforms.uTime.value = heroCapture.snap ? 0 : state.clock.elapsedTime;
    material.uniforms.uGain.value = lite ? 0.14 : 0.1;
  });

  return (
    <group>
      {sheets.map((sheet, i) => (
        <mesh
          key={i}
          position={[...sheet.pos]}
          rotation={[...sheet.rot]}
          renderOrder={4 + i}
          frustumCulled={false}
          material={material}
        >
          <planeGeometry args={[sheet.size[0], sheet.size[1]]} />
        </mesh>
      ))}
    </group>
  );
}
