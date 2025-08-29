import React, { useState } from "react";
import { useLoginMutation } from "../services/apis/authApi";
import { setCredentials } from "../services/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "sonner";
import { useNavigate, Navigate } from "react-router-dom";
import type { RootState } from "../store";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      if (res && "error" in res && res.error && "data" in res.error) {
        const message = (res.error.data as any)?.message;
        toast.error(message || "Credenziali non valide");
      } else {
        toast.success("Accesso effettuato con successo!");
        dispatch(setCredentials({ user: (res as any).data.email, role: (res as any).data.role }));
        setEmail("");
        setPassword("");
        navigate("/dashboard");
      }
    } catch {
      toast.error("Si è verificato un errore durante il login.");
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
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-xl font-semibold transition-colors 
                     bg-blue-500/10 text-blue-200 ring-1 ring-blue-400/30 
                     shadow-[0_0_18px_rgba(59,130,246,0.35)] hover:bg-blue-500/20"
        >
          Torna alla home
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        <div className="text-center mt-6 mb-8">
          <h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight 
                       bg-gradient-to-r from-emerald-300 via-blue-400 to-amber-300 
                       bg-clip-text text-transparent"
          >
            Accedi
          </h1>
          <p className="mt-3 text-white/75">
            Entra per visualizzare il sinottico e i dati in tempo reale.
          </p>
        </div>

        <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)] p-6 sm:p-8">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 
                           border border-white/10 outline-none
                           focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-400/30"
                placeholder="••••••••"
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="w-full px-4 py-2 rounded-xl font-semibold transition-colors 
                           bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-400/30 
                           shadow-[0_0_18px_rgba(16,185,129,0.35)] hover:bg-emerald-500/20"
              >
                Accedi
              </button>

              <p className="text-center text-sm text-white/70">
                Non hai un account?{" "}
                <a
                  href="/register"
                  className="text-blue-300 hover:text-blue-200 underline underline-offset-4"
                >
                  Registrati
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

export default Login;
