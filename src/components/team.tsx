"use client";

import { Shell } from "@/components/ui/shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";

const roles = [
  { num: "i.", text: "Acceso directo a Kley" },
  { num: "ii.", text: "Plan personalizado" },
  { num: "iii.", text: "Adaptación especifica de los sistemas" },
  { num: "iv.", text: "Acceso directo al guionista y al diseñador particulares" },
  { num: "v.", text: "Acceso directo al Manychat Manager" },
  { num: "vi.", text: "Ajustes y seguimientos en tiempo real" },
];

export function Team() {
  return (
    <section className="py-[clamp(40px,6vw,80px)]">
      <Shell>
        <div className="mb-[clamp(60px,8vw,100px)] grid grid-cols-[1fr_1.2fr] items-end gap-[60px] max-[780px]:grid-cols-1 max-[780px]:gap-6">
          <Reveal>
            <Eyebrow>Equipo 1:1</Eyebrow>
            <h2 className="mt-5 font-serif text-[clamp(38px,5vw,68px)] font-light leading-[1.05] tracking-[-0.02em]">
              Equipo <em className="text-gold italic font-light">1:1</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-[62ch] text-[clamp(15px,1.2vw,18px)] leading-[1.6] text-ivory-dim">
              Acceso directo a grupo privado con el equipo de trabajo especifico para tu negocio.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 items-start gap-[clamp(40px,6vw,80px)]">
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
        </div>
      </Shell>
    </section>
  );
}
