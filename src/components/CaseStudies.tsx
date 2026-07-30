import { useEffect, useRef } from "react";
import { caseStudies } from "../data/cases";
import { casesPage } from "../data/liveContent";
import { useInfiniteCaseCarousel, CASE_CAROUSEL_COPIES } from "../hooks/useInfiniteCaseCarousel";
import { useHorizontalPointerScroll } from "../hooks/useHorizontalPointerScroll";
import { CasePreviewCard } from "./CasePreviewCard";
import { ScrollLink } from "./ScrollLink";

/**
 * /cases — one viewport: horizontal deck (no page scroll).
 * MagicUI reserved for Expertise (Beam) and Studio (Bento) only.
 */
export function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { activeIndex, scrollByCard, scrollToIndex } = useInfiniteCaseCarousel(scrollRef, {
    itemCount: caseStudies.length,
  });
  useHorizontalPointerScroll(scrollRef);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
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
              <span className="text-orange">{caseStudies.length}</span> cases
            </p>
          </div>
        </header>

        <section
          id="cases"
          ref={sectionRef}
          className="viewport-page__panel relative flex min-h-0 flex-1 flex-col overflow-hidden pt-2"
        >
          <div className="carousel-fade relative min-h-0 flex-1 overflow-hidden">
            <div
              ref={scrollRef}
              role="region"
              aria-roledescription="carousel"
              aria-label="Case studies"
              data-lenis-prevent-touch
              className="cases-carousel cases-carousel-loop cases-carousel-picker flex h-full cursor-grab items-stretch gap-4 overflow-x-auto overflow-y-hidden py-0.5 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

          <div className="viewport-page__chrome mt-3 flex shrink-0 items-center justify-between gap-4">
            <p className="scroll-hint text-xs text-muted opacity-70">Swipe or ← → · tap to open</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous case"
                onClick={() => scrollByCard("left")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:border-orange/40"
              >
                ←
              </button>
              {caseStudies.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Go to case ${index + 1}: ${item.client}`}
                  onClick={() => scrollToIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    activeIndex === index ? "w-6 bg-orange" : "w-2 bg-border hover:bg-muted"
                  }`}
                />
              ))}
              <button
                type="button"
                aria-label="Next case"
                onClick={() => scrollByCard("right")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition hover:border-orange/40"
              >
                →
              </button>
            </div>
            <ScrollLink
              href="/contact"
              data-cursor="cta"
              className="btn-caps btn-caps--primary hidden sm:inline-block"
            >
              Request Pilot
            </ScrollLink>
          </div>
        </section>
      </div>
    </div>
  );
}
