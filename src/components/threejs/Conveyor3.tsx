import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import type { ErrorProps } from './Macchinario'

const Conveyor3 = ({hasError}: ErrorProps) => {

  const { scene } = useGLTF('src/assets/models/conveyor3.glb')
  const glowRef = useRef<THREE.Mesh>(null)

  scene.scale.set(1, 1, 1)
  scene.position.set(-3.8, 0, -7)
  scene.rotation.set(0, -Math.PI / 2, 0)

  return(
    <>
        <primitive object={scene} onClick={() => alert("OK")}/>
        {(hasError && (
          <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[-3.8, -0.4, -7.4]}>
            <boxGeometry args={[2, 7]} />
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

export default Conveyor3