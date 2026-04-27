"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarStepProps {
  selectedDate: Date | null;
  onSelect: (date: Date, label: string) => void;
  onNext: () => void;
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DAYS = ["L", "M", "X", "J", "V", "S", "D"];

function formatLabel(d: Date) {
  return `${d.getDate()} de ${MONTHS[d.getMonth()]}`;
}

export function CalendarStep({ selectedDate, onSelect, onNext }: CalendarStepProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const cells = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const startDay = (first.getDay() + 6) % 7; // Monday=0
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const result: { day: number; available: boolean; date: Date | null }[] = [];
    for (let i = 0; i < startDay; i++) result.push({ day: 0, available: false, date: null });

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth, d);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      result.push({
        day: d,
        available: !isWeekend && !isPast,
        date,
      });
    }
    return result;
  }, [viewYear, viewMonth, today]);

  const changeMonth = (dir: number) => {
    let m = viewMonth + dir;
    let y = viewYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setViewMonth(m);
    setViewYear(y);
  };

  const isSelected = (d: Date | null) =>
    d && selectedDate && d.toDateString() === selectedDate.toDateString();

  return (
    <div>
      {/* Urgency banner */}
      <div className="mb-7 flex items-center gap-3.5 border border-line-strong bg-[rgba(212,176,120,0.08)] px-[18px] py-3.5 text-[13px] text-ivory-dim">
        <span className="h-2 w-2 flex-none rounded-full bg-gold animate-[blink_1.6s_infinite]" />
        <span>
          Quedan <strong className="font-medium text-gold">3 plazas</strong> este mes. Los slots se liberan en orden de aplicación.
        </span>
      </div>

      {/* Month header */}
      <div className="mb-5 flex items-center justify-between">
        <span className="font-serif text-xl text-ivory">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <div className="flex gap-2">
          <button
            className="flex h-8 w-8 items-center justify-center border border-line text-ivory-dim transition-all duration-200 hover:border-gold hover:text-gold"
            onClick={() => changeMonth(-1)}
          >
            <ChevronLeft className="h-[10px] w-[10px]" />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center border border-line text-ivory-dim transition-all duration-200 hover:border-gold hover:text-gold"
            onClick={() => changeMonth(1)}
          >
            <ChevronRight className="h-[10px] w-[10px]" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {DAYS.map((d) => (
          <span key={d} className="py-2 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
            {d}
          </span>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((c, i) =>
          c.day === 0 ? (
            <span key={`e${i}`} className="aspect-square" />
          ) : (
            <button
              key={i}
              disabled={!c.available}
              className={`relative flex aspect-square items-center justify-center border font-serif text-[15px] transition-all duration-200 ${
                isSelected(c.date)
                  ? "border-gold bg-gold text-[#0a0907]"
                  : c.available
                  ? "border-transparent text-ivory hover:border-gold hover:text-gold"
                  : "cursor-default border-transparent text-muted-2"
              }`}
              onClick={() => c.date && onSelect(c.date, formatLabel(c.date))}
            >
              {c.day}
              {c.available && !isSelected(c.date) && (
                <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold-deep" />
              )}
            </button>
          )
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
          Paso 1 / 3
        </span>
        <Button
          onClick={onNext}
          disabled={!selectedDate}
          className={!selectedDate ? "pointer-events-none opacity-40" : ""}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
