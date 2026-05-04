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
    title: "Sistema de Contenido",
    items: [
      "Creación del \"Espejo de marca\"",
      "Análisis profundo de contenido y KPIs",
      "Planeación de carruseles y formatos",
      "Guionizado de carruseles",
      "Creación y diseño de carruseles",
      "Carruseles nuevos cada día",
      "CRM de métricas y KPIs de contenido",
      "Calendario de publicación",
      "Carpetas de Drive con los carruseles ordenados por semanas",
      "Documento de guionizado",
    ],
  },
  {
    title: "Sistema \"VENOM\"",
    items: [
      "Captación de leads 24/7",
      "Inteligencia Artificial Integrada",
      "100% humanizado, 0 robótico",
      "Memoria Inteligente Específica",
      "Seguimientos Específicos",
      "2 fases de segmentación",
      "Nutrición de leads",
      "Pre-Agenda de leads",
      "Aumento de follows",
      "Manejo de alto volumen de leads",
      "Filtro y calificación de leads",
    ],
  },
  {
    title: "Equipo 1:1",
    items: [
      "Acceso directo a grupo privado con el equipo de trabajo específico para tu negocio",
      "Acceso directo a Kley",
      "Plan personalizado",
      "Adaptación específica de los sistemas",
      "Acceso directo al guionista y al diseñador particulares",
      "Acceso directo al Manychat Manager",
      "Ajustes y seguimientos en tiempo real",
    ],
  },
];

export function Deliverables({ onOpenModal }: DeliverablesProps) {
  return (
    <section className="py-24 bg-[#081422]">
      <Shell>
        <Reveal>
          <div className="text-center mb-20">
            <Eyebrow>SISTEMA DE ENTREGABLES</Eyebrow>
            <h2 className="mt-6 font-serif text-[clamp(32px,4vw,60px)] font-light leading-tight">
              ¿Qué obtienes <em className="text-gold italic font-light">al entrar?</em>
            </h2>
            <p className="mt-4 mx-auto max-w-[58ch] text-[clamp(14px,1vw,16px)] leading-[1.6] text-ivory-dim">
              Estos son todos los entregables que obtienes una vez entras a Carousels Selling durante los meses activos
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border-y border-line">
          {groups.map((group, idx) => (
            <motion.div
              key={group.title}
              whileHover={{
                backgroundColor: "rgba(0,229,255,0.03)",
                boxShadow: "inset 0 0 40px rgba(0,229,255,0.06)",
              }}
              className="bg-bg p-10 transition-all duration-500"
            >
              <Reveal delay={idx * 0.1}>
                <span className="font-mono text-[10px] tracking-[0.3em] text-gold uppercase">
                  0{idx + 1}
                </span>
                <h3 className="mt-4 mb-8 font-serif text-2xl text-ivory">
                  {group.title}
                </h3>
                <div className="space-y-3">
                  {group.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3.5"
                    >
                      <span className="flex h-6 w-6 flex-none items-center justify-center border border-gold font-mono text-[10px] text-gold mt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm tracking-[0.01em] text-ivory-dim/80 leading-[1.5]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.4}>
          <div className="mt-16 flex justify-center">
            <Button onClick={onOpenModal} className="px-12 py-7 text-lg uppercase tracking-widest">
              Aplicar
            </Button>
          </div>
        </Reveal>
      </Shell>
    </section>
  );
}
