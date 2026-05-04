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
  videoSrc,
  reverse = false
}: {
  num: string,
  title: string,
  titleEm: string,
  desc: string,
  items: string[],
  imageLabel: string,
  videoSrc?: string,
  reverse?: boolean
}) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 border-b border-line`}>
    {/* Video — always first on mobile (order-1), position varies on desktop */}
    <div className={`bg-bg-2 p-8 md:p-16 flex items-center justify-center order-1 ${reverse ? 'md:order-1' : 'md:order-2'}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative w-full aspect-[4/3] overflow-hidden border border-line-strong bg-[#0d1b30] group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
        <span className="absolute top-4 left-4 z-10 font-mono text-[9px] tracking-[0.2em] text-gold uppercase opacity-50">
          {imageLabel}
        </span>

        <div className="absolute inset-0 flex items-center justify-center">
          {videoSrc ? (
            <video
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            />
          ) : (
            <div className="w-24 h-24 border border-gold/10 rounded-full animate-pulse" />
          )}
        </div>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gold/5 pointer-events-none" />
      </motion.div>
    </div>

    {/* Text — always second on mobile (order-2), position varies on desktop */}
    <div className={`p-8 md:p-16 flex flex-col justify-center order-2 ${reverse ? 'md:order-2 md:border-l' : 'md:order-1 md:border-r'} border-line`}>
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
  </div>
);

export function Pillars({ onOpenModal }: PillarsProps) {
  return (
    <section className="py-20">
      <Shell>
        <div className="border-t border-line">
          {/* Adquisición FIRST */}
          <Reveal>
            <PillarCard
              num="I."
              title="Adquisición"
              titleEm="con Carruseles"
              desc="Un negocio que vende no puede depender únicamente del tiempo para grabar del creador, eso no es escalable en el tiempo, aquí la solución: Un sistema que publique carruseles de forma diaria, que funcione como un segundo flujo de contenido totalmente independiente del tiempo del creador. Pensados para captar clientes de forma constante."
              items={[
                "Contenido diario 100% independiente",
                "Estrategia de carruseles de alta conversión",
                "Escalabilidad sin carga de grabación"
              ]}
              imageLabel="Visual Acquisition"
              videoSrc="/adquisicion-carruseles.mp4"
            />
          </Reveal>

          {/* Captación SECOND */}
          <Reveal delay={0.1}>
            <PillarCard
              num="II."
              title="Captación"
              titleEm="Automatizada"
              reverse={true}
              desc="Ante un aumento del volumen de entrada de leads, necesitas un sistema capaz afrontar dicho volumen y evitar cuellos de botella futuros. Aquí instalamos un sistema automático en tu cuenta que se encarga del flujo de leads, que permite que los setters solamente traten con leads muy calificados y no perder tiempo con curiosos."
              items={[
                "Sistema paralelo de captación por DM",
                "Flujo de leads pre-calificados",
                "Eliminación de cuellos de botella operativos"
              ]}
              imageLabel="Infraestructura DM"
              videoSrc="/captacion-automatizada-v2.mp4"
            />
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-20 flex justify-center">
            <Button onClick={onOpenModal} className="px-12 py-7 text-lg uppercase tracking-widest">
              Aplicar
            </Button>
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}
