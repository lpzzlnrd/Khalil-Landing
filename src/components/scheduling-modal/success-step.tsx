"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessStepProps {
  dateLabel: string;
  timeLabel: string;
  email: string;
  onClose: () => void;
}

export function SuccessStep({ dateLabel, timeLabel, email, onClose }: SuccessStepProps) {
  return (
    <div className="py-[30px] text-center">
      {/* Check icon */}
      <div className="relative mx-auto mb-7 flex h-[72px] w-[72px] items-center justify-center rounded-full border border-gold text-gold">
        <Check className="h-7 w-7" strokeWidth={1.4} />
        <span className="absolute inset-[-8px] rounded-full border border-gold opacity-30 animate-[ring_2s_ease-out_infinite]" />
      </div>

      <h4 className="mb-3.5 font-serif text-[28px] font-light">Aplicación recibida</h4>
      <p className="mx-auto mb-7 max-w-[42ch] text-ivory-dim">
        Hemos enviado la confirmación a tu email. Si tu caso encaja, el equipo te contactará en las próximas 24–48h para cerrar la llamada.
      </p>

      {/* Meta */}
      <div className="mx-auto max-w-[360px] border border-line text-left">
        {[
          { label: "Reservado", value: dateLabel },
          { label: "Hora", value: timeLabel },
          { label: "Email", value: email },
          { label: "Estado", value: "Pendiente", gold: true },
        ].map((row, i, arr) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-5 py-2.5 ${
              i < arr.length - 1 ? "border-b border-line" : ""
            }`}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{row.label}</span>
            <span className={`font-serif text-sm ${row.gold ? "text-gold" : "text-ivory"}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-[30px]">
        <Button variant="ghost" arrow={false} onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </div>
  );
}
