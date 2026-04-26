"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormStepProps {
  dateLabel: string;
  timeLabel: string;
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
  onBack: () => void;
}

export function FormStep({ dateLabel, timeLabel, onSubmit, onBack }: FormStepProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, phone });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Fields first */}
      <div className="mb-[22px]">
        <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Nombre completo
        </label>
        <input
          type="text"
          required
          minLength={2}
          placeholder="Ana Martínez"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border-b border-line-strong bg-transparent py-3 font-serif text-lg font-light text-ivory outline-none transition-colors duration-200 placeholder:italic placeholder:text-muted-2 focus:border-gold"
        />
      </div>
      <div className="mb-[22px]">
        <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Email
        </label>
        <input
          type="email"
          required
          placeholder="ana@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-b border-line-strong bg-transparent py-3 font-serif text-lg font-light text-ivory outline-none transition-colors duration-200 placeholder:italic placeholder:text-muted-2 focus:border-gold"
        />
      </div>
      <div className="mb-[22px]">
        <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          WhatsApp / Teléfono
        </label>
        <input
          type="tel"
          required
          placeholder="+34 600 000 000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border-b border-line-strong bg-transparent py-3 font-serif text-lg font-light text-ivory outline-none transition-colors duration-200 placeholder:italic placeholder:text-muted-2 focus:border-gold"
        />
      </div>

      {/* Summary at the bottom (per user feedback) */}
      <div className="mt-7 grid grid-cols-2 gap-3.5 border border-line bg-[rgba(212,176,120,0.05)] px-5 py-[18px]">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">Fecha</div>
          <div className="mt-1 font-serif text-base text-ivory">{dateLabel}</div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted">Hora</div>
          <div className="mt-1 font-serif text-base text-ivory">{timeLabel}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
        <button
          type="button"
          className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-200 hover:text-gold"
          onClick={onBack}
        >
          <ChevronLeft className="h-3 w-2" />
          Volver
        </button>
        <Button type="submit">Confirmar aplicación</Button>
      </div>
    </form>
  );
}
