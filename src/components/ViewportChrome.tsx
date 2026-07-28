import { lazy, Suspense } from "react";
import { ScrollLink } from "./ScrollLink";

const PartnersCarousel = lazy(() =>
  import("./PartnersCarousel").then((m) => ({ default: m.PartnersCarousel })),
);

/**
 * Compact chrome for viewport pages — replaces full Footer.
 * Logo strip stays; marks swap by section via PartnersCarousel.
 */
export function ViewportChrome() {
  return (
    <div className="viewport-chrome shrink-0 border-t border-border/40">
      <Suspense fallback={null}>
        <PartnersCarousel compact />
      </Suspense>
      <div className="section-inner flex h-9 items-center justify-between gap-4 text-[0.6875rem] text-muted">
        <p className="truncate">
          <span className="font-semibold tracking-wide text-fg/80">UPRAISER</span>
          <span className="mx-2 opacity-40">·</span>
          London · since 2017
        </p>
        <nav className="flex shrink-0 items-center gap-4">
          <ScrollLink href="/privacy" className="transition hover:text-fg">
            Privacy
          </ScrollLink>
          <ScrollLink href="/terms" className="transition hover:text-fg">
            Terms
          </ScrollLink>
          <a
            href="mailto:info@upraiser.co.uk"
            className="hidden transition hover:text-fg sm:inline"
          >
            info@upraiser.co.uk
          </a>
        </nav>
      </div>
    </div>
  );
}
