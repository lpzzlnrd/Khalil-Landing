interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export function Eyebrow({ children, className = "", centered = false }: EyebrowProps) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-gold before:inline-block before:h-px before:w-[22px] before:bg-gold ${centered ? "justify-center" : ""} ${className}`}
    >
      {children}
    </span>
  );
}
