import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { DirectionalLight, Group, Mesh, Object3D } from "three";
import {
  Box3,
  MathUtils,
  MeshStandardMaterial,
  Vector3,
} from "three";
import { useHeroFlyOptional } from "../../context/HeroFlyContext";
import { VOYAGER_URL } from "../../lib/heroModel";
import {
  HERO_ASCENT_DEFAULTS,
  TRACK_FOLLOW,
  easeInOutCubic,
  idle01,
  readProgress,
} from "./shared";

/**
 * Dark-theme Voyager — ridge-line sky pocket at hero start, parallax + hero-exit fade.
 */

const VOYAGER_SRC = `${VOYAGER_URL}?v=tex6`;

/** Layout derived from Path C start — sits on the right ridge horizon, not under nav. */
function heroProbeLayout() {
  const cam = new Vector3(...HERO_ASCENT_DEFAULTS.startPos);
  const look = new Vector3(...HERO_ASCENT_DEFAULTS.startLook);
  const view = look.clone().sub(cam).normalize();
  const worldUp = new Vector3(0, 1, 0);
  const right = new Vector3().crossVectors(view, worldUp).normalize();
  const skyUp = new Vector3().crossVectors(right, view).normalize();

  const anchor = look
    .clone()
    .addScaledVector(view, -38)
    .addScaledVector(right, 28)
    .addScaledVector(skyUp, 9);

  const outbound = new Vector3()
    .addScaledVector(view, 26)
    .addScaledVector(skyUp, -5)
    .addScaledVector(right, 2);

  return { anchor, outbound, view, right, skyUp };
}

const LAYOUT = heroProbeLayout();

function heroExitOpacity(progress: number) {
  const exit = MathUtils.clamp((progress - 0.95) / 0.05, 0, 1);
  const exitEase = exit * exit * (3 - 2 * exit);
  return 1 - exitEase;
}

function tuneProbeMaterial(mat: MeshStandardMaterial) {
  const c = mat.color;
  mat.color.setRGB(
    Math.min(1, c.r * 1.16 + 0.1),
    Math.min(1, c.g * 1.14 + 0.09),
    Math.min(1, c.b * 1.2 + 0.12),
  );
  mat.metalness = MathUtils.lerp(mat.metalness, 0.84, 0.65);
  mat.roughness = MathUtils.lerp(mat.roughness, 0.36, 0.65);
  mat.envMapIntensity = 1.15;
  mat.fog = false;
  mat.transparent = false;
  mat.opacity = 1;
  mat.depthWrite = true;
  mat.needsUpdate = true;
}

function prepareVoyager(source: Object3D) {
  const root = source.clone(true);
  root.updateMatrixWorld(true);

  const box = new Box3().setFromObject(root);
  const size = new Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z, 0.001);
  root.scale.setScalar(26 / maxDim);

  const materials: MeshStandardMaterial[] = [];

  root.traverse((obj) => {
    const mesh = obj as Mesh;
    if (!mesh.isMesh) return;
    mesh.frustumCulled = false;

    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      if (mat instanceof MeshStandardMaterial) {
        tuneProbeMaterial(mat);
        materials.push(mat);
      }
    }
  });

  return { root, materials };
}

export function FloatingVoyager() {
  const heroFly = useHeroFlyOptional();
  const groupRef = useRef<Group>(null);
  const sunKeyRef = useRef<DirectionalLight>(null);
  const progressSmooth = useRef(0);
  const { scene } = useGLTF(VOYAGER_SRC);
  const anchor = useMemo(() => new Vector3(), []);
  const drift = useMemo(() => new Vector3(), []);
  const idleOffset = useMemo(() => new Vector3(), []);

  const { root, materials } = useMemo(() => prepareVoyager(scene), [scene]);

  useFrame((state, delta) => {
    progressSmooth.current = MathUtils.damp(
      progressSmooth.current,
      readProgress(heroFly),
      TRACK_FOLLOW,
      delta,
    );
    const climb = easeInOutCubic(progressSmooth.current);
    const exitAlpha = heroExitOpacity(progressSmooth.current);

    const t = state.clock.elapsedTime;
    const idle = idle01(t, 2.4);

    drift.copy(LAYOUT.outbound).multiplyScalar(climb);
    idleOffset.set(
      Math.sin(t * 0.31) * 0.35,
      Math.sin(t * 0.24 + 0.7) * 0.25 + (idle - 0.5) * 0.15,
      Math.cos(t * 0.18) * 0.22,
    );
    anchor.copy(LAYOUT.anchor).add(drift).add(idleOffset);

    for (const mat of materials) {
      mat.transparent = exitAlpha < 0.999;
      mat.opacity = exitAlpha;
      mat.depthWrite = exitAlpha > 0.45;
    }

    if (sunKeyRef.current) {
      sunKeyRef.current.intensity = 2.35 * exitAlpha;
    }

    const group = groupRef.current;
    if (!group) return;

    group.position.copy(anchor);
    group.rotation.set(
      -0.24 + Math.cos(t * 0.17) * 0.02,
      0.78 + t * 0.005,
      Math.sin(t * 0.2) * 0.035,
    );
    group.visible = exitAlpha > 0.01;
  });

  return (
    <>
      <directionalLight
        ref={sunKeyRef}
        color="#fff6ea"
        intensity={2.35}
        position={[118, 96, 52]}
      />
      <directionalLight color="#5a6888" intensity={0.14} position={[-48, 18, -36]} />
      <group ref={groupRef} frustumCulled={false}>
        <primitive object={root} />
      </group>
    </>
  );
}

useGLTF.preload(VOYAGER_SRC);
