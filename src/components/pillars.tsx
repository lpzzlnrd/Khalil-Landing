"use client";

import { Shell } from "@/components/ui/shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface PillarsProps {
  onOpenModal: () => void;
}

const PillarCard = ({ 
  num, 
  title, 
  titleEm, 
  desc, 
  items, 
  imageLabel, 
  reverse = false 
}: { 
  num: string, 
  title: string, 
  titleEm: string, 
  desc: string, 
  items: string[], 
  imageLabel: string, 
  reverse?: boolean 
}) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 border-b border-line ${reverse ? 'md:flex-row-reverse' : ''}`}>
    <div className={`p-8 md:p-16 flex flex-col justify-center ${reverse ? 'md:order-2 md:border-l' : 'md:border-r'} border-line`}>
      <span className="font-serif text-lg italic text-gold">{num}</span>
      <h3 className="mt-4 mb-6 font-serif text-[clamp(28px,3vw,42px)] font-light leading-[1.1]">
        {title} <em className="text-gold italic font-light">{titleEm}</em>
      </h3>
      <p className="text-ivory-dim leading-relaxed mb-8 text-[15px]">
        {desc}
      </p>
      <ul className="space-y-4">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-ivory-dim/80">
            <span className="h-px w-4 bg-gold mt-2.5 flex-none" />
            {item}
          </li>
        ))}
      </ul>
    </div>
    <div className={`bg-bg-2 p-8 md:p-16 flex items-center justify-center ${reverse ? 'md:order-1' : ''}`}>
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="relative w-full aspect-[4/3] overflow-hidden border border-line-strong bg-[#0e0d0a] group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
        <span className="absolute top-4 left-4 font-mono text-[9px] tracking-[0.2em] text-gold uppercase opacity-50">
          {imageLabel}
        </span>
        
        {/* Placeholder for dynamic content/images */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 border border-gold/10 rounded-full animate-pulse" />
        </div>
        
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gold/5 pointer-events-none" />
      </motion.div>
    </div>
  </div>
);

export function Pillars({ onOpenModal }: PillarsProps) {
  return (
    <section className="py-20">
      <Shell>
        <Reveal>
          <div className="mb-16">
            <Eyebrow>LOS PILARES DEL SISTEMA</Eyebrow>
            <h2 className="mt-6 font-serif text-[clamp(32px,4vw,60px)] font-light leading-tight">
              Estructura <em className="text-gold italic font-light">Escalable</em>
            </h2>
          </div>
        </Reveal>

        <div className="border-t border-line">
          <Reveal>
            <PillarCard 
              num="I."
              title="Captación"
              titleEm="Automatizada"
              desc="Ante un aumento del volumen de entrada de leads, necesitas un sistema capaz afrontar dicho volumen y evitar cuellos de botella. Instalamos un flujo automático en tu cuenta que permite que los setters solamente traten con leads muy calificados."
              items={[
                "Sistema paralelo de captación por DM",
                "Flujo de leads pre-calificados",
                "Eliminación de cuellos de botella operativos"
              ]}
              imageLabel="Infraestructura DM"
            />
          </Reveal>

          <Reveal delay={0.1}>
            <PillarCard 
              num="II."
              title="Adquisición"
              titleEm="con Carruseles"
              reverse={true}
              desc="No dependas únicamente del tiempo del creador. Un sistema que publica carruseles diarios funciona como un segundo flujo de contenido independiente, diseñado para captar de forma constante sin tu intervención."
              items={[
                "Contenido diario 100% independiente",
                "Estrategia de carruseles de alta conversión",
                "Escalabilidad sin carga de grabación"
              ]}
              imageLabel="Visual Acquisition"
            />
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-20 flex justify-center">
            <Button onClick={onOpenModal} className="px-12 py-7 text-lg uppercase tracking-widest">
              Agendar llamada
            </Button>
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}
