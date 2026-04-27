"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormStepProps {
  dateLabel: string;
  timeLabel: string;
  timezoneNote?: string; // e.g. "16:00 tu hora" when user is in a different TZ
  onSubmit: (data: { name: string; email: string; phone: string; answers: Record<string, string> }) => Promise<void>;
  onBack: () => void;
  submitting: boolean;
  errorMessage: string | null;
}

export function FormStep({ dateLabel, timeLabel, timezoneNote, onSubmit, onBack, submitting, errorMessage }: FormStepProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Custom questions
  const [profile, setProfile] = useState("");
  const [instagram, setInstagram] = useState("");
  const [goal, setGoal] = useState("");
  const [frequency, setFrequency] = useState("");
  const [partner, setPartner] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ 
      name, 
      email, 
      phone,
      answers: {
        perfil: profile,
        instagram: instagram,
        objetivo: goal,
        frecuencia_contenido: frequency,
        socio_representante: partner
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-h-[60vh] overflow-y-auto pr-4 space-y-8 custom-scrollbar">
      {/* Basic Info */}
      <div className="space-y-6">
        <div>
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">¿Cómo te llamas?</label>
          <input
            type="text" required minLength={2} placeholder="Ej: Leonardo Correa"
            value={name} onChange={(e) => setName(e.target.value)}
            className="w-full border-b border-line-strong bg-transparent py-2 font-serif text-lg text-ivory outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">¿Cuál es tu número? (Incluye prefijo +)</label>
          <input
            type="tel" required placeholder="Ej: +34 123456789"
            value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full border-b border-line-strong bg-transparent py-2 font-serif text-lg text-ivory outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">¿Cuál es tu correo?</label>
          <input
            type="email" required placeholder="Ej: pablomatinez@gmail.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-line-strong bg-transparent py-2 font-serif text-lg text-ivory outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Qualification Questions */}
      <div className="space-y-6 pt-4">
        <div>
          <label className="mb-4 block font-serif text-base text-ivory">¿Eres coach, consultor o infoproductor?</label>
          <div className="space-y-3">
            {[
              "Si, soy coach, consultor o infoproductor.",
              "Mi negocio no tiene nada que ver con eso."
            ].map(opt => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" name="profile" required value={opt} 
                  onChange={(e) => setProfile(e.target.value)}
                  className="sr-only"
                />
                <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${profile === opt ? "border-gold" : "border-line-strong group-hover:border-gold/50"}`}>
                  {profile === opt && <div className="h-2 w-2 rounded-full bg-gold" />}
                </div>
                <span className={`text-sm transition-colors ${profile === opt ? "text-ivory" : "text-ivory-dim group-hover:text-ivory"}`}>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">¿Cuál es tu Instagram?</label>
          <input
            type="text" required placeholder="Ej: @kleystudio"
            value={instagram} onChange={(e) => setInstagram(e.target.value)}
            className="w-full border-b border-line-strong bg-transparent py-2 font-serif text-lg text-ivory outline-none focus:border-gold"
          />
        </div>

        <div>
          <label className="mb-4 block font-serif text-base text-ivory">¿Cuál es tu objetivo realista en los próximos meses?</label>
          <div className="space-y-3">
            {[
              "Pasar de 1.000$ mensuales a 5.000$ al mes.",
              "Pasar de 10.000$ mensuales a 20.000$ por mes",
              "Pasar de 60.000$ al mes y alcanzar los 100.000$ mensuales",
              "Salir del rango de los 100K-150K$ mensuales y poder llegar a +200K$ por mes"
            ].map(opt => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" name="goal" required value={opt} 
                  onChange={(e) => setGoal(e.target.value)}
                  className="sr-only"
                />
                <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${goal === opt ? "border-gold" : "border-line-strong group-hover:border-gold/50"}`}>
                  {goal === opt && <div className="h-2 w-2 rounded-full bg-gold" />}
                </div>
                <span className={`text-sm transition-colors ${goal === opt ? "text-ivory" : "text-ivory-dim group-hover:text-ivory"}`}>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-4 block font-serif text-base text-ivory">¿Cuánto contenido subes por semana?</label>
          <div className="space-y-3">
            {[
              "Publico contenido una sola vez por semana.",
              "Publico contenido entre 3 y 5 veces por semana.",
              "Publico contenido nuevo todos los días.",
              "Publico contenido más de una vez al día, todos los días."
            ].map(opt => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" name="frequency" required value={opt} 
                  onChange={(e) => setFrequency(e.target.value)}
                  className="sr-only"
                />
                <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${frequency === opt ? "border-gold" : "border-line-strong group-hover:border-gold/50"}`}>
                  {frequency === opt && <div className="h-2 w-2 rounded-full bg-gold" />}
                </div>
                <span className={`text-sm transition-colors ${frequency === opt ? "text-ivory" : "text-ivory-dim group-hover:text-ivory"}`}>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-4 block font-serif text-base text-ivory">¿Tienes algún socio del negocio o representante que tenga que estar contigo en la llamada?</label>
          <div className="space-y-3">
            {[
              "No, yo decido todo por mi cuenta.",
              "Si, voy a entrar con alguien más."
            ].map(opt => (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" name="partner" required value={opt} 
                  onChange={(e) => setPartner(e.target.value)}
                  className="sr-only"
                />
                <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${partner === opt ? "border-gold" : "border-line-strong group-hover:border-gold/50"}`}>
                  {partner === opt && <div className="h-2 w-2 rounded-full bg-gold" />}
                </div>
                <span className={`text-sm transition-colors ${partner === opt ? "text-ivory" : "text-ivory-dim group-hover:text-ivory"}`}>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="flex gap-8 border border-line bg-[rgba(212,176,120,0.05)] px-5 py-4">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">Fecha</div>
          <div className="mt-1 font-serif text-base text-ivory">{dateLabel}</div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">Hora</div>
          <div className="mt-1 font-serif text-base text-ivory">{timeLabel}</div>
          {timezoneNote && (
            <div className="mt-0.5 font-mono text-[9px] text-muted">{timezoneNote}</div>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="border border-[rgba(212,120,120,0.3)] bg-[rgba(212,120,120,0.1)] px-4 py-3 text-sm text-[#f5b7b7]">
          {errorMessage}
        </div>
      )}

      {/* Footer */}
      <div className="sticky bottom-0 bg-bg pt-6 pb-2 border-t border-line flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted hover:text-gold transition-colors"
          onClick={onBack}
        >
          <ChevronLeft className="h-3 w-2" />
          Volver
        </button>
        <Button type="submit" disabled={submitting} className="px-8">
          {submitting ? "Confirmando..." : "Finalizar reserva"}
        </Button>
      </div>
    </form>
  );
}
