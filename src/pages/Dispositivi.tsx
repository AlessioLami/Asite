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

  const { data, error, refetch } = useGetLogsQuery({
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

  const filteredLogs = data?.logDispo?.filter((log: any) => {
    const nomeMatch = log.codifica.toLowerCase().includes(filtroNome.toLowerCase());
    const filtroMatch = log.dispoType?.toLowerCase() === filtroTipo.toLowerCase();
    return filtroTipo === "tutti" ? nomeMatch : nomeMatch && filtroMatch;
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
    battery: safeFixedNumber(log?.batt_level ?? log?.batt_leve, 0),
  }));

  return (
    <div className="flex p-10 gap-10">
      <Toaster position="top-center" richColors />

      <div className="flex flex-col gap-2 w-full max-w-[300px]">
        <div className="flex flex-col gap-3">
          <a
            href="/dashboard"
            className="flex align-middle items-center gap-2 bg-gray-300 rounded-xl font-bold p-2 max-w-[300px]"
          >
            <FiArrowLeft />
            Panoramica
          </a>
          <h1 className="text-5xl font-black">DISPOSITIVI</h1>
        </div>

        <Calendar
          mode="range"
          required={true}
          selected={dateRange}
          onSelect={handleDateChange}
          className="mx-[-20px] w-full"
        />

        <div>
          <h1 className="text-2xl font-bold">Filtro</h1>
          <input
            className="mt-1 border-3 rounded-md px-2"
            placeholder="Nome da filtrare"
            type="text"
            onChange={(e) => setFiltroNome(e.target.value)}
          />
          <h1 className="text-2xl font-bold mt-3 mb-1">Tipo</h1>
          <div className="flex flex-col gap-1">
            {["tutti", "installato", "non_installato", "virtual"].map((tipo) => (
              <label key={tipo}>
                <input
                  type="radio"
                  value={tipo}
                  checked={filtroTipo === tipo}
                  onChange={() => setFiltroTipo(tipo as any)}
                />
                <span className="ml-2 capitalize">{tipo.replace("_", " ")}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-md font-semibold mb-1 block">Dispositivo per grafico</label>
          <select
            className="border px-2 py-1 rounded w-full"
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
          <div className="h-64">
            <h1 className="font-bold text-xl mb-2">Grafico Temperature</h1>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={temperature}
                margin={{ top: 5, right: 0, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickMargin={0} padding={{ left: 0, right: 0 }} />
                <YAxis tickMargin={0} width={20} />
                <Tooltip />
                <Line dataKey="temperature" stroke="#8884d8" activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="h-64">
            <h1 className="font-bold text-xl mb-2">Grafico Batteria</h1>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={temperature}
                margin={{ top: 5, right: 0, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickMargin={0} padding={{ left: 0, right: 0 }} />
                <YAxis tickMargin={0} width={20} />
                <Tooltip />
                <Line dataKey="battery" stroke="#82ca9d" activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="w-full">
        <table className="w-full border-3 rounded-xl text-left">
          <thead className="bg-gray-100">
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
                <th key={th} className="py-2 px-4 border-b text-center">
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredLogs?.length > 0 ? (
              filteredLogs.map((log: any, id: number) => {
                const formattedDate = DateTime.fromISO(log.ts_registrazione, { zone: 'utc' })
                  .setZone('local')
                  .toFormat('dd-MM HH:mm');

                return (
                  <tr key={id}>
                    <td className="py-2 px-4 text-center">{log.codifica}</td>
                    <td className="py-2 px-4 text-center">{log.id_pacchetto}</td>
                    <td className="py-2 px-4 text-center">
                      {unita?.data.find((u: any) => u._id === log.unita_misurata)?.codifica.toUpperCase() || "N/A"}
                    </td>
                    <td className="py-2 px-4 text-center">{safeToFixedStr(log?.temp_calc, 0)}°C</td>
                    <td className="py-2 px-4 text-center">{log.rssi} dBm</td>
                    <td className="py-2 px-4 text-center">{log.tempLimit ? "Si" : "No"}</td>
                    <td className="py-2 px-4 text-center">{safeToFixedStr(log?.batt_leve ?? log?.batt_level, 0)}</td>
                    <td className="py-2 px-4 text-center">{formattedDate}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="text-center w-full text-xl p-5 font-semibold">
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

