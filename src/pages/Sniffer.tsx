import { FiArrowLeft } from 'react-icons/fi';
import { useGetSnifferQuery } from '../services/apis/snifferApi';
import { DateTime } from 'luxon';

const Sniffer = () => {
  const { data, error, refetch } = useGetSnifferQuery({});

  if (error) {
    refetch();
  }

  const latestLogMap = new Map();

  if (data?.logSniffer) {
    for (const log of data.logSniffer) {
      if (!latestLogMap.has(log.sniffer_codifica)) {
        latestLogMap.set(log.sniffer_codifica, log);
      }
    }
  }

  const convertToPercent = (mv: number) => {
    const min = 2650;
    const max = 3100;
    return Math.max(0, Math.min(100, ((mv - min) / (max - min)) * 100));
  };

  const getColor = (percent: number) => {
    if (percent >= 70) return '#00c950';
    if (percent >= 40) return '#f0b100';
    return '#fb2c36';
  };

  const chartData = [...latestLogMap.values()]
    .map((log) => {
      const percent = convertToPercent(log.batt_level);
      return {
        name: log.sniffer_codifica,
        percent,
        fill: getColor(percent),
      };
    })
    .sort((a, b) => b.percent - a.percent);

  return (
    <div
      className="flex p-10 gap-10 text-white w-full min-h-screen overflow-hidden"
      style={{
        backgroundColor: '#0f172a',
        backgroundImage: `
          radial-gradient(circle at 18% 8%, rgba(59,130,246,0.12), transparent 35%),
          radial-gradient(circle at 82% 10%, rgba(16,185,129,0.10), transparent 30%),
          radial-gradient(circle at 60% 80%, rgba(234,179,8,0.08), transparent 35%),
          linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
        `,
        backgroundSize: 'auto,auto,auto,40px 40px,40px 40px',
      }}
    >
      {/* COLONNA SINISTRA */}
      <div className="flex flex-col gap-10 w-full max-w-[300px]">
        <div className="flex flex-col gap-3">
          <a
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl font-semibold px-3 py-2 max-w-[300px]
                       bg-white/5 border border-white/10 hover:bg-white/10 transition"
          >
            <FiArrowLeft />
            Panoramica
          </a>
          <h1 className="text-4xl font-extrabold tracking-tight">SNIFFER</h1>
        </div>

        <div className="w-full flex flex-col justify-start text-start rounded-2xl p-4 bg-white/5 border border-white/10 backdrop-blur">
          <h2 className="text-xl font-bold mb-3">Livello di Batteria degli Sniffer</h2>
          <div className="w-full space-y-2">
            {chartData.map((log) => (
              <div key={log.name} className="flex items-center justify-between text-xs font-semibold">
                <span className="text-white/90">{log.name}</span>
                {/* barra: mantengo lo stesso elemento/struttura, solo classi */}
                <h1
                  className="rounded-md px-2 py-1 mt-1 text-black shadow-sm"
                  style={{
                    width: `${log.percent - 20}%`,
                    backgroundColor: log.fill,
                  }}
                >
                  {Number(log.percent).toFixed(0)}%
                </h1>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABELLA */}
      <div className="w-full">
        <table className="w-full rounded-2xl text-left overflow-hidden bg-white/5 border border-white/10 backdrop-blur">
          <thead className="bg-gray-900/70 border-b border-white/10 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wide text-white/80">
                Codifica
              </th>
              <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wide text-white/80">
                MAC
              </th>
              <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wide text-white/80">
                Liv. Batteria
              </th>
              <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wide text-white/80">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.logSniffer?.length > 0 ? (
              data.logSniffer.map((log: any, id: number) => {
                const formattedDate = DateTime.fromISO(log.ts_registrazione, { zone: 'utc' })
                  .setZone('local')
                  .toFormat('dd-MM HH:mm');

                return (
                  <tr key={id} className="odd:bg-white/[0.02] even:bg-transparent hover:bg-white/[0.06] transition">
                    <td className="py-2 px-4 text-center">{log.sniffer_codifica}</td>
                    <td className="py-2 px-4 text-center">{log.mac_sniffer}</td>
                    <td className="py-2 px-4 text-center">
                      {convertToPercent(log.batt_level).toFixed(0)}%
                    </td>
                    <td className="py-2 px-4 text-center">{formattedDate}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="text-center w-full text-xl p-5 font-semibold text-white/70">
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

export default Sniffer;
