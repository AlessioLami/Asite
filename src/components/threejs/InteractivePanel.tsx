import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera, OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import Pavimento from "./Pavimento";
import Macchinario from "./Macchinario";
import ClampControls from "./ClampControls";

const InteractivePanel = () => {

  const LIMITS = {
    min: new THREE.Vector3(-1.5, -1.5, -1.5),
    max: new THREE.Vector3(1.5, 1.5, 1.5)
  }
  
  const controlsRef = useRef(null)


  return (
    <div className="relative z-1 w-full h-screen">
      <Canvas shadows>
        <OrthographicCamera makeDefault position={[10, 10, 10]} zoom={50} />
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
          mouseButtons={{LEFT: THREE.MOUSE.PAN}}
        />
        <ClampControls controlsRef={controlsRef} limits={LIMITS}/>
      </Canvas>
    </div>
  );
};

export default InteractivePanel;

