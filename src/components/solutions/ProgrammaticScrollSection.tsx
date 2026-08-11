import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useScroll } from "../../context/ScrollContext";
import type { SiteMode } from "../../data/liveContent";
import { SectionHeader } from "../SectionHeader";
import { AD_FORMATS, type AdFormat } from "./ProgrammaticFormats";
import { FormatCopy } from "./FormatCopy";
import { CssPhone } from "./CssPhone";
import { BrandAurora } from "../BrandAurora";

import { CanvasErrorBoundary } from "../CanvasErrorBoundary";
import "../../styles/programmatic-scroll-section.css";
import "../../styles/programmatic-full-feed.css";

const phone3DImport = () =>
  import("./Phone3D").then((m) => ({ default: m.Phone3D }));

const Phone3D = lazy(phone3DImport);

// Trigger chunk fetch immediately so Suspense fallback never blinks
if (typeof window !== "undefined") {
  void phone3DImport();
}

/** Scroll distance per format — much longer so fast swiping doesn’t skip steps. */
const FORMAT_HEIGHT = 2800;

function progressToIndex(progress: number, count: number): number {
  const raw = progress * count;
  return Math.min(Math.max(0, Math.floor(raw)), count - 1);
}

type ProgrammaticScrollSectionProps = {
  mode: SiteMode;
  laneSwitcher?: ReactNode;
  /** Defaults to App Growth formats. */
  formats?: readonly AdFormat[];
  headerLabel?: string;
  headerTitle?: string;
  headerDescription?: string;
};

/**
 * Native sticky scroll drives the active format — no wheel hijack.
 * Desktop: 3D phone (dark silhouette while booting). Mobile: CssPhone + live feed.
 */
export function ProgrammaticScrollSection({
  mode,
  laneSwitcher,
  formats = AD_FORMATS,
  headerLabel = "Lanes",
  headerTitle = "Every Format. One Supply Path.",
  headerDescription,
}: ProgrammaticScrollSectionProps) {
  const reduced = useReducedMotion();
  const { scrollToY } = useScroll();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const rafRef = useRef(0);
  const lastIndexRef = useRef(0);
  const totalVirtual = formats.length * FORMAT_HEIGHT;

  useEffect(() => {
    lastIndexRef.current = 0;
    setActiveIndex(0);
  }, [formats]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // Preload chunk + active GLB as soon as desktop Solutions mounts.
  useEffect(() => {
    if (reduced || isMobile) return;
    void import("./Phone3D").then((m) => {
      m.preloadPhone3DAssets(mode);
    });
  }, [reduced, isMobile, mode]);

  useEffect(() => {
    if (isMobile || reduced) return;

    const sync = () => {
      rafRef.current = 0;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
      const traveled = Math.min(scrollable, Math.max(0, -rect.top));
      const progress = traveled / scrollable;
      const next = progressToIndex(progress, formats.length);
      if (next !== lastIndexRef.current) {
        lastIndexRef.current = next;
        setActiveIndex(next);
      }
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(sync);
    };

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, reduced, formats.length]);

  const jumpTo = (idx: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const center = (idx + 0.5) / formats.length;
    const target = sectionTop + scrollable * center;
    lastIndexRef.current = idx;
    setActiveIndex(idx);
    scrollToY(target, { immediate: reduced });
  };

  const format = formats[activeIndex] ?? formats[0]!;

  if (isMobile || reduced) {
    return (
      <MobileFormats
        mode={mode}
        laneSwitcher={laneSwitcher}
        reduced={reduced}
        formats={formats}
        headerLabel={headerLabel}
        headerTitle={headerTitle}
        headerDescription={headerDescription}
      />
    );
  }

  return (
    <div
      ref={sectionRef}
      className="prog-scroll-outer"
      style={{ height: `calc(100dvh + ${totalVirtual}px)` }}
      aria-label="Ad formats"
    >
      <div className="prog-scroll-sticky">
        <div className="prog-scroll-ambience" aria-hidden />
        <BrandAurora tone="routes" className="prog-scroll-stage-aurora" />
        <div className="prog-scroll-sticky-inner">
          <div className="prog-scroll-headline">
            <SectionHeader label={headerLabel} title={headerTitle} description={headerDescription} />
          </div>
          <div className="prog-scroll-layout">
            <div className="prog-scroll-phone-col">
              <Suspense fallback={<div className="prog-scroll-canvas" />}>
                <CanvasErrorBoundary
                  fallback={
                    <div className="prog-scroll-canvas" style={{ background: "red", color: "white", display: "grid", placeItems: "center" }}>
                      <h1>3D CRASHED! Error caught by boundary.</h1>
                    </div>
                  }
                >
                  <Phone3D mode={mode} formatId={format.id} className="prog-scroll-canvas" />
                </CanvasErrorBoundary>
              </Suspense>
            </div>

            <div className="prog-scroll-copy-col">
              <FormatCopy
                format={format}
                index={activeIndex}
                total={formats.length}
                mode={mode}
                reduced={false}
                laneSwitcher={laneSwitcher}
                formats={formats}
                onJump={jumpTo}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileFormats({
  mode,
  laneSwitcher,
  reduced,
  formats,
  headerLabel,
  headerTitle,
  headerDescription,
}: {
  mode: SiteMode;
  laneSwitcher?: ReactNode;
  reduced: boolean;
  formats: readonly AdFormat[];
  headerLabel: string;
  headerTitle: string;
  headerDescription?: string;
}) {
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
      /* Focus band sits above the bottom dock */
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

      {/* Copy first — phone dock fixed to the bottom while cards scroll */}
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
