import { cn } from "../lib/cn";
import { useReducedMotion } from "../hooks/useReducedMotion";

export type BrandAuroraTone = "routes" | "contact" | "company" | "cases";

type BrandAuroraProps = {
  className?: string;
  tone?: BrandAuroraTone;
};

/**
 * Shared brand aurora veil (Aceternity pattern, gold/red only).
 * Tone sets loudness; navbar glass is toggled via useBrandAuroraNav.
 */
export function BrandAurora({ className = "", tone = "routes" }: BrandAuroraProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className={cn(
        "brand-aurora route-aurora pointer-events-none absolute inset-0 overflow-hidden",
        `brand-aurora--${tone}`,
        className,
      )}
      aria-hidden
      data-reduced={reduced ? "true" : "false"}
      data-tone={tone}
    >
      <div className="route-aurora__wash" />
      <div className="route-aurora__sheet" />
    </div>
  );
}
