import { useTexture } from "@react-three/drei"
import * as THREE from "three"

const Pavimento = () => {
    
    const texture = useTexture("src/assets/textures/pavimento.jpg")
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(20, 20)

    return(
        <mesh rotation={[-Math.PI/2, 0, 0]} receiveShadow>
            <planeGeometry args={[200, 200]}/>
            <meshStandardMaterial map={texture}/>
        </mesh>
    )
}

export default Pavimento