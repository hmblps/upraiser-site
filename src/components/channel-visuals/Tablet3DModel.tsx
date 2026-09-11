import { useEffect, useLayoutEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import {
  Box3,
  Color,
  MeshBasicMaterial,
  Vector3,
  type Mesh,
  type Object3D,
  type Texture,
} from "three";
import type { ThreeElements } from "@react-three/fiber";
import { DRACO_PATH } from "../../lib/heroModel";

const TABLET_URL = "/channels/oem/tablet.glb";

type ModelProps = ThreeElements["group"] & {
  screenMap?: Texture | null;
  /** Horizontal content scale vs glass (System UI shade ≈ 0.92). */
  contentScaleX?: number;
  /** Vertical content scale vs glass — keep near 1 so no empty chin. */
  contentScaleY?: number;
};

/**
 * Clone the cached GLB (flat in XZ). Parent π/2 in Tablet3D stands it up.
 * Black glass plate fills the aperture; ad map sits on it (real in-screen read).
 */
export function Model({
  screenMap = null,
  contentScaleX = 1,
  contentScaleY = 1,
  ...props
}: ModelProps) {
  const { scene } = useGLTF(TABLET_URL, DRACO_PATH);

  const { root, glassMat, screenMat, screenPose } = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((obj: Object3D) => {
      const mesh = obj as Mesh;
      if (mesh.isMesh && mesh.name === "Cube_1") mesh.visible = false;
    });

    const box = new Box3().setFromObject(root);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());

    // Full aperture = seamless black glass (bezel reads as chassis, not letterbox).
    const glassMat = new MeshBasicMaterial({
      name: "upraiser-tablet-glass",
      color: new Color("#050505"),
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
    });

    const screenMat = new MeshBasicMaterial({
      name: "upraiser-tablet-screen",
      color: new Color("#050505"),
      toneMapped: false,
      depthWrite: false,
      depthTest: false,
    });

    const sx = Math.min(1, Math.max(0.7, contentScaleX));
    const sy = Math.min(1, Math.max(0.7, contentScaleY));
    const glassW = size.x * 0.94;
    const glassH = size.z * 0.955;
    const screenPose = {
      position: [center.x, box.max.y - 0.00015, center.z] as [number, number, number],
      rotation: [-Math.PI / 2, 0, 0] as [number, number, number],
      glassSize: [glassW, glassH] as [number, number],
      contentSize: [glassW * sx, glassH * sy] as [number, number],
    };

    return { root, glassMat, screenMat, screenPose };
  }, [scene, contentScaleX, contentScaleY]);

  useEffect(
    () => () => {
      glassMat.dispose();
      screenMat.dispose();
    },
    [glassMat, screenMat],
  );

  useLayoutEffect(() => {
    if (screenMap) {
      screenMap.flipY = true;
      screenMap.needsUpdate = true;
      screenMat.map = screenMap;
      screenMat.color = new Color("#ffffff");
      screenMat.needsUpdate = true;
    } else {
      screenMat.map = null;
      screenMat.color = new Color("#050505");
      screenMat.needsUpdate = true;
    }
  }, [screenMap, screenMat]);

  return (
    <group {...props} dispose={null}>
      <primitive object={root} />
      {/* Black glass plate under the map — no bright letterbox against bezel. */}
      <mesh position={screenPose.position} rotation={screenPose.rotation} renderOrder={1}>
        <planeGeometry args={screenPose.glassSize} />
        <primitive object={glassMat} attach="material" />
      </mesh>
      <mesh
        position={[screenPose.position[0], screenPose.position[1] + 0.00005, screenPose.position[2]]}
        rotation={screenPose.rotation}
        renderOrder={2}
      >
        <planeGeometry args={screenPose.contentSize} />
        <primitive object={screenMat} attach="material" />
      </mesh>
    </group>
  );
}

useGLTF.preload(TABLET_URL, DRACO_PATH);
