import * as THREE from "three";
import React, { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  PerspectiveCamera,
  OrbitControls,
  useProgress,
  Environment,
  Bounds,
  useBounds,
} from "@react-three/drei";
import Macchinario from "./Macchinario";

function FitAndPushOnce({
  rootRef,
  controlsRef,
  pushFactor = 1 
}: {
  rootRef: React.RefObject<THREE.Group>;
  controlsRef: React.RefObject<any>;
  pushFactor?: number;
}) {
  const bounds = useBounds();
  const { camera } = useThree();
  const { progress } = useProgress();
  const appliedRef = useRef(false);

  useEffect(() => {
    if (appliedRef.current) return;
    if (progress < 100) return;
    if (!rootRef.current) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bounds.refresh(rootRef.current).clip();
        bounds.fit();

        const center = new THREE.Vector3();
        new THREE.Box3().setFromObject(rootRef.current!).getCenter(center);

        if (controlsRef.current) {
          controlsRef.current.target.copy(center);
          controlsRef.current.update();
        } else {
          camera.lookAt(center);
        }

        const persp = camera as THREE.PerspectiveCamera;
        if ((persp as any).isPerspectiveCamera) {
          const dir = new THREE.Vector3().subVectors(persp.position, center);
          persp.position.copy(center).add(dir.divideScalar(pushFactor));
          persp.updateProjectionMatrix();
        }

        appliedRef.current = true;
      });
    });
  }, [bounds, camera, progress, rootRef, controlsRef, pushFactor]);

  return null;
}
const InteractivePanel = ({ sensorData, parameters }: { sensorData: any; parameters: any }) => {
  const { progress } = useProgress();
  const controlsRef = useRef<any>(null);
  const plantRef = useRef<THREE.Group>(null!);

  return (
    <div className="relative rounded-xl z-1 w-full max-w-[1000px] h-screen max-h-[calc(100vh-80px)]">
      {progress < 100 && (
        <div className="absolute w-full h-full flex bg-gray-400 justify-center items-center font-black text-5xl text-white">
          Caricando i modelli... {Math.round(progress)}%
        </div>
      )}

      <Canvas
        dpr={[1, 2]}
        performance={{ min: 0.5, max: 1 }}
        shadows
        onCreated={({ gl, scene, camera }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          scene.up.set(0, 1, 0);
          camera.up.set(0, 1, 0);
        }}
      >
        <color attach="background" args={["#36454F"]} />

        <PerspectiveCamera
          makeDefault
          position={[-40, 30, 36]}
          fov={36}
          near={0.1}
          far={5000}
        />

        <hemisphereLight args={[0xffffff, 0x444444, 0.6]} position={[0, 50, 0]} />
        <directionalLight
          position={[12, 18, 10]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={1}
          shadow-camera-far={200}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-15, 10, -6]} intensity={0.45} />
        <directionalLight position={[0, 14, -20]} intensity={0.7} />

        <Environment preset="warehouse" />

        <Bounds clip margin={0.85}>
          <group ref={plantRef}>
            <Macchinario sensorData={sensorData} parameters={parameters} />
          </group>

          <FitAndPushOnce
            rootRef={plantRef}
            controlsRef={controlsRef}
            pushFactor={1}
          />
        </Bounds>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableRotate
          enablePan
          enableZoom
          enableDamping
          dampingFactor={0.1}
          autoRotate={false}
          mouseButtons={{ LEFT: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.ROTATE }}
        />
      </Canvas>
    </div>
  );
};

export default InteractivePanel;
