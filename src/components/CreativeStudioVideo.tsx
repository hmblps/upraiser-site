import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface CreativeStudioVideoProps {
  videoSrc: string;
  theme: "light" | "dark";
}

interface StudioCategory {
  key: string;
  titleKey: string;
  defaultTitle: string;
  tags: string[];
  items: Array<{ key: string; defaultText: string }>;
}

const STUDIO_CATEGORIES: StudioCategory[] = [
  {
    key: "immersive",
    titleKey: "creativeStudio.categories.immersive.title",
    defaultTitle: "Immersive & High-Tech",
    tags: ["3D & CGI", "Motion CGI", "Virtual Avatars"],
    items: [
      { key: "creativeStudio.categories.immersive.items.0", defaultText: "3D Graphics & CGI" },
      { key: "creativeStudio.categories.immersive.items.1", defaultText: "Motion Design & Animation" },
      { key: "creativeStudio.categories.immersive.items.2", defaultText: "AI Brand Ambassadors & Virtual Avatars" },
    ],
  },
  {
    key: "content",
    titleKey: "creativeStudio.categories.content.title",
    defaultTitle: "Content Production",
    tags: ["Photo & Video", "Creator-Led", "Playable"],
    items: [
      { key: "creativeStudio.categories.content.items.0", defaultText: "Full-Scale Photo & Video Production" },
      { key: "creativeStudio.categories.content.items.1", defaultText: "Creator-Led Digital Content" },
      { key: "creativeStudio.categories.content.items.2", defaultText: "High-Converting Video & Digital Banners" },
      { key: "creativeStudio.categories.content.items.3", defaultText: "Playable Rich Media" },
    ],
  },
  {
    key: "engineering",
    titleKey: "creativeStudio.categories.engineering.title",
    defaultTitle: "Digital & Tech Engineering",
    tags: ["Web Dev", "Mobile Apps", "Cloud Arch"],
    items: [
      { key: "creativeStudio.categories.engineering.items.0", defaultText: "End-to-End Web Development" },
      { key: "creativeStudio.categories.engineering.items.1", defaultText: "Mobile Application Development" },
      { key: "creativeStudio.categories.engineering.items.2", defaultText: "Cloud Infrastructure & System Architecture" },
    ],
  },
];

// Emil Kowalski Staggered Spring Cascade Variants (slower, deliberate, luxurious reveal)
const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.12,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 20,
      mass: 1.1,
    },
  },
};

