import * as THREE from "three"
import { Html, OrbitControls, OrthographicCamera, useGLTF } from "@react-three/drei"
import ClampControls from "../components/threejs/ClampControls"
import Pavimento from "../components/threejs/Pavimento"
import { Canvas } from "@react-three/fiber"
import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"

const Conveyor3Info = () => {

    const { scene } = useGLTF("src/assets/models/conveyor3.glb");
    scene.scale.set(2, 2, 2)
    scene.position.set(0, 0, 0)
    scene.rotation.set(0, -Math.PI / 2, 0)
    const LIMITS = {
        min: new THREE.Vector3(-1.5, -1.5, -1.5),
        max: new THREE.Vector3(1.5, 1.5, 1.5)
    }
  
  const controlsRef = useRef(null)
  const navigate = useNavigate();

    return(
          <div className="h-screen w-full flex justify-center items-center">
            <div className="absolute z-100 pointer-events-none flex w-full h-full p-10">
                <div>
                    <h1 onClick={() => navigate("/dashboard")} className="pointer-events-auto flex text-black font-black align-middle truncate items-center gap-2 text-xl bg-white"><FaArrowLeft/> TORNA ALLA PANORAMICA</h1>
                    <h1 className="text-white font-black text-5xl">NASTRO TRASPORTATORE</h1>
                    <div className="flex flex-col">
                        <h1 className="text-white font-black text-3xl">ERRORI:</h1>
                        <div className="flex flex-col">

                        </div>
                    </div>

                </div>
            </div>
            <Canvas className="relative z-1 max-h">
                <OrthographicCamera makeDefault position={[10, 10, 10]} zoom={50} />
                <ambientLight/>
                <directionalLight position={[5, 5, 5]} intensity={10}/>
                <Html position={[0, 0.6, 5]} center>
                    <div className='bg-red-500 text-white rounded-lg shadow-xl px-10 py-2 min-w-[250px] font-bold text-sm max-w-[400px] text-ellipsis'>
                        ⚠ M3 - Motore guasto
                    </div>
                </Html>
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
                <ClampControls controlsRef={controlsRef} limits={LIMITS}/>
            </Canvas>
        </div>  
    )
}

export default Conveyor3Info