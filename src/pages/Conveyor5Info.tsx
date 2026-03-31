import * as THREE from "three";
import {
  Html,
  OrbitControls,
  OrthographicCamera,
  useGLTF,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { FaArrowLeft, FaCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGetLastQuery } from "../services/apis/logsApi";

type LogItem = {
  id: string | number;
  dispo_codifica?: string;
  temp_calc?: number;
  tempLimit?: number;
  ts_registrazione: string | number | Date;
  unita_misurata?: "M13" | "M14" | string;
  isInTempAlarm?: boolean;
};

type ErrorItem = {
  id: string | number;
  codifica?: string;
  description: string;
  limite?: number;
  time: string;
  date: string;
  ts: number;
  unit?: string;
};

const Conveyor5Info = () => {
  const controlsRef = useRef(null);
  const navigate = useNavigate();

  const { scene } = useGLTF("models/rullo5.glb") as any;
  scene.scale.set(70, 70, 70);
  scene.position.set(25, 0, 12);
  scene.rotation.set((90 * Math.PI) / 180, (180 * Math.PI) / 180, (90 * Math.PI) / 180);

  const scene2 = scene.clone();
  scene2.scale.set(5, 2, 2);
  scene2.position.set(-19, 0, 0);
  scene2.rotation.set(0, Math.PI, 0);

  const { data, isLoading } = useGetLastQuery(
    { daysBefore: 60 },
    { pollingInterval: 3000 }
  );

  const rows: LogItem[] = useMemo(
    () => {
      const logs = data?.data?.latestLogs ?? data?.data;
      return Array.isArray(logs) ? (logs as LogItem[]) : [];
    },
    [data]
  );

  const conveyorRows = useMemo(
    () => rows.filter((r) => ["M13", "M14"].includes(r?.unita_misurata ?? "")),
    [rows]
  );

  const errorsData = useMemo(
    () => conveyorRows.filter((r) => r?.isInTempAlarm === true),
    [conveyorRows]
  );

  const errors: ErrorItem[] = useMemo(() => {
    return errorsData
      .slice()
      .sort((a, b) => {
        const ta = new Date(a.ts_registrazione).getTime();
        const tb = new Date(b.ts_registrazione).getTime();
        if (tb !== ta) return tb - ta; // più recenti in alto
        return String(b.id).localeCompare(String(a.id)); // tie-breaker
      })
      .map((e) => {
        const delta = Number(e.temp_calc ?? 0) - Number(e.tempLimit ?? 0);
        const deltaRounded = Math.round(delta * 10) / 10;
        const tsDate = new Date(e.ts_registrazione);
        return {
          id: e.id,
          codifica: e.dispo_codifica,
          description: `Temperatura oltre la soglia di ${deltaRounded}°C`,
          limite: e.tempLimit,
          time: tsDate.toLocaleTimeString("it-IT"),
          date: tsDate.toLocaleDateString("it-IT"),
          ts: tsDate.getTime(),
          unit: e.unita_misurata,
        };
      });
  }, [errorsData]);

  const hasM13 = useMemo(() => errorsData.some((e) => e?.unita_misurata === "M13"), [errorsData]);
  const hasM14 = useMemo(() => errorsData.some((e) => e?.unita_misurata === "M14"), [errorsData]);

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

          <h1 className="text-5xl font-extrabold tracking-tight">RULLO 5</h1>

          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">ERRORI: {isLoading ? "…" : errors.length}</h1>

            <div className="flex flex-col gap-2 pt-2">
              {!isLoading && errors.length === 0 && (
                <div className="bg-emerald-500/15 ring-1 ring-emerald-500/30 text-emerald-200 font-semibold p-2 rounded-xl backdrop-blur">
                  Nessun errore in questo momento.
                </div>
              )}

              {!isLoading &&
                errors.map((error) => (
                  <div
                    key={`${error.id}-${error.ts}`}
                    className="flex flex-col items-start rounded-xl p-3
                               bg-red-500/15 ring-1 ring-red-500/30 backdrop-blur"
                  >
                    <div className="flex justify-between w-full items-center">
                      <h1 className="font-semibold flex items-center text-white text-lg">
                        <FaCircle className="text-red-400 mr-2 h-2 w-2" />
                        {error.codifica}
                      </h1>
                      <h1 className="text-white/80 text-sm font-semibold">{error.time}</h1>
                    </div>

                    <h1 className="text-white/90 font-semibold">{error.description}</h1>

                    <div className="flex justify-between w-full">
                      <p className="text-white/80 font-semibold text-sm">
                        Limite temperatura: {error.limite}°C
                      </p>
                      <p className="text-white/70 text-sm font-semibold">{error.date}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <Canvas
        className="relative z-[1] w-full h-full !bg-transparent"
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl, scene: scn, camera }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2; 
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          scn.background = null; 
          camera.up.set(0, 1, 0);
        }}
      >
        <OrthographicCamera makeDefault position={[10, 10, 10]} zoom={50} />

        <ambientLight intensity={0.6} />
        <hemisphereLight args={["#bcd3ff", "#1f2937", 0.6]} position={[0, 1, 0]} />
        <directionalLight
          position={[10, 15, 8]} // key
          intensity={1.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={1}
          shadow-camera-far={120}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-12, 10, -6]} intensity={0.6} /> {/* fill */}
        <directionalLight position={[0, 12, -20]} intensity={0.8} />   {/* rim/back */}

        <Environment preset="warehouse" />
        <ContactShadows opacity={0.35} scale={100} blur={2.6} far={30} position={[0, -0.001, 0]} />

        {hasM14 && (
          <Html position={[9, -1, 0]} center>
            <div
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                background:
                  "linear-gradient(180deg, rgba(255,59,59,0.95), rgba(255,59,59,0.82))",
                color: "white",
                fontWeight: 800,
                fontSize: 12,
                letterSpacing: 0.3,
                boxShadow:
                  "0 10px 30px rgba(255,59,59,0.35), 0 0 0 2px rgba(255,59,59,0.35), inset 0 0 0 1px rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                whiteSpace: "nowrap",
              }}
            >
              M14 ERRORE
            </div>
          </Html>
        )}

        {hasM13 && (
          <Html position={[5, -1, 0]} center>
            <div
              style={{
                padding: "6px 12px",
                borderRadius: 999,
                background:
                  "linear-gradient(180deg, rgba(255,59,59,0.95), rgba(255,59,59,0.82))",
                color: "white",
                fontWeight: 800,
                fontSize: 12,
                letterSpacing: 0.3,
                boxShadow:
                  "0 10px 30px rgba(255,59,59,0.35), 0 0 0 2px rgba(255,59,59,0.35), inset 0 0 0 1px rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                whiteSpace: "nowrap",
              }}
            >
              M13 ERRORE
            </div>
          </Html>
        )}

        <group>
          <primitive object={scene} castShadow receiveShadow />
          <primitive object={scene2} castShadow receiveShadow />
        </group>


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

export default Conveyor5Info;
