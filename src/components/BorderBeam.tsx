import type { CSSProperties } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

type BorderBeamProps = {
  className?: string;
  size?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
};

export function BorderBeam({
  className = "",
  size = 220,
  duration = 8,
  colorFrom = "var(--theme-accent)",
  colorTo = "var(--theme-accent-secondary)",
}: BorderBeamProps) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <span
      aria-hidden
      className={`border-beam pointer-events-none absolute inset-0 z-0 rounded-[inherit] ${className}`.trim()}
      style={
        {
          "--beam-size": `${size}px`,
          "--beam-duration": `${duration}s`,
          "--beam-from": colorFrom,
          "--beam-to": colorTo,
        } as CSSProperties
      }
    />
  );
}
