import type { ReactNode } from "react";
import { cn } from "../lib/cn";

type ProofFrameProps = {
  label: string;
  meta?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Proactiv-style product frame — chrome + soft glow.
 * Wraps Beam / proof widgets so the right column fills like a product panel.
 */
export function ProofFrame({ label, meta, children, className }: ProofFrameProps) {
  return (
    <div className={cn("proof-frame", className)}>
      <div className="proof-frame__glow" aria-hidden />
      <div className="proof-frame__chrome">
        <span className="proof-frame__dot" aria-hidden />
        <span className="proof-frame__label">{label}</span>
        {meta ? <span className="proof-frame__meta">{meta}</span> : null}
      </div>
      <div className="proof-frame__body">{children}</div>
    </div>
  );
}
