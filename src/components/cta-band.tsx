"use client";

import { Shell } from "@/components/ui/shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface CtaBandProps {
  onOpenModal: () => void;
}

export function CtaBand({ onOpenModal }: CtaBandProps) {
  return (
    <section className="border-t border-b border-line bg-bg-2 py-[clamp(80px,10vw,130px)] text-center">
      <Shell>
        <Reveal>
          <Eyebrow centered className="justify-center">
            Aplicar
          </Eyebrow>
          <h2 className="mx-auto mt-6 max-w-[18ch] font-serif text-[clamp(38px,5vw,68px)] font-light leading-[1.05] tracking-[-0.02em]">
            ¿Cómo puedo <em className="text-gold italic font-light">comenzar?</em>
          </h2>
          <div className="mt-3.5">
            <Button size="xl" onClick={onOpenModal}>
              Aplicar
            </Button>
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}
