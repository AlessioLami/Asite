import { Html, useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import type { ErrorProps } from './Macchinario'
import { useNavigate } from 'react-router-dom'

const Conveyor4 = ({hasError}: ErrorProps) => {

  const { scene } = useGLTF('src/assets/models/conveyor4.glb')
  const glowRef = useRef<THREE.Mesh>(null)

  scene.scale.set(3, 1, 1)
  scene.position.set(-3.8, 0, -9.3)
  scene.rotation.set(0, -Math.PI * 2, 0)
  const navigate = useNavigate()

  return(
    <>
        <primitive object={scene} onClick={() => navigate("/conveyor4")}/>
        {(hasError && (
          <group>
            <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[-5, -0.4, -9.3]}>
            <boxGeometry args={[21, 1.5]} />
            <meshBasicMaterial
              color="red"
              transparent
              opacity={0.5}
              depthWrite={false}
            />
          </mesh>  
          <Html position={[-8, 2, -8.4]} center scale={1.2}>
            <div className='bg-red-500 text-white rounded-lg shadow-xl px-10 py-2 min-w-[250px] font-bold text-sm max-w-[400px] text-ellipsis'>
              ⚠ Nastro bloccato
            </div>
          </Html>
          </group> 
        ))} 
    </>
  ) 
}

export default Conveyor4