import { useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, ShaderMaterial,   } from "three";
import { heroCapture } from "../../lib/heroCapture";
import { useHeroFlyOptional } from "../../context/HeroFlyContext";
import { readProgress } from "./shared";

function makeSeaMaterial(theme: string) {
  const isLight = theme === "light";
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    fog: true,
    side: DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: isLight ? [0.96, 0.975, 0.995] : [0.05, 0.05, 0.05] },
      uOpacity: { value: 0.95 },
      // ThreeJS fog uniforms are automatically injected if fog: true
    },
    vertexShader: `
      #include <fog_pars_vertex>
      varying vec2 vUv;
      varying vec3 vWorldPosition;
      void main() {
        vUv = uv;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        vec4 mvPosition = viewMatrix * worldPosition;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }
    `,
    fragmentShader: `
      #include <fog_pars_fragment>
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vUv;
      varying vec3 vWorldPosition;

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
        return noise(p) * 0.5 + noise(p * 2.0) * 0.25 + noise(p * 4.0) * 0.125;
      }

      void main() {
        float d = distance(vUv, vec2(0.5));
        float edgeFade = smoothstep(0.5, 0.1, d);

        vec2 uvScaled = vWorldPosition.xz * 0.003;
        float n = fbm(uvScaled + vec2(uTime * 0.015, uTime * 0.01));
        float n2 = fbm(uvScaled * 2.0 - vec2(uTime * 0.02, 0.0));
        float finalNoise = mix(n, n2, 0.4);
        
        float cloudAlpha = smoothstep(0.2, 0.8, finalNoise);

        gl_FragColor = vec4(uColor, cloudAlpha * edgeFade * uOpacity);
        
        #include <fog_fragment>
      }
    `,
  });
}

export function SeaOfClouds({ theme, lite = false }: { theme: "light" | "dark"; lite?: boolean }) {
  const material = useMemo(() => makeSeaMaterial(theme), [theme]);
  const heroFly = useHeroFlyOptional();

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame((state) => {
    material.uniforms.uTime.value = heroCapture.snap ? 0 : state.clock.elapsedTime;
    if (lite && heroFly) {
      const p = readProgress(heroFly);
      const fade = 1.0 - Math.min(1.0, Math.max(0.0, (p - 0.5) / 0.3));
      material.uniforms.uOpacity.value = 0.95 * fade;
    }
  });

  return (
    <mesh material={material} position={[0, 45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1400, 1400, 1, 1]} />
    </mesh>
  );
}
