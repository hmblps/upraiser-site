import type { ReactNode } from "react";
import { accentSectionLabel } from "../lib/accent";
import { Reveal } from "./motion/Reveal";

type SectionHeaderProps = {
  label: string;
  title?: string;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  delay?: number;
  labelAccent?: "gold" | "red";
};

export function SectionHeader({
  label,
  title,
  description,
  align = "left",
  className = "",
  delay = 0,
  labelAccent = "red",
}: SectionHeaderProps) {
  return (
    <Reveal
      delay={delay}
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : "text-left"} ${className}`}
    >
      <p className={accentSectionLabel(labelAccent)}>{label}</p>
      {title ? <h2 className="section-title">{title}</h2> : null}
      {description ? <p className="section-description">{description}</p> : null}
    </Reveal>
  );
}

type SectionHeaderRowProps = {
  children: ReactNode;
  className?: string;
};

export function SectionHeaderRow({ children, className = "" }: SectionHeaderRowProps) {
  return (
    <div className={`flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between ${className}`}>
      {children}
    </div>
  );
}
