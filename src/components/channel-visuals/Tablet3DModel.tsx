import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'
import type { ThreeElements } from '@react-three/fiber'
import type { SiteMode } from "../../data/liveContent";

type GLTFResult = GLTF & {
  nodes: {
    큐브: THREE.Mesh
    큐브_1: THREE.Mesh
    큐브_2: THREE.Mesh
    큐브_3: THREE.Mesh
    큐브_4: THREE.Mesh
    큐브_5: THREE.Mesh
    큐브_6: THREE.Mesh
    큐브_7: THREE.Mesh
    Cube: THREE.Mesh
    Cube_1: THREE.Mesh
    Cube_2: THREE.Mesh
    Cube_3: THREE.Mesh
    Cube_4: THREE.Mesh
    Cube001: THREE.Mesh
    Cube001_1: THREE.Mesh
    Cube001_2: THREE.Mesh
  }
  materials: {
    ['매테리얼.001']: THREE.MeshStandardMaterial
    Material: THREE.MeshStandardMaterial
    white: THREE.MeshStandardMaterial
    steel: THREE.MeshStandardMaterial
    Logo: THREE.MeshStandardMaterial
    lense: THREE.MeshPhysicalMaterial
    glass: THREE.MeshPhysicalMaterial
    매테리얼: THREE.MeshStandardMaterial
    bronze: THREE.MeshStandardMaterial
    ['right apple pencil dock']: THREE.MeshStandardMaterial
    black: THREE.MeshStandardMaterial
  }
}

export function Model(props: ThreeElements['group'] & { mode?: SiteMode }) {
  const { nodes, materials } = useGLTF('/channels/oem/tablet.glb') as unknown as GLTFResult
  return (
    <group {...props} dispose={null}>
      <group scale={[0.159, 0.096, 0.159]}>
        <mesh geometry={nodes.큐브.geometry} material={materials['매테리얼.001']} />
        <mesh geometry={nodes.큐브_1.geometry} material={materials.Material} />
        <mesh geometry={nodes.큐브_2.geometry} material={materials.white} />
        <mesh geometry={nodes.큐브_3.geometry} material={materials.steel} />
        <mesh geometry={nodes.큐브_4.geometry} material={materials.Logo} />
        <mesh geometry={nodes.큐브_5.geometry} material={materials.lense} />
        <mesh geometry={nodes.큐브_6.geometry} material={materials.glass} />
        <mesh geometry={nodes.큐브_7.geometry} material={materials.white} />
        <group scale={[1, 1.065, 1]}>
          <mesh geometry={nodes.Cube.geometry} material={materials.매테리얼} />
          <mesh geometry={nodes.Cube_1.geometry} material={materials.Material} />
          <mesh geometry={nodes.Cube_2.geometry} material={materials.steel} />
          <mesh geometry={nodes.Cube_3.geometry} material={materials.bronze} />
          <mesh geometry={nodes.Cube_4.geometry} material={materials.white} />
        </group>
        <group scale={[1, 1.065, 1]}>
          <mesh geometry={nodes.Cube001.geometry} material={materials.Material} />
          <mesh geometry={nodes.Cube001_1.geometry} material={materials['right apple pencil dock']} />
          <mesh geometry={nodes.Cube001_2.geometry} material={materials.black} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/channels/oem/tablet.glb')
