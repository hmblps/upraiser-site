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
};

/**
 * Clone the cached GLB (flat in XZ). Parent π/2 in Tablet3D stands it up.
 * Screen = unlit plane sized from the body bounds (GLB "glass" is the camera lens only).
 */
export function Model({ screenMap = null, ...props }: ModelProps) {
  const { scene } = useGLTF(TABLET_URL, DRACO_PATH);

  const { root, screenMat, screenPose } = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((obj: Object3D) => {
      const mesh = obj as Mesh;
      if (mesh.isMesh && mesh.name === "Cube_1") mesh.visible = false;
    });

    const box = new Box3().setFromObject(root);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());

    const screenMat = new MeshBasicMaterial({
      name: "upraiser-tablet-screen",
      color: new Color("#000000"),
      toneMapped: false,
    });

    const screenPose = {
      position: [center.x, box.max.y + 0.00035, center.z] as [number, number, number],
      rotation: [-Math.PI / 2, 0, 0] as [number, number, number],
      size: [size.x * 0.905, size.z * 0.92] as [number, number],
    };

    return { root, screenMat, screenPose };
  }, [scene]);

  useEffect(() => () => screenMat.dispose(), [screenMat]);

  useLayoutEffect(() => {
    if (screenMap) {
      screenMap.flipY = true;
      screenMap.needsUpdate = true;
      screenMat.map = screenMap;
      screenMat.color = new Color("#ffffff");
      screenMat.needsUpdate = true;
    } else {
      screenMat.map = null;
      screenMat.color = new Color("#111111");
      screenMat.needsUpdate = true;
    }
  }, [screenMap, screenMat]);

  return (
    <group {...props} dispose={null}>
      <primitive object={root} />
      <mesh position={screenPose.position} rotation={screenPose.rotation} renderOrder={2}>
        <planeGeometry args={screenPose.size} />
        <primitive object={screenMat} attach="material" />
      </mesh>
    </group>
  );
}

useGLTF.preload(TABLET_URL, DRACO_PATH);
