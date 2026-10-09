import { AnimatePresence, motion, animate } from "framer-motion";
import { memo, useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useCarouselActiveIndex } from "../hooks/useCarouselActiveIndex";
import { useCountUp } from "../hooks/useCountUp";
import { useApplePreview } from "../hooks/useApplePreview";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { SPRING_SOFT } from "../lib/motion";
import { HeroFlyProvider, useHeroFly } from "../context/HeroFlyContext";
import { HeroHighlights } from "./apple-preview/HeroHighlights";
import { heroHighlightsByMode, heroLedeByMode, } from "../data/liveContent";
import { HeroAtmosphere } from "./HeroAtmosphere";
import { LenovoTrustStrip } from "./LenovoTrustStrip";
import { DESKTOP_HERO_QUERY } from "../lib/heroDesktop";
import { useMode } from "./SectionHeader";
import { useScroll } from "../context/ScrollContext";
import { useTranslation } from "react-i18next";

const HERO_SPRING = { type: "spring" as const, stiffness: 100, damping: 20, mass: 0.85 };


const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0, delayChildren: 0, duration: 0 },
  },
};

const itemVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: HERO_SPRING },
};

function HeroStatsDots({
  containerRef,
  labels,
  activeIndex,
}: {
  labels: string[];
  containerRef: RefObject<HTMLDivElement | null>;
  
  activeIndex: number;
}) {
  const scrollTo = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const cell = container.querySelectorAll(".hero-stats__cell")[index] as HTMLElement | undefined;
    if (!cell) return;
    animate(container.scrollLeft, cell.offsetLeft - container.offsetLeft, {
      type: "spring",
      bounce: 0,
      duration: 0.5,
      onUpdate: (v) => {
        container.scrollLeft = v;
      }
    });
  };

  return (
    <div className="hero-stats-dots" role="tablist" aria-label="Hero metrics">
      {labels.map((label, index) => (
        <motion.button
          key={index}
          type="button"
          role="tab"
          aria-selected={index === activeIndex}
          aria-label={label}
          className={`hero-stats-dot${index === activeIndex ? " is-active" : ""}`}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scrollTo(index)}
        />
      ))}
    </div>
  );
}

function StatCard({ value, label, counted, accent, videoDriven, align = "center" }: { value: string; label: string; counted: boolean; accent?: boolean; videoDriven: boolean; align?: "left" | "center" | "right" }) {
  const durationRef = useRef<{ set: boolean; val: number }>({ set: false, val: 1400 });
  
  if (counted && !durationRef.current.set) {
    if (videoDriven) {
      if (typeof document !== "undefined") {
        const v = document.getElementById("hero-idle-video") as HTMLVideoElement | null;
        if (v && v.duration && !v.paused) {
          durationRef.current.val = Math.max(1400, (v.duration - v.currentTime) * 1000);
        }
      }
    } else {
      durationRef.current.val = 0;
    }
    durationRef.current.set = true;
  }

  const ref = useCountUp(value, counted, durationRef.current.val);
  const alignClass = align === "left" ? "items-start text-left" : align === "right" ? "items-end text-right" : "items-center text-center";
  const [, setEnded] = useState(false);
  // const isLight = mode === "growth";

  useEffect(() => {
    const onEnded = () => setEnded(true);
    window.addEventListener('hero-video-ended', onEnded);
    return () => window.removeEventListener('hero-video-ended', onEnded);
  }, []);

  // Cinematic stop-frame gesture:
  // Brightness flash and a sharp scale pop that settles down with a spring.
  return (
    <article className={`hero-stat-ghost flex flex-col justify-center h-full ${alignClass} ${accent ? 'is-accent' : ''}`}>
      <motion.div 
        className="hero-stat-ghost__value origin-center" 
        ref={ref as any}
        
      >
        {value}
      </motion.div>
      <motion.p 
        className="hero-stat-ghost__label"
        
      >
        {label}
      </motion.p>
    </article>
  );
}

