"use client";

import { useState, useRef, useCallback } from "react";
import { Shell } from "@/components/ui/shell";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { faqItems } from "@/content/faq";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasAnswer = a.trim().length > 0;

  const toggle = useCallback(() => {
    if (!hasAnswer) return;
    setOpen((v) => !v);
  }, [hasAnswer]);

  return (
    <div className="border-b border-line">
      <button
        className="group flex w-full items-center justify-between py-7 pr-[50px] text-left font-serif text-[clamp(18px,1.6vw,22px)] font-light text-ivory transition-colors duration-300 hover:text-gold"
        onClick={toggle}
      >
        {q}
        <span className="relative h-[22px] w-[22px] flex-none">
          <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-gold" />
          <span
            className={`absolute left-1/2 top-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 bg-gold transition-transform duration-300 ${
              open && hasAnswer ? "rotate-90" : ""
            }`}
          />
        </span>
      </button>
      <div
        ref={contentRef}
        className={`overflow-hidden transition-[max-height] duration-400 ease-[cubic-bezier(.2,.7,.2,1)] ${
          open && hasAnswer ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="max-w-[62ch] pb-7 text-[15px] leading-[1.7] text-ivory-dim">{a}</div>
      </div>
    </div>
  );
}

export function Faq() {
  return (
    <section className="py-[clamp(80px,12vw,160px)]">
      <Shell>
        <div className="grid grid-cols-[1fr_1.4fr] items-start gap-[clamp(40px,6vw,80px)] max-[860px]:grid-cols-1">
          <Reveal>
            <Eyebrow>Preguntas Frecuentes</Eyebrow>
            <h2 className="mt-5 font-serif text-[clamp(38px,5vw,68px)] font-light leading-[1.05] tracking-[-0.02em]">
              Preguntas <em className="text-gold italic font-light">frecuentes</em>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border-t border-line">
              {faqItems.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </Reveal>
        </div>
      </Shell>
    </section>
  );
}
