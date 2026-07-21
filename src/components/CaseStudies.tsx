import { useEffect, useRef, useState } from "react";
import { caseStudies } from "../data/cases";
import type { SiteMode } from "../data/liveContent";
import { sectionsByMode } from "../data/liveContent";
import { useCountUp } from "../hooks/useCountUp";
import { SectionHeader, useMode } from "./SectionHeader";
import { Reveal } from "./motion/Reveal";
import { useInfiniteCaseCarousel, CASE_CAROUSEL_COPIES } from "../hooks/useInfiniteCaseCarousel";
import { useHorizontalPointerScroll } from "../hooks/useHorizontalPointerScroll";

function SoftDetail({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-micro text-muted opacity-50">{title}</p>
      {children}
    </div>
  );
}

function CaseCard({
  item,
  caseIndex,
  copy,
  mode,
}: {
  item: (typeof caseStudies)[0];
  caseIndex: number;
  copy: number;
  mode: SiteMode;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroActive, setHeroActive] = useState(false);
  const heroDisplay = useCountUp(item.heroMetric.value, heroActive, 1600);

  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeroActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const data = mode === "growth" ? item.growthFocus : item.optimizationFocus;

  return (
    <article
      data-case-card
      data-case-index={caseIndex}
      data-case-copy={copy}
      aria-hidden={copy > 0 || undefined}
      className="card-lift case-card flex w-[min(88vw,420px)] shrink-0 flex-col overflow-hidden rounded-3xl border border-border/60 bg-bg-card"
    >
      <div className="case-card-scroll card-pad flex min-h-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="text-micro text-orange opacity-80">
              {item.category}
            </span>
            <h3 className="mt-3 text-xl font-bold tracking-tight text-fg md:text-2xl">{item.client}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted opacity-70 md:text-base">{item.headline}</p>
          </div>
        </div>

        <div ref={heroRef} className="mt-10">
          <p className="case-hero-metric-value text-6xl font-bold tracking-tighter text-orange md:text-7xl">
            {heroDisplay}
          </p>
          <p className="mt-2 text-sm font-semibold tracking-wide text-muted opacity-60">{item.heroMetric.label}</p>
        </div>

        <p className="mt-8 text-sm leading-relaxed text-muted opacity-60 md:text-[0.9375rem]">{data.overview}</p>

        <div className="mt-8 space-y-6 opacity-60">
          <SoftDetail title="Outcome">
            <p className="text-sm leading-relaxed text-muted">{data.outcome}</p>
          </SoftDetail>
        </div>
      </div>
    </article>
  );
}

export function CaseStudies() {
  const { mode } = useMode();
  const section = sectionsByMode.cases[mode];
  const scrollRef = useRef<HTMLDivElement>(null);
  const { activeIndex, scrollToIndex } = useInfiniteCaseCarousel(scrollRef, {
    itemCount: caseStudies.length,
  });
  useHorizontalPointerScroll(scrollRef);

  const loopItems = Array.from({ length: CASE_CAROUSEL_COPIES }, (_, copy) =>
    caseStudies.map((item, index) => ({ item, copy, index })),
  ).flat();

  return (
    <section id="cases" className="section-band">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader label={sectionsByMode.cases.label} title={section.title} />

        <Reveal delay={0.1} className="section-stack">
          <div className="carousel-fade relative">
            <div
              ref={scrollRef}
              role="region"
              aria-roledescription="carousel"
              aria-label="Case studies"
              data-lenis-prevent-touch
              className="cases-carousel cases-carousel-picker flex cursor-grab items-start gap-5 overflow-x-auto pb-4 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {loopItems.map(({ item, copy, index }) => (
                <CaseCard key={`${item.id}-${copy}`} item={item} caseIndex={index} copy={copy} mode={mode} />
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="scroll-hint text-xs text-muted opacity-70">
              Scroll inside a card · swipe for more
            </p>
            <div className="flex items-center gap-2">
              {caseStudies.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Go to case ${index + 1}`}
                  onClick={() => scrollToIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    activeIndex === index ? "w-6 bg-orange" : "w-2 bg-border hover:bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
