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
            <h1 className="mt-4 mb-8 font-serif text-[clamp(32px,4.5vw,64px)] font-light leading-[1.15] tracking-[-0.02em] max-w-[22ch] mx-auto uppercase">
              Instala un <em className="text-gold italic font-light">Sistema de Adquisición Paralelo</em> o{" "}
              <em className="text-gold italic font-light">&ldquo;Embudo Dual&rdquo;</em> en tu Instagram: agenda más llamadas y vende más{" "}
              <span className="underline decoration-gold underline-offset-4">sin aumentar carga operativa</span> a tu negocio.
            </h1>
            <p className="max-w-[62ch] mx-auto text-[clamp(15px,1.05vw,18px)] leading-[1.7] text-ivory-dim mb-12">
              Un sistema diseñado para escalar a coaches, consultores e infoproductores que ya venden constantemente en Instagram y buscan aumentar el volumen sin aumentar su carga operativa.
            </p>
          </Reveal>

          {/* Video VSL */}
          <Reveal delay={0.2}>
            <div className="relative mx-auto w-full max-w-[1000px] aspect-video flex items-center justify-center overflow-hidden border border-line-strong bg-[#0d1b30] shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.08)_0%,transparent_70%)]" />

              <span className="absolute top-[20px] left-[24px] flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] text-gold uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff3b3b] animate-pulse" />
                VIDEO VSL
              </span>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="group relative z-[2] flex h-[80px] w-[80px] items-center justify-center rounded-full border border-gold/40 bg-[rgba(10,22,40,0.6)] backdrop-blur-sm transition-all duration-300 hover:border-gold hover:bg-gold"
              >
                <Play className="ml-1 h-6 w-6 fill-gold stroke-none group-hover:fill-[#0a1628]" />
                <span className="absolute inset-[-10px] rounded-full border border-gold opacity-20 animate-ping" />
              </motion.button>

              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.svg')]" />
            </div>
          </Reveal>

          {/* CTA */}
          <Reveal delay={0.4}>
            <div className="mt-16">
              <Button onClick={onOpenModal} className="px-12 py-7 text-lg uppercase tracking-widest">
                Aplicar
              </Button>
            </div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}
