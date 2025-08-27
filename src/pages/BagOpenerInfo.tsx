import * as THREE from "three"
import { OrbitControls, OrthographicCamera, useGLTF } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Pavimento from "../components/threejs/Pavimento";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";


const BagOpenerInfo = () => {
    
    const { scene } = useGLTF("src/assets/models/aprisacchi.glb");
    scene.scale.set(100, 100, 100)
    scene.position.set(20, 0, 4)
    scene.rotation.set(-90*Math.PI/180, 0, Math.PI/2)
  
    const controlsRef = useRef(null)
    const navigate = useNavigate()

    return(
        <div className="h-screen w-full flex justify-center items-center">
            <div className="absolute z-100 pointer-events-none flex w-full h-full p-10">
                <div>
                    <h1 onClick={() => navigate("/dashboard")} className="pointer-events-auto flex text-black font-black align-middle truncate items-center gap-2 text-xl bg-white"><FaArrowLeft/> TORNA ALLA PANORAMICA</h1>
                    <h1 className="text-black font-black text-5xl min-w-[320px]">LACERASACCHI</h1>
                    <div className="flex flex-col">
                        <h1 className="text-black font-black text-3xl">ERRORI:</h1>
                        <div className="flex flex-col">

                        </div>
                    </div>

                </div>
            </div>
            <Canvas className="relative z-1 max-h">
                <OrthographicCamera makeDefault position={[10, 10, 10]} zoom={50} />
                <ambientLight/>
                <directionalLight position={[5, 5, 5]} intensity={10}/>
               <primitive object={scene}/>
                <Pavimento/>
                <OrbitControls
                    ref={controlsRef}
                    enableRotate={false}
                    enablePan={true}
                    enableZoom={true}
                    minZoom={40}
                    maxZoom={100}
                    mouseButtons={{LEFT: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.ROTATE}}
                />
            </Canvas>
        </div>
       
    )
}

export default BagOpenerInfo