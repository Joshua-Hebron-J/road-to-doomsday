import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  interactive?: boolean;
  accent?: "emerald" | "gold" | "silver" | "none";
  className?: string;
}

export function Card({
  children,
  interactive = false,
  accent = "none",
  className = "",
}: CardProps) {
  const accentBorder = {
    emerald: "before:bg-gradient-to-r before:from-transparent before:via-emerald-500/60 before:to-transparent",
    gold: "before:bg-gradient-to-r before:from-transparent before:via-amber-400/50 before:to-transparent",
    silver: "before:bg-gradient-to-r before:from-transparent before:via-slate-400/40 before:to-transparent",
    none: "",
  }[accent];

  return (
    <div
      className={`relative rounded-lg bg-surface-2/40 border border-white/5 p-6 sm:p-8 backdrop-blur-sm ${
        interactive
          ? "hover:border-emerald-500/35 hover:shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(16,185,129,0.12)] transition-all duration-300"
          : ""
      } ${
        accent !== "none"
          ? `before:absolute before:top-0 before:left-8 before:right-8 before:h-[1px] ${accentBorder}`
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mb-6 space-y-2 ${className}`}>{children}</div>;
}

export function CardTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`text-lg sm:text-xl font-bold uppercase tracking-wider text-slate-100 ${className}`}
    >
      {children}
    </h3>
  );
}

export function CardSubtitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`block text-xs font-mono tracking-wider text-emerald-400/90 uppercase ${className}`}
    >
      {children}
    </span>
  );
}

export function CardDescription({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-sm text-slate-400 font-light leading-relaxed ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-500 ${className}`}
    >
      {children}
    </div>
  );
}
