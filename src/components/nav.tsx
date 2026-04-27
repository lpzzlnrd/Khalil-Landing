"use client";

import { Shell } from "@/components/ui/shell";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface NavProps {
  onOpenModal: () => void;
}

export function Nav({ onOpenModal }: NavProps) {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 border-b border-line bg-[rgba(10,9,7,0.72)] backdrop-blur-[14px]"
    >
      <Shell className="flex h-[72px] items-center justify-between">
        {/* Left: Program Name */}
        <div className="flex flex-col">
          <span className="font-serif text-[11px] tracking-[0.25em] text-gold-deep uppercase">
            Carousels Selling
          </span>
          <div className="h-[1px] w-8 bg-gold-deep/30 mt-1" />
        </div>

        {/* Right: Logo / Studio Name */}
        <div className="flex items-center gap-8">
          <Button 
            variant="ghost" 
            onClick={onOpenModal}
            className="hidden md:flex border-gold/20 text-gold/80 hover:bg-gold/5"
          >
            Agendar llamada
          </Button>
          <div className="text-right">
            <span className="font-serif text-sm tracking-[0.4em] text-ivory">
              KLEY
            </span>
            <small className="mt-0.5 block font-mono text-[8px] tracking-[0.2em] text-muted uppercase">
              Studio
            </small>
          </div>
        </div>
      </Shell>
    </motion.nav>
  );
}
