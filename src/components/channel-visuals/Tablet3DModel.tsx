import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'
import type { ThreeElements } from '@react-three/fiber'
import type { SiteMode } from "../../data/liveContent";

type GLTFResult = GLTF & {
  nodes: {
    Cube: THREE.Mesh
    Cube001: THREE.Mesh
    Cube002: THREE.Mesh
    Cube003: THREE.Mesh
    Cube004: THREE.Mesh
  }
  materials: {
    Material: THREE.MeshStandardMaterial
  }
}

export function Model(props: ThreeElements['group'] & { mode?: SiteMode }) {
  const { nodes, materials } = useGLTF('/channels/oem/tablet.glb') as unknown as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Cube.geometry} material={materials.Material} position={[4.075, -0.277, -0.352]} />
      <mesh geometry={nodes.Cube001.geometry} material={nodes.Cube001.material} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Cube002.geometry} material={nodes.Cube002.material} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Cube003.geometry} material={nodes.Cube003.material} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Cube004.geometry} material={nodes.Cube004.material} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  )
}

useGLTF.preload('/channels/oem/tablet.glb')
