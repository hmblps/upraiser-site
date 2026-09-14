import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useScroll as useFramerScroll } from "framer-motion";
import type { SiteMode } from "../../data/liveContent";
import { SectionHeader } from "../SectionHeader";
import type { AdFormat } from "./ProgrammaticFormats";
import { CssPhone, CssTablet, CssTv } from "./CssPhone";

export type ProgrammaticScrollSectionMobileProps = {
  mode: SiteMode;
  lane?: string;
  laneSwitcher?: ReactNode;
  formats: readonly AdFormat[];
  headerLabel: string;
  headerTitle: ReactNode;
  headerDescription?: string;
};

/** Mobile / reduced-motion Routes — sticky phone sidebar + scrolling cards. */
export function ProgrammaticScrollSectionMobile({
  mode,
  lane = "app-growth",
  laneSwitcher,
  formats,
  headerLabel,
  headerTitle,
  headerDescription,
}: ProgrammaticScrollSectionMobileProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const laneRef = useRef(lane);
  const format = formats[activeIndex] ?? formats[0]!;
  const [zoomed, setZoomed] = useState(false);

  // Reset index when lane changes
  if (laneRef.current !== lane) {
    laneRef.current = lane;
    setActiveIndex(0);
  }

  const { scrollYProgress } = useFramerScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    return scrollYProgress.onChange((v) => {
      const total = formats.length;
      let idx = Math.floor(v * total);
      if (idx >= total) idx = total - 1;
      if (idx < 0) idx = 0;
      setActiveIndex(idx);
    });
  }, [scrollYProgress, formats.length]);

  return (
    <div className="prog-scroll-section--mobile relative" aria-label="Ad formats">
      {/* Normal scrolling header */}
      <div className="prog-mobile-headline section-inner relative z-30 pt-8" style={{ backgroundColor: "var(--theme-bg)" }}>
        <SectionHeader label={headerLabel} title={headerTitle} description={headerDescription} />
      </div>
      {laneSwitcher ? (
        <div className="prog-mobile-switcher section-inner mb-0 pb-6 z-30 relative pointer-events-auto" style={{ backgroundColor: "var(--theme-bg)" }}>
          {laneSwitcher}
        </div>
      ) : null}

      {/* Scrubbing Section */}
      <section ref={sectionRef} style={{ height: `${formats.length * 80}vh` }} className="relative z-20 w-full">
        <div className="sticky top-0 w-full h-[100dvh] flex flex-col items-center justify-between overflow-hidden bg-background">
          <div className="prog-mobile-ambience absolute inset-0 !top-0" style={{ position: "absolute", height: "100%" }} aria-hidden />

          {/* Device Area (Top 60%) */}
          <div className="flex-1 w-full flex flex-col items-center justify-center pt-[5vh] pb-4 px-4 relative z-10 pointer-events-auto">
            <button
              type="button"
              className="w-full flex justify-center outline-none"
              onClick={() => setZoomed(true)}
              aria-label="Zoom device"
            >
              <div className={`relative w-full ${format.scene === 'tv' ? 'aspect-[16/9] max-w-[240px]' : format.scene === 'tablet' ? 'aspect-[3/4] max-w-[200px]' : 'aspect-[9/19] max-w-[170px]'}`}>
                <span className="prog-mobile-stage__glow" aria-hidden />
                {format.scene === 'tv' ? (
                  <CssTv mode={mode} formatId={format.id} className="h-full w-full pointer-events-none" />
                ) : format.scene === 'tablet' ? (
                  <CssTablet mode={mode} formatId={format.id} className="h-full w-full pointer-events-none" />
                ) : (
                  <CssPhone mode={mode} formatId={format.id} className="prog-css-phone--mobile h-full w-full pointer-events-none" />
                )}
              </div>
            </button>

            {/* Pagination Dots */}
            <button 
              className="mt-6 flex items-center justify-center gap-2 outline-none"
              onClick={() => setZoomed(true)}
            >
              {formats.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-4 bg-accent" : "w-1.5 bg-border"}`} 
                />
              ))}
            </button>
            <span className="mt-2 font-mono text-[10px] uppercase font-semibold text-theme-muted opacity-60">
              Tap to zoom
            </span>
          </div>

          {/* Crossfading Cards Area (Bottom 40%) */}
          <div className="w-full h-[40vh] min-h-[320px] max-h-[400px] relative z-20 px-4 pb-8 flex items-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                className="w-full bg-bg-elevated/90 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-3xl p-6 flex flex-col"
              >
                <div className="prog-mobile-card__meta mb-2">
                  <p className="prog-mobile-card__tag !max-w-full">{format.tagline}</p>
                </div>
                <h3 className="card-title text-xl sm:text-2xl">{format.label}</h3>
                <p className="copy mt-3 text-sm">{format.description}</p>
                <ul className="prog-mobile-card__points mt-4 p-4 bg-background/50 rounded-2xl space-y-2 flex-1 overflow-y-auto">
                  {format.points.map((point) => (
                    <li key={point} className="prog-mobile-card__point text-sm flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Zoom Modal */}
      {zoomed && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md p-4 cursor-zoom-out"
          onClick={() => setZoomed(false)}
        >
          <div className={`relative w-full ${format.scene === 'tv' ? 'max-w-3xl aspect-[16/9]' : format.scene === 'tablet' ? 'max-w-xl aspect-[3/4]' : 'max-w-sm aspect-[9/19]'}`}>
            {format.scene === 'tv' ? (
              <CssTv mode={mode} formatId={format.id} className="h-full w-full pointer-events-none" />
            ) : format.scene === 'tablet' ? (
              <CssTablet mode={mode} formatId={format.id} className="h-full w-full pointer-events-none" />
            ) : (
              <CssPhone mode={mode} formatId={format.id} className="prog-css-phone--mobile h-full w-full pointer-events-none" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
