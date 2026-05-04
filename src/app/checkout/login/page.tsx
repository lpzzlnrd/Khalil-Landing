"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Credenciales inválidas");
        return;
      }

      router.push("/checkout");
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-5">
      <div className="w-full max-w-[400px] border border-line-strong bg-bg-2 p-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <span className="font-serif text-sm tracking-[0.5em] text-ivory" style={{ paddingLeft: "0.5em" }}>
            S T U D I O
          </span>
          <small className="mt-1 block font-mono text-[9px] tracking-[0.28em] text-muted">
            KLEY / ADMIN PANEL
          </small>
        </div>

        <h1 className="mb-6 font-serif text-2xl font-light text-ivory">
          Iniciar <em className="italic text-gold">sesión</em>
        </h1>

        {error && (
          <div className="mb-4 border border-[rgba(212,60,60,0.3)] bg-[rgba(212,60,60,0.08)] px-4 py-3 text-sm text-[#d43c3c]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-line-strong bg-transparent py-3 font-serif text-lg font-light text-ivory outline-none transition-colors duration-200 placeholder:italic placeholder:text-muted-2 focus:border-gold"
              placeholder="admin@kleystudio.com"
            />
          </div>
          <div className="mb-8">
            <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-line-strong bg-transparent py-3 font-serif text-lg font-light text-ivory outline-none transition-colors duration-200 placeholder:italic placeholder:text-muted-2 focus:border-gold"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-[2px] bg-gold px-[26px] py-3.5 font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-[#0a1628] transition-all duration-300 ease-[cubic-bezier(.2,.7,.2,1)] hover:bg-ivory hover:-translate-y-px disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Acceder"}
          </button>
        </form>
      </div>
    </div>
  );
}
