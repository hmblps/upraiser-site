import { useState, useEffect, type CSSProperties } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { partnersForSet, partnerSetForRoute } from "../data/partners";
import { clientBrands } from "../data/clients";

import { SectionHeader } from "./SectionHeader";

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
  const [modalOpen, setModalOpen] = useState(false);


  useEffect(() => {
    if (!modalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

  const itemsList = compact ? partners : clientBrands;

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

  /* Home / footer runway — continuous pure CSS marquee */
  const marqueeItems = [...itemsList, ...itemsList];

  return (
    <>
      <section
        className="partners-strip partners-strip--home relative overflow-hidden bg-transparent py-4"
        aria-label="Trusted clients"
      >
        <div className="section-inner mb-6">
          <SectionHeader label="Trusted by" title="Our Clients" animated={false} />
        </div>

        <div className="section-inner">
          <div 
            className="relative w-full overflow-hidden cursor-pointer h-[100px] sm:h-[130px] flex items-center group"
            onClick={() => setModalOpen(true)}
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 sm:w-32 bg-gradient-to-r from-bg to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 sm:w-32 bg-gradient-to-l from-bg to-transparent" />

            <div className="partners-marquee flex w-max items-center h-full">
              {marqueeItems.map((brand, idx) => (
                <div
                  key={`${brand.slug}-${idx}`}
                  className="partner-logo-slot partner-logo-slot--home partner-logo-slot--interactive flex justify-center items-center flex-shrink-0 h-full px-12"
                  style={{
                    "--logo-scale": brand.scale ?? 1,
                  } as CSSProperties}
                >
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="partner-logo partner-logo-filter"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className="partner-logo-wordmark partner-logo-filter">
                      {brand.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          .partner-logo-filter {
            filter: grayscale(100%);
            opacity: 0.6;
            transition: filter 0.3s ease, opacity 0.3s ease;
          }
          @media (hover: hover) and (pointer: fine) {
            .partner-logo-slot--interactive:hover .partner-logo-filter {
              filter: grayscale(0%);
              opacity: 1;
            }
          }
        `}} />
      </section>

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
            <motion.div
              className="absolute inset-0 bg-bg/90 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              className="relative w-full max-w-5xl rounded-3xl bg-bg-card border border-border/50 shadow-2xl p-8 sm:p-12 overflow-y-auto max-h-[90vh]"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <button 
                onClick={() => setModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-fg-muted hover:text-fg transition-colors"
                aria-label="Close modal"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
              
              <h2 className="text-3xl font-bold mb-10 text-center tracking-tight">Our Clients</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12 items-center justify-items-center">
                {clientBrands.map((brand) => (
                  <div key={brand.slug} className="flex justify-center w-full" style={{ "--logo-scale": brand.scale ?? 1 } as CSSProperties}>
                    {brand.logo ? (
                      <img 
                        src={brand.logo} 
                        alt={brand.name} 
                        className="max-w-[120px] max-h-[48px] w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" 
                      />
                    ) : (
                      <span className="font-bold text-lg text-fg/80">{brand.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
