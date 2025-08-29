import { useNavigate } from "react-router-dom";

const screenshots = [
  {
    src: "/dashboard.png",
    title: "Pannello principale",
    desc: "Vista sinottica con monitoraggio in tempo reale di motori e sensori dell’impianto.",
  },
  {
    src: "/log_dispositivi.png",
    title: "Log dispositivi",
    desc: "Storico eventi dei dispositivi con dettagli sugli errori e gli stati di comunicazione.",
  },
  {
    src: "/dispositivi.png",
    title: "Impostazioni",
    desc: "Configurazione dispositivi, unità, e parametri per il sistema di monitoraggio.",
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
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
          <img src="/IOTALAB_Logo_RGB.png" className="h-15 w-auto opacity-90" alt="logo" />
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 rounded-xl max-h-[50px] max-w-[100px] sm:max-w-[3000px] text-xs md:text-md font-semibold transition-colors 
                     bg-blue-500/10 text-blue-200 ring-1 ring-blue-400/30 
                     shadow-[0_0_18px_rgba(59,130,246,0.35)] hover:bg-blue-500/20"
        >
          Entra nella dashboard
        </button>
      </header>

      <main className="max-w-5xl mx-auto grid place-items-center pt-5 md:pt-10 pb-5 md:pb-10 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight 
                       bg-gradient-to-r from-emerald-300 via-blue-400 to-amber-300 
                       bg-clip-text text-transparent">
          Sinottico Asite
        </h1>
        <p className="mt-4 text-white/80 text-lg max-w-2xl">
          Monitoraggio in tempo reale per l’impianto di selezione rifiuti.
        </p>
      </main>

      <section className="max-w-6xl mx-auto px-6 pb-16 grid gap-12 md:gap-16">
        {screenshots.map((s, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl 
                       shadow-[0_8px_30px_rgba(0,0,0,0.25)] overflow-hidden"
          >
            <div className="w-full flex items-center justify-center bg-black/30">
              <img
                src={s.src}
                alt={s.title}
                className="max-w-full max-h-[600px] object-contain"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-white/70 max-w-2xl mx-auto">{s.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <footer className="max-w-7xl mx-auto py-8 px-6 text-sm text-white/60 text-center">
        © 2025 – Asite - Iotalab 
      </footer>
    </div>
  );
};

export default Home;
