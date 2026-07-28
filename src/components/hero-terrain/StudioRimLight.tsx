import { Environment, Lightformer } from "@react-three/drei";

/**
 * Light-theme only: studio Lightformers bake into a low-res env map.
 * frames={1} — bake once; no per-frame cubemap cost.
 */
export function StudioRimLight() {
  return (
    <Environment resolution={128} frames={1} background={false} environmentIntensity={0.38}>
      <Lightformer
        form="rect"
        intensity={2.8}
        color="#ffd98a"
        scale={[32, 3.2, 1]}
        position={[68, 72, -8]}
        target={[6, 22, -12]}
      />
      <Lightformer
        form="ring"
        intensity={1.2}
        color="#fff4dc"
        scale={22}
        position={[48, 54, 36]}
        target={[10, 18, -6]}
      />
      <Lightformer
        form="rect"
        intensity={0.35}
        color="#f3e8d4"
        scale={[36, 18, 1]}
        position={[-58, 28, 48]}
        target={[0, 12, 0]}
      />
    </Environment>
  );
}
