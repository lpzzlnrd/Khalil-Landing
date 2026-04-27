import { Shell } from "@/components/ui/shell";

export function Footer() {
  return (
    <footer className="border-t border-line py-[50px] pb-10 font-mono text-[11px] tracking-[0.1em] text-muted">
      <Shell className="flex flex-wrap items-center justify-between gap-6">
        <span className="font-serif text-xs tracking-[0.5em] text-ivory font-light">S T U D I O</span>
        <span>© 2026 KLEY STUDIO · CAROUSELS SELLING</span>
      </Shell>
    </footer>
  );
}
