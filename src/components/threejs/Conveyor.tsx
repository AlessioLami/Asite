import { Html, useGLTF } from "@react-three/drei";
import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import type { ErrorProps } from "./Macchinario";
import { useNavigate } from "react-router-dom";
import { useFrame } from "@react-three/fiber";

const Conveyor = ({ hasError, hasWarning }: ErrorProps) => {
  const status = hasError ? "error" : hasWarning ? "warning" : "ok";
  const glowColor = status === "error" ? "#ff3b3b" : "#ffb020";
  const emissiveColor = status === "error" ? 0xff3b3b : 0xffb020;
  const { scene } = useGLTF("/models/rullo1.glb");
  const glowRef = useRef<THREE.Mesh>(null);
  const navigate = useNavigate();

  scene.scale.set(50, 50, 50);
  scene.position.set(3, 0, -5.5);
  scene.rotation.set((90 * Math.PI) / 180, (180 * Math.PI) / 180, (90 * Math.PI) / 180);

  const center = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const c = new THREE.Vector3();
    box.getCenter(c);
    c.y += (box.getSize(new THREE.Vector3()).y || 1) * 0.6; // alza la label
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

      if (status !== "ok") {
        mat.emissive.set(emissiveColor);
        mat.emissiveIntensity = 0.28;
      } else {
        mat.emissive.set(0x000000);
        mat.emissiveIntensity = 0;
      }

      o.castShadow = true;
      o.receiveShadow = true;
    });
  }, [scene, status, emissiveColor]);

  useFrame(() => {
    if (status === "ok" || !glowRef.current) return;
    const m = glowRef.current.material as THREE.MeshBasicMaterial;
    const t = performance.now() * 0.004;
    m.opacity = 0.35 + 0.15 * Math.sin(t); // 0.2–0.5
  });

  return (
    <>
      <primitive object={scene} onClick={() => navigate("/conveyor")} />

      {status !== "ok" && (
        <>
          <Html position={[center.x, center.y, center.z]} center distanceFactor={30} occlude>
            <div
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                background: status === "error" ? "rgba(255,59,59,0.92)" : "rgba(255,176,32,0.92)",
                color: "white",
                fontWeight: 700,
                fontSize: 12,
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              RULLO1 {status === "error" ? "ERRORE" : "WARNING"}
            </div>
          </Html>

          <group>
            <mesh
              ref={glowRef}
              rotation={[(90 * Math.PI) / 180, 0, (90 * Math.PI) / 180]}
              position={[7, 0, -5.4]}
            >
              <boxGeometry args={[2, 6, 0.1]} />
              <meshBasicMaterial color={glowColor} transparent opacity={0.4} depthWrite={false} />
            </mesh>
          </group>
        </>
      )}
    </>
  );
};

export default Conveyor;
