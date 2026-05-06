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
    <section className="relative overflow-hidden border-t border-line py-[clamp(48px,7vw,90px)] text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(0,229,255,0.10)_0%,transparent_60%)]" />
      <Shell>
        <Reveal>
          <Eyebrow centered className="justify-center">
            Aplicar
          </Eyebrow>
          <h2 className="mx-auto mt-5 mb-7 max-w-[16ch] font-serif text-[clamp(42px,6.2vw,88px)] font-light leading-[1.05] tracking-[-0.02em]">
            ¿Cómo puedo <em className="text-gold italic font-light">comenzar?</em>
          </h2>
          <p className="mx-auto mb-11 max-w-[62ch] text-[clamp(15px,1.2vw,18px)] leading-[1.6] text-ivory-dim">
            Debido a la personalización del programa y la dedicación de todo nuestro equipo por cada uno de nuestros clientes, tenemos plazas limitadas cada mes para garantizar la calidad del servicio. 
            <br/><br/>
            Presionando el botón de abajo podrás agendar una llamada con nosotros, en la que primero analizaremos si te podemos ayudar, y en caso de ser así, podremos continuar. En el botón puedes ver cuántas plazas quedan en este momento ↓
          </p>
          <Button size="xl" onClick={onOpenModal}>
            Aplicar
          </Button>
        </Reveal>
      </Shell>
    </section>
  );
}
