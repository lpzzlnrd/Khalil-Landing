"use client";

import { Shell } from "@/components/ui/shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

const items = [
  "Creación del “Espejo de marca”",
  "Analisis profundo de contenido y KPIs",
  "Planeación de carruseles y formatos",
  "Guionizado de carruseles",
  "Creación y diseño de carruseles",
  "Carruseles nuevos cada día",
  "CRM de métricas y KPIs de contenido",
  "Calendario de publicación",
  "Carpetas de Drive con los carruseles ordenados por semanas.",
  "Documento de guionizado",
];

export function Deliverables() {
  return (
    <section className="py-[clamp(80px,12vw,160px)]">
      <Shell>
        <div className="mb-[clamp(60px,8vw,100px)] grid grid-cols-[1fr_1.2fr] items-end gap-[60px] max-[780px]:grid-cols-1 max-[780px]:gap-6">
          <Reveal>
            <Eyebrow>Sistema de Contenido</Eyebrow>
            <h2 className="mt-5 font-serif text-[clamp(38px,5vw,68px)] font-light leading-[1.05] tracking-[-0.02em]">
              ¿Qué obtienes <em className="text-gold italic font-light">al entrar?</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-[62ch] text-[clamp(15px,1.2vw,18px)] leading-[1.6] text-ivory-dim">
              Estos son todos los entregables que obtienes una vez entras a Carousels Selling durante los meses activos ⇩
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 border-t border-line max-[780px]:grid-cols-1">
          {items.map((name, i) => (
            <Reveal key={name} delay={i * 0.03}>
              <div
                className={`grid grid-cols-[50px_1fr_auto] items-center gap-[18px] border-b border-line py-[26px] transition-all duration-300 hover:pl-[30px] ${
                  i % 2 === 0
                    ? "border-r border-line pr-6 max-[780px]:border-r-0 max-[780px]:pr-0"
                    : "pl-6 hover:pl-8 max-[780px]:pl-0 max-[780px]:hover:pl-[30px]"
                }`}
              >
                <span className="font-mono text-[10px] tracking-[0.2em] text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-serif text-[clamp(17px,1.6vw,22px)] text-ivory font-light">
                  {name}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-gold-deep opacity-50" />
              </div>
            </Reveal>
          ))}
        </div>
      </Shell>
    </section>
  );
}
