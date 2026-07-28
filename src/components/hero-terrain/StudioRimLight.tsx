import { Environment, Lightformer } from "@react-three/drei";

/**
 * Light-theme only: cooler alpine Lightformers bake into an env map.
 * frames={1} — bake once; no per-frame cubemap cost.
 */
export function StudioRimLight() {
  return (
    <Environment resolution={512} frames={1} background={false} environmentIntensity={1.05}>
      <Lightformer
        form="rect"
        intensity={3.8}
        color="#ffe2b0"
        scale={[28, 2.8, 1]}
        position={[72, 78, -18]}
        target={[6, 22, -12]}
      />
      <Lightformer
        form="ring"
        intensity={2.4}
        color="#e8f0ff"
        scale={26}
        position={[42, 58, 48]}
        target={[10, 18, -6]}
      />
      <Lightformer
        form="rect"
        intensity={1.15}
        color="#c8d8f5"
        scale={[40, 22, 1]}
        position={[-62, 24, 56]}
        target={[0, 12, 0]}
      />
      <Lightformer
        form="rect"
        intensity={0.4}
        color="#1a1820"
        scale={[50, 30, 1]}
        position={[0, -40, 20]}
        target={[0, 10, 0]}
      />
    </Environment>
  );
}
