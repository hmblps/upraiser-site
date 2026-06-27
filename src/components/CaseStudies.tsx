import { useEffect, useRef, useState } from "react";
import { caseStudies } from "../data/cases";
import { sections } from "../data/content";
import { accentLink } from "../lib/accent";
import { useCountUp } from "../hooks/useCountUp";
import { SectionHeader, SectionHeaderRow } from "./SectionHeader";
import { Reveal } from "./motion/Reveal";
import { useHorizontalScrollProgress } from "../hooks/useHorizontalScrollProgress";
import { CaseSparkline, getTrendLabel } from "./CaseSparkline";

function CaseResultStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const display = useCountUp(value, active);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="rounded-xl border border-border bg-bg p-3">
      <div className="text-lg font-bold text-orange">{display}</div>
      <div className="mt-0.5 line-clamp-2 min-h-0 stat-label leading-snug text-muted-light sm:min-h-[2.5rem]">{label}</div>
    </div>
  );
}

function CaseCard({ item }: { item: (typeof caseStudies)[0] }) {
  return (
    <article className="card-lift flex w-[min(88vw,420px)] shrink-0 snap-start flex-col self-stretch overflow-hidden rounded-3xl border border-border bg-bg-card">
      <div className="rounded-t-3xl border-b border-border bg-[var(--theme-case-panel)] p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <span className="rounded-full bg-orange/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange">
              {item.category}
            </span>
            <h3 className="mt-3 line-clamp-2 min-h-0 text-xl font-bold leading-tight sm:min-h-[3.5rem]">{item.client}</h3>
            <p className="mt-2 line-clamp-2 min-h-0 text-sm font-medium leading-snug text-fg sm:min-h-[2.5rem]">{item.headline}</p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange/35 to-orange/15 text-lg font-bold text-on-accent">
            {item.client.charAt(0)}
          </div>
        </div>

        <div className="mt-4 flex min-h-0 flex-wrap content-start gap-2 sm:min-h-[4.5rem]">
          {item.channels.map((channel) => (
            <span
              key={channel}
              className="rounded-full border border-border bg-bg-elevated px-2.5 py-1 text-[11px] font-medium text-muted-light"
            >
              {channel}
            </span>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-border/80 bg-bg p-3">
          <CaseSparkline trend={item.trend} label={getTrendLabel(item)} id={item.id} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="copy line-clamp-3 min-h-0 sm:line-clamp-4 sm:min-h-[5.5rem]">{item.overview}</p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {item.results.map((result) => (
            <CaseResultStat key={result.label} value={result.value} label={result.label} />
          ))}
        </div>

        <div className="mt-5 hidden flex-1 gap-4 sm:grid sm:grid-cols-2">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-orange">Challenge</h4>
            <ul className="mt-2 space-y-1.5">
              {item.challenges.slice(0, 2).map((point) => (
                <li key={point} className="copy flex gap-2 text-xs">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-magenta" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="stat-label text-orange">Our Approach</h4>
            <ul className="mt-2 space-y-1.5">
              {item.approach.slice(0, 2).map((point) => (
                <li key={point} className="copy flex gap-2 text-xs">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-orange" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="copy mt-auto border-t border-border pt-4 text-xs">
          <span className="stat-label font-semibold text-fg">Outcome: </span>
          {item.outcome}
        </p>
      </div>
    </article>
  );
}

export function CaseStudies() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeIndex = useHorizontalScrollProgress(scrollRef, caseStudies.length);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -440 : 440,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (index: number) => {
    const element = scrollRef.current;
    if (!element) return;
    const card = element.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  return (
    <section id="cases" className="section-band">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeaderRow>
          <SectionHeader
            label={sections.cases.label}
            title={sections.cases.title}
            description={sections.cases.description}
          />

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition hover:border-orange/40"
              aria-label="Scroll cases left"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition hover:border-orange/40"
              aria-label="Scroll cases right"
            >
              →
            </button>
            <a href="#contact" className={`link-caps ${accentLink("red")}`}>
              Start a Project →
            </a>
          </div>
        </SectionHeaderRow>

        <Reveal delay={0.1} className="relative mt-10">
          <div className="carousel-fade relative">
            <div
              ref={scrollRef}
              className="flex cursor-grab snap-x snap-mandatory items-stretch gap-5 overflow-x-auto pb-4 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {caseStudies.map((item) => (
                <CaseCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="scroll-hint text-xs text-muted">
              Drag or scroll to explore <span aria-hidden>→</span>
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
