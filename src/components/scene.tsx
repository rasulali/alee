import * as THREE from "three"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import { Physics, useSphere } from "@react-three/cannon"
import { EffectComposer, N8AO, SMAA } from "@react-three/postprocessing"
import { useMemo } from "react"

const rfs = THREE.MathUtils.randFloatSpread
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const baubleMaterial = new THREE.MeshStandardMaterial({ color: "white", roughness: 0, envMapIntensity: 1 })

function Clump() {
  const [ref, api] = useSphere<THREE.InstancedMesh>(() => ({
    args: [1],
    mass: 1,
    angularDamping: 0.1,
    linearDamping: 0.65,
    position: [rfs(20), rfs(20), rfs(20)],
  }))

  const mat = useMemo(() => new THREE.Matrix4(), [])
  const vec = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    for (let i = 0; i < 40; i++) {
      ref.current?.getMatrixAt(i, mat)
      api.at(i).applyForce(vec.setFromMatrixPosition(mat).normalize().multiplyScalar(-40).toArray(), [0, 0, 0])
    }
  })

  return (
    <instancedMesh ref={ref} args={[sphereGeometry, baubleMaterial, 40]}>
      <meshStandardMaterial color={"white"} />
    </instancedMesh>
  )
}

function Pointer() {
  const { viewport, pointer } = useThree()
  const [ref, api] = useSphere(() => ({ type: "Kinematic", args: [3], position: [0, 0, 0] }))

  useFrame(() => {
    api.position.set(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    )
  })

  return <mesh ref={ref as any} />
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 40], fov: 60 }}
    >
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <Physics>
        <Clump />
        <Pointer />
      </Physics>
      <EffectComposer>
        <SMAA />
        <N8AO aoRadius={2} intensity={1.5} />
      </EffectComposer>
      <Environment preset="sunset" />
    </Canvas>
  )
}

