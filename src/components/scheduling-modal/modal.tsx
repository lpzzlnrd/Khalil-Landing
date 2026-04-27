"use client";

import { useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CalendarStep } from "./calendar-step";
import { TimeStep } from "./time-step";
import { FormStep } from "./form-step";
import { SuccessStep } from "./success-step";

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

const titles = ["Elige una fecha", "Elige una hora", "Tus datos", "Aplicación recibida"];
const stepLabels = ["Fecha", "Hora", "Datos", "Confirmado"];

export function SchedulingModal({ open, onClose }: ModalProps) {
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateLabel, setSelectedDateLabel] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toDateKey = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const reset = useCallback(() => {
    setStep(0);
    setSelectedDate(null);
    setSelectedDateLabel("");
    setSelectedTime("");
    setFormData({ name: "", email: "", phone: "" });
    setSubmitError(null);
    setSubmitting(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    reset();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, reset]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const goStep = (s: number) => setStep(s);

  const handleDateSelect = (date: Date, label: string) => {
    setSelectedDate(date);
    setSelectedDateLabel(label);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleSubmit = async (data: { name: string; email: string; phone: string }) => {
    if (!selectedDate || !selectedTime) {
      setSubmitError("Selecciona fecha y hora antes de confirmar.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        ...data,
        date: toDateKey(selectedDate),
        time: selectedTime,
      };

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const errorMessage = typeof body?.error === "string" ? body.error : "No se pudo guardar la cita.";
        setSubmitError(errorMessage);
        return;
      }

      setFormData(data);
      setStep(3);
    } catch {
      setSubmitError("No se pudo conectar con el servidor. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[rgba(4,3,2,0.82)] backdrop-blur-[8px]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-[640px] max-h-[92vh] overflow-y-auto border border-line-strong bg-bg-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {/* Close */}
            <button
              className="absolute right-[18px] top-[18px] z-[2] flex h-9 w-9 items-center justify-center rounded-full border border-line text-ivory-dim transition-all duration-300 hover:border-gold hover:text-gold"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {/* Header */}
            <div className="border-b border-line px-10 pt-9 pb-6">
              <Eyebrow className="mb-3">Aplicación · Carousels Selling</Eyebrow>
              <h3 className="font-serif text-[28px] font-light tracking-[-0.01em]">{titles[step]}</h3>

              {/* Progress */}
              <div className="mt-6 flex gap-2.5">
                {[0, 1, 2, 3].map((s) => (
                  <span
                    key={s}
                    className={`relative h-0.5 flex-1 overflow-hidden ${
                      s < step ? "bg-gold" : "bg-line"
                    }`}
                  >
                    {s === step && (
                      <span className="absolute inset-0 bg-gold animate-[fill_0.4s_ease_forwards]" />
                    )}
                  </span>
                ))}
              </div>
              <div className="mt-2.5 flex gap-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                {stepLabels.map((l, i) => (
                  <span key={l} className={`flex-1 ${i === step ? "text-gold" : ""}`}>
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="px-10 pt-8 pb-10">
              {step === 0 && (
                <CalendarStep
                  selectedDate={selectedDate}
                  onSelect={handleDateSelect}
                  onNext={() => goStep(1)}
                />
              )}
              {step === 1 && (
                <TimeStep
                  dateLabel={selectedDateLabel}
                  selectedTime={selectedTime}
                  onSelect={handleTimeSelect}
                  onNext={() => goStep(2)}
                  onBack={() => goStep(0)}
                />
              )}
              {step === 2 && (
                <FormStep
                  dateLabel={selectedDateLabel}
                  timeLabel={selectedTime}
                  onSubmit={handleSubmit}
                  onBack={() => goStep(1)}
                  submitting={submitting}
                  errorMessage={submitError}
                />
              )}
              {step === 3 && (
                <SuccessStep
                  dateLabel={selectedDateLabel}
                  timeLabel={selectedTime}
                  email={formData.email}
                  onClose={onClose}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
