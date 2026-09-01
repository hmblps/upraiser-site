import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { InstancedMesh, MeshBasicMaterial, AdditiveBlending, NormalBlending } from "three";
import { useScroll } from "../context/ScrollContext";

function useIsLightTheme() {
  const [isLight, setIsLight] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.getAttribute("data-theme") === "light";
  });

  useEffect(() => {
    const update = () =>
      setIsLight(document.documentElement.getAttribute("data-theme") === "light");
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    update();
    return () => obs.disconnect();
  }, []);

  return isLight;
}

function SnowParticles({ isLight }: { isLight: boolean }) {
  const count = 5500;
  const meshRef = useRef<InstancedMesh>(null);
  const materialRef = useRef<MeshBasicMaterial>(null);

  const { positions, phases, scales } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    const sc = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 40;
      ph[i] = Math.random() * Math.PI * 2;
      sc[i] = Math.random() * 0.8 + 0.5;
    }
    return { positions: pos, phases: ph, scales: sc };
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScrollDelta: { value: 0 },
  }), []);

  const { registerScrollListener } = useScroll();
  const prevScrollY = useRef(0);
  const scrollVelocity = useRef(0);

  useEffect(() => {
    return registerScrollListener((scrollY) => {
      const delta = scrollY - prevScrollY.current;
      scrollVelocity.current = delta;
      prevScrollY.current = scrollY;
    });
  }, [registerScrollListener]);

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    scrollVelocity.current *= 0.92;
    uniforms.uScrollDelta.value += scrollVelocity.current * delta * 1.0;
  });

  // Light theme: dark blue-grey flakes with NormalBlending so they're visible on white
  // Dark theme: white flakes with AdditiveBlending for glow
  const snowColor = isLight ? "#7a8fa8" : "#ffffff";
  const snowOpacity = isLight ? 0.55 : 0.65;
  const snowBlending = isLight ? NormalBlending : AdditiveBlending;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry args={[0.08, 0.08]}>
        <instancedBufferAttribute attach="attributes-offset" args={[positions, 3]} />
        <instancedBufferAttribute attach="attributes-phase" args={[phases, 1]} />
        <instancedBufferAttribute attach="attributes-pscale" args={[scales, 1]} />
      </planeGeometry>
      <meshBasicMaterial
        ref={materialRef}
        color={snowColor}
        transparent
        opacity={snowOpacity}
        depthWrite={false}
        blending={snowBlending}
        onBeforeCompile={(shader) => {
          shader.uniforms.uTime = uniforms.uTime;
          shader.uniforms.uScrollDelta = uniforms.uScrollDelta;

          shader.vertexShader = `
            uniform float uTime;
            uniform float uScrollDelta;
            attribute vec3 offset;
            attribute float phase;
            attribute float pscale;
            varying vec2 vUvCustom;
            ${shader.vertexShader}
          `.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
            vUvCustom = uv;

            float fallSpeed = 1.1;
            float windSpeed = 0.4;

            vec3 pos = offset;
            pos.y -= uTime * fallSpeed * pscale;
            pos.y += uScrollDelta * pscale;
            pos.x += uTime * windSpeed + sin(uTime * 1.5 + phase) * 1.2;

            float boxXY = 120.0;
            float boxZ = 60.0;
            vec3 wrapPos;
            wrapPos.x = mod(pos.x + boxXY * 0.5, boxXY) - boxXY * 0.5;
            wrapPos.y = mod(pos.y + boxXY * 0.5, boxXY) - boxXY * 0.5;
            wrapPos.z = mod(pos.z + boxZ * 0.5, boxZ) - boxZ * 0.5 - 40.0;
            `
          ).replace(
            `#include <project_vertex>`,
            `
            vec4 mvPosition = modelViewMatrix * vec4(wrapPos, 1.0);
            mvPosition.xy += position.xy * pscale;
            gl_Position = projectionMatrix * mvPosition;
            `
          );

          shader.fragmentShader = `
            varying vec2 vUvCustom;
            ${shader.fragmentShader}
          `.replace(
            `#include <dithering_fragment>`,
            `#include <dithering_fragment>

            float d = length(vUvCustom - 0.5);
            if (d > 0.5) discard;
            float alpha = smoothstep(0.5, 0.05, d);
            gl_FragColor.a *= alpha;
            `
          );
        }}
      />
    </instancedMesh>
  );
}

export function GlobalSnowfall() {
  const isLight = useIsLightTheme();

  // Snow is a light-theme-only effect
  if (!isLight) return null;

  return (
    <div
      className="global-snowfall"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 40,
        pointerEvents: "none",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)",
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ fov: 45, position: [0, 0, 0], near: 0.1, far: 300 }}
        gl={{ alpha: true, antialias: false }}
        dpr={[1, 1.5]}
        style={{ pointerEvents: "none" }}
      >
        <SnowParticles isLight={isLight} />
      </Canvas>
    </div>
  );
}
