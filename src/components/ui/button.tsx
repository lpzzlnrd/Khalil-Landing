import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  size?: "default" | "xl";
  arrow?: boolean;
  href?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "default",
  arrow = true,
  href,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2.5 font-sans font-medium uppercase tracking-[0.14em] rounded-[2px] transition-all duration-300 ease-[cubic-bezier(.2,.7,.2,1)] relative overflow-hidden group";

  const sizes = {
    default: "px-[26px] py-3.5 text-[13px]",
    xl: "px-12 py-[22px] text-sm",
  };

  const variants = {
    primary:
      "bg-gold text-[#0a1628] hover:bg-ivory hover:-translate-y-px",
    ghost:
      "bg-transparent text-ivory border border-line-strong hover:border-gold hover:text-gold",
  };

  const combinedClassName = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  const content = (
    <>
      {children}
      {arrow && variant === "primary" && (
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={combinedClassName}
      {...props}
    >
      {content}
    </button>
  );
}

