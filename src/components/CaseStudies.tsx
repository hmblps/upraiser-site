import { useEffect, useRef } from "react";
import { caseStudies } from "../data/cases";
import { casesPage, sectionsByMode } from "../data/liveContent";
import { useInfiniteCaseCarousel, CASE_CAROUSEL_COPIES } from "../hooks/useInfiniteCaseCarousel";
import { useHorizontalPointerScroll } from "../hooks/useHorizontalPointerScroll";
import { CasePreviewCard } from "./CasePreviewCard";
import { ModeContentTransition } from "./motion/ModeContentTransition";
import { SectionHeader, useMode } from "./SectionHeader";
import { Reveal } from "./motion/Reveal";

/**
 * /cases only — infinite horizontal deck.
 * Home keeps a 3-card teaser grid. Tap a card → detail modal.
 */
export function CaseStudies() {
  const { mode } = useMode();
  const section = sectionsByMode.cases[mode];
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

      const sectionNode = sectionRef.current;
      if (!sectionNode) return;

      const rect = sectionNode.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1;
      if (!inView) return;

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
    <section id="cases" ref={sectionRef} className="section-band">
      <ModeContentTransition mode={mode} className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          label={casesPage.label}
          title={section.title}
          description="Swipe the deck. Open a card for the case brief — shareable on /cases/:slug."
        />
      </ModeContentTransition>

      <Reveal delay={0.1} className="section-stack mt-10">
        <div className="carousel-fade relative">
          <div
            ref={scrollRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Case studies"
            data-lenis-prevent-touch
            className="cases-carousel cases-carousel-loop cases-carousel-picker flex cursor-grab items-stretch gap-5 overflow-x-auto px-6 pb-4 active:cursor-grabbing lg:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

        <div className="mx-auto mt-5 flex max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
          <p className="scroll-hint text-xs text-muted opacity-70">
            Swipe or ← → · tap to open
          </p>
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
        </div>
      </Reveal>
    </section>
  );
}
