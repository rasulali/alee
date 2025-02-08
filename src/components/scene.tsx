import { RGBELoader } from 'three-stdlib'
import { Canvas, useLoader } from '@react-three/fiber'
import {
  Center,
  Text3D,
  Instance,
  Instances,
  Environment,
  Lightformer,
  OrbitControls,
  MeshTransmissionMaterial,
  AccumulativeShadows,
  RandomizedLight
} from '@react-three/drei'
import { type ComponentProps, type FC } from 'react'

interface ConfigType {
  text: string
  backside: boolean
  backsideThickness: number
  samples: number
  resolution: number
  transmission: number
  clearcoat: number
  clearcoatRoughness: number
  thickness: number
  chromaticAberration: number
  anisotropy: number
  roughness: number
  distortion: number
  distortionScale: number
  temporalDistortion: number
  ior: number
  color: string
  shadow: string
  autoRotate: boolean
}

const config: ConfigType = {
  text: 'SOON',
  backside: true,
  backsideThickness: 0.15,
  samples: 16,
  resolution: 1024,
  transmission: 1,
  clearcoat: 1,
  clearcoatRoughness: 0.0,
  thickness: 0.3,
  chromaticAberration: 0.15,
  anisotropy: 0.25,
  roughness: 0,
  distortion: 0.5,
  distortionScale: 0.1,
  temporalDistortion: 0,
  ior: 1.25,
  color: 'white',
  shadow: '#94cbff',
  autoRotate: true
}

interface GridProps {
  number?: number
  lineWidth?: number
  height?: number
}

const Grid: FC<GridProps> = ({ number = 23, lineWidth = 0.026, height = 0.5 }) => (
  <Instances position={[0, -1.02, 0]}>
    <planeGeometry args={[lineWidth, height]} />
    <meshBasicMaterial color="#999" />
    {Array.from({ length: number }, (_, y) =>
      Array.from({ length: number }, (_, x) => (
        <group key={`${x}:${y}`} position={[x * 2 - Math.floor(number / 2) * 2, -0.01, y * 2 - Math.floor(number / 2) * 2]}>
          <Instance rotation={[-Math.PI / 2, 0, 0]} />
          <Instance rotation={[-Math.PI / 2, 0, Math.PI / 2]} />
        </group>
      ))
    )}
    <gridHelper args={[100, 100, '#bbb', '#bbb']} position={[0, -0.01, 0]} />
  </Instances>
)

interface TextProps extends Partial<ComponentProps<typeof Center>> {
  children: string
  config: ConfigType
  font?: string
}

const Text: FC<TextProps> = ({ children, config, font = '/Montserrat.json', ...props }) => {
  const texture = useLoader(RGBELoader, '/aerodynamics_workshop_1k.hdr')
  return (
    <group>
      <Center scale={[1, 1, 1]} front top {...props}>
        <Text3D
          castShadow
          bevelEnabled
          font={font}
          scale={5}
          letterSpacing={-0.03}
          height={0.25}
          bevelSize={0.01}
          bevelSegments={10}
          curveSegments={128}
          bevelThickness={0.01}>
          {children}
          <MeshTransmissionMaterial {...config} background={texture} />
        </Text3D>
      </Center>
      <Grid />
    </group>
  )
}


export const Scene: FC = () => {
  return (
    <Canvas shadows orthographic camera={{ position: [10, 20, 20], zoom: 80 }} gl={{ preserveDrawingBuffer: true }}>
      <color attach="background" args={['#f2f2f5']} />
      <Text config={config} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 2.25]}>
        {config.text}
      </Text>
      <OrbitControls
        autoRotate={config.autoRotate}
        autoRotateSpeed={-0.5}
        zoomSpeed={0.25}
        minZoom={40}
        maxZoom={140}
        enablePan={false}
        dampingFactor={0.05}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 3}
      />
      <Environment resolution={1024}>
        <group rotation={[-Math.PI / 4, -0.3, 0]}>
          <Lightformer intensity={20} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[10, 2, 1]} />
          <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
          <Lightformer type="ring" intensity={2} rotation-y={Math.PI / 2} position={[-0.1, -1, -5]} scale={10} />
        </group>
      </Environment>
    </Canvas>
  )
}
