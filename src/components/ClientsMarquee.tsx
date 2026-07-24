import type { CSSProperties } from "react";
import { clientBrands } from "../data/clients";

/** Quiet brand reel under hero — no label chrome. */
export function ClientsMarquee() {
  const items = [...clientBrands, ...clientBrands];

  return (
    <section className="clients-marquee-band bg-bg" aria-label="Partners and brands">
      <div className="partners-strip relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent sm:w-24" />

        <div className="partners-marquee flex w-max items-center px-8">
          {items.map((brand, index) => (
            <div
              key={`${brand.slug}-${index}`}
              className="partner-logo-slot"
              style={{ "--logo-scale": brand.scale ?? 1 } as CSSProperties}
              aria-hidden={index >= clientBrands.length}
            >
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="partner-logo"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="partner-logo-wordmark">{brand.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
