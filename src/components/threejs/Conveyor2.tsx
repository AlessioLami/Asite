import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import type { ErrorProps } from './Macchinario'

const Conveyor2 = ({hasError}: ErrorProps) => {

  const { scene } = useGLTF('src/assets/models/conveyor2.glb')
    const glowRef = useRef<THREE.Mesh>(null)

  scene.scale.set(1.9, 1, 1.5)
  scene.position.set(-2, 0, -2.7)
  scene.rotation.set(0, Math.PI * 2, 0)

  return(
    <>
        <primitive object={scene}/>
        {hasError && (
          <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[-2.5, -0.4, -2.5]}>
            <boxGeometry args={[14, 2]} />
            <meshBasicMaterial
              color="red"
              transparent
              opacity={0.5}
              depthWrite={false}
            />
          </mesh>  
        )} 
    </>
  ) 
}

export default Conveyor2