"use client";

import { Shell } from "@/components/ui/shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

const roles = [
  { num: "i.", text: "Acceso directo a KleyPlan personalizado" },
  { num: "ii.", text: "Adaptación específica de los sistemas" },
  { num: "iii.", text: "Acceso directo al guionista y al diseñador particulares" },
  { num: "iv.", text: "Acceso directo al Manychat Manager" },
  { num: "v.", text: "Ajustes y seguimientos en tiempo real" },
];

const avatars = [
  { role: "Strategist", name: "KleyPlan", sub: "/ plan personalizado", angle: "45deg" },
  { role: "Guionista", name: "Scripts", sub: "/ diario", angle: "-45deg" },
  { role: "Diseñador", name: "Visual", sub: "/ carruseles", angle: "-45deg" },
  { role: "ManyChat Manager", name: "Venom", sub: "/ ops", angle: "45deg" },
];

export function Team() {
  return (
    <section className="py-[clamp(80px,12vw,160px)]">
      <Shell>
        <div className="mb-[clamp(60px,8vw,100px)] grid grid-cols-[1fr_1.2fr] items-end gap-[60px] max-[780px]:grid-cols-1 max-[780px]:gap-6">
          <Reveal>
            <Eyebrow>03 / Acompañamiento</Eyebrow>
            <h2 className="mt-5 font-serif text-[clamp(38px,5vw,68px)] font-light leading-[1.05] tracking-[-0.02em]">
              Equipo <em className="text-gold italic font-light">1:1</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-[62ch] text-[clamp(15px,1.2vw,18px)] leading-[1.6] text-ivory-dim">
              Acceso directo a grupo privado con el equipo de trabajo específico para tu negocio. Sin intermediarios, sin tickets, sin espera.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 items-start gap-[clamp(40px,6vw,80px)] max-[860px]:grid-cols-1">
          <Reveal>
            <ul className="list-none">
              {roles.map((r) => (
                <li key={r.num} className="grid grid-cols-[40px_1fr] items-center gap-[18px] border-b border-line py-[22px]">
                  <span className="font-serif text-[22px] italic text-gold">{r.num}</span>
                  <span className="font-serif text-xl text-ivory font-light">{r.text}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid grid-cols-2 gap-4">
              {avatars.map((a) => (
                <div
                  key={a.name}
                  className="flex aspect-[3/4] flex-col justify-between border border-line p-[18px]"
                  style={{
                    background: `repeating-linear-gradient(${a.angle}, #141210 0 8px, #17150f 8px 16px)`,
                  }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">{a.role}</span>
                  <div>
                    <div className="font-serif text-xl text-ivory">{a.name}</div>
                    <div className="mt-1 font-mono text-[10px] tracking-[0.1em] text-muted">{a.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}
