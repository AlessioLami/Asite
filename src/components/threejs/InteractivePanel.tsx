import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera, OrbitControls, useProgress, Html } from "@react-three/drei";
import { Suspense, useRef } from "react";
import Pavimento from "./Pavimento";
import Macchinario from "./Macchinario";
import ClampControls from "./ClampControls";



const InteractivePanel = () => {

  const { progress } = useProgress()

  const LIMITS = {
    min: new THREE.Vector3(-1.5, -1.5, -1.5),
    max: new THREE.Vector3(1.5, 1.5, 1.5)
  }
  
  const controlsRef = useRef(null)


  return (
    <div className="relative z-1 w-full h-screen">
    {progress < 100 && (<div className="absolute w-full h-full flex bg-gray-400 justify-center items-center font-black text-5xl text-white">Caricando i modelli... {Math.round(progress)}%</div>)}
      <Canvas dpr={[1,2]} performance={{min: 0.5, max: 1}}shadows>
          <OrthographicCamera makeDefault position={[10, 10, 10]} zoom={40} />
          <ambientLight intensity={10} />
          <directionalLight position={[5, 5, 5]} intensity={10} />
          <Pavimento />
          <Macchinario />
          <OrbitControls
            ref={controlsRef}
            enableRotate={false}
            enablePan={true}
            enableZoom={true}
            minZoom={40}
            maxZoom={60}
            mouseButtons={{LEFT: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.ROTATE}}
          />
          <ClampControls controlsRef={controlsRef} limits={LIMITS}/>
      </Canvas>
    </div>
  );
};

export default InteractivePanel;

