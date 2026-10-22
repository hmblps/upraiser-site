import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

export function CreativeStudioVideo({ videoSrc, theme }: CreativeStudioVideoProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const altitudeRef = useRef<HTMLSpanElement>(null);

  const [phase, setPhase] = useState<"climbing" | "summit">("climbing");
  const [goldenVisible, setGoldenVisible] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const phaseRef = useRef<"climbing" | "summit">("climbing");
  const goldenVisibleRef = useRef(false);

  // Exact timestamp when camera cuts and climber is viewed from behind on the massive wall:
  // light-loop.mp4: 4.75s (cut & settle on wide wall with climber seen from behind)
  // dark-loop.mp4: 6.00s (headlamp strikes wall with climber seen from behind)
  const goldenStartTime = theme === "light" ? 4.75 : 6.0;

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
    goldenVisibleRef.current = false;
    setGoldenVisible(false);

    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.playbackRate = 1.0;
      v.play().catch(() => {});
    }
  }, [videoSrc]);

  // Precision 60/120 FPS rAF loop for telemetry updates & frame-perfect transitions
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
  }, [decelStartTime, goldenStartTime, pauseTime, targetSlowRate]);

  const handleVideoEnded = useCallback(() => {
    const v = videoRef.current;
    if (v) v.pause();
    phaseRef.current = "summit";
    setPhase("summit");
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
    goldenVisibleRef.current = true;
    setGoldenVisible(true);
  }, [pauseTime]);

  return (
    <div
      onClick={phase === "climbing" ? handleSkipToSummit : undefined}
      className={`relative w-full h-[100dvh] overflow-hidden flex flex-col select-none ${
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

      {/* Cinematic Golden Ascent Flood Filter — subtle ambient warm illumination strictly on climber back-view shot */}
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
            {/* Ambient Warm Champagne Illumination (no moving scanlines/stripes) */}
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

      {/* Main Content Area: Hugs the left rail exactly like Hero (--hero-rail-left) */}
      <div
        className="relative z-20 w-full h-[100dvh] overflow-y-auto overscroll-contain site-scrollbar pt-20 sm:pt-24 lg:pt-28 pb-28"
        style={{
          paddingLeft: "var(--hero-rail-left, clamp(1.25rem, 4vw, 3rem))",
          paddingRight: "var(--hero-rail-left, clamp(1.25rem, 4vw, 3rem))",
        }}
      >
        <div
          className="min-h-full w-full flex flex-col items-center justify-center relative"
          style={{ zoom: 0.8 }}
        >
          {/* Phase 1: Header Typography — Visible strictly during climbing video, fades out when climb completes */}
          <AnimatePresence>
            {phase === "climbing" && (
              <motion.div
                key="climbing-header"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeOut" } }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute top-0 left-0 text-left w-full max-w-3xl lg:max-w-4xl pointer-events-none"
              >
                {/* Monumental Title: Exact font, size, line-height & ladder structure as Hero reference */}
                <h1 className="hero-title hero-title--hero font-extrabold tracking-tighter !text-white text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] text-left">
                  <span className="block">We build the</span>
                  <span className="block">
                    <span className="hero-title-accent">Art & Code</span>
                  </span>
                  <span className="block">Behind the</span>
                  <span className="block">Ascent.</span>
                </h1>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 2: Full Capabilities Grid centered in the middle of the viewport */}
          <AnimatePresence>
            {phase === "summit" && (
              <div
                className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch max-w-6xl xl:max-w-7xl mx-auto my-auto"
              >
                {STUDIO_CATEGORIES.map((cat, index) => (
                  <motion.article
                    key={cat.key}
                    initial={{ opacity: 0, y: 48, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 24, scale: 0.96, transition: { duration: 0.2 } }}
                    transition={{
                      delay: 0.35 + index * 0.40, // Distinct 400ms sequential cadence: Card 1 at 0.35s, Card 2 at 0.75s, Card 3 at 1.15s
                      duration: 0.95,
                      ease: [0.16, 1, 0.3, 1], // Emil Kowalski Apple-like fluid deceleration curve
                    }}
                    whileHover={
                      reduced
                        ? undefined
                        : {
                            y: -6,
                            transition: { type: "spring", stiffness: 400, damping: 25 },
                          }
                    }
                    whileTap={{ scale: 0.985 }}
                    className="case-preview-card group flex flex-col overflow-hidden rounded-2xl border border-white/12 dark:border-white/10 bg-bg-card/18 sm:bg-bg-card/22 backdrop-blur-2xl shadow-2xl transition-[border-color,background-color,box-shadow] duration-300 hover:border-accent/40 hover:bg-bg-card/28 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]"
                    style={
                      {
                        "--case-accent": "var(--theme-accent)",
                        "--case-surface": "var(--theme-bg-card)",
                      } as React.CSSProperties
                    }
                  >
                    {/* Case Card Header matching CaseBrandHeader */}
                    <div className="case-brand-header relative overflow-hidden border-b border-white/10 dark:border-white/10 p-5 sm:p-6 shrink-0">
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
                      <div className="pt-4 mt-auto border-t border-white/10 dark:border-white/10 flex items-center justify-between">
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
              </div>
            )}
          </AnimatePresence>


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
