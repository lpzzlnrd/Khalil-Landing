"use client";

import { Play } from "lucide-react";
import { Shell } from "@/components/ui/shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { motion } from "framer-motion";

interface HeroProps {
  onOpenModal: () => void;
}

export function Hero({ onOpenModal }: HeroProps) {
  return (
    <section className="relative pt-[clamp(40px,8vw,80px)] pb-[clamp(60px,10vw,120px)] overflow-hidden">
      <Shell>
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <Eyebrow>SISTEMA CAROUSELS SELLING</Eyebrow>
            <h1 className="mt-8 mb-8 font-serif text-[clamp(40px,5.8vw,82px)] font-light leading-[1.1] tracking-[-0.03em] max-w-[15ch] mx-auto">
              Instala un <em className="text-gold italic font-light">Sistema de Adquisición</em> en tu Instagram.
            </h1>
            <p className="max-w-[58ch] mx-auto text-[clamp(16px,1.1vw,19px)] leading-[1.6] text-ivory-dim mb-12">
              Agenda más llamadas y escala tu facturación sin aumentar la carga operativa de tu negocio.
            </p>
          </Reveal>

          {/* Video VSL - Now below the text */}
          <Reveal delay={0.2}> {/*  Error en build de prod aqui */}
            <div className="relative mx-auto w-full max-w-[1000px] aspect-video flex items-center justify-center overflow-hidden border border-line-strong bg-[#0e0d0a] shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,176,120,0.12)_0%,transparent_70%)]" />

              <span className="absolute top-[20px] left-[24px] flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] text-gold uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d43c3c] animate-pulse" />
                Preview del sistema
              </span>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="group relative z-[2] flex h-[80px] w-[80px] items-center justify-center rounded-full border border-gold/40 bg-[rgba(10,9,7,0.6)] backdrop-blur-sm transition-all duration-300 hover:border-gold hover:bg-gold"
              >
                <Play className="ml-1 h-6 w-6 fill-gold stroke-none group-hover:fill-[#0a0907]" />
                <span className="absolute inset-[-10px] rounded-full border border-gold opacity-20 animate-ping" />
              </motion.button>
              
              {/* Noise overlay specific to video */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>
          </Reveal>

          {/* CTA at the end */}
          <Reveal delay={0.4}>
            <div className="mt-16">
              <Button onClick={onOpenModal} className="px-12 py-7 text-lg uppercase tracking-widest">
                Agendar ahora
              </Button>
            </div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}
