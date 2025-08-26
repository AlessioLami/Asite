import { Html, useGLTF } from "@react-three/drei";
import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import type { ErrorProps } from "./Macchinario";
import { useNavigate } from "react-router-dom";
import { useFrame } from "@react-three/fiber";

const EDGES_KEY = "_edgesHelper";

const BagOpener = ({ hasError }: ErrorProps) => {
  const { scene } = useGLTF("src/assets/models/aprisacchi.glb");
  const navigate = useNavigate();
  const glowRef = useRef<THREE.Mesh>(null);

  // posa del modello
  scene.scale.set(50, 50, 50);
  scene.position.set(20, 0, -5);
  scene.rotation.set((-90 * Math.PI) / 180, 0, Math.PI / 2);

  // centro del bbox (per posizionare l'Html)
  const center = useMemo(() => {
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const c = new THREE.Vector3();
    box.getCenter(c);
    // alza un po' l'etichetta sopra al modello
    c.y += (box.getSize(new THREE.Vector3()).y || 1) * 0.6;
    return c;
  }, [scene]);

  // Emissive + contorni su tutte le mesh, on/off a seconda di hasError
  useEffect(() => {
    scene.traverse((o: any) => {
      if (!o.isMesh) return;

      // materiali standard + parametri "leggibili"
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

      // contorni (Edges)
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

  // Pulse del pannello rosso
  useFrame(() => {
    if (!hasError || !glowRef.current) return;
    const m = glowRef.current.material as THREE.MeshBasicMaterial;
    const t = performance.now() * 0.004;
    m.opacity = 0.35 + 0.15 * Math.sin(t); // 0.2–0.5
  });

  return (
    <>
      <primitive object={scene} onClick={() => navigate("/bagopener")} />

      {/* etichetta sopra il macchinario (compare solo se errore) */}
      {hasError && (
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
            Aprisacchi ERRORE
          </div>
        </Html>
      )}

      {/* pannello rosso a terra (glow) quando errore */}
      {hasError && (
        <group>
          <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[11.5, 0, -5]}>
            <boxGeometry args={[4, 2.7, 0.1]} />
            <meshBasicMaterial color="#ff3b3b" transparent opacity={0.4} depthWrite={false} />
          </mesh>
        </group>
      )}
    </>
  );
};

export default BagOpener;
