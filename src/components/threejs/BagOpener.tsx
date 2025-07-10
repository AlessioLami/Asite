import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import type { ErrorProps } from './Macchinario'

const BagOpener = ({hasError} : ErrorProps) => {

  const { scene } = useGLTF('src/assets/models/bagopener.glb')
    const glowRef = useRef<THREE.Mesh>(null)
    scene.scale.set(0.0015, 0.002, 0.002)
  scene.position.set(4, 0.1, -2)
  scene.rotation.set(-Math.PI/2, Math.PI, 0)

  return(
    <>
        <primitive object={scene} onClick={() => alert("OK")}/>
        {hasError && (
            <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[6.3, -0.4, -2.8]}>
                <boxGeometry args={[5.5, 2.7]} />
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

export default BagOpener 