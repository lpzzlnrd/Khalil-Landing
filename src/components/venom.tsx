"use client";

import { Shell } from "@/components/ui/shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

const features = [
  "Captación de leads 24/7",
  "IA Integrada",
  "100% humanizado",
  "Memoria Inteligente Específica",
  "Seguimientos Específicos",
  "2 fases de segmentación",
  "Nutrición de leads",
  "Pre-Agenda de leads",
  "Aumento de follows",
  "Manejo de alto volumen",
  "Filtro y calificación de leads",
];

export function Venom() {
  return (
    <section className="border-t border-b border-line bg-gradient-to-b from-[#0d0c09] to-bg py-[clamp(80px,12vw,160px)]">
      <Shell>
        <div className="grid grid-cols-[0.9fr_1.1fr] items-start gap-[clamp(40px,6vw,80px)] max-[860px]:grid-cols-1">
          <Reveal>
            <span className="mb-[22px] inline-flex items-center gap-2.5 rounded-full border border-line-strong px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-[ring_2s_ease-out_infinite]" />
              Automatización · ManyChat
            </span>
            <h2 className="font-serif text-[clamp(38px,5vw,68px)] font-light leading-[1.05] tracking-[-0.02em]">
              Sistema <em className="text-gold italic font-light">VENOM</em>
            </h2>
            <p className="mt-6 max-w-[62ch] text-[clamp(15px,1.2vw,18px)] leading-[1.6] text-ivory-dim">
              Se trata de una Automatización de ManyChat con funcionalidades pensadas para operar 24/7 sin perder humanidad ni calificación.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-px border border-line bg-line">
              {[
                { val: "24/7", label: "Activo" },
                { val: "100%", label: "Humanizado" },
              ].map((s) => (
                <div key={s.label} className="bg-bg p-5">
                  <div className="font-serif text-4xl italic leading-none text-gold">{s.val}</div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid grid-cols-2 gap-px border border-line bg-line max-[560px]:grid-cols-1">
              {features.map((feat, i) => (
                <div
                  key={feat}
                  className={`flex items-center gap-3.5 bg-bg px-[22px] py-5 ${
                    i === features.length - 1 ? "col-span-full max-[560px]:col-span-1" : ""
                  }`}
                >
                  <span className="flex h-6 w-6 flex-none items-center justify-center border border-gold font-mono text-[10px] text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm tracking-[0.01em] text-ivory">{feat}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}