export function CreativeStudioVideo({ videoSrc, theme }: CreativeStudioVideoProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const altitudeRef = useRef<HTMLSpanElement>(null);

  const [phase, setPhase] = useState<"climbing" | "summit">("climbing");
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [goldenVisible, setGoldenVisible] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const phaseRef = useRef<"climbing" | "summit">("climbing");
  const subtitleVisibleRef = useRef(false);
  const goldenVisibleRef = useRef(false);

  // Exact timestamp when camera cuts and climber is viewed from behind on the massive wall:
  // light-loop.mp4: 4.75s (cut & settle on wide wall with climber seen from behind)
  // dark-loop.mp4: 6.00s (headlamp strikes wall with climber seen from behind)
  const goldenStartTime = theme === "light" ? 4.75 : 6.0;

  // Subtitle reveal timing: delayed until top-down climb climax (~3.8s in light, ~5.0s in dark)
  const subtitleStartTime = theme === "light" ? 3.8 : 5.0;

  // Subtle imperceptible deceleration on the wide mountain wall:
  // 1.0x full speed everywhere (especially whip zoom 4.60-4.88s) to eliminate judder,
  // then gentle 0.82x on wide wall approach:
  const decelStartTime = theme === "light" ? 4.88 : 6.5;
  const targetSlowRate = theme === "light" ? 0.82 : 0.85;

  // Natural pause on reaching the mountain wall / summit:
  // light-loop.mp4 (6.01s): ~5.5s reaches full wide mountain wall
  // dark-loop.mp4 (11.01s): ~10.6s reaches top of the ice wall
  const pauseTime = theme === "light" ? 5.5 : 10.6;

  // Reset when video source changes
  useEffect(() => {
    phaseRef.current = "climbing";
    setPhase("climbing");
    subtitleVisibleRef.current = false;
    setSubtitleVisible(false);
    goldenVisibleRef.current = false;
    setGoldenVisible(false);

    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.playbackRate = 1.0;
      v.play().catch(() => {});
    }
  }, [videoSrc]);

  // Precision 60/120 FPS rAF loop for telemetry updates, subtitle reveal & frame-perfect transitions
  useEffect(() => {
    let rafId: number;
    const check = () => {
      const v = videoRef.current;
      if (v && !v.paused) {
        const cur = v.currentTime;

        // Update telemetry capsule progress & altitude smoothly without React re-renders
        const pct = Math.min(100, Math.max(0, (cur / pauseTime) * 100));
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${pct}%`;
        }
        if (altitudeRef.current) {
          const alt = Math.round(720 + (pct / 100) * 170);
          altitudeRef.current.textContent = `${alt}M`;
        }

        // Subtitle reveal timed to video narrative climax (replaces arbitrary early 800ms timer)
        if (cur >= subtitleStartTime && !subtitleVisibleRef.current) {
          subtitleVisibleRef.current = true;
          setSubtitleVisible(true);
        }

        // Bloom golden filter strictly when climber is seen from behind
        if (cur >= goldenStartTime && !goldenVisibleRef.current) {
          goldenVisibleRef.current = true;
          setGoldenVisible(true);
        } else if (cur < goldenStartTime && goldenVisibleRef.current) {
          goldenVisibleRef.current = false;
          setGoldenVisible(false);
        }

        // Subtle, imperceptible video deceleration on the wide mountain wall (strictly 1.0x prior)
        if (cur >= decelStartTime && cur < pauseTime) {
          if (v.playbackRate !== targetSlowRate) {
            v.playbackRate = targetSlowRate;
          }
        } else if (cur < decelStartTime && v.playbackRate !== 1.0) {
          v.playbackRate = 1.0;
        }

        // Pause on summit wall
        if (cur >= pauseTime && phaseRef.current === "climbing") {
          v.pause();
          phaseRef.current = "summit";
          setPhase("summit");
          subtitleVisibleRef.current = true;
          setSubtitleVisible(true);
          if (!goldenVisibleRef.current) {
            goldenVisibleRef.current = true;
            setGoldenVisible(true);
          }
        }
      }
      rafId = requestAnimationFrame(check);
    };

    rafId = requestAnimationFrame(check);
    return () => cancelAnimationFrame(rafId);
  }, [decelStartTime, goldenStartTime, pauseTime, subtitleStartTime, targetSlowRate]);

  const handleVideoEnded = useCallback(() => {
    const v = videoRef.current;
    if (v) v.pause();
    phaseRef.current = "summit";
    setPhase("summit");
    subtitleVisibleRef.current = true;
    setSubtitleVisible(true);
    goldenVisibleRef.current = true;
    setGoldenVisible(true);
  }, []);

  const handleReplay = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.playbackRate = 1.0;
    phaseRef.current = "climbing";
    setPhase("climbing");
    subtitleVisibleRef.current = false;
    setSubtitleVisible(false);
    goldenVisibleRef.current = false;
    setGoldenVisible(false);
    setReplayKey((k) => k + 1);
    v.play().catch(() => {});
  }, []);

  const handleSkipToSummit = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (phaseRef.current === "summit") return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = pauseTime;
    v.pause();
    phaseRef.current = "summit";
    setPhase("summit");
    subtitleVisibleRef.current = true;
    setSubtitleVisible(true);
    goldenVisibleRef.current = true;
    setGoldenVisible(true);
  }, [pauseTime]);

  // Hero stat color: light mode uses climbing red (#cb310d) from Hero stat label; dark mode uses gold accent
  const kickerColor =
    theme === "light" ? "var(--hero-light-stat-label, #cb310d)" : "var(--theme-accent, #eab308)";

  return (
    <div
      onClick={phase === "climbing" ? handleSkipToSummit : undefined}
      className={`relative w-full h-[100dvh] overflow-hidden flex flex-col items-center justify-center select-none ${
        phase === "climbing" ? "cursor-pointer" : ""
      }`}
      style={{ background: "var(--theme-bg)" }}
    >
      {/* Video with Theme-Specific Filters (natural playback, zero artificial sepia) */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnded}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          theme === "light"
            ? "opacity-95 contrast-[1.10] saturate-[1.05]"
            : "opacity-100 contrast-[1.15] saturate-[0.8]"
        }`}
        style={{
          filter:
            theme === "light"
              ? "contrast(1.08) saturate(1.04) brightness(1.04)"
              : "contrast(1.1) saturate(0.95) brightness(1.0)",
        }}
      />

      {/* Atmosphere / Color Grade Overlay */}
      <div
        className={`absolute inset-0 pointer-events-none mix-blend-overlay ${
          theme === "light"
            ? "bg-gradient-to-b from-[#e0eaf5]/40 to-[#c8d6e5]/40"
            : "bg-gradient-to-b from-[#111a24]/40 to-[#080d14]/60"
        }`}
      />

      {/* Cinematic Golden Ascent Flood Filter — crawls in smoothly strictly on climber back-view shot */}
      <AnimatePresence>
        {goldenVisible && (
          <motion.div
            key={`golden-filter-${replayKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none z-15 overflow-hidden"
          >
            {/* Layer A: Ambient Warm Champagne Illumination */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2.0, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0"
              style={{
                mixBlendMode: "color-dodge",
                background:
                  theme === "dark"
                    ? "radial-gradient(ellipse 100% 70% at 50% 100%, rgba(234, 179, 8, 0.10) 0%, rgba(180, 83, 9, 0.04) 50%, transparent 85%)"
                    : "radial-gradient(ellipse 110% 80% at 50% 100%, rgba(245, 158, 11, 0.13) 0%, rgba(217, 119, 6, 0.05) 50%, transparent 85%)",
              }}
            />

            {/* Layer B: Cinematic Golden Sunrise Wave Crawling Upwards */}
            <motion.div
              initial={{ y: "45%", opacity: 0 }}
              animate={{ y: "-6%", opacity: 1 }}
              transition={{ duration: 3.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 -bottom-24 h-[125%] pointer-events-none"
              style={{ mixBlendMode: "screen" }}
            >
              <div
                className="w-full h-full"
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(to top, rgba(234, 179, 8, 0.15) 0%, rgba(217, 119, 6, 0.08) 35%, rgba(180, 83, 9, 0.02) 65%, transparent 100%)"
                      : "linear-gradient(to top, rgba(234, 179, 8, 0.17) 0%, rgba(245, 158, 11, 0.09) 35%, rgba(217, 119, 6, 0.03) 65%, transparent 100%)",
                }}
              />
              <div
                className="absolute inset-x-0 top-0 h-48 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 100% 60% at 50% 100%, rgba(254, 240, 138, 0.16) 0%, rgba(234, 179, 8, 0.06) 45%, transparent 80%)",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heavy Local Grain to ensure continuity with Hero */}
      <div className="site-grain absolute inset-0 z-10 opacity-60 pointer-events-none" />

      {/* Centered cinematic contrast vignette for razor-sharp typography */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            theme === "dark"
              ? "radial-gradient(ellipse 85% 65% at 50% 35%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)"
              : "radial-gradient(ellipse 85% 65% at 50% 35%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.10) 60%, transparent 100%)",
        }}
      />

      {/* Subtle theme-aware contrast overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          theme === "dark" ? "bg-black/55" : "bg-black/35"
        }`}
        style={{
          opacity: phase === "summit" ? 0.70 : 0.40,
        }}
      />

      {/* Main Content Area: safely cleared below top header island (pt-24 sm:pt-28), scrollable if needed */}
      <div className="relative z-20 w-full h-[100dvh] overflow-y-auto overscroll-contain site-scrollbar px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-24 pb-28">
        <div className="min-h-full w-full max-w-6xl mx-auto flex flex-col items-center justify-start md:justify-center">
          
          {/* Header Typography with Emil Kowalski Shared Layout Spring Physics */}
          <motion.div
            layout
            className="text-center max-w-4xl mx-auto shrink-0 relative px-4"
            transition={{ type: "spring", bounce: 0.12, duration: 0.7 }}
          >
            {/* Kicker label using Hero stat color (#cb310d in light, gold in dark) */}
            <motion.p
              layout
              className="font-bold tracking-[0.16em] uppercase text-xs sm:text-sm mb-1 sm:mb-2 font-sans"
              style={{ color: kickerColor }}
            >
              {t("creativeStudio.label", "UPRAISER · FULL-CYCLE STUDIO")}
            </motion.p>

            {/* Slightly Enlarged 3-Row Main Title (Clean, razor-sharp editorial typography without cheap fuzzy text halos) */}
            <motion.h1
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.12, duration: 0.8 }}
              className={`font-display font-bold text-white tracking-tight uppercase leading-[1.08] text-balance drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] ${
                phase === "summit"
                  ? "text-xl sm:text-2xl md:text-3xl lg:text-4xl"
                  : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
              }`}
            >
              <span className="block">Full-Cycle Digital</span>
              <span className="block">Creative & Tech</span>
              <span className="block">Studio</span>
            </motion.h1>

            {/* Subtitle: Silky Optical Lens Dissolve (Appears at 3.8s, eliminating abrupt jump) */}
            <AnimatePresence>
              {subtitleVisible && (
                <motion.div
                  layout
                  initial={{ opacity: 0, filter: "blur(6px)", y: 14 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.2 } }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`font-sans text-white/95 max-w-3xl mx-auto font-medium text-balance drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] ${
                    phase === "summit"
                      ? "mt-2 sm:mt-3 text-xs sm:text-sm md:text-base leading-snug"
                      : "mt-4 sm:mt-5 text-sm sm:text-base md:text-lg lg:text-xl leading-snug sm:leading-relaxed"
                  }`}
                >
                  <span className="block">Driving digital growth:</span>
                  <span className="block">from immersive 3D and AI concepts</span>
                  <span className="block">to high-performance content and enterprise tech.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Phase 2: Full Capabilities Grid using Emil Kowalski Staggered Spring Cascade & Transparent Glass Cards */}
          <AnimatePresence>
            {phase === "summit" && (
              <motion.div
                variants={gridVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="w-full mt-4 sm:mt-6 lg:mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch"
              >
                {STUDIO_CATEGORIES.map((cat) => (
                  <motion.article
                    key={cat.key}
                    variants={cardVariants}
                    whileHover={{
                      y: -6,
                      transition: { type: "spring", stiffness: 400, damping: 25 },
                    }}
                    whileTap={{ scale: 0.985 }}
                    className="case-preview-card card-lift group flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-bg-card/35 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:border-accent/45 hover:bg-bg-card/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                    style={
                      {
                        "--case-accent": "var(--theme-accent)",
                        "--case-surface": "var(--theme-bg-card)",
                      } as React.CSSProperties
                    }
                  >
                    {/* Case Card Header matching CaseBrandHeader */}
                    <div className="case-brand-header relative overflow-hidden border-b border-border/30 p-5 sm:p-6 shrink-0">
                      <div className="case-brand-header__wash" aria-hidden />
                      <div className="relative z-10">
                        <h2 className="case-brand-header__title text-base sm:text-lg lg:text-xl font-bold tracking-tight text-fg">
                          {t(cat.titleKey, cat.defaultTitle)}
                        </h2>
                      </div>

                      {/* Domain / format pills */}
                      <div className="case-brand-header__channels mt-3 flex flex-wrap gap-1.5">
                        {cat.tags.map((tag) => (
                          <span key={tag} className="case-brand-channel">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Case Card Body matching card-pad */}
                    <div className="card-pad p-5 sm:p-6 flex flex-col flex-1 justify-between gap-5">
                      <ul className="space-y-3 sm:space-y-3.5 my-auto">
                        {cat.items.map((item) => (
                          <li
                            key={item.key}
                            className="flex items-start gap-3 text-xs sm:text-sm text-fg/85 leading-relaxed group/item"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-accent/80 shrink-0 mt-2 transition-transform duration-200 group-hover/item:scale-125" />
                            <span className="group-hover/item:text-fg transition-colors duration-200 font-medium">
                              {t(item.key, item.defaultText)}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Clean baseline: no "Discuss Project" CTA, indicates active studio development */}
                      <div className="pt-4 mt-auto border-t border-border/30 flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-fg-muted font-sans">
                          {t("creativeStudio.cardFooterLabel", "Creative & Tech")}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[9px] tracking-wider uppercase font-semibold text-accent/90 px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 select-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          {t("creativeStudio.inDevelopment", "In Development")}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Under Columns: Clean "To be featured soon" announcement with generous breathing room */}
          {phase === "summit" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 sm:mt-8 pb-20 sm:pb-24 flex flex-col items-center justify-center shrink-0"
            >
              <p className="font-sans text-accent tracking-[0.22em] uppercase text-xs sm:text-sm font-bold text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                {t("creativeStudio.featuredSoon", "To be featured soon")}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Dynamic Island: Header-styled Telemetry Capsule that fluidly morphs into Repeat Climb Button */}
      <div
        className="fixed bottom-6 sm:bottom-8 inset-x-0 z-30 pointer-events-none flex items-center justify-center px-4"
        style={{ bottom: "max(1.5rem, calc(1.25rem + env(safe-area-inset-bottom, 0px)))" }}
      >
        <motion.button
          layout
          type="button"
          onClick={phase === "climbing" ? handleSkipToSummit : handleReplay}
          whileHover={reduced ? undefined : { scale: 1.05 }}
          whileTap={reduced ? undefined : { scale: 0.95 }}
          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
          className="pointer-events-auto min-h-[44px] flex items-center bg-bg-elevated/75 backdrop-blur-xl rounded-full border border-border/40 shadow-lg px-4 py-2 gap-2.5 text-[10px] sm:text-[11px] font-bold tracking-wide uppercase font-sans select-none cursor-pointer text-fg-muted hover:text-fg transition-colors group"
          aria-label={
            phase === "climbing"
              ? t("creativeStudio.skipToSummit", "View Capabilities")
              : t("creativeStudio.replayClimb", "Repeat Climb")
          }
          title={
            phase === "climbing"
              ? t("creativeStudio.skipToSummit", "View Capabilities")
              : t("creativeStudio.replayClimb", "Repeat Climb")
          }
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {phase === "climbing" ? (
              <motion.div
                key="telemetry-inner"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
                <span className="text-fg/90 whitespace-nowrap">
                  PITCH 04 · ASCENT · <span ref={altitudeRef}>720M</span>
                </span>
                <div className="w-12 sm:w-16 h-1 rounded-full bg-border/50 overflow-hidden shrink-0">
                  <div
                    ref={progressBarRef}
                    className="h-full bg-accent rounded-full transition-all duration-75"
                    style={{ width: "0%" }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="replay-inner"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 text-fg group-hover:text-accent transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5 text-accent shrink-0 transition-transform duration-300 group-hover:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.4}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="whitespace-nowrap">{t("creativeStudio.replayClimb", "Repeat Climb")}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
