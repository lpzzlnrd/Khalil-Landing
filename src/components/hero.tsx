"use client";

import { Play } from "lucide-react";
import { Shell } from "@/components/ui/shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface HeroProps {
  onOpenModal: () => void;
}

export function Hero({ onOpenModal }: HeroProps) {
  return (
    <section className="relative py-[clamp(60px,10vw,140px)] pb-[clamp(60px,8vw,100px)]">
      <Shell>
        <div className="grid grid-cols-[1.05fr_0.95fr] items-center gap-[clamp(40px,6vw,80px)] max-[900px]:grid-cols-1">
          <Reveal>
            <Eyebrow>VIDEO VSL</Eyebrow>
            <h1 className="mt-[26px] mb-7 font-serif text-[clamp(42px,6.2vw,88px)] font-light leading-[1.05] tracking-[-0.02em]">
              Instala un <em className="text-gold italic font-light">Sistema de Adquisición Paralelo</em> o “Embudo Dual” en tu Instagram: agenda más llamadas y vende más sin aumentar carga operativa a tu negocio.
            </h1>
            <p className="max-w-[62ch] text-[clamp(15px,1.2vw,18px)] leading-[1.6] text-ivory-dim">
              Un sistema diseñado para escalar a coaches, consultores e infoproductores que ya venden constantemente en Instagram y buscan aumentar el volumen sin aumentar su carga operativa.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button onClick={onOpenModal}>Aplicar</Button>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden border border-line-strong bg-gradient-to-b from-bg-3 to-[#0e0d0a]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,176,120,0.08)_0%,transparent_70%)]" />

              <span className="absolute top-[18px] left-[22px] flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-gold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d43c3c] animate-[blink_1.6s_ease-in-out_infinite]" />
                VIDEO VSL
              </span>

              <button
                aria-label="VIDEO VSL"
                title="VIDEO VSL"
                className="group relative z-[2] flex h-[88px] w-[88px] items-center justify-center rounded-full border border-gold bg-[rgba(10,9,7,0.4)] transition-all duration-300 hover:bg-gold"
              >
                <Play className="ml-1 h-6 w-6 fill-gold stroke-none group-hover:fill-[#0a0907]" />
                <span className="absolute inset-[-6px] rounded-full border border-gold opacity-30 animate-[pulse_2.4s_ease-in-out_infinite]" />
              </button>

            </div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}
