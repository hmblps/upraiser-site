import fs from "fs";
let content = fs.readFileSync("src/components/hero-terrain/BrandHazeSky.tsx", "utf-8");

content = `import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Object3D } from "three";
import { BackSide, Color, ShaderMaterial, SphereGeometry, Vector3 } from "three";
import { EXPEDITION_FOG } from "./shared";

export function BrandHazeSky({ lite = false }: { lite?: boolean }) {
  const meshRef = useRef<Object3D>(null);
  const { camera } = useThree();

  const fogColor = useMemo(() => new Color(EXPEDITION_FOG.light.color), []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        depthWrite: false,
        fog: false, // Turn off actual fog to prevent shader crashes
        uniforms: {
          uZenith: { value: new Color("#ffffff") },
          uMid: { value: new Color("#f0f3f7") },
          uHorizon: { value: new Color("#e4e9f0") },
          uGlow: { value: new Color("#c8dcff") },
          uSunDir: { value: new Vector3(0.55, 0.48, -0.4).normalize() },
          uLite: { value: lite ? 1.0 : 0.0 },
          uFogColor: { value: fogColor },
        },
        vertexShader: \`
          varying vec3 vWorldPos;
          void main() {
            vec4 world = modelMatrix * vec4(position, 1.0);
            vWorldPos = world.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        \`,
        fragmentShader: \`
          uniform vec3 uZenith;
          uniform vec3 uMid;
          uniform vec3 uHorizon;
          uniform vec3 uGlow;
          uniform vec3 uSunDir;
          uniform float uLite;
          uniform vec3 uFogColor;
          varying vec3 vWorldPos;
          void main() {
            vec3 dir = normalize(vWorldPos - cameraPosition);
            float h = dir.y;
            vec3 col = mix(uHorizon, uMid, smoothstep(-0.08, 0.32, h));
            col = mix(col, uZenith, smoothstep(0.22, 0.92, h));
            float sun = pow(max(dot(dir, uSunDir), 0.0), 5.5);
            float halo = pow(max(dot(dir, uSunDir), 0.0), 1.45);
            vec3 warm = vec3(1.0, 0.82, 0.62);
            vec3 cool = uGlow;
            vec3 violet = vec3(0.78, 0.72, 1.0);
            vec3 prism = mix(cool, warm, sun);
            prism = mix(prism, violet, halo * 0.35);
            col += prism * (sun * 0.32 + halo * 0.12);
            col = mix(col, uZenith, 0.05);
            
            // If in expedition mode, just output the fog color to seamlessly blend with the blizzard!
            gl_FragColor = vec4(mix(col, uFogColor, uLite), 1.0);
          }
        \`,
      }),
    [lite, fogColor],
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
`;

fs.writeFileSync("src/components/hero-terrain/BrandHazeSky.tsx", content);
