"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, LogOut, ChevronDown, Calendar as CalendarIcon, List, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Application = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled";
  answers: Record<string, string>;
  meeting_link?: string;
  created_at: string;
};

const statusColors = {
  pending: "bg-gold/10 text-gold border-gold/20",
  confirmed: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [view, setView] = useState<"list" | "calendar">("list");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

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
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateStatus = async (id: string, status: string, e?: React.ChangeEvent) => {
    if (e) e.stopPropagation();
    await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchApplications();
    if (selectedApp?.id === id) {
      setSelectedApp(prev => prev ? { ...prev, status: status as any } : null);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/checkout/login");
  };

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || a.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [applications, search, filterStatus]);

  return (
    <div className="min-h-screen bg-[#0a0907] text-ivory p-6 md:p-10 font-sans">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <header className="mb-12 flex items-center justify-between border-b border-line pb-8">
          <div>
            <h1 className="font-serif text-3xl font-light tracking-tight">
              Dashboard <em className="text-gold italic">Admin</em>
            </h1>
            <p className="text-muted text-xs mt-2 uppercase tracking-[0.2em]">Carousels Selling · Khalil</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex bg-bg-2 p-1 border border-line">
              <button 
                onClick={() => setView("list")}
                className={`p-2 transition-colors ${view === "list" ? "bg-gold text-bg" : "text-muted hover:text-ivory"}`}
              >
                <List size={18} />
              </button>
              <button 
                onClick={() => setView("calendar")}
                className={`p-2 transition-colors ${view === "calendar" ? "bg-gold text-bg" : "text-muted hover:text-ivory"}`}
              >
                <CalendarIcon size={18} />
              </button>
            </div>
            <button onClick={handleLogout} className="text-muted hover:text-red-400 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Controls */}
        <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input 
                type="text" placeholder="Buscar cliente..." 
                className="w-full bg-bg-2 border border-line py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gold transition-colors"
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select 
              className="bg-bg-2 border border-line px-4 py-2.5 text-xs uppercase tracking-widest outline-none focus:border-gold"
              value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="confirmed">Confirmados</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs text-muted uppercase tracking-tighter">Total: {filtered.length} aplicaciones</span>
          </div>
        </div>

        {/* List View */}
        {view === "list" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-4"
          >
            {loading ? (
              <div className="py-20 text-center text-muted font-mono animate-pulse">Cargando aplicaciones...</div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-line text-muted">No se encontraron resultados</div>
            ) : (
              filtered.map((app) => (
                <div 
                  key={app.id} 
                  onClick={() => setSelectedApp(app)}
                  className="bg-bg-2 border border-line p-5 flex flex-wrap items-center justify-between gap-6 cursor-pointer hover:border-gold/40 transition-all group"
                >
                  <div className="flex gap-6 items-center">
                    <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center text-gold font-serif text-xl">
                      {app.name[0]}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-ivory group-hover:text-gold transition-colors">{app.name}</h3>
                      <p className="text-muted text-xs font-mono mt-1">{app.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-12">
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Fecha</p>
                      <p className="font-serif text-sm">{app.date}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Hora</p>
                      <p className="font-mono text-sm">{app.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className={`px-3 py-1 border text-[10px] uppercase tracking-widest font-mono ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                    <button className="text-muted group-hover:text-gold transition-colors">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Calendar View (Simple placeholder implementation) */}
        {view === "calendar" && (
           <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-bg-2 border border-line p-10 text-center"
           >
             <p className="text-muted font-serif italic text-lg">Vista de calendario en desarrollo...</p>
             <p className="text-xs text-muted mt-2 uppercase tracking-widest">Consulta la lista para gestionar las citas activas</p>
           </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl h-full bg-bg border-l border-line shadow-2xl overflow-y-auto"
            >
              <div className="p-8 md:p-12">
                <button onClick={() => setSelectedApp(null)} className="mb-8 text-muted hover:text-gold transition-colors">
                  <X size={24} />
                </button>

                <div className="flex items-center gap-6 mb-12">
                  <div className="w-20 h-20 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center text-gold font-serif text-3xl">
                    {selectedApp.name[0]}
                  </div>
                  <div>
                    <h2 className="font-serif text-3xl font-light">{selectedApp.name}</h2>
                    <p className="text-gold text-sm mt-1">{selectedApp.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-12 py-8 border-y border-line">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted mb-2">WhatsApp</p>
                    <p className="font-mono text-sm">{selectedApp.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Estado</p>
                    <select 
                      value={selectedApp.status} 
                      onChange={e => updateStatus(selectedApp.id, e.target.value)}
                      className={`w-full bg-transparent border-b border-line py-1 font-mono text-xs uppercase tracking-widest outline-none ${statusColors[selectedApp.status]}`}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Fecha y Hora</p>
                    <p className="font-serif text-sm">{selectedApp.date} @ {selectedApp.time}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted mb-2">Google Meet</p>
                    <a href={selectedApp.meeting_link} target="_blank" className="text-gold text-xs underline break-all">
                      Abrir link de reunión
                    </a>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="font-serif text-xl font-light text-gold">Respuestas al formulario</h3>
                  {Object.entries(selectedApp.answers || {}).map(([key, value]) => (
                    <div key={key} className="bg-bg-2 p-6 border border-line">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3">{key}</p>
                      <p className="text-sm leading-relaxed text-ivory-dim">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-line">
                   <p className="text-[9px] uppercase tracking-widest text-muted">ID: {selectedApp.id}</p>
                   <p className="text-[9px] uppercase tracking-widest text-muted mt-1">Recibido: {new Date(selectedApp.created_at).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
