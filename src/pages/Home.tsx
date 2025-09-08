import { useNavigate } from "react-router-dom";
import HomeInteractivePanel from "../components/threejs/InteractivePanel Home";

const Step = ({ n, title, desc }: { n: number; title: string; desc: string }) => (
  <div className="relative rounded-2xl border border-white/10 bg-white/5 p-5">
    <div className="absolute -top-3 -left-3 h-10 w-10 grid place-items-center rounded-xl bg-blue-500/90 text-white font-bold shadow-lg">
      {n}
    </div>
    <h4 className="text-base font-semibold">{title}</h4>
    <p className="mt-1 text-white/70 text-sm leading-relaxed">{desc}</p>
  </div>
);

const Key = ({ k, label }: { k: string; label: string }) => (
  <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs">
    <span className="rounded-md bg-black/30 px-1.5 py-0.5 font-mono text-[11px]">{k}</span>
    <span className="text-white/70">{label}</span>
  </span>
);

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#0b1220] via-[#0f1a2d] to-[#0b1220]" />
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            radial-gradient(800px 600px at 15% 10%, rgba(59,130,246,0.14), transparent 40%),
            radial-gradient(700px 500px at 85% 8%, rgba(16,185,129,0.12), transparent 42%),
            radial-gradient(700px 500px at 60% 85%, rgba(234,179,8,0.10), transparent 45%)
          `,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
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
      <div className="absolute inset-0 pointer-events-none [box-shadow:inset_0_0_120px_rgba(0,0,0,0.35)]" />

      <header className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center gap-3">
          <img src="/IOTALAB_Logo_RGB.png" className="h-12 w-auto opacity-90" alt="logo" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-colors 
                       bg-blue-500/10 text-blue-200 ring-1 ring-blue-400/30 
                       shadow-[0_0_18px_rgba(59,130,246,0.35)] hover:bg-blue-500/20"
          >
            Entra nella dashboard
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid place-items-center pt-6 md:pt-12 pb-6 md:pb-10 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight 
                       bg-gradient-to-r from-emerald-300 via-blue-400 to-amber-300 
                       bg-clip-text text-transparent">
          Sinottico 3D
        </h1>
        <p className="mt-4 text-white/80 text-lg max-w-3xl">
          Visualizzatore 3D interattivo per il monitoraggio in tempo reale di impianti industriali.
        </p>
      </main>

      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Step
            n={1}
            title="Accedi alla dashboard"
            desc="Entra nella dashboard e autenticati."
          />
          <Step
            n={2}
            title="Naviga la scena 3D"
            desc="Usa il mouse per muoverti. Clicca su una parte del macchinario per aprire il pannello info per visualizzare allarmi e stati."
          />
          <Step
            n={3}
            title="Filtra e analizza"
            desc="Accedi a tutti i log dell'impianto e filtra per data e dispositivo."
          />
        </div>
      <section className="pt-5 w-full  ">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-15 flex justify-center items-center">
          <HomeInteractivePanel />
        </div>
      </section>
      </section>



      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="flex flex-wrap gap-2">
          <Key k="Click sinistro" label="Pan" />
          <Key k="Click Destro" label="Rotazione" />
          <Key k="Scroll" label="Zoom" />
        </div>
      </section>
      <footer className="max-w-7xl mx-auto py-8 px-6 text-sm text-white/60 text-center">
        © 2025 - Iotalab
      </footer>
    </div>
  );
};

export default Home;
