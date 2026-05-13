"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NoiseOverlay } from "@/components/ui/noise-overlay";
import { CalendarStep } from "@/components/scheduling-modal/calendar-step";
import { TimeStep } from "@/components/scheduling-modal/time-step";
import { FormStep } from "@/components/scheduling-modal/form-step";
import { SuccessStep } from "@/components/scheduling-modal/success-step";
import { BUSINESS_TZ } from "@/lib/timezone";

type Step = "calendar" | "time" | "form" | "success";

export default function AgendarClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateLabel, setDateLabel] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Compute a timezone note for users outside the business TZ */
  const timezoneNote = useMemo(() => {
    if (!selectedDate || !selectedTime) return undefined;
    const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (userTZ === BUSINESS_TZ) return undefined;

    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${d}`;

    // Convert business time to user local time
    const ref = new Date(`${dateStr}T${selectedTime}:00`);
    const businessRef = new Date(ref.toLocaleString("en-US", { timeZone: BUSINESS_TZ }));
    const localRef = new Date(ref.toLocaleString("en-US"));
    const diffMs = localRef.getTime() - businessRef.getTime();
    const localTime = new Date(ref.getTime() + diffMs);

    const localStr = localTime.toLocaleTimeString("es-ES", {
      hour: "2-digit", minute: "2-digit", hour12: false,
    });
    return `${localStr} tu hora`;
  }, [selectedDate, selectedTime]);

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

  const handleFinish = () => {
    router.push("/");
  };

  const stepIndex = step === "calendar" ? 0 : step === "time" ? 1 : step === "form" ? 2 : 3;

  return (
    <>
      <NoiseOverlay />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-5 py-12">
        {/* Background glow effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gold/[0.04] blur-[120px]" />
          <div className="absolute -bottom-[20%] left-1/4 h-[400px] w-[400px] rounded-full bg-gold-deep/[0.06] blur-[100px]" />
        </div>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute left-5 top-5 sm:left-8 sm:top-8"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Volver
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
          className="relative z-10 w-full max-w-[640px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border border-b-0 border-line bg-bg-2/60 backdrop-blur-sm px-8 py-6 max-sm:px-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gold" />
              <span className="font-serif text-sm tracking-[0.3em] text-ivory uppercase">
                {step === "success" ? "Completado" : "Agendar llamada"}
              </span>
            </div>

            {/* Step indicators */}
            {step !== "success" && (
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === stepIndex
                        ? "w-6 bg-gold"
                        : i < stepIndex
                        ? "w-3 bg-gold/40"
                        : "w-3 bg-line-strong"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="border border-line bg-bg shadow-2xl">
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
                  timezoneNote={timezoneNote}
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
                  timezoneNote={timezoneNote}
                  email={applicantEmail}
                  onClose={handleFinish}
                />
              )}
            </div>
          </div>

          {/* Footer accent line */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </motion.div>

        {/* Branding */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-2"
        >
          Kley Studio
        </motion.p>
      </div>
    </>
  );
}

