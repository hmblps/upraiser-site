import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useCarouselActiveIndex } from "../hooks/useCarouselActiveIndex";
import { useCountUp } from "../hooks/useCountUp";
import { useApplePreview } from "../hooks/useApplePreview";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { SPRING_SOFT } from "../lib/motion";
import { HeroFlyProvider, useHeroFly } from "../context/HeroFlyContext";
import { Magnetic } from "./motion-preview/Magnetic";
import { HeroHighlights } from "./apple-preview/HeroHighlights";
import { heroFounded, heroHighlightsByMode, heroLede, primaryCta } from "../data/liveContent";
import { HeroAtmosphere } from "./HeroAtmosphere";
import { HoverTilt } from "./HoverTilt";
import { ScrollLink } from "./ScrollLink";
import { DESKTOP_HERO_QUERY } from "../lib/heroDesktop";
import { useMode } from "./SectionHeader";

const HERO_SPRING = { type: "spring" as const, stiffness: 100, damping: 20, mass: 0.85 };

/** Sticky-scroll progress when each stat card reveals + counts up (paced for longer runway). */
const CARD_REVEAL_AT = [0.18, 0.38, 0.58, 0.78] as const;

const headlineLines = [
  { text: "We see how stunning", accent: false },
  { text: "Your rise", accent: true, suffix: " to the top" },
  { text: "can be.", accent: false },
] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.22 },
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

function StatCard({ value, label, counted }: { value: string; label: string; counted: boolean }) {
  const display = useCountUp(value, counted);

  return (
    <HoverTilt className="tilt-surface hero-stat-card h-full rounded-2xl" maxTilt={6} spotlight={false}>
      <article className="card-pad h-full">
        <div className="stat-value">{display}</div>
        <p className="stat-label text-muted-light">{label}</p>
      </article>
    </HoverTilt>
  );
}

function HeroPinnedScene() {
  const reduced = useReducedMotion();
  const { mode } = useMode();
  const { isActive } = useApplePreview();
  const { progress } = useHeroFly();
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
    <section
      className="hero-stage hero-stage--terrain hero-stage--fly relative"
      data-hero-fly={progress.toFixed(3)}
    >
      <div className="hero-fly-sticky relative flex flex-col overflow-hidden pb-10 lg:pb-14">
        <HeroAtmosphere />

        <div className="hero-content relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="hero-layout grid items-end gap-11 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
            <motion.div
              className="hero-copy"
              initial={reduced ? false : "hidden"}
              animate="visible"
              variants={reduced ? undefined : containerVariants}
            >
              <motion.p variants={reduced ? undefined : itemVariants} className="section-label mb-5">
                UPRAISER · Charting the Ascent
              </motion.p>

              <h1 className="hero-title max-w-[12ch] text-[2.5rem] font-extrabold leading-none tracking-tighter sm:max-w-[12.5ch] sm:text-4xl lg:max-w-[12ch] lg:text-[3.75rem]">
                <motion.span variants={reduced ? undefined : itemVariants} className="block">
                  {headlineLines[0].text}
                </motion.span>
                <motion.span variants={reduced ? undefined : itemVariants} className="block">
                  <span className="hero-title-accent">{headlineLines[1].text}</span>
                  {headlineLines[1].suffix}
                </motion.span>
                <motion.span variants={reduced ? undefined : itemVariants} className="block">
                  {headlineLines[2].text}
                </motion.span>
              </h1>

              <motion.p
                variants={reduced ? undefined : itemVariants}
                className="hero-lede mt-8 max-w-lg text-[0.9375rem] leading-[1.65] text-muted-light sm:text-base"
              >
                {heroLede}
              </motion.p>

              <motion.p
                variants={reduced ? undefined : itemVariants}
                className="hero-founded mt-3 text-[0.8125rem] font-medium tracking-wide text-muted-light sm:text-sm"
              >
                {heroFounded}
              </motion.p>

              <motion.div variants={reduced ? undefined : itemVariants} className="mt-9 flex flex-wrap gap-3.5">
                <Magnetic>
                  <ScrollLink
                    href={primaryCta.href}
                    data-cursor="cta"
                    className="btn-caps inline-block rounded-full bg-orange px-7 py-3.5 text-sm font-semibold text-on-accent hover:bg-orange-light hover:shadow-[0_10px_28px_color-mix(in_srgb,var(--theme-accent)_28%,transparent)]"
                  >
                    {primaryCta.label}
                  </ScrollLink>
                </Magnetic>
                <Magnetic strength={0.22}>
                  <ScrollLink
                    href="/cases"
                    className="btn-caps btn-secondary inline-block rounded-full px-7 py-3.5 text-sm font-semibold hover:border-orange/35"
                  >
                    View Case Studies
                  </ScrollLink>
                </Magnetic>
              </motion.div>

              {isActive("highlights") ? <HeroHighlights /> : null}
            </motion.div>

            <div className="hero-stats-wrap">
              <div
                ref={setStatsRef}
                className="hero-stats -mx-6 overflow-x-auto px-6 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
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
                      const at = CARD_REVEAL_AT[index] ?? 0.7;
                      const revealed = !scrubCards || progress >= at;

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
                          <StatCard value={item.value} label={item.label} counted={revealed} />
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
      </div>
    </section>
  );
}

/**
 * Home Hero — slogans stay put; sticky scroll reveals stat cards one-by-one with count-up.
 */
export function Hero() {
  return (
    <HeroFlyProvider>
      <HeroPinnedScene />
    </HeroFlyProvider>
  );
}
