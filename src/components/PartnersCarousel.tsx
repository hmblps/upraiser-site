import type { CSSProperties } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { partnersForSet, partnerSetForRoute } from "../data/partners";

type PartnersCarouselProps = {
  /** Compact strip for viewport chrome */
  compact?: boolean;
};

/** Partners marquee — same strip; logos swap by route/section. */
export function PartnersCarousel({ compact = false }: PartnersCarouselProps) {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const setId = partnerSetForRoute(pathname, params.get("pillar"));
  const partners = partnersForSet(setId);
  const items = partners.length > 0 ? [...partners, ...partners] : [];

  if (items.length === 0) return null;

  if (compact) {
    return (
      <div className="partners-strip partners-strip--chrome relative overflow-hidden" aria-label="Integrations">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-bg to-transparent" />
        <div className="partners-marquee flex w-max items-center px-4">
          {items.map((partner, index) => (
            <div
              key={`${partner.slug}-${index}`}
              className="partner-logo-slot partner-logo-slot--chrome"
              style={{ "--logo-scale": partner.scale ?? 1 } as CSSProperties}
              aria-hidden={index >= partners.length}
            >
              <img src={partner.logo} alt="" className="partner-logo" loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* Home / footer runway — transparent, border-less, and spacious look like thingortwo.com */
  return (
    <section
      className="partners-strip partners-strip--home relative overflow-hidden bg-transparent"
      aria-label="Trusted integrations and partners"
    >
      <div className="text-center mb-6 mt-8">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-fg-muted/40">
          Our Partners
        </span>
      </div>

      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent sm:w-28" />

        <div className="partners-marquee flex w-max items-center">
          {items.map((partner, index) => (
            <div
              key={`${partner.slug}-${index}`}
              className="partner-logo-slot partner-logo-slot--home"
              style={{ "--logo-scale": partner.scale ?? 1 } as CSSProperties}
              aria-hidden={index >= partners.length}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="partner-logo"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
