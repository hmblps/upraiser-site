import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Mesh, Object3D } from "three";
import { AdditiveBlending, CircleGeometry, MathUtils, ShaderMaterial } from "three";
import { useHeroFlyOptional } from "../../context/HeroFlyContext";
import { TRACK_FOLLOW, easeOutCubic, idle01, readProgress, IDLE_BREATHE } from "./shared";

/**
 * Atmospheric ascent halo — soft aureole + prismatic ring (not a sun disc).
 * Shared CircleGeometry; materials disposed on unmount.
 */
function makeHaloFillMaterial() {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    fog: false,
    toneMapped: false,
    blending: AdditiveBlending,
    uniforms: { uOpacity: { value: 0.35 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying vec2 vUv;
      void main() {
        vec2 p = vUv * 2.0 - 1.0;
        float r = length(p);
        float fill = exp(-r * r * 1.55);
        fill *= smoothstep(1.02, 0.25, r);
        float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.01;
        float a = clamp(fill * uOpacity + dither, 0.0, 1.0);
        gl_FragColor = vec4(vec3(0.96, 0.86, 0.62), a);
      }
    `,
  });
}

function makeHaloRingMaterial() {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    fog: false,
    toneMapped: false,
    blending: AdditiveBlending,
    uniforms: {
      uOpacity: { value: 0.55 },
      uRingR: { value: 0.58 },
      uRingW: { value: 0.14 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      uniform float uRingR;
      uniform float uRingW;
      varying vec2 vUv;
      void main() {
        vec2 p = vUv * 2.0 - 1.0;
        float r = length(p);
        float d = abs(r - uRingR) / max(uRingW, 0.001);
        float ring = exp(-d * d * 2.8) * smoothstep(1.0, 0.82, r);
        float t = clamp((r - (uRingR - uRingW)) / (uRingW * 2.0), 0.0, 1.0);
        vec3 c0 = vec3(1.0, 0.55, 0.42);
        vec3 c1 = vec3(1.0, 0.82, 0.48);
        vec3 c2 = vec3(0.78, 0.88, 1.0);
        vec3 c3 = vec3(0.86, 0.72, 0.98);
        vec3 spectral = mix(c0, c1, smoothstep(0.0, 0.35, t));
        spectral = mix(spectral, c2, smoothstep(0.35, 0.7, t));
        spectral = mix(spectral, c3, smoothstep(0.7, 1.0, t));
        spectral = mix(spectral, vec3(1.0, 0.9, 0.72), 0.28);
        float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.012;
        float a = clamp(ring * uOpacity + dither, 0.0, 1.0);
        gl_FragColor = vec4(spectral, a);
      }
    `,
  });
}

export function AscentHalo() {
  const heroFly = useHeroFlyOptional();
  const groupRef = useRef<Object3D>(null);
  const fillRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const ring2Ref = useRef<Mesh>(null);
  const progressSmooth = useRef(0);

  const fillMat = useMemo(() => makeHaloFillMaterial(), []);
  const ringMat = useMemo(() => makeHaloRingMaterial(), []);
  const ring2Mat = useMemo(() => makeHaloRingMaterial(), []);
  const fillGeo = useMemo(() => new CircleGeometry(1, 48), []);
  const ringGeo = useMemo(() => new CircleGeometry(1, 64), []);

  useEffect(
    () => () => {
      fillMat.dispose();
      ringMat.dispose();
      ring2Mat.dispose();
      fillGeo.dispose();
      ringGeo.dispose();
    },
    [fillMat, ringMat, ring2Mat, fillGeo, ringGeo],
  );

  useLayoutEffect(() => {
    ring2Mat.uniforms.uRingR.value = 0.78;
    ring2Mat.uniforms.uRingW.value = 0.11;
  }, [ring2Mat]);

  useFrame((state, delta) => {
    progressSmooth.current = MathUtils.damp(progressSmooth.current, readProgress(heroFly), TRACK_FOLLOW, delta);
    const climb = easeOutCubic(progressSmooth.current);
    const t = state.clock.elapsedTime;
    const idle = idle01(t);
    const idleSigned = Math.sin(t * IDLE_BREATHE);

    if (groupRef.current) {
      groupRef.current.position.set(
        MathUtils.lerp(64, 46, climb) + idleSigned * 0.6,
        MathUtils.lerp(52, 76, climb) + idleSigned * 0.9,
        MathUtils.lerp(-48, -92, climb),
      );
    }

    const size = MathUtils.lerp(95, 190, climb) * (0.93 + 0.1 * idle);
    const fillGlow = MathUtils.lerp(0.28, 0.48, climb) * (0.82 + 0.28 * idle);
    const ringGlow = MathUtils.lerp(0.42, 0.78, climb) * (0.78 + 0.32 * idle);

    const fill = fillRef.current;
    if (fill) {
      fill.scale.setScalar(size * 1.15);
      (fill.material as ShaderMaterial).uniforms.uOpacity.value = fillGlow;
    }
    const ring = ringRef.current;
    if (ring) {
      ring.scale.setScalar(size);
      const mat = ring.material as ShaderMaterial;
      mat.uniforms.uOpacity.value = ringGlow;
      mat.uniforms.uRingR.value = 0.56 + idle * 0.025 + climb * 0.02;
      mat.uniforms.uRingW.value = 0.13 + idle * 0.025;
    }
    const ring2 = ring2Ref.current;
    if (ring2) {
      ring2.scale.setScalar(size * (1.02 + idle * 0.04));
      (ring2.material as ShaderMaterial).uniforms.uOpacity.value = ringGlow * (0.28 + 0.12 * idle);
    }
  });

  return (
    <group ref={groupRef} frustumCulled={false} renderOrder={-50}>
      <Billboard follow>
        <mesh ref={fillRef} geometry={fillGeo} material={fillMat} renderOrder={-51} frustumCulled={false} />
        <mesh ref={ringRef} geometry={ringGeo} material={ringMat} renderOrder={-49} frustumCulled={false} />
        <mesh ref={ring2Ref} geometry={ringGeo} material={ring2Mat} renderOrder={-48} frustumCulled={false} />
      </Billboard>
    </group>
  );
}
