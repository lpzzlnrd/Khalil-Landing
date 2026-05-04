"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS_TZ, BUSINESS_TZ_LABEL } from "@/lib/timezone";

interface TimeStepProps {
  selectedDate: Date; // Required now to check availability
  dateLabel: string;
  selectedTime: string; // Always in business TZ (e.g. "09:00")
  onSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const ALL_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00",
  "12:00", "13:00", "16:00", "17:00", "18:00", "19:00",
];

/** Convert a business-TZ time to the user's local time for display */
function businessToLocal(dateStr: string, businessTime: string): string {
  const [h, m] = businessTime.split(":").map(Number);
  // Build a Date in the business timezone by formatting a known instant
  // We create a date string that, when parsed as the business TZ, gives us the right instant
  const dateObj = new Date(dateStr + "T" + businessTime + ":00");

  // Get the offset difference between business TZ and local TZ
  const businessDate = new Date(
    dateObj.toLocaleString("en-US", { timeZone: BUSINESS_TZ })
  );
  const localDate = new Date(
    dateObj.toLocaleString("en-US")
  );
  const diffMs = localDate.getTime() - businessDate.getTime();

  // The actual local time = business time + offset difference
  const localTime = new Date(dateObj.getTime() + diffMs);

  return localTime.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** Check if the user's local timezone differs from the business timezone */
function isUserInBusinessTZ(): boolean {
  const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return userTZ === BUSINESS_TZ;
}

/** Get the user's timezone abbreviation for display */
function getUserTZLabel(): string {
  try {
    const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Get a short timezone name
    const parts = new Intl.DateTimeFormat("es-ES", {
      timeZoneName: "short",
      timeZone: userTZ,
    }).formatToParts(new Date());
    const tzPart = parts.find(p => p.type === "timeZoneName");
    return tzPart?.value || userTZ.split("/").pop()?.replace(/_/g, " ") || "Local";
  } catch {
    return "Local";
  }
}

export function TimeStep({ selectedDate, dateLabel, selectedTime, onSelect, onNext, onBack }: TimeStepProps) {
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const dateStr = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [selectedDate]);

  const sameZone = useMemo(() => isUserInBusinessTZ(), []);
  const userTZLabel = useMemo(() => getUserTZLabel(), []);

  useEffect(() => {
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
  }, [dateStr]);

  const slots = useMemo(() => {
    return ALL_SLOTS.map(time => {
      // 24h lead time: calculate in business TZ
      const now = new Date();
      const nowInBusiness = new Date(
        now.toLocaleString("en-US", { timeZone: BUSINESS_TZ })
      );
      const minTime = new Date(nowInBusiness.getTime() + 24 * 60 * 60 * 1000);

      const [h, min] = time.split(":").map(Number);
      const slotInBusiness = new Date(selectedDate);
      slotInBusiness.setHours(h, min, 0, 0);

      const isTooSoon = slotInBusiness < minTime;
      const isBooked = bookedTimes.includes(time);

      const localTime = sameZone ? time : businessToLocal(dateStr, time);

      return {
        time,        // business TZ time (stored value)
        localTime,   // user's local time (display value)
        available: !isTooSoon && !isBooked,
      };
    });
  }, [selectedDate, bookedTimes, dateStr, sameZone]);

  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between">
        <span className="font-serif text-[22px] text-ivory">{dateLabel}</span>
        <span className="font-mono text-[10px] tracking-[0.15em] text-muted">
          TZ · {BUSINESS_TZ_LABEL}
        </span>
      </div>

      {!sameZone && (
        <div className="mb-4 border border-line bg-[rgba(0,229,255,0.06)] px-4 py-2.5 font-mono text-[11px] text-ivory-dim">
          Horarios en tu zona ({userTZLabel}) junto a la hora del negocio
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 max-[500px]:grid-cols-2">
        {slots.map((s) => (
          <button
            key={s.time}
            disabled={!s.available || loading}
            className={`border px-2.5 py-3.5 text-center font-mono text-[13px] transition-all duration-200 ${
              selectedTime === s.time
                ? "border-gold bg-gold text-[#0a1628]"
                : s.available
                ? "border-line text-ivory hover:border-gold hover:text-gold"
                : "pointer-events-none border-line text-muted-2 line-through opacity-40"
            }`}
            onClick={() => onSelect(s.time)}
          >
            {sameZone ? (
              s.time
            ) : (
              <>
                <span className="block text-[13px]">{s.localTime}</span>
                <span className="block text-[9px] text-muted">{s.time} VET</span>
              </>
            )}
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
