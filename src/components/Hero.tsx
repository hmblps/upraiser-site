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
        <motion.button
          key={index}
          type="button"
          role="tab"
          aria-selected={index === activeIndex}
          aria-label={`Metric ${index + 1}`}
          className={`hero-stats-dot${index === activeIndex ? " is-active" : ""}`}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scrollTo(index)}
        />
      ))}
    </div>
  );
}

function StatCard({ value, label, counted, accent, align = "center" }: { value: string; label: string; counted: boolean; accent?: boolean; align?: "left" | "center" | "right" }) {
  const ref = useCountUp(value, counted);
  const alignClass = align === "left" ? "items-start text-left" : align === "right" ? "items-end text-right" : "items-center text-center";

  return (
    <article className={`hero-stat-ghost flex flex-col justify-center h-full ${alignClass} ${accent ? 'is-accent' : ''}`}>
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

        {/* Hero copy — uses fly-rail padding (wide left) */}
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
          </div>
        </div>

        {/* Stats — uses SAME page-container as Header, guaranteeing identical column alignment */}
        <div className="page-container absolute bottom-0 left-0 right-0 z-10 pointer-events-none hidden lg:block"
             style={{ marginBottom: "clamp(3rem, 7vh, 5.5rem)" }}>
          <div className="w-full grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 xl:gap-14">
            <div className="hidden lg:block" />
            <div className="hero-stats-wrap flex flex-col w-full pointer-events-auto">
              <p className="section-label hero-fly-label text-left w-full block mb-6">UPRAISER · Charting the Ascent</p>
              <div ref={setStatsRef} className="hero-stats overflow-visible px-0 pb-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={mode}
                    className="hero-stats__track grid grid-cols-2 w-full"
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex flex-col gap-10 items-start">
                      {highlights.filter((_, i) => i % 2 === 0).map((item, i) => {
                        const originalIndex = i * 2;
                        const revealed = !scrubCards || originalIndex < revealedCount;
                        return (
                          <motion.div
                            key={`${mode}-left-${i}`}
                            initial={reduced ? false : { opacity: 0, y: 28, scale: 0.96 }}
                            animate={reduced ? false : revealed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.96 }}
                            transition={SPRING_SOFT}
                            style={{ pointerEvents: revealed ? undefined : "none" }}
                          >
                            <StatCard value={item.value} label={item.label} counted={revealed} accent={'accent' in item ? item.accent : false} align="left" />
                          </motion.div>
                        );
                      })}
                    </div>
                    <div className="flex flex-col gap-10 items-end">
                      {highlights.filter((_, i) => i % 2 !== 0).map((item, i) => {
                        const originalIndex = i * 2 + 1;
                        const revealed = !scrubCards || originalIndex < revealedCount;
                        return (
                          <motion.div
                            key={`${mode}-right-${i}`}
                            initial={reduced ? false : { opacity: 0, y: 28, scale: 0.96 }}
                            animate={reduced ? false : revealed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.96 }}
                            transition={SPRING_SOFT}
                            style={{ pointerEvents: revealed ? undefined : "none" }}
                          >
                            <StatCard value={item.value} label={item.label} counted={revealed} accent={'accent' in item ? item.accent : false} align="right" />
                          </motion.div>
                        );
                      })}
                    </div>
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
