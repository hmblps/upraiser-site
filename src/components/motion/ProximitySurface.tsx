import { useRef, type ReactNode } from "react";
import { useProximityGlow } from "../../hooks/useProximityGlow";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type ProximitySurfaceProps = {
  children: ReactNode;
  className?: string;
};

export function ProximitySurface({ children, className = "" }: ProximitySurfaceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useProximityGlow(ref, !reduced);

  return (
    <div ref={ref} className={`proximity-surface card-lift ${className}`.trim()}>
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
