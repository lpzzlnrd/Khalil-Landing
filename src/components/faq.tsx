"use client";

import { useState, useRef, useCallback } from "react";
import { Shell } from "@/components/ui/shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

const faqs = [
  {
    q: "¿Para qué tipo de personas está pensado?",
    a: "Coaches, consultores e infoproductores que ya venden constantemente en Instagram, generalmente atascados en los 100K/mes, que buscan aumentar volumen sin aumentar carga operativa. No es para cuentas en fase cero — es para negocios que ya facturan y quieren romper el techo.",
  },
  {
    q: "¿Cuándo podré ver resultados?",
    a: "El sistema se instala en las primeras 2–3 semanas. Los primeros resultados en DMs llegan en la semana 2; el flujo de carruseles empieza a captar desde el día 1. Resultados materiales en facturación aparecen típicamente entre el mes 2 y el 3.",
  },
  {
    q: "¿Cuánto tiempo dura el programa?",
    a: "Trabajamos por ciclos trimestrales renovables. El primer ciclo incluye instalación, optimización y el primer trimestre de operación completa del sistema.",
  },
  {
    q: "¿Qué voy a lograr con este programa?",
    a: "Instalar un sistema de adquisición paralelo que capte y califique leads sin depender de tu tiempo. Multiplicar el volumen de llamadas agendadas y, con ello, escalar facturación sin aumentar carga operativa.",
  },
  {
    q: "¿Por qué funciona?",
    a: "Porque rompe la dependencia lineal entre tiempo del creador y output de contenido. Dos flujos independientes trabajan en paralelo y VENOM califica el volumen 24/7 sin perder humanidad.",
  },
  {
    q: "¿Qué significa Espejo de Marca?",
    a: "Es un documento vivo que captura tono, posicionamiento, historia y arquetipos de tu marca. Permite al equipo producir contenido y copys indistinguibles de los tuyos. Es la base sobre la que opera todo el sistema.",
  },
  {
    q: "¿Cómo puedo comenzar?",
    a: 'Aplicando a una llamada desde cualquier botón "Aplicar" de esta página. Revisamos tu caso, evaluamos si encaja, y si avanza agendamos la instalación.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => setOpen((v) => !v), []);

  return (
    <div className="border-b border-line">
      <button
        className="group flex w-full items-center justify-between py-7 pr-[50px] text-left font-serif text-[clamp(18px,1.6vw,22px)] font-light text-ivory transition-colors duration-300 hover:text-gold"
        onClick={toggle}
        aria-expanded={open}
      >
        {q}
        <span className="relative h-[22px] w-[22px] flex-none">
          <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-gold" />
          <span
            className={`absolute left-1/2 top-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 bg-gold transition-transform duration-300 ${
              open ? "rotate-90" : ""
            }`}
          />
        </span>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-[max-height] duration-400 ease-[cubic-bezier(.2,.7,.2,1)]"
        style={{ maxHeight: open ? contentRef.current?.scrollHeight ?? 0 : 0 }}
      >
        <div className="max-w-[62ch] pb-7 text-[15px] leading-[1.7] text-ivory-dim">{a}</div>
      </div>
    </div>
  );
}

export function Faq() {
  return (
    <section className="py-[clamp(80px,12vw,160px)]">
      <Shell>
        <div className="grid grid-cols-[1fr_1.4fr] items-start gap-[clamp(40px,6vw,80px)] max-[860px]:grid-cols-1">
          <Reveal>
            <Eyebrow>06 / FAQ</Eyebrow>
            <h2 className="mt-5 font-serif text-[clamp(38px,5vw,68px)] font-light leading-[1.05] tracking-[-0.02em]">
              Preguntas <em className="text-gold italic font-light">frecuentes</em>
            </h2>
            <p className="mt-7 max-w-[34ch] text-[15px] leading-[1.7] text-ivory-dim">
              Si tu duda no está aquí, la resolvemos en la llamada de aplicación.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border-t border-line">
              {faqs.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}
