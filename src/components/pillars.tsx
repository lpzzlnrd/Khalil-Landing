"use client";

import { Shell } from "@/components/ui/shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

const tickItems = (items: string[]) =>
  items.map((item) => (
    <li
      key={item}
      className="relative border-b border-line py-3 pl-[22px] text-sm text-ivory-dim before:absolute before:left-0 before:top-5 before:h-px before:w-2 before:bg-gold"
    >
      {item}
    </li>
  ));

export function Pillars() {
  return (
    <section className="pb-[clamp(80px,12vw,160px)]">
      <Shell>
        {/* Section Head */}
        <div className="mb-[clamp(60px,8vw,100px)] grid grid-cols-[1fr_1.2fr] items-end gap-[60px] max-[780px]:grid-cols-1 max-[780px]:gap-6">
          <Reveal>
            <Eyebrow>01 / Sistema</Eyebrow>
            <h2 className="mt-5 font-serif text-[clamp(38px,5vw,68px)] font-light leading-[1.05] tracking-[-0.02em]">
              Dos pilares. <em className="text-gold italic font-light">Un sistema.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-[62ch] text-[clamp(15px,1.2vw,18px)] leading-[1.6] text-ivory-dim">
              Un embudo dual que opera en paralelo al creador. Un flujo capta, otro convierte, y ninguno depende de que tú subas contenido ese día.
            </p>
          </Reveal>
        </div>

        {/* Pillar I — Horizontal (landscape card) */}
        <Reveal>
          <div className="border-t border-b border-line">
            <div className="grid grid-cols-[1.2fr_0.8fr] max-[900px]:grid-cols-1">
              <div className="border-r border-line p-[clamp(32px,4vw,56px)] max-[900px]:border-r-0 max-[900px]:border-b max-[900px]:border-line">
                <span className="font-serif text-lg italic text-gold">I.</span>
                <h3 className="mt-[18px] mb-[22px] font-serif text-[clamp(26px,2.6vw,38px)] font-light leading-[1.08]">
                  Captación <em className="text-gold italic font-light">Automatizada</em>
                </h3>
                <p className="text-sm leading-[1.7] text-ivory-dim">
                  Ante un aumento del volumen de entrada de leads, necesitas un sistema capaz de afrontar dicho volumen y evitar cuellos de botella futuros. Aquí instalamos un sistema automático en tu cuenta.
                </p>
                <ul className="mt-6 list-none">
                  {tickItems([
                    "Sistema paralelo de captación por DM",
                    "Flujo de contenido diario independiente",
                    "Capacidad para alto volumen sin cuellos de botella",
                  ])}
                </ul>
              </div>

              {/* Visual side */}
              <div className="relative flex flex-col justify-between gap-7 bg-bg-2 p-[clamp(40px,5vw,72px)] max-[900px]:p-[clamp(28px,3vw,44px)]">
                <div className="relative aspect-[16/10] overflow-hidden border border-line bg-[repeating-linear-gradient(135deg,#17150f_0_10px,#1a1812_10px_20px)]">
                  <span className="absolute top-[14px] left-[14px] flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-gold">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold animate-[blink_1.6s_ease-in-out_infinite]" />
                    DIAGRAMA · CAPTACIÓN
                  </span>
                  <span className="absolute bottom-[14px] left-[14px] font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    / Sistema automático DM
                  </span>
                </div>
                <div>
                  <Eyebrow>Flujo Paralelo</Eyebrow>
                  <p className="mt-2.5 text-sm leading-[1.7] text-ivory-dim">
                    Captación 24/7 sin depender de tu disponibilidad. El lead entra, el sistema responde.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Pillar II — Vertical (portrait card) */}
        <Reveal delay={0.15}>
          <div className="mt-px border-b border-line">
            <div className="grid grid-cols-[0.8fr_1.2fr] max-[900px]:grid-cols-1">
              {/* Visual side — top on mobile */}
              <div className="relative flex flex-col justify-between gap-7 border-r border-line bg-bg-2 p-[clamp(40px,5vw,72px)] max-[900px]:order-2 max-[900px]:border-r-0 max-[900px]:border-t max-[900px]:border-line max-[900px]:p-[clamp(28px,3vw,44px)]">
                <div className="relative aspect-[3/4] overflow-hidden border border-line bg-[repeating-linear-gradient(-45deg,#17150f_0_10px,#1a1812_10px_20px)]">
                  <span className="absolute top-[14px] left-[14px] flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-gold">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold animate-[blink_1.6s_ease-in-out_infinite]" />
                    CARRUSEL · EJEMPLO
                  </span>
                  <span className="absolute bottom-[14px] left-[14px] font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    / Flujo de contenido diario
                  </span>
                </div>
                <div>
                  <Eyebrow>Embudo Dual</Eyebrow>
                  <p className="mt-2.5 text-sm leading-[1.7] text-ivory-dim">
                    Dos flujos independientes, una sola conversión. Tu tiempo deja de ser el cuello de botella.
                  </p>
                </div>
              </div>

              {/* Content side */}
              <div className="p-[clamp(32px,4vw,56px)] max-[900px]:order-1">
                <span className="font-serif text-lg italic text-gold">II.</span>
                <h3 className="mt-[18px] mb-[22px] font-serif text-[clamp(26px,2.6vw,38px)] font-light leading-[1.08]">
                  Adquisición <em className="text-gold italic font-light">con Carruseles</em>
                </h3>
                <p className="text-sm leading-[1.7] text-ivory-dim">
                  Un negocio que vende no puede depender únicamente del tiempo para grabar del creador — eso no es escalable. Aquí la solución: un sistema que publique carruseles de forma diaria, que funcione como un segundo flujo de contenido totalmente independiente del tiempo del creador.
                </p>
                <ul className="mt-6 list-none">
                  {tickItems([
                    "Publicación diaria de carruseles",
                    "Flujo independiente del creador",
                    "Pensados para captar clientes de forma constante",
                  ])}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}
