import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'
import type { ThreeElements } from '@react-three/fiber'
import type { SiteMode } from "../../data/liveContent";

type GLTFResult = GLTF & {
  nodes: {
    TV_Material001_0: THREE.Mesh
  }
  materials: {
    ['Material.001']: THREE.MeshStandardMaterial
  }
}

export function Model(props: ThreeElements['group'] & { mode?: SiteMode }) {
  const { nodes, materials } = useGLTF('/channels/oem/tv.glb') as unknown as GLTFResult
  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        <mesh geometry={nodes.TV_Material001_0.geometry} material={materials['Material.001']} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
      </group>
    </group>
  )
}

useGLTF.preload('/channels/oem/tv.glb')
