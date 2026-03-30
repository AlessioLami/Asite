import { useEffect, useState } from 'react';
import { Calendar } from '../components/ui/calendar';
import { FiArrowLeft } from 'react-icons/fi';
import { useGetLogsQuery } from '../services/apis/logsApi';
import { DateTime } from "luxon";
import { toast, Toaster } from 'sonner';
import { useGetUnitaQuery } from '../services/apis/unitaApi';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts";

type DateRange = {
  from: Date;
  to: Date;
};

function safeFixedNumber(v: unknown, digits = 0): number | null {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? Number(n.toFixed(digits)) : null;
}

function safeToFixedStr(v: unknown, digits = 0, fallback = "-"): string {
  const n = safeFixedNumber(v, digits);
  return n === null ? fallback : String(n);
}

const Dispositivi = () => {
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<"tutti" | "installato" | "non_installato" | "virtual">("tutti");
  const [dispositivoSelezionatoTemperature, setDispositivoSelezionatoTemperature] = useState("");

  const { data: unita } = useGetUnitaQuery({});

  const today = new Date();
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 5);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: fiveDaysAgo,
    to: today,
  });

  const { data, error, isLoading, refetch } = useGetLogsQuery({
    dateStart: dateRange ? DateTime.fromJSDate(dateRange.from).toISO({ includeOffset: false }) : undefined,
    dateStop: dateRange ? DateTime.fromJSDate(dateRange.to).toISO({ includeOffset: false }) : undefined,
  });

  const handleDateChange = (range: { from?: Date; to?: Date }) => {
    if (!range.from || !range.to) return;
    setDateRange({ from: range.from, to: range.to });
    refetch();
  };

  useEffect(() => {
    if (error) {
      toast.error("Nessun log trovato in quel periodo.");
    }
  }, [error]);

 const filteredLogs = (data?.logDispo ?? []).filter((log: any) => {
  const codifica = typeof log?.codifica === "string" ? log.codifica : String(log?.codifica ?? "");
  const nomeMatch = codifica.toLowerCase().includes((filtroNome ?? "").toLowerCase());

  const tipo = typeof log?.dispoType === "string" ? log.dispoType : "";
  const filtroMatch = filtroTipo === "tutti" ? true : tipo.toLowerCase() === filtroTipo.toLowerCase();

  return nomeMatch && filtroMatch;
}); 

  const dispositiviUnici : string[] = Array.from(new Set(filteredLogs?.map((log: any) => log.codifica)));

  useEffect(() => {
    if (dispositiviUnici.length > 0 && !dispositivoSelezionatoTemperature) {
      setDispositivoSelezionatoTemperature(dispositiviUnici[0]);
    }
  }, [dispositiviUnici]);

  const temperature = filteredLogs?.filter((log: any) =>
    log.codifica === dispositivoSelezionatoTemperature
  ).map((log: any) => ({
    name: DateTime.fromISO(log.ts_registrazione).toFormat("HH:mm"),
    temperature: safeFixedNumber(log?.temp_calc, 0),
    battery: safeFixedNumber(log?.batt_level, 0),
  }));

  return (
    <div
      className="flex p-10 gap-10 text-white relative w-full min-h-screen overflow-hidden"
      style={{
        backgroundColor: "#0f172a",
        backgroundImage: `
          radial-gradient(circle at 20% 10%, rgba(59,130,246,0.12), transparent 35%),
          radial-gradient(circle at 82% 6%, rgba(16,185,129,0.10), transparent 30%),
          radial-gradient(circle at 60% 78%, rgba(234,179,8,0.08), transparent 35%),
          linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
        `,
        backgroundSize: "auto, auto, auto, 40px 40px, 40px 40px",
      }}
    >
      <Toaster position="top-center" richColors />

      {/* COLONNA SINISTRA */}
      <div className="flex flex-col gap-2 w-full max-w-[300px]">
        <div className="flex flex-col gap-3">
          <a
            href="/dashboard"
            className="flex align-middle items-center gap-2 rounded-xl font-semibold px-3 py-2 max-w-[300px]
                       bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <FiArrowLeft />
            Panoramica
          </a>
          <h1 className="text-4xl font-extrabold tracking-tight">DISPOSITIVI</h1>
        </div>

<div className="rounded-2xl p-3 bg-white/5 border border-white/10 backdrop-blur">
  <Calendar
    mode="range"
    required
    selected={dateRange}
    onSelect={handleDateChange}
    style={{
      ["--rdp-background-color" as any]: "transparent",
      ["--rdp-cell-size" as any]: "34px",
      ["--rdp-accent-color" as any]: "rgb(56 189 248)", // sky-400
    }}
    className="
      w-full !bg-transparent
      /* testi in dark */
      [&_.rdp-caption_label]:text-white
      [&_.rdp-head_cell]:text-white/70
      [&_.rdp-day]:text-white

      /* --- FIX RANGE --- */
      /* z-index sopra il background del day: i numeri non vengono coperti */
      [&_.rdp-day_button]:relative [&_.rdp-day_button]:z-[1]

      /* Colore della striscia centrale del range (non bianca, semi-trasparente) */
      [&_.rdp-day_range_middle]:bg-sky-400/15

      [&_.rdp-day_range_start_.rdp-day_button]:!bg-sky-400
      [&_.rdp-day_range_end_.rdp-day_button]:!bg-sky-400
      [&_.rdp-day_selected_.rdp-day_button]:!bg-sky-400 text-white
      [&_.rdp-day_range_start_.rdp-day_button]:!rounded-l-full !text-white
      [&_.rdp-day_range_end_.rdp-day_button]:!rounded-r-full !text-white

      /* Evita arrotondamenti nel tratto centrale */
      [&_.rdp-day_range_middle_.rdp-day_button]:!rounded-none
    "
  />
</div>



        <div className="rounded-2xl p-3 bg-white/5 border border-white/10 backdrop-blur mt-2">
          <h1 className="text-2xl font-bold">Filtro</h1>
          <input
            className="mt-2 w-full rounded-md px-3 py-2 bg-white/5 border border-white/10 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
            placeholder="Nome da filtrare"
            type="text"
            onChange={(e) => setFiltroNome(e.target.value)}
          />
          <h1 className="text-xl font-semibold mt-4 mb-2">Tipo</h1>
          <div className="flex flex-col gap-1">
            {["tutti", "installato", "non_installato", "virtual"].map((tipo) => (
              <label key={tipo} className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  value={tipo}
                  checked={filtroTipo === tipo}
                  onChange={() => setFiltroTipo(tipo as any)}
                />
                <span className="ml-1 capitalize">{tipo.replace("_", " ")}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl p-3 bg-white/5 border border-white/10 backdrop-blur">
          <label className="text-md font-semibold mb-2 block">Dispositivo per grafico</label>
          <select
            className="border border-white/10 bg-white/5 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400/40"
            value={dispositivoSelezionatoTemperature}
            onChange={(e) => setDispositivoSelezionatoTemperature(e.target.value)}
          >
            {dispositiviUnici.map((nome) => (
              <option key={nome} value={nome}>
                {nome}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex flex-col gap-6">
          <div className="h-64 rounded-2xl p-3 bg-white/5 border border-white/10 backdrop-blur">
            <h1 className="font-semibold text-lg mb-2">Grafico Temperature</h1>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={temperature}
                margin={{ top: 5, right: 0, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickMargin={0} padding={{ left: 0, right: 0 }} />
                <YAxis tickMargin={0} width={20} />
                <Tooltip />
                <Line dataKey="temperature" stroke="#8884d8" activeDot={{ r: 6 }} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="h-64 rounded-2xl p-3 bg-white/5 border border-white/10 backdrop-blur">
            <h1 className="font-semibold text-lg mb-2">Grafico Batteria</h1>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={temperature}
                margin={{ top: 5, right: 0, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickMargin={0} padding={{ left: 0, right: 0 }} />
                <YAxis tickMargin={0} width={20} />
                <Tooltip />
                <Line dataKey="battery" stroke="#82ca9d" activeDot={{ r: 6 }} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="w-full">
        <table className="w-full rounded-2xl text-left overflow-hidden bg-white/5 border border-white/10 backdrop-blur">
          <thead className="bg-gray-900/70 border-b border-white/10 sticky top-0 z-10">
            <tr>
              {[
                "Codifica",
                "ID Pacchetto",
                "Unita Misurata",
                "Temperatura",
                "RSSI",
                "In Errore?",
                "Liv. Batteria",
                "Data e Ora",
              ].map((th) => (
                <th key={th} className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wide text-white/80">
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center w-full text-xl p-5 font-semibold text-white/70">
                  Caricamento...
                </td>
              </tr>
            ) : filteredLogs?.length > 0 ? (
              filteredLogs.map((log: any, id: number) => {
                const formattedDate = DateTime.fromISO(log.ts_registrazione, { zone: 'utc' })
                  .setZone('local')
                  .toFormat('dd-MM HH:mm');

                return (
                  <tr key={id} className="odd:bg-white/[0.02] even:bg-transparent hover:bg-white/[0.06] transition">
                    <td className="py-2 px-4 text-center">{log.codifica}</td>
                    <td className="py-2 px-4 text-center">{log.id_pacchetto}</td>
                    <td className="py-2 px-4 text-center">
                      {unita?.data?.find((u: any) => u._id === log.unita_misurata)?.codifica?.toUpperCase() || "N/A"}
                    </td>
                    <td className="py-2 px-4 text-center">{safeToFixedStr(log?.temp_calc, 0)}°C</td>
                    <td className="py-2 px-4 text-center">{log.rssi} dBm</td>
                    <td className="py-2 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                        log.isInTempAlarm
                          ? "bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30"
                          : "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/30"
                      }`}>
                        {log.isInTempAlarm ? "Si" : "No"}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-center">{safeToFixedStr(log?.batt_level, 0)}</td>
                    <td className="py-2 px-4 text-center">{formattedDate}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="text-center w-full text-xl p-5 font-semibold text-white/70">
                  Non ci sono log in questo periodo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dispositivi;
