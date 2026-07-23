import { lenovoPartnership } from "../data/liveContent";
import { LenovoPartnershipLogo } from "./LenovoPartnershipLogo";
import { cn } from "../lib/cn";

type LenovoProofStripProps = {
  className?: string;
  /** `band` = full section; `inline` = compact row inside another section */
  variant?: "band" | "inline";
};

/** Single Lenovo moat proof — Partners owns the story; elsewhere use inline. */
export function LenovoProofStrip({ className, variant = "band" }: LenovoProofStripProps) {
  const body = (
    <>
      <p className="section-label">{lenovoPartnership.badge}</p>
      <div className="mt-4 flex flex-wrap items-center gap-6">
        <LenovoPartnershipLogo className="h-9 w-auto sm:h-10" />
        <div className="min-w-0 max-w-xl">
          <p className="text-base font-bold tracking-tight text-fg">{lenovoPartnership.title}</p>
          <p className="copy mt-2 text-sm text-muted">{lenovoPartnership.stripLine}</p>
        </div>
      </div>
    </>
  );

  if (variant === "inline") {
    return <div className={cn("lenovo-proof-strip", className)}>{body}</div>;
  }

  return (
    <section className={cn("section-band section-band--strip border-y border-border/40", className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">{body}</div>
    </section>
  );
}
