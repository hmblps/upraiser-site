/*
  UPRAISER Hero terrain.
  - Dark  → brand gold wireframe + ghost fill (Everest mesh, no maps)
  - Light → new mountain-light.glb rendered with its own embedded PBR textures
             No custom shaders, no external texture loads — just <primitive>.
*/

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Center, useGLTF } from "@react-three/drei";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import {
  Box3,
  Color,
  MeshStandardMaterial,
  SRGBColorSpace,
  LinearSRGBColorSpace,
  LinearMipmapLinearFilter,
  Vector3,
  type Mesh,
  type Object3D,
  type Texture,
} from "three";
import {
  DRACO_PATH,
  MODEL_URL,
  MODEL_URL_LIGHT,
} from "../lib/heroModel";
import { IDLE_BREATHE } from "./hero-terrain/shared";
import { heroCapture } from "../lib/heroCapture";

export { DRACO_PATH, MODEL_URL, MODEL_URL_LIGHT } from "../lib/heroModel";

const TERRAIN_SPAN = 420;
/**
 * Planet-curvature radius (world units). Terrain edges bend down like the Earth's
 * horizon, so the map never shows a hard end — edge drop ≈ (span/2)² / (2R) ≈ 48u.
 */
const PLANET_RADIUS = 460;

// ── Dark-theme GLB shape ──────────────────────────────────────────────────────
type DarkGLTF = {
  nodes: {
    Object_4: Mesh;
    Object_5: Mesh;
    Object_6: Mesh;
    Object_7: Mesh;
  };
  materials: {
    Default: MeshStandardMaterial;
  };
  scene: Object3D;
};

// ── Light-theme GLB shape ─────────────────────────────────────────────────────
type LightGLTF = {
  nodes: Record<string, Mesh>;
  materials: Record<string, MeshStandardMaterial>;
  scene: Object3D;
};

type ThemeMode = "light" | "dark";

type EverestProps = ThreeElements["group"] & {
  theme?: ThemeMode;
  castShadow?: boolean;
  receiveShadow?: boolean;
};

function skipRaycast() {}

function stripMaps(mat: MeshStandardMaterial) {
  mat.map = null;
  mat.normalMap = null;
  mat.roughnessMap = null;
  mat.metalnessMap = null;
  mat.aoMap = null;
  mat.emissiveMap = null;
  mat.alphaMap = null;
  mat.bumpMap = null;
  mat.displacementMap = null;
  mat.needsUpdate = true;
}

