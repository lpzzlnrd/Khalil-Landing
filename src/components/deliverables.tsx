"use client";

import { Shell } from "@/components/ui/shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface DeliverablesProps {
  onOpenModal: () => void;
}

const groups = [
  {
    title: "Estrategia",
    items: [
      "Creación del “Espejo de marca”",
      "Análisis profundo de KPIs",
      "Planeación de carruseles"
    ]
  },
  {
    title: "Ejecución",
    items: [
      "Guionizado de carruseles",
      "Diseño de alta conversión",
      "Carruseles nuevos cada día"
    ]
  },
  {
    title: "Gestión",
    items: [
      "CRM de métricas",
      "Calendario de publicación",
      "Carpetas de Drive ordenadas"
    ]
  }
];

export function Deliverables({ onOpenModal }: DeliverablesProps) {
  return (
    <section className="py-24 bg-[#0c0b09]">
      <Shell>
        <Reveal>
          <div className="text-center mb-20">
            <Eyebrow>SISTEMA DE ENTREGABLES</Eyebrow>
            <h2 className="mt-6 font-serif text-[clamp(32px,4vw,60px)] font-light leading-tight">
              ¿Qué obtienes <em className="text-gold italic font-light">al entrar?</em>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border-y border-line">
          {groups.map((group, idx) => (
            <motion.div 
              key={group.title}
              whileHover={{ backgroundColor: "rgba(212,176,120,0.03)" }}
              className="bg-bg p-12 transition-colors duration-500"
            >
              <Reveal delay={idx * 0.1}>
                <span className="font-mono text-[10px] tracking-[0.3em] text-gold uppercase">0{idx + 1}</span>
                <h3 className="mt-4 mb-8 font-serif text-2xl text-ivory">{group.title}</h3>
                <ul className="space-y-6">
                  {group.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-sm text-ivory-dim/70">
                      <div className="h-1 w-1 rounded-full bg-gold flex-none" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.4}>
          <div className="mt-20 flex justify-center">
            <Button onClick={onOpenModal} className="px-12 py-7 text-lg uppercase tracking-widest">
              Quiero mi sistema
            </Button>
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}
