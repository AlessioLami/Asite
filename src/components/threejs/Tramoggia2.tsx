import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import type { ErrorProps } from './Macchinario'

const Tramoggia2 = ({hasError, hasWarning}: ErrorProps) => {
  const status = hasError ? "error" : hasWarning ? "warning" : "ok";
  const glowColor = status === "error" ? "red" : "#ffb020";
  const { scene } = useGLTF('/models/tramoggia2.glb')
  const glowRef = useRef<THREE.Mesh>(null)

  scene.scale.set(50, 50, 50)
  scene.position.set(6, 0, -5.15)
  scene.rotation.set(90*Math.PI/180, 180*Math.PI/180, 90*Math.PI/180)

  return(
    <>
        <primitive object={scene}/>
        {(status !== "ok" && (
          <group>
            <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[-5, -0.4, -9.3]}>
            <boxGeometry args={[21, 1.5]} />
            <meshBasicMaterial
              color={glowColor}
              transparent
              opacity={0.5}
              depthWrite={false}
            />
          </mesh>
          </group>
        ))} 
    </>
  ) 
}

export default Tramoggia2