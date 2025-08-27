import * as THREE from "three";
import { Html, OrbitControls, OrthographicCamera, useGLTF } from "@react-three/drei";
import Pavimento from "../components/threejs/Pavimento";
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

  // Modello 3D + clone
  const { scene } = useGLTF("src/assets/models/rullo5.glb") as any;
  scene.scale.set(70, 70, 70);
  scene.position.set(25, 0, 12);
  scene.rotation.set((90 * Math.PI) / 180, (180 * Math.PI) / 180, (90 * Math.PI) / 180);

  const scene2 = scene.clone();
  scene2.scale.set(5, 2, 2);
  scene2.position.set(-19, 0, 0);
  scene2.rotation.set(0, Math.PI, 0);

  // Dati
  const { data, isLoading } = useGetLastQuery(
    { daysBefore: 60 },
    { pollingInterval: 3000 }
  );

  const rows: LogItem[] = useMemo(
    () => (Array.isArray(data?.data) ? (data!.data as LogItem[]) : []),
    [data]
  );

  // Solo M13/M14
  const conveyorRows = useMemo(
    () => rows.filter(r => ["M13", "M14"].includes(r?.unita_misurata ?? "")),
    [rows]
  );

  // Solo errori temperatura
  const errorsData = useMemo(
    () => conveyorRows.filter(r => r?.isInTempAlarm === true),
    [conveyorRows]
  );

  // Ordinamento per timestamp (discendente) + mapping
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

  const hasM13 = useMemo(() => errorsData.some(e => e?.unita_misurata === "M13"), [errorsData]);
  const hasM14 = useMemo(() => errorsData.some(e => e?.unita_misurata === "M14"), [errorsData]);

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="absolute z-[100] pointer-events-none flex w-full h-full p-10">
        <div>
          <h1
            onClick={() => navigate("/dashboard")}
            className="pointer-events-auto flex text-black font-black align-middle truncate items-center gap-2 text-xl bg-white"
          >
            <FaArrowLeft /> TORNA ALLA PANORAMICA
          </h1>
          <h1 className="text-black font-black text-5xl">RULLO 5</h1>

          <div className="flex flex-col">
            <h1 className="text-black font-black text-3xl">
              ERRORI: {isLoading ? "…" : errors.length}
            </h1>

            <div className="flex flex-col gap-2 pt-2">
              {!isLoading && errors.length === 0 && (
                <div className="bg-green-500 text-white font-semibold p-2 rounded-xl">
                  Nessun errore in questo momento.
                </div>
              )}

              {!isLoading &&
                errors.map((error) => (
                  <div
                    key={`${error.id}-${error.ts}`}
                    className="flex flex-col items-start bg-red-500 border-red-500/30 border-[0.1px] p-2 rounded-xl"
                  >
                    <div className="flex justify-between w-full items-center">
                      <h1 className="font-semibold flex items-center align-middle text-white text-lg">
                        <FaCircle className="text-white mr-2 h-2" />
                        {error.codifica}
                      </h1>
                      <h1 className="text-white text-sm font-semibold">{error.time}</h1>
                    </div>

                    <h1 className="text-white font-semibold">{error.description}</h1>

                    <div className="flex justify-between w-full">
                      <p className="text-white font-semibold text-sm">
                        Limite temperatura: {error.limite}°C
                      </p>
                      <p className="text-gray-200 text-sm font-semibold">{error.date}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <Canvas className="relative z-[1]">
        <OrthographicCamera makeDefault position={[10, 10, 10]} zoom={50} />
        <ambientLight />
        <directionalLight position={[5, 5, 5]} intensity={10} />

        {hasM14 && (
          <Html position={[9, -1, 0]} center>
           <div className="bg-red-500 flex text-center text-white rounded-lg shadow-xl p-2  font-bold text-sm max-w-[400px] text-ellipsis">
              M14 ERRORE
            </div>  
          </Html>
        )}

        {hasM13 && (
          <Html position={[5, -1, 0]} center>
          <div className="bg-red-500 flex text-center text-white rounded-lg shadow-xl p-2  font-bold text-sm max-w-[400px] text-ellipsis">
              M13 ERRORE
            </div> 
          </Html>
        )}

        <group>
          <primitive object={scene} />
        </group>

        <Pavimento />
        <OrbitControls
          ref={controlsRef}
          enableRotate={false}
          enablePan={true}
          enableZoom={true}
          minZoom={40}
          maxZoom={100}
          mouseButtons={{ LEFT: THREE.MOUSE.PAN, RIGHT: THREE.MOUSE.ROTATE }}
        />
      </Canvas>
    </div>
  );
};

export default Conveyor5Info;
