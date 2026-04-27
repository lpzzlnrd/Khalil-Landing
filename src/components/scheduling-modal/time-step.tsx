"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimeStepProps {
  dateLabel: string;
  selectedTime: string;
  onSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const slots = [
  { time: "09:00", available: true },
  { time: "09:30", available: true },
  { time: "10:00", available: true },
  { time: "10:30", available: false },
  { time: "11:00", available: true },
  { time: "12:00", available: true },
  { time: "13:00", available: true },
  { time: "16:00", available: true },
  { time: "17:00", available: false },
  { time: "18:00", available: true },
  { time: "19:00", available: true },
];

export function TimeStep({ dateLabel, selectedTime, onSelect, onNext, onBack }: TimeStepProps) {
  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-baseline justify-between">
        <span className="font-serif text-[22px] text-ivory">{dateLabel}</span>
        <span className="font-mono text-[10px] tracking-[0.15em] text-muted">TZ · CET (Madrid)</span>
      </div>

      {/* Slots grid */}
      <div className="grid grid-cols-3 gap-2 max-[500px]:grid-cols-2">
        {slots.map((s) => (
          <button
            key={s.time}
            disabled={!s.available}
            className={`border px-2.5 py-3.5 text-center font-mono text-[13px] transition-all duration-200 ${
              selectedTime === s.time
                ? "border-gold bg-gold text-[#0a0907]"
                : s.available
                ? "border-line text-ivory hover:border-gold hover:text-gold"
                : "pointer-events-none border-line text-muted-2 line-through"
            }`}
            onClick={() => onSelect(s.time)}
          >
            {s.time}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
        <button
          className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors duration-200 hover:text-gold"
          onClick={onBack}
        >
          <ChevronLeft className="h-3 w-2" />
          Volver
        </button>
        <Button
          onClick={onNext}
          disabled={!selectedTime}
          className={!selectedTime ? "pointer-events-none opacity-40" : ""}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
