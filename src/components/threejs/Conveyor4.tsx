import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import type { ErrorProps } from './Macchinario'

const Conveyor4 = ({hasError}: ErrorProps) => {

  const { scene } = useGLTF('src/assets/models/conveyor4.glb')
  const glowRef = useRef<THREE.Mesh>(null)

  scene.scale.set(3, 1, 1)
  scene.position.set(-3.8, 0, -9.3)
  scene.rotation.set(0, -Math.PI * 2, 0)

  return(
    <>
        <primitive object={scene} onClick={() => alert("OK")}/>
        {(hasError && (
          <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[-5, -0.4, -9.3]}>
            <boxGeometry args={[21, 1.5]} />
            <meshBasicMaterial
              color="red"
              transparent
              opacity={0.5}
              depthWrite={false}
            />
          </mesh>  
        ))} 
    </>
  ) 
}

export default Conveyor4