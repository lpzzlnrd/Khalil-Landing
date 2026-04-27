"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimeStepProps {
  selectedDate: Date; // Required now to check availability
  dateLabel: string;
  selectedTime: string;
  onSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const ALL_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", 
  "12:00", "13:00", "16:00", "17:00", "18:00", "19:00",
];

export function TimeStep({ selectedDate, dateLabel, selectedTime, onSelect, onNext, onBack }: TimeStepProps) {
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;

    async function loadBookedTimes() {
      setLoading(true);
      try {
        const res = await fetch(`/api/applications?availability=1&date=${dateStr}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setBookedTimes(data.bookedTimes || []);
      } catch {
        setBookedTimes([]);
      } finally {
        setLoading(false);
      }
    }
    loadBookedTimes();
  }, [selectedDate]);

  const slots = ALL_SLOTS.map(time => {
    // 24h lead time check also for specific slots if today/tomorrow
    const now = new Date();
    const minTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    const [h, min] = time.split(":").map(Number);
    const slotDate = new Date(selectedDate);
    slotDate.setHours(h, min, 0, 0);

    const isTooSoon = slotDate < minTime;
    const isBooked = bookedTimes.includes(time);

    return {
      time,
      available: !isTooSoon && !isBooked
    };
  });

  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between">
        <span className="font-serif text-[22px] text-ivory">{dateLabel}</span>
        <span className="font-mono text-[10px] tracking-[0.15em] text-muted">TZ · CET (Madrid)</span>
      </div>

      <div className="grid grid-cols-3 gap-2 max-[500px]:grid-cols-2">
        {slots.map((s) => (
          <button
            key={s.time}
            disabled={!s.available || loading}
            className={`border px-2.5 py-3.5 text-center font-mono text-[13px] transition-all duration-200 ${
              selectedTime === s.time
                ? "border-gold bg-gold text-[#0a0907]"
                : s.available
                ? "border-line text-ivory hover:border-gold hover:text-gold"
                : "pointer-events-none border-line text-muted-2 line-through opacity-40"
            }`}
            onClick={() => onSelect(s.time)}
          >
            {s.time}
          </button>
        ))}
      </div>

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
          disabled={!selectedTime || loading}
          className={!selectedTime || loading ? "pointer-events-none opacity-40" : ""}
        >
          {loading ? "Cargando..." : "Continuar"}
        </Button>
      </div>
    </div>
  );
}
