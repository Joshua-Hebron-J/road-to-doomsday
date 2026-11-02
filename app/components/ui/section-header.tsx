import { ReactNode } from "react";
import { Badge, BadgeVariant } from "./badge";

interface SectionHeaderProps {
  category?: string;
  categoryVariant?: BadgeVariant;
  title: string;
  description?: string | ReactNode;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({
  category,
  categoryVariant = "emerald",
  title,
  description,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const isCentered = align === "center";

  return (
    <div
      className={`max-w-3xl ${
        isCentered ? "mx-auto text-center" : "text-left"
      } mb-16 sm:mb-20 ${className}`}
    >
      {category && (
        <div className={`mb-3.5 ${isCentered ? "flex justify-center" : "flex justify-start"}`}>
          <Badge variant={categoryVariant} size="sm">
            {category}
          </Badge>
        </div>
      )}
      <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-[0.16em] text-slate-100">
        {title}
      </h2>
      {description && (
        <div className="mt-4 text-sm sm:text-base text-slate-400 font-light leading-relaxed">
          {description}
        </div>
      )}
    </div>
  );
}
