"use client";

import { Shell } from "@/components/ui/shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

const cases = [
  {
    from: "€100K",
    to: "€280K",
    quote:
      "Pasé de vivir dentro de Instagram respondiendo DMs, a ver cómo las agendas se llenaban solas mientras yo grababa contenido principal.",
    name: "Mariana D.",
    role: "COACH · MINDSET",
    initial: "M",
  },
  {
    from: "€140K",
    to: "€410K",
    quote:
      "El embudo dual nos rompió el techo. El equipo publica, VENOM filtra, y yo solo cierro. Todo sin cuellos de botella.",
    name: "Andrés V.",
    role: "CONSULTOR · B2B",
    initial: "A",
  },
  {
    from: "€95K",
    to: "€230K",
    quote:
      "Lo que más valoro no es la facturación — es que por primera vez siento que el negocio no depende de mi disponibilidad.",
    name: "Laura G.",
    role: "INFOPRODUCTORA",
    initial: "L",
  },
];

export function CaseStudies() {
  return (
    <section className="py-[clamp(80px,12vw,160px)]">
      <Shell>
        <div className="mb-[clamp(60px,8vw,100px)] grid grid-cols-[1fr_1.2fr] items-end gap-[60px] max-[780px]:grid-cols-1 max-[780px]:gap-6">
          <Reveal>
            <Eyebrow>04 / Resultados</Eyebrow>
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

        {/* Horizontal cards layout */}
        <div className="flex flex-col gap-px border border-line bg-line">
          {cases.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.08}>
              <div className="grid grid-cols-[minmax(200px,auto)_1fr_auto] items-center gap-[clamp(24px,4vw,56px)] bg-bg p-[clamp(32px,3.4vw,44px)] max-[880px]:grid-cols-1 max-[880px]:gap-6" style={{ minHeight: 180 }}>
                {/* Metric */}
                <div className="flex items-baseline gap-3.5 whitespace-nowrap max-[880px]:pb-5 max-[880px]:border-b max-[880px]:border-line">
                  <span className="font-serif text-2xl text-muted line-through decoration-muted-2">{c.from}</span>
                  <span className="font-mono text-sm text-gold">→</span>
                  <span className="font-serif text-[clamp(32px,3vw,44px)] italic text-gold">{c.to}</span>
                  <span className="font-mono text-[11px] tracking-[0.1em] text-muted">/mes</span>
                </div>

                {/* Quote */}
                <p className="font-serif text-[clamp(17px,1.4vw,20px)] italic leading-[1.5] text-ivory font-light">
                  <span className="mr-0.5 text-gold">&ldquo;</span>
                  {c.quote}
                  <span className="text-gold">&rdquo;</span>
                </p>

                {/* Person */}
                <div className="flex items-center gap-3.5 max-[880px]:pt-5 max-[880px]:border-t max-[880px]:border-line">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-line-strong bg-gradient-to-br from-[#2a2620] to-[#13120e] font-serif text-base text-gold">
                    {c.initial}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ivory">{c.name}</div>
                    <div className="font-mono text-xs tracking-[0.08em] text-muted">{c.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Shell>
    </section>
  );
}
