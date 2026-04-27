"use client";

import { Shell } from "@/components/ui/shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

interface TrustProps {
  onOpenModal: () => void;
}

export function Trust({ onOpenModal }: TrustProps) {
  return (
    <section className="border-t border-b border-line bg-bg-2 py-[clamp(80px,12vw,160px)]">
      <Shell>
        <div className="mb-[60px] grid grid-cols-[1fr_1.3fr] items-end gap-[60px] max-[780px]:grid-cols-1 max-[780px]:gap-6">
          <Reveal>
            <Eyebrow>¿Por qué confiar?</Eyebrow>
            <h2 className="mt-5 font-serif text-[clamp(38px,5vw,68px)] font-light leading-[1.05] tracking-[-0.02em]">
              ¿Por qué <em className="text-gold italic font-light">confiar?</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-[62ch] text-[clamp(15px,1.2vw,18px)] leading-[1.6] text-ivory-dim">
              Cientos de miles de euros extra en facturación en negocios y marcas personales grandes que comenzaron a utilizar nuestro sistema.
            </p>
            <div className="mt-7">
              <Button onClick={onOpenModal}>Aplicar</Button>
            </div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}
