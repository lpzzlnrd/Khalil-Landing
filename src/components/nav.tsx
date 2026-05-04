"use client";

import { Shell } from "@/components/ui/shell";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

interface NavProps {
  onOpenModal: () => void;
}

export function Nav({ onOpenModal }: NavProps) {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 border-b border-line bg-[rgba(10,22,40,0.72)] backdrop-blur-[14px]"
    >
      <Shell className="flex h-[72px] items-center justify-between">
        {/* Left: Program Name in Montserrat Bold */}
        <span className="font-[var(--font-montserrat)] text-[15px] font-bold tracking-[0.04em] text-ivory uppercase">
          Carousels Selling
        </span>

        {/* Right: CTA + Logo */}
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            onClick={onOpenModal}
            className="hidden md:flex border-gold/20 text-gold/80 hover:bg-gold/5"
          >
            Aplicar
          </Button>
          <Image
            src="/KS.png"
            alt="KLEY Studio"
            width={80}
            height={40}
            className="h-8 w-auto"
          />
        </div>
      </Shell>
    </motion.nav>
  );
}
