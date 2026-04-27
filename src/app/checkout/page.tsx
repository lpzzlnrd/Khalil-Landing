"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, LogOut, ChevronDown } from "lucide-react";

type Application = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
};

const statusColors = {
  pending: "bg-[rgba(212,176,120,0.15)] text-gold border-gold/30",
  confirmed: "bg-[rgba(120,212,140,0.15)] text-[#78d48c] border-[#78d48c]/30",
  cancelled: "bg-[rgba(212,120,120,0.15)] text-[#d47878] border-[#d47878]/30",
};

const statusLabels = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch("/api/applications");
      if (res.status === 401) {
        router.push("/checkout/login");
        return;
      }
      const data = await res.json();
      setApplications(data);
    } catch {
      // handle error silently
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchApplications();
  };

  const handleLogout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/checkout/login");
  };

  const filtered = applications.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen p-6 md:p-10">
      {/* Header */}
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-serif text-sm tracking-[0.5em] text-ivory" style={{ paddingLeft: "0.5em" }}>
              S T U D I O
            </span>
            <small className="mt-1 block font-mono text-[9px] tracking-[0.28em] text-muted">
              KLEY / ADMIN PANEL
            </small>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors hover:text-gold"
          >
            <LogOut className="h-3.5 w-3.5" />
            Salir
          </button>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="font-serif text-[clamp(28px,4vw,42px)] font-light tracking-[-0.02em]">
            Aplicaciones <em className="italic text-gold">recibidas</em>
          </h1>
          <p className="mt-2 text-sm text-ivory-dim">
            {applications.length} aplicaciones en total
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-line bg-bg-2 py-3 pl-10 pr-4 font-sans text-sm text-ivory outline-none transition-colors placeholder:text-muted-2 focus:border-gold"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none border border-line bg-bg-2 py-3 pl-4 pr-10 font-mono text-xs uppercase tracking-[0.15em] text-ivory outline-none transition-colors focus:border-gold"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="cancelled">Cancelada</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="font-mono text-sm text-muted">Cargando...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center border border-line bg-bg-2 py-20">
            <span className="font-mono text-sm text-muted">
              {applications.length === 0 ? "No hay aplicaciones aún" : "Sin resultados"}
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto border border-line">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-line bg-bg-2">
                  {["Nombre", "Email", "Teléfono", "Fecha", "Hora", "Estado", "Creado"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.2em] text-muted font-medium"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-line transition-colors hover:bg-bg-2/50"
                  >
                    <td className="px-5 py-4 font-serif text-[15px] text-ivory font-light">
                      {app.name}
                    </td>
                    <td className="px-5 py-4 text-sm text-ivory-dim">{app.email}</td>
                    <td className="px-5 py-4 font-mono text-xs text-ivory-dim">{app.phone}</td>
                    <td className="px-5 py-4 font-serif text-sm text-ivory">{app.date}</td>
                    <td className="px-5 py-4 font-mono text-xs text-ivory">{app.time}</td>
                    <td className="px-5 py-4">
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className={`appearance-none rounded-[2px] border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] ${statusColors[app.status]} cursor-pointer bg-transparent outline-none`}
                      >
                        <option value="pending">{statusLabels.pending}</option>
                        <option value="confirmed">{statusLabels.confirmed}</option>
                        <option value="cancelled">{statusLabels.cancelled}</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 font-mono text-[10px] text-muted">
                      {new Date(app.created_at).toLocaleDateString("es-ES")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
