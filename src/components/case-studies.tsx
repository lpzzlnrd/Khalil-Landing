"use client";

import { Shell } from "@/components/ui/shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

export function CaseStudies() {
  return (
    <section className="py-[clamp(80px,12vw,160px)]">
      <Shell>
        <div className="mb-[clamp(60px,8vw,100px)] grid grid-cols-[1fr_1.2fr] items-end gap-[60px] max-[780px]:grid-cols-1 max-[780px]:gap-6">
          <Reveal>
            <Eyebrow>Casos de éxito</Eyebrow>
            <h2 className="mt-5 font-serif text-[clamp(38px,5vw,68px)] font-light leading-[1.05] tracking-[-0.02em]">
              Casos <em className="text-gold italic font-light">de éxito</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-[62ch] text-[clamp(15px,1.2vw,18px)] leading-[1.6] text-ivory-dim">
              Cientos de victorias y varios casos de éxito. Todos estuvieron en esta misma página y decidieron entrar.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div className="border border-line p-[clamp(28px,3.4vw,42px)]">
            <p className="font-serif text-[clamp(18px,1.8vw,26px)] leading-[1.5] text-ivory font-light">
              Entre ellos se encuentran personas que ya tenían un negocio formado en Instagram, pero se encontraban atascados en los 100K/mes, y gracias al sistema pudieron escalar su facturación sin aumentar su carga operativa (Volumen de trabajo y cantidad de tiempo dedicado).
            </p>
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}
