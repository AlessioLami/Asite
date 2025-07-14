import { Html, useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import type { ErrorProps } from './Macchinario'
import { useNavigate } from 'react-router-dom'

const BagOpener = ({hasError} : ErrorProps) => {

  const { scene } = useGLTF('src/assets/models/bagopener.glb')
    const glowRef = useRef<THREE.Mesh>(null)
    scene.scale.set(0.0015, 0.002, 0.002)
  scene.position.set(4, 0.1, -2)
  scene.rotation.set(-Math.PI/2, Math.PI, 0)
  const navigate = useNavigate()

  return(
    <>
        <primitive object={scene} onClick={() => navigate("/bagopener")}/>
        {hasError && (
           <group>
            <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[6.3, -0.4, -2.8]}>
                <boxGeometry args={[5.5, 2.7]} />
                <meshBasicMaterial
                    color="red"
                    transparent
                    opacity={0.5}
                    depthWrite={false}
                />
            </mesh>  
            {/*<Html position={[10, 4, 1]} center scale={1.2}>
            <div className='bg-red-500 text-white rounded-lg shadow-xl px-10 py-2 min-w-[250px] font-bold text-sm max-w-[400px] text-ellipsis'>
              ⚠ Aprisacchi bloccato 
            </div>
            </Html>
            */}
           </group> 
        )} 
    </>
  ) 
}

export default BagOpener 