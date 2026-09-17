import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  const laneRef = useRef(lane);
  const format = formats[activeIndex] ?? formats[0]!;
  const [zoomed, setZoomed] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const ignoreObserverRef = useRef(false);

  // Reset index when lane changes
  if (laneRef.current !== lane) {
    laneRef.current = lane;
    setActiveIndex(0);
    if (scrollerRef.current) {
      scrollerRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }

  // Intersection observer to detect which card is visible in the horizontal carousel
  useEffect(() => {
    if (!scrollerRef.current) return;
    const nodes = Array.from(scrollerRef.current.querySelectorAll(".prog-mobile-card-wrapper"));
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        if (ignoreObserverRef.current) return;
        const idx = Number((visible.target as HTMLElement).dataset.index);
        if (!Number.isNaN(idx)) setActiveIndex(idx);
      },
      { root: scrollerRef.current, rootMargin: "0px", threshold: 0.6 }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [formats]);

  const scrollToCard = (idx: number) => {
    if (!scrollerRef.current) return;
    const nodes = Array.from(scrollerRef.current.querySelectorAll(".prog-mobile-card-wrapper"));
    const target = nodes[idx];
    if (target) {
      ignoreObserverRef.current = true;
      setActiveIndex(idx);
      
      const scroller = scrollerRef.current;
      const scrollLeft = (target as HTMLElement).offsetLeft - scroller.offsetWidth / 2 + (target as HTMLElement).offsetWidth / 2;
      
      scroller.scrollTo({ left: scrollLeft, behavior: "smooth" });
      
      setTimeout(() => {
        ignoreObserverRef.current = false;
      }, 500);
    }
  };

  return (
    <div className="prog-scroll-section--mobile relative flex flex-col w-full bg-background pt-8 pb-16" aria-label="Ad formats">
      <div className="prog-mobile-ambience absolute inset-0 !top-0" style={{ position: "absolute", height: "100%" }} aria-hidden />

      {/* Header */}
      <div className="prog-mobile-headline section-inner relative z-30">
        <SectionHeader label={headerLabel} title={headerTitle} description={headerDescription} />
      </div>
      {laneSwitcher ? (
        <div className="prog-mobile-switcher section-inner mb-4 z-30 relative pointer-events-auto">
          {laneSwitcher}
        </div>
      ) : null}

      {/* Device Area */}
      <div className="w-full flex flex-col items-center justify-center pt-4 pb-2 px-4 relative z-10 pointer-events-auto">
        <button
          type="button"
          className="w-full flex justify-center outline-none"
          onClick={() => setZoomed(true)}
          aria-label="Zoom device"
        >
          <div className={`relative w-full ${format.scene === 'tv' ? 'aspect-[16/9] max-w-[260px]' : format.scene === 'tablet' ? 'aspect-[3/4] max-w-[220px]' : 'aspect-[9/19] max-w-[190px]'}`}>
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
        <div className="mt-6 flex items-center justify-center gap-2">
          {formats.map((_, i) => (
            <button 
              key={i}
              onClick={() => scrollToCard(i)}
              className={`h-1.5 rounded-full transition-all duration-300 outline-none ${i === activeIndex ? "w-4 bg-accent" : "w-1.5 bg-border hover:bg-border/80"}`} 
              aria-label={`Go to format ${i + 1}`}
            />
          ))}
        </div>
        <span className="mt-2 font-mono text-[10px] uppercase font-semibold text-theme-muted opacity-60">
          Swipe cards to change
        </span>
      </div>

      {/* Horizontal Scrolling Cards Area */}
      <div className="w-full mt-4 relative z-20">
        <div 
          ref={scrollerRef}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 px-4 pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {formats.map((fmt, i) => (
            <div 
              key={fmt.id} 
              data-index={i}
              className="prog-mobile-card-wrapper snap-center shrink-0 w-[85vw] max-w-[340px] flex"
            >
              <div 
                className={`w-full bg-bg-elevated/90 backdrop-blur-2xl border ${i === activeIndex ? "border-accent/40 shadow-xl" : "border-border/40 shadow-lg opacity-60 scale-95"} transition-all duration-300 rounded-3xl p-6 flex flex-col`}
              >
                <div className="prog-mobile-card__meta mb-2">
                  <p className="prog-mobile-card__tag !max-w-full">{fmt.tagline}</p>
                </div>
                <h3 className="card-title text-xl sm:text-2xl">{fmt.label}</h3>
                <p className="copy mt-3 text-sm text-theme-muted">{fmt.description}</p>
                <ul className="prog-mobile-card__points mt-4 p-4 bg-background/50 rounded-2xl space-y-2 flex-1">
                  {fmt.points.map((point) => (
                    <li key={point} className="prog-mobile-card__point text-sm flex items-start gap-2">
                      <span className="text-accent mt-0.5">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

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
