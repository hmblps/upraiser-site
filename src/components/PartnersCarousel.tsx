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

  /* Home / footer runway — medium density (between chrome and old py-12 block) */
  return (
    <section
      className="partners-strip partners-strip--home relative overflow-hidden border-t border-border bg-bg-elevated"
      aria-label="Trusted integrations and partners"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-bg-elevated to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-bg-elevated to-transparent sm:w-20" />

      <div className="partners-marquee flex w-max items-center px-6">
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
    </section>
  );
}
