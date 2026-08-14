import { useEffect, useRef, useState, type ReactNode } from "react";
import type { SiteMode } from "../../data/liveContent";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { SectionHeader } from "../SectionHeader";
import type { AdFormat } from "./ProgrammaticFormats";
import { CssPhone } from "./CssPhone";

export type ProgrammaticScrollSectionMobileProps = {
  mode: SiteMode;
  laneSwitcher?: ReactNode;
  formats: readonly AdFormat[];
  headerLabel: string;
  headerTitle: string;
  headerDescription?: string;
};

/** Mobile / reduced-motion Routes — stacked cards + bottom phone dock. */
export function ProgrammaticScrollSectionMobile({
  mode,
  laneSwitcher,
  formats,
  headerLabel,
  headerTitle,
  headerDescription,
}: ProgrammaticScrollSectionMobileProps) {
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [dockPinned, setDockPinned] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const dockRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const format = formats[activeIndex] ?? formats[0]!;

  useEffect(() => {
    setActiveIndex(0);
  }, [formats]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setDockPinned(Boolean(entry?.isIntersecting));
      },
      { rootMargin: "-8% 0px -8% 0px", threshold: [0, 0.05, 0.15] },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const dock = dockRef.current;
    const section = sectionRef.current;
    if (!dock || !section) return;

    const syncHeight = () => {
      const h = Math.ceil(dock.getBoundingClientRect().height);
      if (h > 0) section.style.setProperty("--prog-dock-h", `${h}px`);
    };
    syncHeight();
    const ro = new ResizeObserver(syncHeight);
    ro.observe(dock);
    return () => ro.disconnect();
  }, [dockPinned, formats.length]);

  useEffect(() => {
    const nodes = cardRefs.current.filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = Number((visible.target as HTMLElement).dataset.index);
        if (!Number.isNaN(idx)) setActiveIndex(idx);
      },
      { rootMargin: "-12% 0px -42% 0px", threshold: [0.15, 0.35, 0.6] },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [formats]);

  const goTo = (idx: number) => {
    setActiveIndex(idx);
    cardRefs.current[idx]?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <section
      ref={sectionRef}
      className="prog-scroll-section prog-scroll-section--mobile"
      aria-label="Ad formats"
    >
      <div className="prog-mobile-ambience" aria-hidden />

      <div className="prog-mobile-headline section-inner">
        <SectionHeader label={headerLabel} title={headerTitle} description={headerDescription} />
      </div>

      {laneSwitcher ? <div className="prog-mobile-switcher section-inner">{laneSwitcher}</div> : null}

      <div className="prog-scroll-section__mobile-inner">
        {formats.map((fmt, i) => (
          <article
            key={fmt.id + fmt.label}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            data-index={i}
            className={`prog-scroll-section__mobile-card${i === activeIndex ? " is-active" : ""}`}
          >
            <div className="prog-mobile-card__meta">
              <p className="prog-mobile-card__tag">{fmt.tagline}</p>
              <span className="prog-mobile-card__index" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="card-title prog-mobile-card__title">{fmt.label}</h3>
            <p className="copy prog-mobile-card__body">{fmt.description}</p>
            <ul className="prog-mobile-card__points">
              {fmt.points.map((point) => (
                <li key={point} className="prog-mobile-card__point">
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div
        ref={dockRef}
        className={`prog-mobile-sticky${dockPinned ? " is-pinned" : ""}`}
        aria-hidden={!dockPinned}
      >
        <div className="prog-mobile-dock">
          <div className="prog-mobile-dock__phone">
            <span className="prog-mobile-stage__glow" aria-hidden />
            <CssPhone mode={mode} formatId={format.id} className="prog-css-phone--mobile prog-css-phone--dock" />
          </div>
          <div className="prog-mobile-dock__caption">
            <p className="prog-mobile-dock__index" aria-hidden>
              {String(activeIndex + 1).padStart(2, "0")} / {String(formats.length).padStart(2, "0")}
            </p>
            <p className="prog-mobile-dock__label">{format.label}</p>
            <p className="prog-mobile-dock__tag">{format.tagline}</p>
            <div className="prog-mobile-dots" role="tablist" aria-label="Formats">
              {formats.map((fmt, i) => (
                <button
                  key={fmt.id + fmt.label}
                  type="button"
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={fmt.label}
                  tabIndex={dockPinned ? 0 : -1}
                  className={`min-h-11 min-w-11${i === activeIndex ? " is-active" : ""}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
