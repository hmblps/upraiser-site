import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Object3D } from "three";
import { BackSide, Color, ShaderMaterial, SphereGeometry, Vector3 } from "three";

/**
 * Brand haze dome — NOT drei <Sky> (Rayleigh drifts blue/grey).
 * Lower sphere tessellation: gradient sky doesn't need dense mesh.
 */
export function BrandHazeSky() {
  const meshRef = useRef<Object3D>(null);
  const { camera } = useThree();

  const material = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uZenith: { value: new Color("#ffffff") },
          uMid: { value: new Color("#f0f3f7") },
          uHorizon: { value: new Color("#e4e9f0") },
          uGlow: { value: new Color("#c8dcff") },
          uSunDir: { value: new Vector3(0.55, 0.48, -0.4).normalize() },
        },
        vertexShader: /* glsl */ `
          varying vec3 vWorldPos;
          void main() {
            vec4 world = modelMatrix * vec4(position, 1.0);
            vWorldPos = world.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uZenith;
          uniform vec3 uMid;
          uniform vec3 uHorizon;
          uniform vec3 uGlow;
          uniform vec3 uSunDir;
          varying vec3 vWorldPos;
          void main() {
            vec3 dir = normalize(vWorldPos - cameraPosition);
            float h = dir.y;
            vec3 col = mix(uHorizon, uMid, smoothstep(-0.08, 0.32, h));
            col = mix(col, uZenith, smoothstep(0.22, 0.92, h));
            float sun = pow(max(dot(dir, uSunDir), 0.0), 5.5);
            float halo = pow(max(dot(dir, uSunDir), 0.0), 1.45);
            // Cool core + faint warm/violet fringe so the aureole reads on white.
            vec3 warm = vec3(1.0, 0.82, 0.62);
            vec3 cool = uGlow;
            vec3 violet = vec3(0.78, 0.72, 1.0);
            vec3 prism = mix(cool, warm, sun);
            prism = mix(prism, violet, halo * 0.35);
            col += prism * (sun * 0.32 + halo * 0.12);
            col = mix(col, uZenith, 0.05);
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  );

  const geometry = useMemo(() => new SphereGeometry(720, 24, 16), []);

  useEffect(
    () => () => {
      material.dispose();
      geometry.dispose();
    },
    [material, geometry],
  );

  useFrame(() => {
    const m = meshRef.current;
    if (!m) return;
    m.position.copy(camera.position);
  });

  return (
    <mesh ref={meshRef} geometry={geometry} frustumCulled={false} renderOrder={-100}>
      <primitive object={material} attach="material" />
    </mesh>
  );
}
