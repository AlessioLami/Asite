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

  const macchine = data?.data ?? [];

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

    if (isLoading || !Array.isArray(macchine) || macchine.length === 0) {
      return { elapsedTime, onlineSensorCount, errorCount, erroriAttendibili, erroriNonAttendibili, warnings };
    }

    const logs = macchine.flatMap((m: any) =>
      (m.unitaMisurate ?? [])
        .filter((u: any) => u.lastLog !== null)
        .map((u: any) => u.lastLog)
    );

    if (logs.length === 0) {
      return { elapsedTime, onlineSensorCount, errorCount, erroriAttendibili, erroriNonAttendibili, warnings };
    }

    const ultimo = logs.reduce((a: any, b: any) =>
      DateTime.fromISO(a.ts_registrazione) > DateTime.fromISO(b.ts_registrazione) ? a : b
    );
    const timeStampLocal = DateTime.fromISO(ultimo.ts_registrazione, { zone: 'utc' }).setZone("Europe/Rome");
    elapsedTime = calcElapsedTime(timeStampLocal.toISO() ?? "");
    onlineSensorCount = logs.length;

    errorCount = logs.filter((item: any) => item.isInTempAlarm === true).length;

    const dispoWarning = logs.map((item: any) => {
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
    logs
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
  }, [macchine, isLoading, parameters]);

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
        <header className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 sm:px-4 md:px-5 md:py-3">
          <div className="flex flex-wrap items-center gap-3 md:gap-5">
            <img src="IOTALAB_Logo_RGB.png" className="h-12 sm:h-14 md:h-[70px] object-contain" />
            <h1 className="hidden lg:block text-white text-lg xl:text-2xl font-bold whitespace-nowrap">
              Selezione Rifiuti Urbani
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`h-7 md:h-[30px] ${statusStyles[systemStatus].wrap} rounded-full px-2 text-sm md:text-base flex font-semibold items-center`}
              >
                <FaCircle className={`h-3 w-3 md:h-4 md:w-4 mr-1 ${statusStyles[systemStatus].dot}`} />
                <span className="hidden sm:inline">Stato:</span>
                <span className="ml-1">{statusStyles[systemStatus].label}</span>
              </span>

              <span
                className={`h-7 md:h-[30px] ${
                  hasWarnings
                    ? "bg-red-500/20 text-red-300 ring-1 ring-inset ring-red-500/30 shadow-[0_0_18px] shadow-red-500/20"
                    : "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/30 shadow-[0_0_18px] shadow-emerald-500/20"
                } rounded-full px-2 text-sm md:text-base flex font-semibold items-center`}
              >
                <FaWifi className={`h-3 w-3 md:h-4 md:w-4 mr-1 ${hasWarnings ? "text-red-300" : "text-emerald-300"}`} />
                <span className="hidden md:inline">Comunicazione:</span>
                <span className="ml-1">{hasWarnings ? "KO" : "OK"}</span>
              </span>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <div className="rounded-full bg-blue-500/30 w-8 h-8 text-white font-semibold flex items-center justify-center border border-blue-400/30 text-sm">
              {user?.slice(0, 2).toUpperCase() ?? "??"}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-white text-sm">{user}</span>
              <span className="text-gray-300 text-xs">{role}</span>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row min-h-0 flex-1 overflow-hidden">
          <aside className="w-full lg:w-[280px] xl:w-[320px] 2xl:w-[350px] px-3 py-2 lg:py-0 flex-shrink-0 overflow-y-auto lg:overflow-visible">
            <div className="bg-gray-900/80 rounded-xl p-3 flex flex-col gap-3 border border-white/10">
              <h2 className="text-white text-base lg:text-lg font-semibold">Stato del Sistema</h2>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-3">
                <div className="flex text-sm lg:text-base items-center text-white font-semibold">
                  <GoAlertFill className={`h-4 mr-2 flex-shrink-0 ${statusStyles[systemStatus].dot}`} />
                  <span>Stato</span>
                  <span className={`ml-auto ${statusStyles[systemStatus].wrap} px-2 rounded-md font-semibold text-sm`}>
                    {statusStyles[systemStatus].label}
                  </span>
                </div>
                <div className="flex text-sm lg:text-base items-center text-white font-semibold">
                  <FaBug className="h-4 mr-2 flex-shrink-0 text-yellow-300" />
                  <span>Errori</span>
                  <span
                    className={`ml-auto ${
                      errorCount > 0
                        ? "bg-yellow-400/10 text-yellow-300 ring-1 ring-yellow-400/30"
                        : "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30"
                    } px-2 rounded-md font-semibold text-sm`}
                  >
                    {errorCount}
                  </span>
                </div>
                <div className="flex text-sm lg:text-base items-center text-white font-semibold">
                  <FaWifi className="h-4 mr-2 flex-shrink-0 text-emerald-300" />
                  <span>Dispositivi</span>
                  <span className="ml-auto bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30 px-2 rounded-md font-semibold text-sm">
                    {onlineSensorCount}
                  </span>
                </div>
                <div className="flex text-sm lg:text-base items-center text-white font-semibold">
                  <FaClock className="h-4 mr-2 flex-shrink-0 text-blue-300" />
                  <span className="hidden sm:inline">Ultimo update</span>
                  <span className="sm:hidden">Update</span>
                  <span className="ml-auto px-2 rounded-md font-semibold text-xs lg:text-sm">{elapsedTime}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 mt-3">
              <button
                onClick={() => navigate("/dispositivi")}
                className="flex items-center justify-center lg:justify-start hover:bg-gray-900/70 text-sm lg:text-lg font-bold text-white bg-gray-900/80 border border-white/10 rounded-xl p-2 lg:p-3 transition"
              >
                <BsCpuFill className="lg:mr-2" />
                <span className="hidden lg:inline">Log Dispositivi</span>
              </button>
              <button
                onClick={() => navigate("/sniffer")}
                className="flex items-center justify-center lg:justify-start hover:bg-gray-900/70 text-sm lg:text-lg font-bold text-white bg-gray-900/80 border border-white/10 rounded-xl p-2 lg:p-3 transition"
              >
                <FaWifi className="lg:mr-2" />
                <span className="hidden lg:inline">Sniffer</span>
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="flex items-center justify-center lg:justify-start hover:bg-gray-900/70 text-sm lg:text-lg font-bold text-white bg-gray-900/80 border border-white/10 rounded-xl p-2 lg:p-3 transition"
              >
                <VscSettings className="lg:mr-2" />
                <span className="hidden lg:inline">Impostazioni</span>
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="hidden lg:flex mt-3 items-center text-lg font-bold hover:bg-blue-600/10 text-blue-300 bg-blue-500/10 border border-blue-400/30 w-full rounded-xl p-3 transition"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </aside>

          <main className="flex-1 min-w-0 min-h-[300px] lg:min-h-0">
            {!isLoading && <InteractivePanel macchine={macchine} parameters={parameters} />}
          </main>

          <aside className="w-full lg:w-[280px] xl:w-[320px] 2xl:w-[350px] px-3 py-2 lg:py-0 flex-shrink-0 max-h-[40vh] lg:max-h-none lg:h-auto overflow-y-auto scrollbar-elegant">
            <div className="flex flex-col gap-3">
              <Section title="Errori del Sistema" count={erroriAttendibili.length}>
                {erroriAttendibili.length > 0 ? (
                  <div className="flex flex-col gap-2">
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
                  <div className="flex flex-col gap-2">
                    {erroriNonAttendibili.map((error) => (
                      <ErrorCard key={error.codifica} variant="warn" item={error} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-300 text-sm">Nessun errore non attendibile.</p>
                )}
              </Section>

              <Section title="Warnings" count={warnings.length}>
                {warnings.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {warnings.map((warning) => (
                      <ErrorCard key={warning.codifica} variant="notice" item={warning} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-300 text-sm">Nessun warning al momento.</p>
                )}
              </Section>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
