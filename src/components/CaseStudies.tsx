import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { caseStudies } from "../data/cases";
import type { SiteMode } from "../data/liveContent";
import { sectionsByMode } from "../data/liveContent";
import { useInfiniteCaseCarousel, CASE_CAROUSEL_COPIES } from "../hooks/useInfiniteCaseCarousel";
import { useHorizontalPointerScroll } from "../hooks/useHorizontalPointerScroll";
import { SPRING } from "../lib/motion";
import { CaseBrandHeader } from "./CaseBrandHeader";
import { CaseSparkline } from "./CaseSparkline";
import { ModeContentTransition } from "./motion/ModeContentTransition";
import { SectionHeader, useMode } from "./SectionHeader";
import { Reveal } from "./motion/Reveal";

const FOCUS_LABELS: Record<SiteMode, { challenge: string; approach: string; result: string }> = {
  growth: {
    challenge: "Challenge",
    approach: "Approach",
    result: "Result",
  },
  infrastructure: {
    challenge: "Risk",
    approach: "Controls",
    result: "Proof",
  },
};

function CaseFocusBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="case-focus-block">
      <p className="case-focus-block__title">{title}</p>
      <p className="case-focus-block__body">{children}</p>
    </div>
  );
}

function CaseCardBody({
  item,
  mode,
  compact = false,
}: {
  item: (typeof caseStudies)[0];
  mode: SiteMode;
  compact?: boolean;
}) {
  const data = mode === "growth" ? item.growthFocus : item.optimizationFocus;
  const labels = FOCUS_LABELS[mode];

  return (
    <>
      {!compact ? <CaseSparkline id={item.id} trend={item.trend} metrics={item.metrics} /> : null}

      <div className={`case-focus-stack ${compact ? "mt-0" : "mt-6"}`}>
        <CaseFocusBlock title={labels.challenge}>{data.challenge}</CaseFocusBlock>
        <CaseFocusBlock title={labels.approach}>{data.approach}</CaseFocusBlock>
        <CaseFocusBlock title={labels.result}>{data.result}</CaseFocusBlock>
      </div>
    </>
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
  return (
    <article
      data-case-card
      data-case-index={caseIndex}
      data-case-copy={copy}
      aria-hidden={copy > 0 || undefined}
      className="card-lift case-card flex w-[min(88vw,420px)] shrink-0 flex-col overflow-hidden rounded-3xl border border-border/60 bg-bg-card"
      style={
        {
          "--case-accent": item.brand.accent,
          "--case-surface": item.brand.surface,
        } as React.CSSProperties
      }
    >
      <CaseBrandHeader item={item} />
      <div className="case-card-scroll card-pad flex min-h-0 flex-1 flex-col">
        <CaseCardBody item={item} mode={mode} />
      </div>
    </article>
  );
}

function CaseAccordionItem({
  item,
  mode,
  open,
  onToggle,
}: {
  item: (typeof caseStudies)[0];
  mode: SiteMode;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `case-panel-${item.id}`;
  const primary = item.metrics[0];

  return (
    <article
      className="case-accordion-item overflow-hidden rounded-2xl border border-border/60 bg-bg-card"
      style={
        {
          "--case-accent": item.brand.accent,
          "--case-surface": item.brand.surface,
        } as React.CSSProperties
      }
    >
      <button
        type="button"
        className="case-accordion-trigger flex w-full items-start gap-3 px-4 py-4 text-left"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="case-brand-icon case-brand-icon--sm shrink-0">
          <img src={item.brand.icon} alt={`${item.client} app icon`} className="case-brand-icon__img" loading="lazy" decoding="async" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-micro case-brand-header__category">
            {item.vertical} · {item.paymentModel} · {item.geos}
          </span>
          <span className="mt-1 block text-base font-bold tracking-tight text-fg">{item.client}</span>
          <span className="mt-1 block text-sm leading-snug text-muted opacity-70">{item.headline}</span>
        </span>
        <span className="shrink-0 pt-1 text-right">
          <span className="block text-lg font-bold tracking-tight text-orange">{primary.value}</span>
          <span className="mt-0.5 block text-[0.625rem] font-semibold uppercase tracking-wide text-muted opacity-60">
            {primary.label}
          </span>
        </span>
        <span
          className={`case-accordion-chevron mt-1 shrink-0 text-muted transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          ↓
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            key="panel"
            className="case-accordion-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={SPRING}
          >
            <div className="case-accordion-panel-inner card-pad border-t border-border/60 pt-4">
              <CaseCardBody item={item} mode={mode} compact />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}

function CaseStudiesMobileAccordion({ mode }: { mode: SiteMode }) {
  const [openId, setOpenId] = useState<string | null>(caseStudies[0]?.id ?? null);

  useEffect(() => {
    setOpenId(caseStudies[0]?.id ?? null);
  }, [mode]);

  return (
    <div className="cases-accordion section-stack md:hidden">
      {caseStudies.map((item) => (
        <CaseAccordionItem
          key={item.id}
          item={item}
          mode={mode}
          open={openId === item.id}
          onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
        />
      ))}
    </div>
  );
}

function CaseStudiesDesktopCarousel({ mode, sectionRef }: { mode: SiteMode; sectionRef: React.RefObject<HTMLElement | null> }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { activeIndex, scrollByCard, scrollToIndex } = useInfiniteCaseCarousel(scrollRef, {
    itemCount: caseStudies.length,
  });
  useHorizontalPointerScroll(scrollRef);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      if (!window.matchMedia("(min-width: 768px)").matches) return;

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
  }, [scrollByCard, sectionRef]);

  const loopItems = Array.from({ length: CASE_CAROUSEL_COPIES }, (_, copy) =>
    caseStudies.map((item, index) => ({ item, copy, index })),
  ).flat();

  return (
    <div className="hidden md:block">
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
        <p className="scroll-hint text-xs text-muted opacity-70">Scroll inside a card · swipe or ← → for more</p>
        <div className="flex items-center gap-2">
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
        </div>
      </div>
    </div>
  );
}

export function CaseStudies() {
  const { mode } = useMode();
  const section = sectionsByMode.cases[mode];
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="cases" ref={sectionRef} className="section-band">
      <ModeContentTransition mode={mode} className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader label={sectionsByMode.cases.label} title={section.title} />

        <Reveal delay={0.1} className="section-stack">
          <CaseStudiesMobileAccordion mode={mode} />
          <CaseStudiesDesktopCarousel mode={mode} sectionRef={sectionRef} />
        </Reveal>
      </ModeContentTransition>
    </section>
  );
}
