"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormStepProps {
  dateLabel: string;
  timeLabel: string;
  onSubmit: (data: { name: string; email: string; phone: string; answers: Record<string, string> }) => Promise<void>;
  onBack: () => void;
  submitting: boolean;
  errorMessage: string | null;
}

export function FormStep({ dateLabel, timeLabel, onSubmit, onBack, submitting, errorMessage }: FormStepProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Extra questions
  const [ig, setIg] = useState("");
  const [billing, setBilling] = useState("");
  const [bottleneck, setBottleneck] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ 
      name, 
      email, 
      phone,
      answers: {
        instagram: ig,
        billing: billing,
        bottleneck: bottleneck
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Nombre completo</label>
          <input
            type="text" required minLength={2} placeholder="Ana Martínez"
            value={name} onChange={(e) => setName(e.target.value)}
            className="w-full border-b border-line-strong bg-transparent py-2 font-serif text-lg text-ivory outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Email</label>
          <input
            type="email" required placeholder="ana@ejemplo.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-line-strong bg-transparent py-2 font-serif text-lg text-ivory outline-none focus:border-gold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">WhatsApp</label>
          <input
            type="tel" required placeholder="+34 600 000 000"
            value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full border-b border-line-strong bg-transparent py-2 font-serif text-lg text-ivory outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Usuario Instagram</label>
          <input
            type="text" required placeholder="@tuusuario"
            value={ig} onChange={(e) => setIg(e.target.value)}
            className="w-full border-b border-line-strong bg-transparent py-2 font-serif text-lg text-ivory outline-none focus:border-gold"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Facturación mensual actual</label>
        <select 
          required value={billing} onChange={(e) => setBilling(e.target.value)}
          className="w-full border-b border-line-strong bg-transparent py-2 font-serif text-lg text-ivory outline-none focus:border-gold appearance-none"
        >
          <option value="" disabled className="bg-bg text-muted italic">Selecciona una opción</option>
          <option value="0-1k" className="bg-bg">0 - 1.000€</option>
          <option value="1k-5k" className="bg-bg">1.000€ - 5.000€</option>
          <option value="5k-10k" className="bg-bg">5.000€ - 10.000€</option>
          <option value="10k+" className="bg-bg">Más de 10.000€</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">¿Cuál es tu mayor cuello de botella?</label>
        <textarea
          required placeholder="Ej: No tengo tiempo para grabar, mis leads no están calificados..."
          value={bottleneck} onChange={(e) => setBottleneck(e.target.value)}
          className="w-full border border-line-strong bg-bg-2 p-4 font-serif text-lg text-ivory outline-none focus:border-gold min-h-[100px]"
        />
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
        </div>
      </div>

      {errorMessage && (
        <div className="border border-[rgba(212,120,120,0.3)] bg-[rgba(212,120,120,0.1)] px-4 py-3 text-sm text-[#f5b7b7]">
          {errorMessage}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-line pt-6">
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
