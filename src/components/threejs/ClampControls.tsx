import { useFrame } from "@react-three/fiber";
import type { MutableRefObject } from "react";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.ts"
import * as THREE from "three"

export interface ClampControlsProps {
  controlsRef: MutableRefObject<OrbitControls | null>;
  limits: {
    min: THREE.Vector3;
    max: THREE.Vector3;
  }
}

function ClampControls({ controlsRef, limits } : ClampControlsProps) {
    useFrame(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    const targetBeforeClamp = controls.target.clone();

    controls.target.clamp(limits.min, limits.max);

    if (!targetBeforeClamp.equals(controls.target)) {
      controls.object.position.addVectors(
        controls.target,
        controls.object.position.clone().sub(targetBeforeClamp)
      );

      controls.update();
    }
  });
  return null;
}

export default ClampControls