import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import type { ErrorProps } from './Macchinario'
import { useNavigate } from 'react-router-dom'

const Conveyor = ({ hasError }: ErrorProps) => {
  const { scene } = useGLTF('src/assets/models/conveyor.glb')
  const glowRef = useRef<THREE.Mesh>(null)

  // Modifica della scena
  scene.scale.set(1, 1, 1)
  scene.position.set(-6, 0, -6)
  scene.rotation.set(0, -Math.PI / 2, 0)
  const navigate = useNavigate()

  return (
    <>
      <primitive object={scene} onClick={() => navigate("/conveyor")} />
      {hasError && (
        <group>
          <mesh
            ref={glowRef}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[-6, -0.4, -5.4]}
          >
            <boxGeometry args={[2, 7]} />
            <meshBasicMaterial
              color="red"
              transparent
              opacity={0.5}
              depthWrite={false}
            />
          </mesh>

          {/*<Html position={[-6, 1.5, -5.4]} center scale={1.2}>
            <div className='bg-red-500 text-white rounded-lg shadow-xl px-10 py-2 min-w-[250px] font-bold text-sm max-w-[400px] text-ellipsis'>
              ⚠ Nastro bloccato
            </div>
          </Html>
          */}
        </group>
      )}
    </>
  )
}

export default Conveyor
