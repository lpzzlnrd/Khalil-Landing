"use client";

import { Shell } from "@/components/ui/shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CaseStudiesProps {
  onOpenModal: () => void;
}

export function CaseStudies({ onOpenModal }: CaseStudiesProps) {
  return (
    <section className="py-[clamp(40px,6vw,80px)]">
      <Shell>
        {/* CASOS DE ÉXITO */}
        <Reveal>
          <div className="text-center mb-12">
            <Eyebrow centered className="justify-center">Casos de éxito</Eyebrow>
          </div>
        </Reveal>

        <Reveal>
          <p className="text-center font-serif text-[clamp(22px,2.5vw,36px)] font-light leading-[1.4] text-ivory mb-12 max-w-[48ch] mx-auto">
            Cientos de victorias y varios casos de éxito. <strong className="text-gold font-medium">Todos estuvieron en esta misma página y decidieron entrar.</strong>
          </p>
        </Reveal>

        <Reveal>
          <motion.div
            whileHover={{
              boxShadow: "0 0 40px rgba(0,229,255,0.08), inset 0 0 40px rgba(0,229,255,0.04)",
            }}
            className="border border-line p-[clamp(28px,3.4vw,42px)] transition-all duration-500"
          >
            <p className="font-serif text-[clamp(16px,1.5vw,22px)] leading-[1.6] text-ivory font-light">
              Entre ellos se encuentran personas que ya tenían un negocio formado en Instagram,{" "}
              <strong className="text-gold font-medium">pero se encontraban estancados en los 100K/mes</strong>, y gracias al sistema pudieron escalar su facturación sin aumentar su carga operativa{" "}
              <span className="text-muted/60">(Volumen de trabajo y cantidad de tiempo dedicado)</span>.
            </p>
          </motion.div>
        </Reveal>

        {/* POR QUÉ CONFIAR */}
        <Reveal delay={0.1}>
          <div className="mt-16 text-center">
            <Eyebrow centered className="justify-center">¿Por qué confiar?</Eyebrow>
            <p className="mt-6 mx-auto max-w-[52ch] text-[clamp(15px,1.2vw,18px)] leading-[1.6] text-ivory-dim">
              Cientos de miles de euros extra en facturación en negocios y marcas personales grandes que comenzaron a utilizar nuestro sistema.
            </p>
            <div className="mt-8">
              <Button onClick={onOpenModal}>Aplicar</Button>
            </div>
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}
