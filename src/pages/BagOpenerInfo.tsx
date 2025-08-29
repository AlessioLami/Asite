import * as THREE from "three";
import {
  OrbitControls,
  OrthographicCamera,
  useGLTF,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BagOpenerInfo = () => {
  const { scene } = useGLTF("src/assets/models/aprisacchi.glb");
  scene.scale.set(100, 100, 100);
  scene.position.set(20, 0, 4);
  scene.rotation.set((-90 * Math.PI) / 180, 0, Math.PI / 2);

  const controlsRef = useRef(null);
  const navigate = useNavigate();

  return (
    <div
      className="h-screen w-full relative overflow-hidden text-white"
      style={{
        backgroundColor: "#0f172a",
        backgroundImage: `
          radial-gradient(circle at 18% 8%, rgba(59,130,246,0.12), transparent 35%),
          radial-gradient(circle at 82% 10%, rgba(16,185,129,0.10), transparent 30%),
          radial-gradient(circle at 60% 80%, rgba(234,179,8,0.08), transparent 35%),
          linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
        `,
        backgroundSize: "auto,auto,auto,40px 40px,40px 40px",
      }}
    >
      <div className="absolute inset-0 z-[100] pointer-events-none p-10 flex">
        <div className="space-y-3">
          <h1
            onClick={() => navigate("/dashboard")}
            className="pointer-events-auto inline-flex items-center gap-2 px-3 py-2 rounded-xl font-semibold
                       bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition"
          >
            <FaArrowLeft /> TORNA ALLA PANORAMICA
          </h1>

          <h1 className="text-5xl font-extrabold tracking-tight">LACERASACCHI</h1>

            
        </div>
      </div>

      {/* Viewer 3D */}
      <Canvas
        className="relative z-0 w-full h-full !bg-transparent"
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl, scene: scn, camera }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2; // più luminoso
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          scn.background = null; // Canvas trasparente -> si vede la griglia
          camera.up.set(0, 1, 0);
        }}
      >
        <OrthographicCamera makeDefault position={[10, 10, 10]} zoom={50} />

        {/* Illuminazione “studio” */}
        <ambientLight intensity={0.6} />
        <hemisphereLight args={["#bcd3ff", "#1f2937", 0.6]} position={[0, 1, 0]} />
        <directionalLight
          position={[10, 15, 8]} // key
          intensity={1.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={1}
          shadow-camera-far={100}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-12, 10, -6]} intensity={0.6} /> {/* fill */}
        <directionalLight position={[0, 12, -20]} intensity={0.8} />   {/* rim/back */}

        {/* HDRI morbida + ombre a contatto */}
        <Environment preset="warehouse" />
        <ContactShadows opacity={0.35} scale={80} blur={2.6} far={25} position={[0, -0.001, 0]} />

        <primitive object={scene} castShadow receiveShadow />

        <OrbitControls
          ref={controlsRef as any}
          enableRotate={false}
          enablePan
          enableZoom
          minZoom={40}
          maxZoom={100}
          mouseButtons={{ LEFT: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.ROTATE }}
        />
      </Canvas>
    </div>
  );
};

export default BagOpenerInfo;