const HeroPinnedScene = memo(function HeroPinnedScene() {
  const reduced = useReducedMotion();
  const { mode } = useMode();
  const { isActive } = useApplePreview();
  const { revealedCount, isVideoDriven } = useHeroFly();
  const statsScrollRef = useRef<HTMLDivElement>(null);
  const highlights = heroHighlightsByMode[mode];
    const translatedHighlights = highlights.map((h, i) => ({
      value: t(`heroHighlights.${mode}.${i}.value`, h.value),
      label: t(`heroHighlights.${mode}.${i}.label`, h.label),
      accent: (h as any).accent
    }));
    
  const activeStatIndex = useCarouselActiveIndex(statsScrollRef, highlights.length);
  const { scrollToY } = useScroll();
  const { t } = useTranslation();

  const localizedLines = [
    { text: t("hero.line1", "We see how") },
    { text: t("hero.line2", "stunning") },
    { text: t("hero.line3", "Your rise"), accent: true },
    { text: t("hero.line4", "to the top") },
    { text: t("hero.line5", "can be.") },
  ];

  const [pinScroll, setPinScroll] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(DESKTOP_HERO_QUERY).matches : false,
  );

  useEffect(() => {
    const onEnded = () => {
      // Delay auto-scroll slightly so user can absorb the final frame
      window.setTimeout(() => {
        // If the user hasn't scrolled manually (or barely scrolled)
        if (window.scrollY < 50) {
          const stage = document.querySelector('.hero-stage') as HTMLElement;
          const partners = document.querySelector('.partners-strip--home');
          
          if (stage && partners) {
            const startY = window.scrollY;
            const runway = Math.max(stage.offsetHeight - window.innerHeight, 1);
            
            // Where the Lenovo popup is fully visible
            const lenovoProgress = 0.65; 
            const targetY1 = stage.getBoundingClientRect().top + startY + (runway * lenovoProgress);
            const finalY = partners.getBoundingClientRect().top + startY + 23;
            
            // Calculate what percentage of the total scroll distance the Lenovo popup represents
            const totalDist = finalY - startY;
            const p = Math.max(0, Math.min(1, (targetY1 - startY) / totalDist));
            
            // Custom Plateau Easing (6 seconds total duration):
            // 0% -> 40% time: ease in-out to the Lenovo popup
            // 40% -> 70% time: extreme slow-mo (plateau) to read the badge
            // 70% -> 100% time: ease in-out to the end
            const plateauEase = (t: number) => {
              if (t < 0.4) {
                // Scale t to [0, 1], apply easeInOutSine, then scale to [0, p]
                const norm = t / 0.4;
                const ease = -(Math.cos(Math.PI * norm) - 1) / 2;
                return ease * p;
              } else if (t < 0.7) {
                // Micro-movement during the "pause" to keep it feeling alive (moves 2% of distance)
                const norm = (t - 0.4) / 0.3;
                return p + (norm * 0.02);
              } else {
                // Scale t to [0, 1], apply easeInOutSine, then scale from [p + 0.02, 1]
                const norm = (t - 0.7) / 0.3;
                const ease = -(Math.cos(Math.PI * norm) - 1) / 2;
                return (p + 0.02) + (ease * (1 - (p + 0.02)));
              }
            };

            // A single, continuous scroll command so the momentum is never broken by the browser
            scrollToY(finalY, { duration: 5.5, easing: Math.abs(p) > 0 ? plateauEase : undefined });
          } else if (partners) {
            const top = partners.getBoundingClientRect().top + window.scrollY;
            const coastingEase = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
            scrollToY(top + 23, { duration: 4.2, easing: coastingEase });
          }
        }
      }, 400); 
    };
    window.addEventListener('hero-video-ended', onEnded);
    return () => window.removeEventListener('hero-video-ended', onEnded);
  }, [scrollToY]);

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
      {/* 1. Terrain Layer (z-index: 0) - Goes under GlobalSnowfall */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="hero-fly-sticky relative flex flex-col overflow-hidden">
          <HeroAtmosphere />
        </div>
      </div>

      {/* 2. UI Layer (z-index: 50) - Goes over GlobalSnowfall */}
      <div className="absolute inset-0 z-[50] pointer-events-none">
        <div className="hero-fly-sticky relative flex flex-col overflow-hidden">
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
                {localizedLines.map((line, idx) => (
                  <motion.span
                    key={idx}
                    variants={reduced ? undefined : itemVariants}
                    className="block"
                    onAnimationComplete={
                      "accent" in line && line.accent
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
                  className="hero-lede mt-5 max-w-xl text-balance text-base leading-relaxed text-fg font-medium sm:text-lg"
                  initial={false}
                  animate={false}
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
        <div className="hero-stats-rail page-container mt-8 lg:mt-0">
          <div className="w-full grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 xl:gap-14">
            <div className="hidden lg:block" />
            <div className="hero-stats-wrap flex flex-col w-full pointer-events-auto">
              <p className="section-label hero-fly-label text-left w-full block mb-6">UPRAISER · Charting the Ascent</p>
              <div ref={setStatsRef} className="hero-stats overflow-visible px-0 pb-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={mode}
                    className="hero-stats__track grid grid-cols-2 gap-x-2 gap-y-4 md:gap-x-4 md:gap-y-6 lg:gap-y-10 w-full"
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {translatedHighlights.map((item, i) => {
                      const revealed = !scrubCards || i < revealedCount;
                      const isLeft = i % 2 === 0;
                      return (
                        <motion.div
                          key={`${mode}-${i}`}
                          className={`hero-stats__cell w-full flex ${isLeft ? 'justify-self-start' : 'justify-self-end'}`}
                          initial={reduced ? false : { opacity: 0, y: 28, scale: 0.96 }}
                          animate={reduced ? false : revealed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.96 }}
                          transition={SPRING_SOFT}
                          style={{ pointerEvents: revealed ? undefined : "none" }}
                        >
                          <div className="w-full">
                            <StatCard 
                              value={item.value} 
                              label={item.label} 
                              counted={revealed} 
                              accent={Boolean((item as any).accent)} 
                              align={isLeft ? "left" : "right"} 
                              videoDriven={isVideoDriven} 
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
              <HeroStatsDots containerRef={statsScrollRef} labels={translatedHighlights.map(h => h.label)} activeIndex={activeStatIndex} />
            </div>
          </div>
        </div>

        {/* Flush to sticky bottom — same frame as the mountain, not a post-hero gap */}
        <div className="pointer-events-auto">
          <LenovoTrustStrip />
        </div>
      </div>
      </div>
    </section>
  );
});

/**
 * Home Hero — big lower headline rides the ascent; ghost stats reveal on scroll.
 */
export const Hero = memo(function Hero() {
  return (
    <HeroFlyProvider>
      <HeroPinnedScene />
    </HeroFlyProvider>
  );
});
