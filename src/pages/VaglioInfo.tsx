import * as THREE from "three"
import { Html, OrbitControls, OrthographicCamera, useGLTF } from "@react-three/drei"
import Pavimento from "../components/threejs/Pavimento"
import { Canvas } from "@react-three/fiber"
import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"

const VaglioInfo = () => {

    const { scene } = useGLTF("src/assets/models/vaglio.glb");
    scene.scale.set(100, 100, 100)
    scene.position.set(4, 0, 7)
    scene.rotation.set((90 * Math.PI) / 180, (180 * Math.PI) / 180, (0 * Math.PI) / 180)

    const controlsRef = useRef(null)
    const navigate = useNavigate();

    return(
          <div className="h-screen w-full flex justify-center items-center">
            <div className="absolute z-100 pointer-events-none flex w-full h-full p-10">
                <div>
                    <h1 onClick={() => navigate("/dashboard")} className="pointer-events-auto flex text-black font-black align-middle truncate items-center gap-2 text-xl bg-white"><FaArrowLeft/> TORNA ALLA PANORAMICA</h1>
                    <h1 className="text-black font-black text-5xl">VAGLIO</h1>
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
                <Html position={[4, 3, 0]} center>
                    <div className='bg-red-500 text-white rounded-lg shadow-xl px-10 py-2 min-w-[250px] font-bold text-sm max-w-[400px] text-ellipsis'>
                        ⚠ M6 - Motore guasto
                    </div>
                </Html>
                <Html position={[0, 3, 0]} center>
                    <div className='bg-red-500 text-white rounded-lg shadow-xl px-10 py-2 min-w-[250px] font-bold text-sm max-w-[400px] text-ellipsis'>
                        ⚠ M7 - Motore guasto
                    </div>
                </Html>
                <Html position={[-4, 3, 0]} center>
                    <div className='bg-red-500 text-white rounded-lg shadow-xl px-10 py-2 min-w-[250px] font-bold text-sm max-w-[400px] text-ellipsis'>
                        ⚠ M8 - Motore guasto
                    </div>
                </Html>
               <primitive object={scene}/>
                <Pavimento/>
                <OrbitControls
                    ref={controlsRef}
                    enableRotate={true}
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

export default VaglioInfo