import { useState, useEffect, type CSSProperties } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { partnersForSet, partnerSetForRoute } from "../data/partners";
import { clientBrands } from "../data/clients";

type PartnersCarouselProps = {
  /** Compact strip for viewport chrome */
  compact?: boolean;
};

/** Partners/Clients marquee — same component; maps to Clients on homepage runway, Partners in chrome. */
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

  const itemsList = compact ? partners : clientBrands;
  const visibleCount = width < 640 ? 3 : width < 1024 ? 4 : 6;
  const extendedItems = [...itemsList, ...itemsList];

  useEffect(() => {
    if (itemsList.length === 0) return;

    let timer: ReturnType<typeof setInterval>;
    let started = false;

    const startCarousel = () => {
      if (started) return;
      started = true;
      
      // If we are not in compact mode, we want the first slide to tick immediately on scale-ready
      if (!compact) {
        setIsTransitioning(true);
        setIndex((prev) => prev + 1);
      }
      
      timer = setInterval(() => {
        setIsTransitioning(true);
        setIndex((prev) => prev + 1);
      }, 3500); // Step every 3.5s
    };

    // If we're on the compact strip (like in Footer or somewhere else)
    // we don't necessarily have a hero to wait for.
    if (compact) {
      startCarousel();
    } else {
      if (typeof window !== "undefined" && (window as any).scaleReady) {
        startCarousel();
      } else {
        window.addEventListener("scale-ready", startCarousel);
        // Fallback in case event missed, but give Hero plenty of time to load (10s)
        const fallback = setTimeout(startCarousel, 10000);

        return () => {
          window.removeEventListener("scale-ready", startCarousel);
          clearTimeout(fallback);
          if (timer) clearInterval(timer);
        };
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [itemsList.length, compact]);

  useEffect(() => {
    if (index >= itemsList.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setIndex(0);
      }, 500); // Match transition speed
      return () => clearTimeout(timeout);
    }
  }, [index, itemsList.length]);

  if (itemsList.length === 0) return null;

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
      aria-label="Trusted clients"
    >
      <div className="text-center mb-6 mt-8">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-fg-muted/40">
          Our Clients
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
            width: `${(extendedItems.length / visibleCount) * 100}%`,
            transform: `translateX(-${(index / extendedItems.length) * 100}%)`,
            transition: isTransitioning ? "transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)" : "none",
          }}
        >
          {extendedItems.map((brand, idx) => (
            <div
              key={`${brand.slug}-${idx}`}
              className="partner-logo-slot partner-logo-slot--home flex justify-center items-center flex-shrink-0"
              style={{
                width: `${100 / extendedItems.length}%`,
                "--logo-scale": brand.scale ?? 1,
              } as CSSProperties}
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
                <span className="partner-logo-wordmark">
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
