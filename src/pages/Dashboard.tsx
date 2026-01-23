import { useDispatch, useSelector } from "react-redux";
import InteractivePanel from "../components/threejs/InteractivePanel.tsx";
import type { RootState } from "../store.ts";
import { useGetLastQuery } from "../services/apis/logsApi.ts";
import { DateTime } from "luxon";
import { GoAlertFill } from "react-icons/go";
import { FaBug, FaCircle, FaClock, FaWifi } from "react-icons/fa";
import { VscSettings } from "react-icons/vsc";
import { BsCpuFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/slices/authSlice.ts";
import { useGetParametersQuery } from "../services/apis/parametersApi.ts";
import { useCallback, useMemo } from "react";

const calcElapsedTime = (data: string) => {
  const delta = Date.now() - new Date(data).getTime();
  const s = Math.floor(delta / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  const parts = [
    d ? `${d}d` : "",
    h % 24 ? `${h % 24}h` : "",
    m % 60 ? `${m % 60}m` : "",
    s % 60 || (!d && !h && !m) ? `${s % 60}s` : "",
  ].filter(Boolean);
  return parts.join(" ");
};

type ErrorItem = {
  codifica: string;
  description: string;
  limite?: number;
  time: string;
  date: string;
};

type WarningItem = {
  codifica: string;
  description: string;
  time: string;
  date: string;
};

const Dashboard = () => {
  const { data: parameters } = useGetParametersQuery({});
  const user = useSelector((state: RootState) => state.auth.user);
  const role = useSelector((state: RootState) => state.auth.role)?.toUpperCase() ?? "";

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const { data, isLoading } = useGetLastQuery(
    { daysBefore: 30 },
    { pollingInterval: 3000 }
  );

  const {
    elapsedTime,
    onlineSensorCount,
    errorCount,
    erroriAttendibili,
    erroriNonAttendibili,
    warnings,
  } = useMemo(() => {
    let elapsedTime = "";
    let onlineSensorCount = 0;
    let errorCount = 0;
    const erroriAttendibili: ErrorItem[] = [];
    const erroriNonAttendibili: ErrorItem[] = [];
    const warnings: WarningItem[] = [];

    if (isLoading || !data) {
      return { elapsedTime, onlineSensorCount, errorCount, erroriAttendibili, erroriNonAttendibili, warnings };
    }

    const ultimo = data.data.reduce((a: any, b: any) =>
      DateTime.fromISO(a.ts_registrazione) > DateTime.fromISO(b.ts_registrazione) ? a : b
    );
    const timeStampLocal = DateTime.fromISO(ultimo.ts_registrazione, { zone: 'utc' }).setZone("Europe/Rome");
    elapsedTime = calcElapsedTime(timeStampLocal.toISO() ?? "");
    onlineSensorCount = data.data.length;

    errorCount = data.data.filter((item: any) => item.isInTempAlarm === true).length;

    const dispoWarning = data.data.map((item: any) => {
      const maxDispoUpdateTime =
        parameters?.find((param: any) => param.keySetting === "maxDispoUpdateTime")?.numberValue ?? 0;
      const ts_registrazione = DateTime.fromISO(item.ts_registrazione, { zone: 'utc' }).setZone("Europe/Rome");
      const diffInMilliseconds = DateTime.now()
        .setZone("Europe/Rome")
        .diff(ts_registrazione, "milliseconds")
        .as("milliseconds");
      return {
        id: item.mac_dispo,
        codifica: item.dispo_codifica,
        ts: ts_registrazione,
        warning: diffInMilliseconds > maxDispoUpdateTime,
        delta: diffInMilliseconds,
      };
    });

    dispoWarning.forEach((item: any) => {
      if (!item.warning) return;
      const humanDelta = ((ms: number) => {
        let s = Math.floor(ms / 1000),
          m = Math.floor(s / 60),
          h = Math.floor(m / 60),
          d = Math.floor(h / 24);
        s %= 60; m %= 60; h %= 24;
        return [
          d ? `${d} ${d === 1 ? "giorno" : "giorni"}` : "",
          h ? `${h} ${h === 1 ? "ora" : "ore"}` : "",
          m ? `${m} ${m === 1 ? "minuto" : "minuti"}` : "",
          s ? `${s} ${s === 1 ? "secondo" : "secondi"}` : "",
        ].filter(Boolean).join(", ");
      })(item.delta);

      warnings.push({
        codifica: item.codifica,
        description: `Il dispositivo ${item.codifica} non comunica da ${humanDelta}`,
        time: item.ts.setZone("Europe/Rome").toFormat("HH:mm:ss"),
        date: item.ts.setZone("Europe/Rome").toFormat("dd/MM/yyyy"),
      });
    });

    warnings.sort((a, b) => a.codifica.localeCompare(b.codifica));

    const errorRows: ErrorItem[] = [];
    data.data
      .filter((item: any) => item.isInTempAlarm === true)
      .forEach((item: any) => {
        const ts = DateTime.fromISO(item.ts_registrazione, { zone: 'utc' }).setZone("Europe/Rome");
        errorRows.push({
          codifica: item.dispo_codifica,
          description: `Temperatura oltre la soglia di ${(item.temp_calc - item.tempLimit)?.toFixed(1)}°C`,
          limite: item.tempLimit,
          time: ts.toFormat("HH:mm:ss"),
          date: ts.toFormat("dd/MM/yyyy"),
        });
      });

    errorRows.sort((a, b) => {
      const ad = DateTime.fromFormat(a.date, "dd/LL/yyyy").toMillis();
      const bd = DateTime.fromFormat(b.date, "dd/LL/yyyy").toMillis();
      if (bd !== ad) return bd - ad;
      if (b.time !== a.time) return b.time.localeCompare(a.time);
      return a.codifica.localeCompare(b.codifica);
    });

    errorRows.forEach((e) => {
      const dt = DateTime.fromFormat(e.date + " " + e.time, "dd/LL/yyyy HH:mm:ss");
      const diffInMinutes = DateTime.now().setZone("Europe/Rome").diff(dt, "minutes").as("minutes");
      if (diffInMinutes <= 8) erroriAttendibili.push(e);
      else erroriNonAttendibili.push(e);
    });

    return { elapsedTime, onlineSensorCount, errorCount, erroriAttendibili, erroriNonAttendibili, warnings };
  }, [data, isLoading, parameters]);

  const hasErrors = errorCount > 0;
  const hasWarnings = warnings.length > 0;

  const systemStatus = hasErrors ? "error" : hasWarnings ? "warn" : "ok";

  const statusStyles = {
    error: {
      wrap: "text-red-300 bg-red-500/15 ring-1 ring-inset ring-red-500/30 shadow-[0_0_18px] shadow-red-500/30",
      dot: "text-red-300",
      label: "KO",
    },
    warn: {
      wrap: "text-yellow-300 bg-yellow-400/10 ring-1 ring-inset ring-yellow-400/30 shadow-[0_0_18px] shadow-yellow-400/25",
      dot: "text-yellow-300",
      label: "KO",
    },
    ok: {
      wrap: "text-emerald-300 bg-emerald-500/10 ring-1 ring-inset ring-emerald-500/30 shadow-[0_0_18px] shadow-emerald-500/25",
      dot: "text-emerald-300",
      label: "OK",
    },
  } as const;

  const Section = ({
    title,
    count,
    children,
  }: {
    title: string;
    count: number;
    children: React.ReactNode;
  }) => (
    <div className="bg-gray-900/80 rounded-xl border border-white/5 shadow-md flex flex-col">
      <div className="sticky top-0 z-10 backdrop-blur bg-gray-900/70 rounded-t-xl border-b border-white/10 px-4 py-3 flex items-center">
        <h2 className="text-white text-lg font-semibold">{title}</h2>
        <span className="ml-auto text-xs font-semibold px-2 py-1 rounded-md bg-white/10 text-white/80">
          {count}
        </span>
      </div>
      <div className="p-3 pt-2">{children}</div>
    </div>
  );

  const ErrorCard = ({
    variant,
    item,
  }: {
    variant: "danger" | "warn" | "notice";
    item: ErrorItem | WarningItem;
  }) => {
    const v =
      variant === "danger"
        ? { bg: "bg-red-500/10", b: "border-red-500/30", hover: "hover:bg-red-500/15", dot: "text-red-500" }
        : variant === "warn"
        ? { bg: "bg-orange-500/10", b: "border-orange-500/30", hover: "hover:bg-orange-500/15", dot: "text-orange-500" }
        : { bg: "bg-yellow-500/10", b: "border-yellow-500/30", hover: "hover:bg-yellow-500/15", dot: "text-yellow-400" };

    return (
      <div className={`flex flex-col gap-2 rounded-xl p-3 border ${v.bg} ${v.b} ${v.hover} transition`}>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold flex items-center text-white text-base">
            <FaCircle className={`${v.dot} mr-2 h-2 w-2`} />
            {item.codifica}
          </h3>
          <span className="text-gray-300 text-xs font-medium">{item.time}</span>
        </div>
        <p className="text-white/90 text-sm">{item.description}</p>
        {"limite" in item ? (
          <div className="flex justify-between text-xs text-gray-300">
            <span className="font-medium">Limite temperatura: {item.limite}°C</span>
            <span className="font-medium">{item.date}</span>
          </div>
        ) : (
          <div className="flex justify-end text-xs text-gray-300">
            <span className="font-medium">{item.date}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220] via-[#0f1a2d] to-[#0b1220]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, rgba(59,130,246,0.12), transparent 35%), radial-gradient(circle at 80% 5%, rgba(16,185,129,0.10), transparent 30%), radial-gradient(circle at 60% 80%, rgba(234,179,8,0.08), transparent 35%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
            maskImage:
              "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
          }}
        />
      </div>

      <div className="h-full flex flex-col">
        <div className="flex justify-between px-5 py-3">
          <div className="flex gap-5 items-center leading-none">
            <img src="IOTALAB_Logo_RGB.png" className="p-2 h-[80px]" />
            <h1 className="text-white text-2xl font-bold">Selezione Rifiuti Urbani</h1>

            <h1
              className={`h-[30px] ${statusStyles[systemStatus].wrap} rounded-full px-2 text-lg flex font-semibold items-center truncate`}
            >
              <FaCircle className={`h-4 w-4 mr-1 ${statusStyles[systemStatus].dot}`} />
              Stato:<span className="ml-1">{statusStyles[systemStatus].label}</span>
            </h1>

            <h1
              className={`h-[30px] ${
                hasWarnings
                  ? "bg-red-500/20 text-red-300 ring-1 ring-inset ring-red-500/30 shadow-[0_0_18px] shadow-red-500/20"
                  : "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/30 shadow-[0_0_18px] shadow-emerald-500/20"
              } rounded-full px-2 text-lg flex font-semibold items-center truncate`}
            >
              <FaWifi className={`h-4 w-4 mr-1 ${hasWarnings ? "text-red-300" : "text-emerald-300"}`} />
              Stato Comunicazione:<span className="ml-1">{hasWarnings ? "KO" : "OK"}</span>
            </h1>
          </div>

          <div className="flex gap-2 items-center">
            <h1 className="rounded-full p-3 bg-blue-500/30 w-8 h-8 text-white font-semibold flex items-center justify-center border border-blue-400/30">
              WI
            </h1>
            <div className="flex flex-col">
              <h1 className="text-white">{user}</h1>
              <p className="text-gray-300">{role}</p>
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className="w-[350px] px-3 flex flex-col justify-between">
            <div className="bg-gray-900/80 rounded-xl p-3 flex flex-col gap-4 border border-white/10">
              <h1 className="text-white text-lg font-semibold">Stato del Sistema</h1>
              <h1 className="flex text-lg items-center text-white font-semibold">
                <GoAlertFill className={`h-4 mr-2 ${statusStyles[systemStatus].dot}`} />
                Stato
                <span
                  className={`ml-auto ${statusStyles[systemStatus].wrap} px-2 rounded-md font-semibold`}
                >
                  {statusStyles[systemStatus].label}
                </span>
              </h1>
              <h1 className="flex text-lg items-center text-white font-semibold">
                <FaBug className="h-4 mr-2 text-yellow-300" />
                Errori
                <span
                  className={`ml-auto ${
                    errorCount > 0
                      ? "bg-yellow-400/10 text-yellow-300 ring-1 ring-yellow-400/30"
                      : "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30"
                  } px-2 rounded-md font-semibold`}
                >
                  {errorCount}
                </span>
              </h1>
              <h1 className="flex text-lg items-center text-white font-semibold">
                <FaWifi className="h-4 mr-2 text-emerald-300" />
                Dispositivi
                <span className="ml-auto bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30 px-2 rounded-md font-semibold">
                  {onlineSensorCount}
                </span>
              </h1>
              <h1 className="flex text-lg items-center text-white font-semibold">
                <FaClock className="h-4 mr-2 text-blue-300" />
                Ultimo update
                <span className="ml-auto px-2 rounded-md font-semibold text-sm">{elapsedTime}</span>
              </h1>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => navigate("/dispositivi")}
                className="flex items-center hover:bg-gray-900/70 text-xl font-bold text-white bg-gray-900/80 border border-white/10 w-full rounded-xl p-3 transition"
              >
                <BsCpuFill className="mr-2" />
                Log Dispositivi
              </button>
              <button
                onClick={() => navigate("/sniffer")}
                className="flex items-center hover:bg-gray-900/70 text-xl font-bold text-white bg-gray-900/80 border border-white/10 w-full rounded-xl p-3 transition"
              >
                <FaWifi className="mr-2" />
                Sniffer
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="flex items-center hover:bg-gray-900/70 text-xl font-bold text-white bg-gray-900/80 border border-white/10 w-full rounded-xl p-3 transition"
              >
                <VscSettings className="mr-2" />
                Impostazioni
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="mt-4 flex items-center text-xl font-bold hover:bg-blue-600/10 text-blue-300 bg-blue-500/10 border border-blue-400/30 w-full rounded-xl p-3 transition"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </div>

          <div className="h-screen flex-1 min-w-0">
            {!isLoading && <InteractivePanel sensorData={data?.data ?? []} parameters={parameters} />}
          </div>

          <div className="h-screen w-[350px] px-3 flex flex-col">
            <div className="flex flex-col gap-4 flex-1 overflow-y-auto scrollbar-elegant">
              <Section title="Errori del Sistema" count={erroriAttendibili.length}>
                {erroriAttendibili.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {erroriAttendibili.map((error) => (
                      <ErrorCard key={error.codifica} variant="danger" item={error} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-300 text-sm">Nessun errore attendibile.</p>
                )}
              </Section>

              <Section title="Errori non attendibili" count={erroriNonAttendibili.length}>
                {erroriNonAttendibili.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {erroriNonAttendibili.map((error) => (
                      <ErrorCard key={error.codifica} variant="warn" item={error} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-300 text-sm">Nessun errore non attendibile nel sistema.</p>
                )}
              </Section>

              <Section title="Warnings" count={warnings.length}>
                {warnings.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {warnings.map((warning) => (
                      <ErrorCard key={warning.codifica} variant="notice" item={warning} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-300 text-sm">Nessun warning al momento.</p>
                )}
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
