import { useTexture } from "@react-three/drei"
import * as THREE from "three"

const Pavimento = () => {
    
    const texture = useTexture("src/assets/textures/pavimento.jpg")
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(20, 20)

    return(
        <mesh rotation={[-Math.PI/2, 0, 0]} receiveShadow>
            <planeGeometry args={[0, 0]}/>
            <shadowMaterial opacity={0.3}/>
            <meshStandardMaterial map={texture}/>
        </mesh>
    )
}

export default Pavimento