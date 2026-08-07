import { useState, useEffect, type CSSProperties } from "react";
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
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleCount = width < 640 ? 3 : width < 1024 ? 4 : 6;
  const extendedItems = [...partners, ...partners];

  useEffect(() => {
    if (partners.length === 0) return;
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setIndex((prev) => prev + 1);
    }, 3500); // Step every 3.5s
    return () => clearInterval(timer);
  }, [partners.length]);

  useEffect(() => {
    if (index >= partners.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setIndex(0);
      }, 500); // Match transition speed
      return () => clearTimeout(timeout);
    }
  }, [index, partners.length]);

  if (partners.length === 0) return null;

  if (compact) {
    const items = [...partners, ...partners];
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

  /* Home / footer runway — stepped sliding carousel like thingortwo.com */
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

      {/* Centered, boxed container so it does not stretch edge-to-edge */}
      <div className="relative w-full max-w-[1100px] mx-auto px-6 overflow-hidden">
        {/* Soft edge-fade gradients inside the box boundary */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-bg to-transparent" />

        <div
          className="flex items-center"
          style={{
            transform: `translateX(-${(index / extendedItems.length) * 100}%)`,
            transition: isTransitioning ? "transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)" : "none",
          }}
        >
          {extendedItems.map((partner, idx) => (
            <div
              key={`${partner.slug}-${idx}`}
              className="partner-logo-slot partner-logo-slot--home flex justify-center items-center flex-shrink-0"
              style={{
                width: `${100 / visibleCount}%`,
                "--logo-scale": partner.scale ?? 1,
              } as CSSProperties}
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
