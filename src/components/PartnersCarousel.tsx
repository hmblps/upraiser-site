import { integrationPartners } from "../data/partners";
import { accentSectionLabel } from "../lib/accent";

export function PartnersCarousel() {
  const items = [...integrationPartners, ...integrationPartners];

  return (
    <section className="border-t border-border bg-bg-elevated py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className={`text-left ${accentSectionLabel("red")}`}>Trusted integrations & partners</p>
      </div>

      <div className="partners-strip relative mt-8 overflow-hidden py-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg-elevated to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg-elevated to-transparent sm:w-24" />

        <div className="partners-marquee flex w-max items-center px-8">
          {items.map((partner, index) => (
            <div
              key={`${partner.slug}-${index}`}
              className="partner-logo-slot"
              style={{ "--logo-scale": partner.scale ?? 1 } as React.CSSProperties}
              aria-hidden={index >= integrationPartners.length}
            >
              <img src={partner.logo} alt={partner.name} className="partner-logo" loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
