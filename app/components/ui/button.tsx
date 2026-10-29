"use client";

import { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "gold" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  className?: string;
}

export type ButtonProps = BaseButtonProps &
  (
    | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
    | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
  );

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "text-white bg-gradient-to-r from-emerald-900/90 via-emerald-800/85 to-emerald-950/90 border border-emerald-500/50 hover:border-emerald-400 hover:shadow-[0_0_35px_rgba(16,185,129,0.35)] shadow-[0_0_20px_rgba(16,185,129,0.2)]",
  secondary:
    "text-slate-200 bg-surface-2/70 hover:bg-surface-2 hover:text-white border border-white/10 hover:border-slate-500 backdrop-blur-sm shadow-subtle",
  gold:
    "text-amber-300 bg-gradient-to-r from-amber-950/50 via-amber-900/40 to-amber-950/50 border border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(197,155,39,0.3)] shadow-[0_0_15px_rgba(197,155,39,0.15)]",
  ghost:
    "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent",
  outline:
    "text-slate-300 hover:text-emerald-400 border border-white/15 hover:border-emerald-500/40 hover:bg-emerald-950/20",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-[11px] tracking-[0.16em]",
  md: "px-6 py-2.5 text-xs tracking-[0.18em]",
  lg: "px-8 py-3.5 text-xs sm:text-sm tracking-[0.2em]",
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      children,
      icon,
      iconPosition = "right",
      fullWidth = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "group relative inline-flex items-center justify-center rounded-md font-semibold uppercase select-none transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.985]";

    const combinedClasses = [
      baseClasses,
      variantStyles[variant],
      sizeStyles[size],
      fullWidth ? "w-full" : "w-auto",
      className,
    ].filter(Boolean).join(" ");

    const content = (
      <>
        {icon && iconPosition === "left" && (
          <span className="mr-2.5 shrink-0 transition-transform group-hover:-translate-x-0.5">
            {icon}
          </span>
        )}
        <span>{children}</span>
        {icon && iconPosition === "right" && (
          <span className="ml-2.5 shrink-0 transition-transform group-hover:translate-x-1">
            {icon}
          </span>
        )}
      </>
    );

    if ("href" in props && typeof props.href === "string") {
      const { href, ...anchorProps } = props;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={combinedClasses}
          {...anchorProps}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={props.type || "button"}
        className={combinedClasses}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
