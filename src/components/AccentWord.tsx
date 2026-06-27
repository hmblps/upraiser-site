import type { AccentTone } from "../lib/accent";

type AccentWordProps = {
  children: string;
  tone?: AccentTone;
  className?: string;
};

export function AccentWord({ children, tone = "red", className = "" }: AccentWordProps) {
  return (
    <span className={`accent-word ${tone === "gold" ? "accent-word-gold" : "accent-word-red"} ${className}`.trim()}>
      {children}
    </span>
  );
}
