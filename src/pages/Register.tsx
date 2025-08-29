import React, { useState } from "react";
import { useRegisterMutation } from "../services/apis/authApi";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [matricola, setMatricola] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [register] = useRegisterMutation();
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== passwordVerify) {
      toast.error("Le password non coincidono.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await register({
        email,
        password,
        passwordVerify,
        internalId: matricola,
      } as any);

      if (res && "error" in res && (res as any).error && "data" in (res as any).error) {
        const message = ((res as any).error.data as any)?.message;
        toast.error(message || "Registrazione non riuscita.");
      } else {
        toast.success("Ti sei registrato correttamente!");
        setMatricola("");
        setEmail("");
        setPassword("");
        setPasswordVerify("");
      }
    } catch {
      toast.error("Si è verificato un errore durante la registrazione.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Toaster position="top-center" richColors />

      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#0b1220] via-[#0f1a2d] to-[#0b1220]" />
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            radial-gradient(900px 600px at 10% 10%, rgba(59,130,246,0.14), transparent 40%),
            radial-gradient(800px 500px at 90% 8%, rgba(16,185,129,0.12), transparent 42%),
            radial-gradient(700px 500px at 60% 88%, rgba(234,179,8,0.10), transparent 45%)
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
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          maskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        }}
      />
      <div className="absolute inset-0 pointer-events-none [box-shadow:inset_0_0_140px_rgba(0,0,0,0.38)]" />

      <header className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center gap-3">
          <img src="/IOTALAB_Logo_RGB.png" className="h-15 w-auto opacity-90" alt="logo" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-xl font-semibold transition-colors 
                       bg-blue-500/10 text-blue-200 ring-1 ring-blue-400/30 
                       shadow-[0_0_18px_rgba(59,130,246,0.35)] hover:bg-blue-500/20"
          >
            Torna alla home
          </button>
          
        </div>
      </header>

      <div className="text-center mt-6 mb-8 px-6">
        <h1
          className="text-4xl md:text-6xl font-extrabold tracking-tight 
                     bg-gradient-to-r from-emerald-300 via-blue-400 to-amber-300 
                     bg-clip-text text-transparent"
        >
          Registrati
        </h1>
        <p className="mt-3 text-white/75">
          Crea un account per accedere al sinottico e ai dati in tempo reale.
        </p>
      </div>

      <main className="max-w-7xl mx-auto px-6">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] p-6 sm:p-8">
          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div className="text-left">
              <label htmlFor="matricola" className="block text-sm font-medium text-white/80 mb-1">
                Matricola
              </label>
              <input
                id="matricola"
                type="text"
                required
                value={matricola}
                onChange={(e) => setMatricola(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 
                           border border-white/10 outline-none
                           focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/30"
                placeholder="ID interno"
              />
            </div>

            <div className="text-left">
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 
                           border border-white/10 outline-none
                           focus:border-blue-400/40 focus:ring-2 focus:ring-blue-400/30"
                placeholder="nome@azienda.it"
              />
            </div>

            <div className="text-left">
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 
                           border border-white/10 outline-none
                           focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/30"
                placeholder="••••••••"
              />
            </div>

            <div className="text-left">
              <label htmlFor="passwordVerify" className="block text-sm font-medium text-white/80 mb-1">
                Ripeti password
              </label>
              <input
                id="passwordVerify"
                type="password"
                required
                autoComplete="new-password"
                value={passwordVerify}
                onChange={(e) => setPasswordVerify(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 
                           border border-white/10 outline-none
                           focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/30"
                placeholder="••••••••"
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-2 rounded-xl font-semibold transition-colors 
                           bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-400/30 
                           shadow-[0_0_18px_rgba(16,185,129,0.35)] hover:bg-emerald-500/20
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Registrazione in corso..." : "Registrati"}
              </button>

              <p className="text-center text-sm text-white/70">
                Hai già un account?{" "}
                <a
                  href="/login"
                  className="text-blue-300 hover:text-blue-200 underline underline-offset-4"
                >
                  Accedi
                </a>
              </p>
            </div>
          </form>
        </div>

      </main>

      <footer className="max-w-7xl mx-auto py-10 px-6 text-sm text-white/60 text-center">
        © 2025 – Iotalab
      </footer>
    </div>
  );
};

export default Register;
