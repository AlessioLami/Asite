import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import type { ErrorProps } from './Macchinario'
import { useNavigate } from 'react-router-dom'

const Conveyor3 = ({hasError}: ErrorProps) => {

  const { scene } = useGLTF('src/assets/models/conveyor3.glb')
  const glowRef = useRef<THREE.Mesh>(null)

  scene.scale.set(1, 1, 1)
  scene.position.set(-3.8, 0, -7)
  scene.rotation.set(0, -Math.PI / 2, 0)
  const navigate = useNavigate();

  return(
    <>
        <primitive object={scene} onClick={() => navigate("/conveyor3")}/>
        {(hasError && (
          <group>
          <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[-3.8, -0.4, -7.4]}>
            <boxGeometry args={[2, 7]} />
            <meshBasicMaterial
              color="red"
              transparent
              opacity={0.5}
              depthWrite={false}
            />
          </mesh>  
          {/*<Html position={[-3, 0.5, -6.4]} center scale={1.2}>
            <div className='bg-red-500 text-white rounded-lg shadow-xl px-2 py-2 font-bold text-sm max-w-[400px] text-ellipsis'>
              ⚠ Motore sovvrariscaldato.
            </div>
          </Html>
          */}
          </group>
        ))} 
    </>
  ) 
}

export default Conveyor3