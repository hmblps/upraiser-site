import { useEffect, useRef, useState, type ReactNode } from "react";
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
  // removed unused useReducedMotion
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const indexByLaneRef = useRef<Record<string, number>>({});
  const laneRef = useRef(lane);
  const ignoreObserverRef = useRef(false);
  const format = formats[activeIndex] ?? formats[0]!;

  if (laneRef.current !== lane) {
    indexByLaneRef.current[laneRef.current] = activeIndex;
    const restore = Math.min(indexByLaneRef.current[lane] ?? 0, Math.max(0, formats.length - 1));
    laneRef.current = lane;
    setActiveIndex(restore);
    ignoreObserverRef.current = true;
  }

  useEffect(() => {
    if (!ignoreObserverRef.current) return;
    const restore = Math.min(indexByLaneRef.current[lane] ?? 0, Math.max(0, formats.length - 1));
    cardRefs.current[restore]?.scrollIntoView({ behavior: "auto", block: "start" });
    const t = window.setTimeout(() => {
      ignoreObserverRef.current = false;
    }, 160);
    return () => window.clearTimeout(t);
  }, [lane, formats.length]);

  useEffect(() => {
    const nodes = cardRefs.current.filter(Boolean) as HTMLElement[];
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
      { rootMargin: "-30% 0px -40% 0px", threshold: [0.2, 0.5, 0.8] },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [formats]);

  const [zoomed, setZoomed] = useState(false);

  return (
    <section
      ref={sectionRef}
      className="prog-scroll-section prog-scroll-section--mobile relative"
      aria-label="Ad formats"
    >
      <div className="prog-mobile-ambience" aria-hidden />

      <div className="prog-mobile-headline section-inner">
        <SectionHeader label={headerLabel} title={headerTitle} description={headerDescription} />
      </div>

      {laneSwitcher ? <div className="prog-mobile-switcher section-inner mb-6 z-20 relative">{laneSwitcher}</div> : null}

      {/* Sticky Device Center */}
      <div className="sticky top-[20vh] sm:top-[25vh] z-0 flex flex-col items-center justify-center w-full max-w-sm mx-auto px-4 mt-8 pointer-events-auto">
        <button
          type="button"
          className="w-full flex justify-center outline-none"
          onClick={() => setZoomed(true)}
          aria-label="Zoom device"
        >
          <div className={`relative w-full ${format.scene === 'tv' ? 'aspect-[16/9] max-w-[280px]' : format.scene === 'tablet' ? 'aspect-[3/4] sm:aspect-[4/3] max-w-[240px]' : 'aspect-[9/19] max-w-[200px]'}`}>
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
        <div className="mt-4 flex flex-col items-center">
           <span className="font-mono text-xs font-semibold text-theme-muted mb-1">
              Tap to expand · {String(activeIndex + 1).padStart(2, "0")} / {String(formats.length).padStart(2, "0")}
           </span>
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomed && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md p-4 cursor-zoom-out"
          onClick={() => setZoomed(false)}
        >
          <div className={`relative w-full max-w-lg ${format.scene === 'tv' ? 'aspect-[16/9]' : format.scene === 'tablet' ? 'aspect-[3/4] sm:aspect-[4/3]' : 'aspect-[9/19] max-h-[85vh]'}`}>
            {format.scene === 'tv' ? (
              <CssTv mode={mode} formatId={format.id} className="h-full w-full" />
            ) : format.scene === 'tablet' ? (
              <CssTablet mode={mode} formatId={format.id} className="h-full w-full" />
            ) : (
              <CssPhone mode={mode} formatId={format.id} className="prog-css-phone--mobile h-full w-full" />
            )}
          </div>
        </div>
      )}

      {/* Scrolling Cards Overlay */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4 mt-[30vh] pb-[30vh] flex flex-col gap-12 sm:gap-24">
        {formats.map((fmt, i) => (
          <article
            key={fmt.id + fmt.label}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            data-index={i}
            className={`prog-scroll-section__mobile-card bg-bg-elevated/80 backdrop-blur-xl border border-border shadow-2xl rounded-3xl p-6 ${i === activeIndex ? "is-active scale-100 opacity-100" : "scale-95 opacity-50"} transition-all duration-500`}
          >
            <div className="prog-mobile-card__meta mb-2">
              <p className="prog-mobile-card__tag !max-w-full">{fmt.tagline}</p>
            </div>
            <h3 className="card-title prog-mobile-card__title text-xl sm:text-2xl">{fmt.label}</h3>
            <p className="copy prog-mobile-card__body mt-3 text-base">{fmt.description}</p>
            <ul className="prog-mobile-card__points mt-4 p-4 bg-background/50 rounded-2xl space-y-2">
              {fmt.points.map((point) => (
                <li key={point} className="prog-mobile-card__point text-sm flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
