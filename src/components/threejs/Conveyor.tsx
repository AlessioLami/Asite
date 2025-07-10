import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import type { ErrorProps } from './Macchinario'

const Conveyor = ({hasError}: ErrorProps) => {

  const { scene } = useGLTF('src/assets/models/conveyor.glb')
  const glowRef = useRef<THREE.Mesh>(null)
 

  scene.scale.set(1, 1, 1)
  scene.position.set(-6, 0, -6)
  scene.rotation.set(0, -Math.PI / 2, 0)

  return(
    <>
        <primitive object={scene} onClick={() => alert("OK")}/>
        {(hasError && (
          <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[-6, -0.4, -5.4]}>
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

export default Conveyor