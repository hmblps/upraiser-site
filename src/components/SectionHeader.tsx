import type { ReactNode } from "react";
import { useTheme } from "../context/ThemeContext";
import { accentSectionLabel } from "../lib/accent";
import { Reveal } from "./motion/Reveal";
import type { SiteMode } from "../data/liveContent";

type SectionHeaderProps = {
  label: string;
  title?: string;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  delay?: number;
  labelAccent?: "gold" | "red";
  animated?: boolean;
};

function modeFromTheme(theme: "light" | "dark"): SiteMode {
  return theme === "light" ? "growth" : "infrastructure";
}

export function useMode() {
  const { theme } = useTheme();
  return { mode: modeFromTheme(theme) };
}

export function SectionHeader({
  label,
  title,
  description,
  align = "left",
  className = "",
  delay = 0,
  labelAccent: _labelAccent = "red",
  animated = true,
}: SectionHeaderProps) {
  const content = (
    <>
      <p className={accentSectionLabel()}>{label}</p>
      {title ? <h2 className="section-title">{title}</h2> : null}
      {description ? <p className="section-description">{description}</p> : null}
    </>
  );
  const classes = `section-header max-w-2xl ${align === "center" ? "mx-auto text-center" : "text-left"} ${className}`;

  return animated ? (
    <Reveal delay={delay} className={classes}>
      {content}
    </Reveal>
  ) : (
    <div className={classes}>{content}</div>
  );
}

type SectionHeaderRowProps = {
  children: ReactNode;
  className?: string;
};

export function SectionHeaderRow({ children, className = "" }: SectionHeaderRowProps) {
  return <div className={`flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between ${className}`}>{children}</div>;
}
