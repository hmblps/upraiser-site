import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useCarouselActiveIndex } from "../hooks/useCarouselActiveIndex";
import { useCountUp } from "../hooks/useCountUp";
import { useApplePreview } from "../hooks/useApplePreview";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { SPRING_SOFT } from "../lib/motion";
import { HeroFlyProvider, useHeroFly } from "../context/HeroFlyContext";
import { HeroHighlights } from "./apple-preview/HeroHighlights";
import { heroHighlightsByMode, heroLedeByMode } from "../data/liveContent";
import { HeroAtmosphere } from "./HeroAtmosphere";
import { LenovoTrustStrip } from "./LenovoTrustStrip";
import { DESKTOP_HERO_QUERY } from "../lib/heroDesktop";
import { useMode } from "./SectionHeader";

const HERO_SPRING = { type: "spring" as const, stiffness: 100, damping: 20, mass: 0.85 };

const headlineLines = [
  { text: "We see how" },
  { text: "stunning" },
  { text: "Your rise", accent: true as const },
  { text: "to the top" },
  { text: "can be." },
] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.18 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: HERO_SPRING },
};

function HeroStatsDots({
  containerRef,
  count,
  activeIndex,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  count: number;
  activeIndex: number;
}) {
  const scrollTo = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const cell = container.querySelectorAll(".hero-stats__cell")[index] as HTMLElement | undefined;
    if (!cell) return;
    container.scrollTo({ left: cell.offsetLeft - container.offsetLeft, behavior: "smooth" });
  };

  return (
    <div className="hero-stats-dots" role="tablist" aria-label="Hero metrics">
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={index === activeIndex}
          aria-label={`Metric ${index + 1}`}
          className={`hero-stats-dot${index === activeIndex ? " is-active" : ""}`}
          onClick={() => scrollTo(index)}
        />
      ))}
    </div>
  );
}

function StatCard({ value, label, counted, accent }: { value: string; label: string; counted: boolean; accent?: boolean }) {
  const ref = useCountUp(value, counted);

  return (
    <article className={`hero-stat-ghost h-full ${accent ? 'is-accent' : ''}`}>
      <div className="hero-stat-ghost__value" ref={ref as any}>{value}</div>
      <p className="hero-stat-ghost__label">{label}</p>
    </article>
  );
}

function HeroPinnedScene() {
  const reduced = useReducedMotion();
  const { mode } = useMode();
  const { isActive } = useApplePreview();
  const { revealedCount } = useHeroFly();
  const statsScrollRef = useRef<HTMLDivElement>(null);
  const highlights = heroHighlightsByMode[mode];
  const activeStatIndex = useCarouselActiveIndex(statsScrollRef, highlights.length);
  const [pinScroll, setPinScroll] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(DESKTOP_HERO_QUERY).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_HERO_QUERY);
    const sync = () => setPinScroll(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const setStatsRef = useCallback((node: HTMLDivElement | null) => {
    statsScrollRef.current = node;
  }, []);

  const scrubCards = pinScroll && !reduced;

  return (
    <section className="hero-stage hero-stage--terrain hero-stage--fly relative">
      <div className="hero-fly-sticky relative flex flex-col overflow-hidden">
        <HeroAtmosphere />

        <div className="hero-content hero-content--fly-rail page-container relative z-10 w-full flex-1">
          <div className="hero-layout grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 xl:gap-14">
            <motion.div
              className="hero-copy"
              initial={reduced ? false : "hidden"}
              animate="visible"
              variants={reduced ? undefined : containerVariants}
              onAnimationComplete={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new Event("hero-ready"));
                }
              }}
            >
              <h1 className="hero-title hero-title--fly hero-title--hero font-extrabold tracking-tighter">
                {headlineLines.map((line) => (
                  <motion.span
                    key={line.text}
                    variants={reduced ? undefined : itemVariants}
                    className="block"
                    onAnimationComplete={
                      line.text === "Your rise"
                        ? () => {
                            if (typeof window !== "undefined") {
                              (window as any).scaleReady = true;
                              window.dispatchEvent(new Event("scale-ready"));
                            }
                          }
                        : undefined
                    }
                  >
                    {"accent" in line && line.accent ? (
                      <span className="hero-title-accent">{line.text}</span>
                    ) : (
                      line.text
                    )}
                  </motion.span>
                ))}
              </h1>

              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={mode}
                  className="hero-lede mt-5 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg"
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -6 }}
                  transition={HERO_SPRING}
                >
                  {heroLedeByMode[mode]}
                </motion.p>
              </AnimatePresence>

              {isActive("highlights") ? <HeroHighlights /> : null}
            </motion.div>

            <div className="hero-stats-wrap">
              <p className="section-label hero-fly-label">UPRAISER · Charting the Ascent</p>
              <div
                ref={setStatsRef}
                className="hero-stats overflow-x-auto px-0 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={mode}
                    className="hero-stats__track flex snap-x snap-mandatory gap-3 md:grid md:grid-cols-2 md:gap-3.5"
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                    transition={HERO_SPRING}
                  >
                    {highlights.map((item, index) => {
                      const revealed = !scrubCards || index < revealedCount;

                      return (
                        <motion.div
                          key={item.label}
                          initial={false}
                          animate={
                            revealed
                              ? { opacity: 1, y: 0, scale: 1 }
                              : { opacity: 0, y: 28, scale: 0.96 }
                          }
                          transition={SPRING_SOFT}
                          className="hero-stats__cell w-[min(68vw,11.5rem)] shrink-0 snap-start md:w-auto"
                          style={{ pointerEvents: revealed ? undefined : "none" }}
                        >
                          <StatCard value={item.value} label={item.label} counted={revealed} accent={'accent' in item ? item.accent : false} />
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
              <HeroStatsDots containerRef={statsScrollRef} count={highlights.length} activeIndex={activeStatIndex} />
            </div>
          </div>
        </div>

        {/* Flush to sticky bottom — same frame as the mountain, not a post-hero gap */}
        <LenovoTrustStrip />
      </div>
    </section>
  );
}

/**
 * Home Hero — big lower headline rides the ascent; ghost stats reveal on scroll.
 */
export function Hero() {
  return (
    <HeroFlyProvider>
      <HeroPinnedScene />
    </HeroFlyProvider>
  );
}
