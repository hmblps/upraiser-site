import type { ReactNode } from "react";
import { useMagneticElement } from "../../hooks/useMagneticElement";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function Magnetic({ children, className = "", strength = 0.32 }: MagneticProps) {
  const ref = useMagneticElement<HTMLDivElement>(strength);
  const reduced = useReducedMotion();
  const block = /\bw-full\b/.test(className);

  return (
    <div
      ref={ref}
      className={`magnetic-wrap ${block ? "block" : "inline-block"}${reduced ? "" : " transition-transform duration-200 ease-out"}${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}
