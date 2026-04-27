"use client";

import { Shell } from "@/components/ui/shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface FinalCtaProps {
  onOpenModal: () => void;
}

export function FinalCta({ onOpenModal }: FinalCtaProps) {
  return (
    <section className="relative overflow-hidden border-t border-line py-[clamp(100px,14vw,180px)] pb-[clamp(80px,10vw,140px)] text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(212,176,120,0.14)_0%,transparent_60%)]" />
      <Shell>
        <Reveal>
          <Eyebrow centered className="justify-center">
            Aplicar
          </Eyebrow>
          <h2 className="mx-auto mt-5 mb-7 max-w-[16ch] font-serif text-[clamp(42px,6.2vw,88px)] font-light leading-[1.05] tracking-[-0.02em]">
            ¿Cómo puedo <em className="text-gold italic font-light">comenzar?</em>
          </h2>
          <p className="mx-auto mb-11 max-w-[52ch] text-[clamp(15px,1.2vw,18px)] leading-[1.6] text-ivory-dim">
            Todos estuvieron en esta misma página y decidieron entrar.
          </p>
          <Button size="xl" onClick={onOpenModal}>
            Aplicar
          </Button>
        </Reveal>
      </Shell>
    </section>
  );
}
