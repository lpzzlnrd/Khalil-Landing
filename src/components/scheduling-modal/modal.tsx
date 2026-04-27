"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Shell } from "@/components/ui/shell";
import { CalendarStep } from "./calendar-step";
import { TimeStep } from "./time-step";
import { FormStep } from "./form-step";
import { SuccessStep } from "./success-step";

interface SchedulingModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = "calendar" | "time" | "form" | "success";

export function SchedulingModal({ open, onClose }: SchedulingModalProps) {
  const [step, setStep] = useState<Step>("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateLabel, setDateLabel] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectDate = (date: Date, label: string) => {
    setSelectedDate(date);
    setDateLabel(label);
    setStep("time");
  };

  const handleSubmitForm = async (formData: { name: string; email: string; phone: string; answers: Record<string, string> }) => {
    setSubmitting(true);
    setError(null);
    setApplicantEmail(formData.email);

    const y = selectedDate!.getFullYear();
    const m = String(selectedDate!.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate!.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: dateStr,
          time: selectedTime,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al procesar la aplicación");

      setStep("success");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep("calendar");
    setSelectedDate(null);
    setSelectedTime("");
    setApplicantEmail("");
    setError(null);
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#0a0907]/90 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="relative z-10 w-full max-w-[640px] border border-line bg-bg shadow-2xl max-sm:h-full max-sm:max-h-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line px-8 py-6">
              <span className="font-serif text-sm tracking-[0.3em] text-ivory uppercase">
                {step === "success" ? "Completado" : "Agendar llamada"}
              </span>
              <button
                onClick={handleClose}
                className="text-muted transition-colors hover:text-gold"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 max-sm:px-6">
              {step === "calendar" && (
                <CalendarStep
                  selectedDate={selectedDate}
                  onSelect={handleSelectDate}
                  onNext={() => setStep("time")}
                />
              )}
              {step === "time" && selectedDate && (
                <TimeStep
                  selectedDate={selectedDate}
                  dateLabel={dateLabel}
                  selectedTime={selectedTime}
                  onSelect={setSelectedTime}
                  onNext={() => setStep("form")}
                  onBack={() => setStep("calendar")}
                />
              )}
              {step === "form" && (
                <FormStep
                  dateLabel={dateLabel}
                  timeLabel={selectedTime}
                  onSubmit={handleSubmitForm}
                  onBack={() => setStep("time")}
                  submitting={submitting}
                  errorMessage={error}
                />
              )}
              {step === "success" && (
                <SuccessStep 
                  dateLabel={dateLabel}
                  timeLabel={selectedTime}
                  email={applicantEmail}
                  onClose={handleClose} 
                />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
