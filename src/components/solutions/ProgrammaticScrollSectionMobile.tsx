import { useEffect, useRef, useState, type ReactNode } from "react";
import type { SiteMode } from "../../data/liveContent";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { SectionHeader } from "../SectionHeader";
import type { AdFormat } from "./ProgrammaticFormats";
import { CssPhone } from "./CssPhone";

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
  const reduced = useReducedMotion();
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

      {laneSwitcher ? <div className="prog-mobile-switcher section-inner mb-6">{laneSwitcher}</div> : null}

      {/* Sticky Sidebar Layout */}
      <div className="flex flex-row items-start px-2 sm:px-4 w-full max-w-2xl mx-auto">
        {/* Left Sticky Phone */}
        <div className="w-[35%] sm:w-[40%] flex-shrink-0 sticky top-[calc(var(--site-header-height,72px)+1rem)] flex flex-col items-center">
          <div className="relative w-full aspect-[9/19] max-w-[160px]">
            <span className="prog-mobile-stage__glow" aria-hidden />
            <CssPhone mode={mode} formatId={format.id} className="prog-css-phone--mobile h-full w-full" />
          </div>
          <div className="mt-4 flex flex-col items-center">
             <span className="font-mono text-xs font-semibold text-theme-muted mb-1">
                {String(activeIndex + 1).padStart(2, "0")} / {String(formats.length).padStart(2, "0")}
             </span>
          </div>
        </div>

        {/* Right Scrolling Cards */}
        <div className="w-[65%] sm:w-[60%] pl-4 sm:pl-6 pb-[20vh] flex flex-col gap-6">
          {formats.map((fmt, i) => (
            <article
              key={fmt.id + fmt.label}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              data-index={i}
              className={`prog-scroll-section__mobile-card ${i === activeIndex ? "is-active" : ""}`}
            >
              <div className="prog-mobile-card__meta mb-2">
                <p className="prog-mobile-card__tag !max-w-full">{fmt.tagline}</p>
              </div>
              <h3 className="card-title prog-mobile-card__title text-lg sm:text-xl">{fmt.label}</h3>
              <p className="copy prog-mobile-card__body text-sm sm:text-base">{fmt.description}</p>
              <ul className="prog-mobile-card__points mt-2 p-2 sm:p-3">
                {fmt.points.map((point) => (
                  <li key={point} className="prog-mobile-card__point text-xs sm:text-sm">
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
