import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

const Conveyor2 = () => {

  const { scene } = useGLTF('src/assets/models/conveyor2.glb')
    const glowRef = useRef<THREE.Mesh>(null)
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshStandardMaterial({ color: 'black' })
    }
  })

  scene.scale.set(2, 1, 1)
  scene.position.set(-0.5, 5, 0)
  scene.rotation.set(0, Math.PI * 2, 0)

  return(
    <>
        <primitive object={scene}/>
        <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, -0.4]}>
          <boxGeometry args={[2, 7]} />
          <meshBasicMaterial
            color="red"
            transparent
            opacity={0.3}
            depthWrite={false}
          />
        </mesh>  
    </>
  ) 
}

export default Conveyor2