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
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCircle } from "react-icons/fa";
import { useGetLastQuery } from "../services/apis/logsApi";

type LogItem = {
  id: string | number;
  dispo_codifica?: string;
  temp_calc?: number;
  tempLimit?: number;
  ts_registrazione: string | number | Date;
  unita_misurata?: "M6" | "M7" | "M8" | string;
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

const VaglioInfo = () => {
  const navigate = useNavigate();
  const controlsRef = useRef(null);

  const { data, isLoading } = useGetLastQuery(
    { daysBefore: 60 },
    { pollingInterval: 3000 }
  );

  const rows: LogItem[] = useMemo(
    () => (Array.isArray(data?.data) ? (data!.data as LogItem[]) : []),
    [data]
  );

  const vaglioRows = useMemo(
    () => rows.filter((r) => ["M6", "M7", "M8"].includes(r?.unita_misurata ?? "")),
    [rows]
  );

  const errorsData = useMemo(
    () => vaglioRows.filter((r) => r?.isInTempAlarm === true),
    [vaglioRows]
  );

  const errors: ErrorItem[] = useMemo(() => {
    return errorsData
      .slice()
      .sort((a, b) => {
        const ta = new Date(a.ts_registrazione).getTime();
        const tb = new Date(b.ts_registrazione).getTime();
        if (tb !== ta) return tb - ta; // più recente prima
        return String(b.id).localeCompare(String(a.id)); // stabilità
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

  const hasM6 = useMemo(() => errorsData.some((e) => e?.unita_misurata === "M6"), [errorsData]);
  const hasM7 = useMemo(() => errorsData.some((e) => e?.unita_misurata === "M7"), [errorsData]);
  const hasM8 = useMemo(() => errorsData.some((e) => e?.unita_misurata === "M8"), [errorsData]);

  const { scene } = useGLTF("src/assets/models/vaglio.glb") as any;
  scene.scale.set(100, 100, 100);
  scene.position.set(4, 0, 7);
  scene.rotation.set((90 * Math.PI) / 180, (180 * Math.PI) / 180, 0);

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
          <h1 className="text-5xl font-extrabold tracking-tight">VAGLIO</h1>

          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">ERRORI: {isLoading ? "…" : errors.length}</h1>

            <div className="flex flex-col gap-2 pt-2 max-w-[520px]">
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
          scn.background = null; // trasparente per mostrare la griglia
          camera.up.set(0, 1, 0);
        }}
      >
        <OrthographicCamera makeDefault position={[10, 10, 10]} zoom={50} />

        <ambientLight intensity={0.6} />
        <hemisphereLight args={["#bcd3ff", "#1f2937", 0.6]} position={[0, 1, 0]} />
        <directionalLight
          position={[10, 15, 8]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={1}
          shadow-camera-far={120}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-12, 10, -6]} intensity={0.6} />
        <directionalLight position={[0, 12, -20]} intensity={0.8} />

        <Environment preset="warehouse" />
        <ContactShadows opacity={0.35} scale={100} blur={2.6} far={30} position={[0, -0.001, 0]} />

        {hasM6 && (
          <Html position={[-7, -5, -4]} center>
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
              M6 ERRORE
            </div>
          </Html>
        )}

        {hasM7 && (
          <Html position={[-3, -1, -4]} center>
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
              M7 ERRORE
            </div>
          </Html>
        )}

        {hasM8 && (
          <Html position={[1, 3, -4]} center>
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
              M8 ERRORE
            </div>
          </Html>
        )}

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

export default VaglioInfo;
