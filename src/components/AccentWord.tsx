import type { AccentTone } from "../lib/accent";
import type { RefObject } from "react";

type AccentWordProps = {
  children: string;
  tone?: AccentTone;
  className?: string;
  innerRef?: RefObject<HTMLSpanElement | null>;
};

export function AccentWord({ children, tone = "red", className = "", innerRef }: AccentWordProps) {
  return (
    <span
      ref={innerRef}
      className={`accent-word ${tone === "gold" ? "accent-word-gold" : "accent-word-red"} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
