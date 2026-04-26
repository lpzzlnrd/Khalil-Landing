"use client";

import { Shell } from "@/components/ui/shell";
import { Button } from "@/components/ui/button";

interface NavProps {
  onOpenModal: () => void;
}

export function Nav({ onOpenModal }: NavProps) {
  return (
    <nav className="sticky top-0 z-40 border-b border-line bg-[rgba(10,9,7,0.72)] backdrop-blur-[14px]">
      <Shell className="flex h-[72px] items-center justify-between">
        <div>
          <span className="font-serif text-sm tracking-[0.5em] text-ivory" style={{ paddingLeft: "0.5em" }}>
            S T U D I O
          </span>
          <small className="mt-0.5 block font-mono text-[9px] tracking-[0.28em] text-muted" style={{ paddingLeft: "0.1em" }}>
            KLEY / CAROUSELS
          </small>
        </div>
        <Button onClick={onOpenModal}>Aplicar</Button>
      </Shell>
    </nav>
  );
}
