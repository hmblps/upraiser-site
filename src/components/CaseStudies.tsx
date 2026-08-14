import { useEffect, useRef } from "react";
import { caseStudies } from "../data/cases";
import { casesPage, primaryCta, sectionsByMode } from "../data/liveContent";
import { useInfiniteCaseCarousel, CASE_CAROUSEL_COPIES } from "../hooks/useInfiniteCaseCarousel";
import { useHorizontalPointerScroll } from "../hooks/useHorizontalPointerScroll";
import { CasePreviewCard } from "./CasePreviewCard";
import { ScrollLink } from "./ScrollLink";
import { ModeContentTransition } from "./motion/ModeContentTransition";
import { SectionHeader, useMode } from "./SectionHeader";

type CaseStudiesProps = {
  /** `home` = embedded carousel on `/`; `page` = legacy full-viewport deck */
  variant?: "home" | "page";
};

function CaseCarouselDeck({ className = "" }: { className?: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { activeIndex, scrollByCard, scrollToIndex } = useInfiniteCaseCarousel(scrollRef, {
    itemCount: caseStudies.length,
  });
  useHorizontalPointerScroll(scrollRef, { mapVertical: true });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (!sectionRef.current?.contains(document.activeElement) && document.activeElement !== document.body) {
        return;
      }
      event.preventDefault();
      if (event.key === "ArrowLeft") scrollByCard("left");
      else scrollByCard("right");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [scrollByCard]);

  const loopItems = Array.from({ length: CASE_CAROUSEL_COPIES }, (_, copy) =>
    caseStudies.map((item, index) => ({ item, copy, index })),
  ).flat();

  return (
    <section
      ref={sectionRef}
      className={`relative flex min-h-0 flex-col overflow-hidden ${className}`}
    >
      <div className="carousel-fade relative min-h-[min(52vh,28rem)] flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Case studies"
          data-lenis-prevent-touch
          className="cases-carousel cases-carousel-loop cases-carousel-picker flex h-full min-h-[min(52vh,28rem)] cursor-grab items-stretch gap-4 overflow-x-auto overflow-y-hidden py-0.5 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {loopItems.map(({ item, copy, index }) => (
            <CasePreviewCard
              key={`${item.id}-${copy}`}
              item={item}
              caseIndex={index}
              copy={copy}
              variant="carousel"
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex shrink-0 items-center justify-between gap-3">
        <p className="scroll-hint hidden text-xs text-muted opacity-70 sm:block">Swipe or ← → · tap to open</p>
        <div className="cases-chrome-nav flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous case"
            onClick={() => scrollByCard("left")}
            className="touch-target flex items-center justify-center rounded-full border border-border transition hover:border-accent/40"
          >
            ←
          </button>
          {caseStudies.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Go to case ${index + 1}: ${item.client}`}
              onClick={() => scrollToIndex(index)}
              className={`cases-chrome-dot${activeIndex === index ? " is-active" : ""}`}
            />
          ))}
          <button
            type="button"
            aria-label="Next case"
            onClick={() => scrollByCard("right")}
            className="touch-target flex items-center justify-center rounded-full border border-border transition hover:border-accent/40"
          >
            →
          </button>
        </div>
        <ScrollLink
          href={primaryCta.href}
          data-cursor="cta"
          className="btn-caps btn-caps--primary cases-chrome-pilot"
        >
          {primaryCta.label}
        </ScrollLink>
      </div>
    </section>
  );
}

/** Full Peaks deck — home embed or legacy viewport page. */
export function CaseStudies({ variant = "home" }: CaseStudiesProps) {
  const { mode } = useMode();
  const section = sectionsByMode.cases[mode];

  if (variant === "page") {
    return (
      <div className="depth-page depth-page--cases viewport-page">
        <div className="viewport-page__shell section-inner flex flex-col">
          <header className="viewport-page__intro shrink-0">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="section-label">{casesPage.label}</p>
                <h1 className="section-title">{casesPage.title}</h1>
                <p className="section-description">{casesPage.description}</p>
              </div>
              <p className="shrink-0 font-mono text-caption font-bold tabular-nums text-muted">
                <span className="text-accent">{caseStudies.length}</span> cases
              </p>
            </div>
          </header>
          <div id="cases" className="viewport-page__panel relative flex min-h-0 flex-1 flex-col overflow-hidden pt-2">
            <CaseCarouselDeck className="flex min-h-0 flex-1 flex-col pt-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section id="cases" className="section-band section-band--dense">
      <ModeContentTransition mode={mode} className="section-inner">
        <SectionHeader
          animated={false}
          label={casesPage.label}
          title={section.title}
          description={
            mode === "growth"
              ? "Killer outcomes from live flights — tap any card for the full story."
              : "Audit-ready pipelines in brief — tap any card for the full story."
          }
        />
        <div className="section-stack mt-2">
          <p className="font-mono text-caption font-bold tabular-nums text-muted">
            <span className="text-accent">{caseStudies.length}</span> cases
          </p>
          <CaseCarouselDeck />
        </div>
      </ModeContentTransition>
    </section>
  );
}
