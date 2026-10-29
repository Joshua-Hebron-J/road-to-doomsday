import { ReactNode } from "react";

export type BadgeVariant = "emerald" | "gold" | "silver" | "incursion" | "subtle";
export type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
  emerald: {
    container:
      "border-emerald-500/30 bg-emerald-950/30 text-emerald-400 border",
    dot: "bg-emerald-400",
  },
  gold: {
    container:
      "border-amber-500/30 bg-amber-950/25 text-amber-300 border",
    dot: "bg-amber-400",
  },
  silver: {
    container:
      "border-white/10 bg-surface-2/70 text-slate-300 border",
    dot: "bg-slate-400",
  },
  incursion: {
    container:
      "border-red-500/30 bg-red-950/25 text-red-400 border",
    dot: "bg-red-500",
  },
  subtle: {
    container:
      "border-white/5 bg-surface-1/60 text-slate-400 border",
    dot: "bg-slate-500",
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px] tracking-wider",
  md: "px-2.5 py-1 text-[11px] tracking-[0.16em]",
  lg: "px-3.5 py-1.5 text-xs tracking-[0.2em]",
};

export function Badge({
  variant = "emerald",
  size = "md",
  children,
  dot = false,
  pulse = false,
  className = "",
}: BadgeProps) {
  const currentVariant = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono uppercase font-medium select-none ${currentVariant.container} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentVariant.dot}`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${currentVariant.dot}`}
          />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}
