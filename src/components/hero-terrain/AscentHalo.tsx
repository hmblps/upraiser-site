import { useEffect, useMemo, useRef } from "react";
import { Billboard } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import type { Mesh, Object3D } from "three";
import { AdditiveBlending, CircleGeometry, MathUtils, ShaderMaterial, Vector3 } from "three";
import { useHeroFlyOptional } from "../../context/HeroFlyContext";
import { TRACK_FOLLOW, easeOutCubic, idle01, readProgress, IDLE_BREATHE } from "./shared";

/**
 * Ice-halo as an angular sky phenomenon tied to the camera.
 *
 * NOT drei useScroll / ScrollControls — hero already drives climb via HeroFly.
 * World-pinned sun was the bug: camera climbs, halo stays, looks like a sticker.
 * Fix: place along (camera → sunDir) at fixed distance so it stays in the sky
 * of the frame; fade with climb via our progress (same Lenis sticky runway).
 */

const HALO_ANGLE = (22 * Math.PI) / 180;
const RING_UV = 0.54;
/** Fixed camera distance — optical infinity for a billboard sky effect. */
const HALO_CAM_DIST = 160;

function makeIceHaloMaterial() {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    fog: false,
    toneMapped: false,
    blending: AdditiveBlending,
    uniforms: {
      uOpacity: { value: 0.85 },
      uRingR: { value: RING_UV },
      uRingW: { value: 0.028 },
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

      vec3 haloSpectrum(float t) {
        vec3 c0 = vec3(1.0, 0.16, 0.06);
        vec3 c1 = vec3(1.0, 0.52, 0.1);
        vec3 c2 = vec3(1.0, 0.9, 0.22);
        vec3 c3 = vec3(0.4, 0.95, 0.48);
        vec3 c4 = vec3(0.28, 0.75, 1.0);
        vec3 c5 = vec3(0.58, 0.38, 1.0);
        vec3 col = mix(c0, c1, smoothstep(0.0, 0.16, t));
        col = mix(col, c2, smoothstep(0.16, 0.34, t));
        col = mix(col, c3, smoothstep(0.34, 0.5, t));
        col = mix(col, c4, smoothstep(0.5, 0.72, t));
        col = mix(col, c5, smoothstep(0.72, 1.0, t));
        return col;
      }

      void main() {
        vec2 p = vUv * 2.0 - 1.0;
        float r = length(p);
        float ang = atan(p.y, p.x);

        float core = exp(-r * r * 140.0) * 1.15;
        float corona = exp(-r * r * 22.0) * 0.16;
        float airGlow = exp(-r * r * 3.2) * 0.06;
        vec3 sunCol = vec3(1.0, 0.98, 0.94) * (core + corona) + vec3(0.85, 0.92, 1.0) * airGlow;

        float dRing = (r - uRingR) / max(uRingW, 0.001);
        float ringMask = exp(-dRing * dRing * 5.8);
        float upperBoost = smoothstep(-0.15, 0.85, p.y) * 0.28 + 0.78;
        float ringT = clamp(dRing * 0.5 + 0.5, 0.0, 1.0);
        float edgeChroma = smoothstep(0.12, 0.62, abs(dRing));
        vec3 ringSpec = haloSpectrum(ringT);
        ringSpec = mix(vec3(1.0, 0.97, 0.92), ringSpec, 0.42 + edgeChroma * 0.72);
        vec3 ringCol = ringSpec * ringMask * upperBoost * 1.4;

        float dogR = abs(r - uRingR);
        float dogSpread = uRingW * uRingW * 1.6;
        float dogL = exp(-dogR * dogR / dogSpread) * exp(-pow(ang - 3.14159265, 2.0) / 0.055);
        float dogRight = exp(-dogR * dogR / dogSpread) * exp(-ang * ang / 0.055);
        float dogL2 = exp(-dogR * dogR / dogSpread) * exp(-pow(ang + 3.14159265, 2.0) / 0.055);
        float dogs = max(dogRight, max(dogL, dogL2));
        float dogHue = clamp((abs(p.x) - uRingR * 0.82) / 0.28, 0.0, 1.0);
        vec3 dogCol = haloSpectrum(dogHue) * dogs * 2.15;
        dogCol += vec3(1.0, 0.95, 0.88) * dogs * 0.18;

        float parhelic = exp(-p.y * p.y / 0.0009)
          * smoothstep(0.14, 0.48, abs(p.x))
          * smoothstep(1.02, 0.58, abs(p.x));
        vec3 parCol = vec3(0.95, 0.97, 1.0) * parhelic * 0.2;

        float arcY = uRingR + 0.055;
        float arc = exp(-pow(r - (arcY + 0.03 * (1.0 - p.y * p.y)), 2.0) / 0.0014)
          * smoothstep(0.08, 0.55, p.y)
          * smoothstep(0.65, 0.18, abs(p.x));
        float arcT = clamp((r - (arcY - 0.02)) / 0.05, 0.0, 1.0);
        vec3 arcCol = haloSpectrum(arcT) * arc * 1.35;

        vec3 col = sunCol + ringCol + dogCol + parCol + arcCol;
        float a = clamp(
          max(max(core + corona * 0.5 + airGlow, ringMask), max(dogs, max(parhelic, arc))) * uOpacity,
          0.0,
          1.0
        );
        float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.01;
        gl_FragColor = vec4(col * uOpacity, clamp(a + dither, 0.0, 1.0));
      }
    `,
  });
}

export function AscentHalo() {
  const heroFly = useHeroFlyOptional();
  const { camera } = useThree();
  const groupRef = useRef<Object3D>(null);
  const meshRef = useRef<Mesh>(null);
  const progressSmooth = useRef(0);
  const sunAim = useMemo(() => new Vector3(), []);
  const sunDir = useMemo(() => new Vector3(), []);

  const material = useMemo(() => makeIceHaloMaterial(), []);
  const geometry = useMemo(() => new CircleGeometry(1, 96), []);

  useEffect(
    () => () => {
      material.dispose();
      geometry.dispose();
    },
    [material, geometry],
  );

  useFrame((state, delta) => {
    progressSmooth.current = MathUtils.damp(progressSmooth.current, readProgress(heroFly), TRACK_FOLLOW, delta);
    const climb = easeOutCubic(progressSmooth.current);
    const t = state.clock.elapsedTime;
    const idle = idle01(t);
    const idleSigned = Math.sin(t * IDLE_BREATHE);

    // Soft sun aim in world — drifts with climb, but placement is camera-relative.
    sunAim.set(
      MathUtils.lerp(48, 28, climb) + idleSigned * 2.5,
      MathUtils.lerp(62, 88, climb) + idleSigned * 1.2,
      MathUtils.lerp(-40, -70, climb),
    );

    sunDir.copy(sunAim).sub(camera.position).normalize();

    const group = groupRef.current;
    if (group) {
      // Lock to camera ray → always in sky of the current shot (parallax with view).
      group.position.copy(camera.position).addScaledVector(sunDir, HALO_CAM_DIST);
    }

    const mesh = meshRef.current;
    if (!mesh) return;

    const worldRingRadius = HALO_CAM_DIST * Math.tan(HALO_ANGLE);
    mesh.scale.setScalar((worldRingRadius / RING_UV) * (0.98 + 0.03 * idle));

    // Fade with HeroFly progress (our sticky Lenis runway — not drei ScrollControls).
    const finaleFade = 1 - MathUtils.smoothstep(climb, 0.45, 1) * 0.75;
    const mat = mesh.material as ShaderMaterial;
    mat.uniforms.uOpacity.value = MathUtils.lerp(0.9, 0.55, climb) * finaleFade * (0.94 + 0.06 * idle);
    mat.uniforms.uRingR.value = RING_UV + idle * 0.005;
    mat.uniforms.uRingW.value = 0.026 + idle * 0.003;
  });

  return (
    <group ref={groupRef} frustumCulled={false} renderOrder={-50}>
      <Billboard follow>
        <mesh ref={meshRef} geometry={geometry} material={material} renderOrder={-49} frustumCulled={false} />
      </Billboard>
    </group>
  );
}
