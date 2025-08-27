import { Html, useGLTF } from "@react-three/drei";
import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import type { ErrorProps } from "./Macchinario";
import { useNavigate } from "react-router-dom";
import { useFrame } from "@react-three/fiber";

const EDGES_KEY = "_edgesHelper";

const Conveyor7 = ({ hasError }: ErrorProps) => {
  const { scene } = useGLTF("src/assets/models/rullo7.glb");
  const glowRef = useRef<THREE.Mesh>(null);
  const navigate = useNavigate();

  scene.scale.set(50, 50, 50);
  scene.position.set(3, 0, -5.15);
  scene.rotation.set((90 * Math.PI) / 180, (180 * Math.PI) / 180, (90 * Math.PI) / 180);

  const center = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const c = new THREE.Vector3();
    box.getCenter(c);
    c.y += (box.getSize(new THREE.Vector3()).y || 1) * 0.6;
    return c;
  }, [scene]);

  useEffect(() => {
    scene.traverse((o: any) => {
      if (!o.isMesh) return;

      if (!o.material?.isMeshStandardMaterial) {
        o.material = new THREE.MeshStandardMaterial({
          color: o.material?.color ?? new THREE.Color("#a0d6a0"),
          metalness: 0.05,
          roughness: 0.85,
        });
      }
      const mat = o.material as THREE.MeshStandardMaterial;

      if (hasError) {
        mat.emissive.set(0xff3b3b);
        mat.emissiveIntensity = 0.28;
      } else {
        mat.emissive.set(0x000000);
        mat.emissiveIntensity = 0;
      }

      if (hasError && !o.userData[EDGES_KEY]) {
        const eg = new THREE.EdgesGeometry(o.geometry, 18);
        const lm = new THREE.LineBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.95,
          depthTest: false,
        });
        const lines = new THREE.LineSegments(eg, lm);
        lines.renderOrder = 9999;
        o.add(lines);
        o.userData[EDGES_KEY] = lines;
      } else if (!hasError && o.userData[EDGES_KEY]) {
        const lines: THREE.LineSegments = o.userData[EDGES_KEY];
        o.remove(lines);
        lines.geometry.dispose();
        (lines.material as THREE.Material).dispose();
        o.userData[EDGES_KEY] = undefined;
      }

      o.castShadow = true;
      o.receiveShadow = true;
    });
  }, [scene, hasError]);

  useFrame(() => {
    if (!hasError || !glowRef.current) return;
    const m = glowRef.current.material as THREE.MeshBasicMaterial;
    const t = performance.now() * 0.004;
    m.opacity = 0.35 + 0.15 * Math.sin(t);
  });

  return (
    <>
      <primitive object={scene} onClick={() => navigate("/conveyor7")} />

      {hasError && (
        <>
          <Html position={[center.x, center.y, center.z]} center distanceFactor={30} occlude>
            <div
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                background: "rgba(255,59,59,0.92)",
                color: "white",
                fontWeight: 700,
                fontSize: 12,
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              RULLO7 ERRORE
            </div>
          </Html>

          <group>
            <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[3, 0, 0.5]} castShadow receiveShadow>
              <boxGeometry args={[7, 4, 0.1]} />
              <meshBasicMaterial color="#ff3b3b" transparent opacity={0.4} depthWrite={false} />
            </mesh>
          </group>
        </>
      )}
    </>
  );
};

export default Conveyor7;
