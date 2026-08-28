import { createPortal } from "react-dom";
import { useState, useEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { partnersForSet, partnerSetForRoute } from "../data/partners";
import { clientBrands } from "../data/clients";

import { SectionHeader } from "./SectionHeader";
import { GlobalModalTrigger } from "./GlobalModalTrigger";
import { AutoScaledLogo } from "./AutoScaledLogo";
import { useMarqueePointerDrag } from "../hooks/useMarqueePointerDrag";

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
  const marqueeRef = useRef<HTMLDivElement>(null);
  useMarqueePointerDrag(marqueeRef);

  if (itemsList.length === 0) return null;

  if (compact) {
    const items = [...partners, ...partners];
    return (
      <div className="partners-strip partners-strip--chrome partners-marquee-viewport relative overflow-hidden" aria-label="Integrations">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-bg to-transparent" />
        <div ref={marqueeRef} className="partners-marquee flex w-max items-center px-4">
          {items.map((partner, index) => (
            <button
              key={`${partner.slug}-${index}`}
              type="button"
              className="partner-logo-slot partner-logo-slot--chrome cursor-grab focus:outline-none"
              aria-hidden={index >= partners.length}
            >
              <AutoScaledLogo src={partner.logo!} alt="" baseScale={partner.scale} className="partner-logo" scaleMethod="css-var" />
            </button>
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
          <div className="partners-marquee-viewport relative w-full overflow-hidden h-[100px] sm:h-[130px] flex items-center">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 sm:w-32 bg-gradient-to-r from-bg to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 sm:w-32 bg-gradient-to-l from-bg to-transparent" />

            <div ref={marqueeRef} className="partners-marquee flex w-max items-center h-full">
              {marqueeItems.map((brand, idx) => (
                <button
                  type="button"
                  key={`${brand.slug}-${idx}`}
                  onClick={() => setModalOpen(true)}
                  className="partner-logo-slot partner-logo-slot--home flex justify-center items-center flex-shrink-0 h-full px-12 cursor-grab outline-none focus:outline-none"
                  data-brand={brand.slug}
                  {...(brand.ink ? { "data-logo-ink": brand.ink } : {})}
                >
                  {brand.logo ? (
                    <AutoScaledLogo
                      src={brand.logo}
                      alt={brand.name}
                      baseScale={brand.scale}
                      ink={brand.ink}
                      className="partner-logo pointer-events-none"
                      scaleMethod="css-var"
                    />
                  ) : (
                    <span className="partner-logo-wordmark pointer-events-none">
                      {brand.name}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modal — rendered outside the section via portal so z-index stacking never clips it */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              key="clients-modal-overlay"
              className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Dim backdrop — click to close */}
              <div
                className="absolute inset-0 bg-transparent"
                onClick={() => setModalOpen(false)}
              />

              {/* Trigger global background video/stars */}
              <GlobalModalTrigger />

              {/* Modal card */}
              <motion.div
                className="case-detail-modal__panel !w-full !max-w-5xl p-8 sm:p-12 overflow-y-auto mx-4"
                
                initial={{ opacity: 0, scale: 0.97, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 24 }}
                transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="absolute top-6 right-6 p-2 text-fg-muted hover:text-fg transition-colors outline-none focus:outline-none"
                  aria-label="Close"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>

                <h2 className="text-3xl font-bold mb-10 text-center tracking-tight">Our Clients</h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-12 items-center justify-items-center">
                  {clientBrands.map((brand) => (
                    <div
                      key={brand.slug}
                      className="clients-modal-item flex justify-center w-full"
                      data-brand={brand.slug}
                    >
                      {brand.logo ? (
                        <AutoScaledLogo
                          src={brand.logo}
                          alt={brand.name}
                          baseScale={brand.scale}
                          ink={brand.ink}
                          className="clients-modal-logo max-w-[120px] max-h-[48px] w-auto object-contain"
                        />
                      ) : (
                        <span className="font-bold text-lg text-fg">{brand.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
