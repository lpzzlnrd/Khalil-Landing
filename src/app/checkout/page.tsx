"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, LogOut, ChevronDown, Calendar as CalendarIcon, List, X, ExternalLink, Mail, Phone, AtSign, Target, Clock, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import { format, parseISO, isSameDay } from "date-fns";
import "react-day-picker/dist/style.css";

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

const iconMap: Record<string, any> = {
  instagram: AtSign,
  objetivo: Target,
  frecuencia_contenido: Clock,
  socio_representante: Users,
  perfil: Users
};

export default function AdminDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [view, setView] = useState<"list" | "calendar">("list");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());

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

  const bookedDays = useMemo(() => {
    return applications.map(app => parseISO(app.date));
  }, [applications]);

  const appsForSelectedDay = useMemo(() => {
    if (!selectedDay) return [];
    return applications.filter(app => isSameDay(parseISO(app.date), selectedDay));
  }, [applications, selectedDay]);

  return (
    <div className="min-h-screen bg-[#0a0907] text-ivory p-4 md:p-10 font-sans">
      <style>{`
        .rdp { --rdp-accent-color: #d4b078; --rdp-background-color: #1a1812; margin: 0; }
        .rdp-day_selected { background-color: var(--rdp-accent-color) !important; color: #0a0907 !important; }
        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: #1a1812; color: #d4b078; }
        .rdp-day_has_app { font-weight: bold; position: relative; }
        .rdp-day_has_app::after { content: ''; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background-color: #d4b078; }
      `}</style>

      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <header className="mb-12 flex items-center justify-between border-b border-line pb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-3xl font-light tracking-tight">
              Dashboard <em className="text-gold italic">Admin</em>
            </h1>
            <p className="text-muted text-[10px] mt-2 uppercase tracking-[0.3em]">Carousels Selling · Khalil</p>
          </div>
          <div className="flex items-center gap-4 md:gap-8">
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
            <button onClick={handleLogout} className="text-muted hover:text-red-400 transition-colors flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
              <LogOut size={16} /> Salir
            </button>
          </div>
        </header>

        {view === "list" ? (
          <>
            {/* Controls */}
            <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-4 flex-1 max-w-2xl min-w-[300px]">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                  <input 
                    type="text" placeholder="Buscar cliente..." 
                    className="w-full bg-bg-2 border border-line py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gold transition-colors"
                    value={search} onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <select 
                  className="bg-bg-2 border border-line px-4 py-2.5 text-[10px] uppercase tracking-widest outline-none focus:border-gold"
                  value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="pending">Pendientes</option>
                  <option value="confirmed">Confirmados</option>
                  <option value="cancelled">Cancelados</option>
                </select>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] text-muted uppercase tracking-widest">Total: {filtered.length} aplicaciones</span>
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-4">
              {loading ? (
                <div className="py-20 text-center text-muted font-mono animate-pulse">Cargando aplicaciones...</div>
              ) : filtered.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-line text-muted font-serif italic">No se encontraron resultados</div>
              ) : (
                filtered.map((app) => (
                  <div 
                    key={app.id} onClick={() => setSelectedApp(app)}
                    className="bg-bg-2 border border-line p-5 flex flex-wrap items-center justify-between gap-6 cursor-pointer hover:border-gold/40 transition-all group"
                  >
                    <div className="flex gap-6 items-center">
                      <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center text-gold font-serif text-xl">
                        {app.name[0]}
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-ivory group-hover:text-gold transition-colors">{app.name}</h3>
                        <p className="text-muted text-[11px] font-mono mt-0.5">{app.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-8 md:gap-16">
                      <div className="text-center">
                        <p className="text-[9px] uppercase tracking-widest text-muted mb-1">Fecha</p>
                        <p className="font-serif text-sm">{format(parseISO(app.date), "dd MMM", { locale: es })}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] uppercase tracking-widest text-muted mb-1">Hora</p>
                        <p className="font-mono text-sm">{app.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className={`px-3 py-1 border text-[9px] uppercase tracking-widest font-mono ${statusColors[app.status]}`}>
                        {app.status}
                      </span>
                      <ExternalLink size={14} className="text-muted group-hover:text-gold transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </>
        ) : (
          /* Calendar View */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            <div className="bg-bg-2 border border-line p-8 flex justify-center">
              <DayPicker
                mode="single"
                selected={selectedDay}
                onSelect={setSelectedDay}
                locale={es}
                modifiers={{ hasApp: bookedDays }}
                modifiersClassNames={{ hasApp: "rdp-day_has_app" }}
                className="font-serif"
              />
            </div>
            <div className="bg-bg-2 border border-line flex flex-col">
              <div className="p-6 border-b border-line">
                <h3 className="font-serif text-xl text-gold">
                  {selectedDay ? format(selectedDay, "dd 'de' MMMM", { locale: es }) : "Selecciona un día"}
                </h3>
                <p className="text-muted text-[10px] uppercase tracking-widest mt-1">
                  {appsForSelectedDay.length} citas programadas
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {appsForSelectedDay.map(app => (
                  <div 
                    key={app.id} onClick={() => setSelectedApp(app)}
                    className="p-4 border border-line bg-bg hover:border-gold/50 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-[13px] text-gold">{app.time}</span>
                      <span className={`text-[8px] px-2 py-0.5 border uppercase tracking-tighter ${statusColors[app.status]}`}>{app.status}</span>
                    </div>
                    <h4 className="font-serif text-base">{app.name}</h4>
                  </div>
                ))}
                {appsForSelectedDay.length === 0 && (
                  <div className="h-full flex items-center justify-center text-muted font-serif italic text-sm py-20">
                    No hay citas para este día
                  </div>
                )}
              </div>
            </div>
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
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="relative w-full max-w-xl h-full bg-bg border-l border-line shadow-2xl overflow-y-auto custom-scrollbar"
            >
              <div className="p-8 md:p-12 pb-24">
                <div className="flex justify-between items-start mb-12">
                  <button onClick={() => setSelectedApp(null)} className="text-muted hover:text-gold transition-colors">
                    <X size={24} />
                  </button>
                  <select 
                    value={selectedApp.status} 
                    onChange={e => updateStatus(selectedApp.id, e.target.value)}
                    className={`bg-transparent border border-line px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] outline-none ${statusColors[selectedApp.status]}`}
                  >
                    <option value="pending" className="bg-bg">Pendiente</option>
                    <option value="confirmed" className="bg-bg">Confirmado</option>
                    <option value="cancelled" className="bg-bg">Cancelado</option>
                  </select>
                </div>

                <div className="mb-12">
                  <h2 className="font-serif text-4xl font-light mb-4">{selectedApp.name}</h2>
                  <div className="flex flex-wrap gap-6 text-muted">
                    <div className="flex items-center gap-2"><Mail size={14}/> <span className="text-xs">{selectedApp.email}</span></div>
                    <div className="flex items-center gap-2"><Phone size={14}/> <span className="text-xs">{selectedApp.phone}</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-12">
                   <div className="bg-bg-2 p-4 border border-line">
                      <p className="text-[9px] uppercase tracking-widest text-muted mb-1">Fecha</p>
                      <p className="font-serif text-lg">{format(parseISO(selectedApp.date), "dd MMMM", { locale: es })}</p>
                   </div>
                   <div className="bg-bg-2 p-4 border border-line">
                      <p className="text-[9px] uppercase tracking-widest text-muted mb-1">Hora</p>
                      <p className="font-mono text-lg">{selectedApp.time}</p>
                   </div>
                </div>

                {selectedApp.meeting_link && (
                  <div className="mb-12">
                    <a 
                      href={selectedApp.meeting_link} target="_blank"
                      className="flex items-center justify-center gap-3 w-full bg-gold text-bg py-4 font-mono text-xs uppercase tracking-[0.2em] hover:bg-ivory transition-colors"
                    >
                      Entrar a Google Meet <ExternalLink size={14} />
                    </a>
                  </div>
                )}

                <div className="space-y-6">
                  <h3 className="font-serif text-xl font-light text-gold flex items-center gap-3">
                    <div className="h-px w-8 bg-gold/30" /> Respuestas de calificación
                  </h3>
                  
                  {Object.entries(selectedApp.answers || {}).map(([key, value]) => {
                    const Icon = iconMap[key.toLowerCase()] || List;
                    return (
                      <div key={key} className="bg-bg-2 p-6 border border-line group hover:border-gold/30 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                          <Icon size={14} className="text-gold" />
                          <p className="text-[9px] uppercase tracking-[0.2em] text-muted">{key.replace(/_/g, ' ')}</p>
                        </div>
                        <p className="text-sm leading-relaxed text-ivory/90">{value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