/** Sharpen anisotropy on embedded textures so the mountain doesn't look blurry. */
function sharpenEmbeddedTextures(scene: Object3D) {
  scene.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    const mat = mesh.material as MeshStandardMaterial;
    if (!mat) return;
    const maps: (Texture | null | undefined)[] = [
      mat.map,
      mat.normalMap,
      mat.roughnessMap,
      mat.metalnessMap,
    ];
    maps.forEach((tex) => {
      if (!tex) return;
      tex.anisotropy = 16;
      tex.minFilter = LinearMipmapLinearFilter;
      tex.generateMipmaps = true;
      // BaseColor is sRGB, everything else is linear
      if (tex === mat.map) {
        tex.colorSpace = SRGBColorSpace;
      } else {
        tex.colorSpace = LinearSRGBColorSpace;
      }
      tex.needsUpdate = true;
    });
    mat.needsUpdate = true;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export function Everest({
  theme = "light",
  castShadow = false,
  receiveShadow = false,
  ...props
}: EverestProps) {
  const isLight = theme === "light";
  const modelUrl = isLight ? MODEL_URL_LIGHT : MODEL_URL;

  // Both themes use same hook signature — the model URL changes.
  const gltf = useGLTF(modelUrl, DRACO_PATH) as unknown as DarkGLTF & LightGLTF;
  const { scene } = gltf;
  const nodes = gltf.nodes as Record<string, Mesh>;
  const materials = gltf.materials as Record<string, MeshStandardMaterial>;

  // ── Shared: auto-scale to TERRAIN_SPAN regardless of model source ──────────
  const scale = useMemo(() => {
    const size = new Vector3();
    new Box3().setFromObject(scene).getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    return TERRAIN_SPAN / maxDim;
  }, [scene]);

  // ── Light: sharpen embedded GLB textures once on mount ────────────────────
  const sharpenedRef = useRef(false);
  useLayoutEffect(() => {
    if (!isLight || sharpenedRef.current) return;
    sharpenedRef.current = true;
    sharpenEmbeddedTextures(scene);
  }, [isLight, scene]);

  // Reset sharpened flag if model changes (theme switch)
  useEffect(() => {
    sharpenedRef.current = false;
  }, [modelUrl]);

  // ── Dark: planet-curvature bend on dark geo (4 nodes) ─────────────────────
  const darkGeos = useMemo(() => {
    if (isLight) return [];
    return [nodes.Object_4, nodes.Object_5, nodes.Object_6, nodes.Object_7].filter(Boolean);
  }, [nodes, isLight]);

  useMemo(() => {
    if (isLight || !darkGeos.length) return;
    const box = new Box3();
    for (const node of darkGeos) {
      node.geometry.computeBoundingBox();
      if (node.geometry.boundingBox) box.union(node.geometry.boundingBox);
    }
    const cx = (box.min.x + box.max.x) / 2;
    const cz = (box.min.z + box.max.z) / 2;
    const rLocal = PLANET_RADIUS / Math.max(scale, 1e-6);

    for (const node of darkGeos) {
      const geo = node.geometry;
      if (geo.userData.planetCurved) continue;
      geo.userData.planetCurved = true;
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i += 1) {
        const dx = pos.getX(i) - cx;
        const dz = pos.getZ(i) - cz;
        pos.setY(i, pos.getY(i) - (dx * dx + dz * dz) / (2 * rLocal));
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
      geo.computeBoundingBox();
      geo.computeBoundingSphere();
    }
  }, [darkGeos, scale, isLight]);

  // ── Dark: wireframe + ghost fill materials ─────────────────────────────────
  const wire = useMemo(() => {
    if (isLight) return null;
    return new MeshStandardMaterial({
      color: new Color("#d4a84a"),
      emissive: new Color("#8a6424"),
      emissiveIntensity: 1.5,
      wireframe: true,
      transparent: true,
      opacity: 0.95,
      metalness: 0.05,
      roughness: 0.68,
      depthWrite: false,
      depthTest: true,
      envMapIntensity: 0,
    });
  }, [isLight]);

  const fill = useMemo(() => {
    if (isLight) return null;
    const src = materials.Default;
    if (!src) return null;
    const mat = src.clone();
    stripMaps(mat);
    mat.color = new Color("#050504");
    mat.emissive = new Color("#000000");
    mat.emissiveIntensity = 0;
    mat.metalness = 0.02;
    mat.roughness = 0.98;
    mat.envMapIntensity = 0;
    mat.wireframe = false;
    mat.transparent = false;
    mat.opacity = 1;
    mat.depthWrite = true;
    mat.depthTest = true;
    mat.needsUpdate = true;
    return mat;
  }, [materials.Default, isLight]);

  useEffect(
    () => () => {
      wire?.dispose();
      fill?.dispose();
    },
    [wire, fill],
  );

  // Soft idle breathe — dark wire only.
  useFrame((state) => {
    if (!wire || heroCapture.snap) return;
    const breathe = Math.sin(state.clock.elapsedTime * IDLE_BREATHE);
    wire.emissiveIntensity = 1.5 + breathe * 0.2;
    wire.opacity = 0.95 + breathe * 0.05;
  });

  return (
    <group {...props} dispose={null} scale={scale} rotation={[0, -0.06, 0]} position={[-6, -34, -22]}>
      <Center>
        {isLight ? (
          /* ── Light: render the GLB scene graph with its own embedded materials ── */
          <primitive
            object={scene}
            castShadow={castShadow}
            receiveShadow={receiveShadow}
          />
        ) : (
          /* ── Dark: ghost fill + gold wireframe overlay ─────────────────────── */
          <>
            {fill &&
              darkGeos.map((node, i) => (
                <mesh
                  key={`fill-${i}`}
                  geometry={node.geometry}
                  material={fill}
                  castShadow={castShadow}
                  receiveShadow={receiveShadow}
                  raycast={skipRaycast}
                />
              ))}
            {wire &&
              darkGeos.map((node, i) => (
                <mesh
                  key={`wire-${i}`}
                  geometry={node.geometry}
                  material={wire}
                  castShadow={false}
                  receiveShadow={false}
                  raycast={skipRaycast}
                />
              ))}
          </>
        )}
      </Center>
    </group>
  );
}

// Preloads owned by HeroTerrainCanvas (active theme first) — avoid parse-time dual fetch.
