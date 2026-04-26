interface ShellProps {
  children: React.ReactNode;
  className?: string;
}

export function Shell({ children, className = "" }: ShellProps) {
  return (
    <div className={`mx-auto w-full max-w-[1240px] px-7 max-sm:px-5 ${className}`}>
      {children}
    </div>
  );
}
