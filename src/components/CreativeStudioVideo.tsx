import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
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
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const momentumLockUntilRef = useRef<number>(0);

  const [phase, setPhase] = useState<"climbing" | "summit">("climbing");
  const [goldenVisible, setGoldenVisible] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const phaseRef = useRef<"climbing" | "summit">("climbing");
  const goldenVisibleRef = useRef(false);

  // Exact timestamp when camera cuts and climber is viewed from behind on the massive wall:
  // light-loop.mp4: 4.25s (cut & settle on wide wall with climber seen from behind)
  // dark-loop.mp4: 6.00s (headlamp strikes wall with climber seen from behind)
  const goldenStartTime = theme === "light" ? 4.25 : 6.0;

  // Subtle imperceptible deceleration on the wide mountain wall:
  // 1.0x full speed everywhere to eliminate judder, then gentle deceleration on approach:
  const decelStartTime = theme === "light" ? 4.4 : 6.5;
  const targetSlowRate = theme === "light" ? 0.82 : 0.85;

  // Natural pause on reaching the mountain wall / summit:
  // light-loop.mp4: 5.0s (climbs 2.5m at 0.5m/s from 98.0m to exactly 100.5m)
  // dark-loop.mp4: 10.6s (climbs 1.0m from 899.0m to 900.0m)
  const pauseTime = theme === "light" ? 5.0 : 10.6;

  // Reset when video source changes
  useEffect(() => {
    phaseRef.current = "climbing";
    setPhase("climbing");
    goldenVisibleRef.current = false;
    setGoldenVisible(false);

    if (altitudeRef.current) {
      altitudeRef.current.textContent = theme === "light" ? "98.0M" : "899.0M";
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.width = "0%";
    }

    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.playbackRate = 1.0;
      v.play().catch(() => {});
    }
  }, [videoSrc, theme]);

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
          if (theme === "light") {
            // Light theme: 0.5m/s, starts at 98.0m, finishes on 100.5m
            const alt = Math.min(100.5, 98.0 + (cur / pauseTime) * 2.5).toFixed(1);
            altitudeRef.current.textContent = `${alt}M`;
          } else {
            // Dark theme: 1m over the whole climb, 899.0m -> 900.0m
            const alt = Math.min(900.0, 899.0 + (cur / pauseTime) * 1.0).toFixed(1);
            altitudeRef.current.textContent = `${alt}M`;
          }
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
          if (altitudeRef.current) {
            altitudeRef.current.textContent = theme === "light" ? "100.5M" : "900.0M";
          }
          if (progressBarRef.current) {
            progressBarRef.current.style.width = "100%";
          }
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
  }, [decelStartTime, goldenStartTime, pauseTime, targetSlowRate, theme]);

  const handleVideoEnded = useCallback(() => {
    const v = videoRef.current;
    if (v) v.pause();
    phaseRef.current = "summit";
    setPhase("summit");
    goldenVisibleRef.current = true;
    setGoldenVisible(true);
    if (altitudeRef.current) {
      altitudeRef.current.textContent = theme === "light" ? "100.5M" : "900.0M";
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.width = "100%";
    }
  }, [theme]);

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
    if (altitudeRef.current) {
      altitudeRef.current.textContent = theme === "light" ? "98.0M" : "899.0M";
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.width = "0%";
    }
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    setReplayKey((k) => k + 1);
    v.play().catch(() => {});
  }, [theme]);

  const handleSkipToSummit = useCallback((e?: React.MouseEvent | React.SyntheticEvent) => {
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
    if (altitudeRef.current) {
      altitudeRef.current.textContent = theme === "light" ? "100.5M" : "900.0M";
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.width = "100%";
    }
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pauseTime, theme]);

  // Quick scroll-to-advance gesture during climbing phase (wheel, touch swipe down, arrow keys)
  // Non-passive with preventDefault() and inertia absorption so the page NEVER descends to the footer
  useEffect(() => {
    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      // Absorb residual momentum wheel events after skipping to summit
      if (Date.now() < momentumLockUntilRef.current) {
        e.preventDefault();
        e.stopPropagation();
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }

      if (phaseRef.current === "climbing") {
        if (e.deltaY > 8) {
          e.preventDefault();
          e.stopPropagation();
          momentumLockUntilRef.current = Date.now() + 750;
          handleSkipToSummit();
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches?.[0]) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches?.[0]) return;
      const currentY = e.touches[0].clientY;
      const dy = touchStartY - currentY;

      if (Date.now() < momentumLockUntilRef.current) {
        e.preventDefault();
        e.stopPropagation();
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }

      if (phaseRef.current === "climbing") {
        // User swiping up to scroll down
        if (dy > 20) {
          e.preventDefault();
          e.stopPropagation();
          momentumLockUntilRef.current = Date.now() + 750;
          handleSkipToSummit();
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (phaseRef.current === "climbing") {
        if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          handleSkipToSummit();
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSkipToSummit]);

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

      {/* Main Content Area */}
      <div
        ref={contentContainerRef}
        className="relative z-20 w-full h-[100dvh] overflow-y-auto overscroll-contain site-scrollbar pt-14 sm:pt-16 lg:pt-20 pb-36 sm:pb-40"
        style={{
          paddingLeft: "var(--hero-rail-left, clamp(1.25rem, 4vw, 3rem))",
          paddingRight: "var(--hero-rail-left, clamp(1.25rem, 4vw, 3rem))",
        }}
      >
        <div
          className="min-h-full w-full flex flex-col items-center justify-start relative my-auto py-2"
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
                className="absolute top-2 sm:top-4 left-0 text-left w-full max-w-3xl lg:max-w-4xl pointer-events-none"
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

          {/* Phase 2: Summit Showcase (Centered directly under climber) */}
          <AnimatePresence>
            {phase === "summit" && (
              <div className="w-full flex flex-col items-center justify-start max-w-6xl xl:max-w-7xl mx-auto my-auto">
                {/* 1. Summit Header Block (Centered directly under climber) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full text-center flex flex-col items-center justify-center mb-6 sm:mb-8"
                >
                  {/* Main Headline: Swiss white, wide single-line layout */}
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[2.65rem] font-extrabold font-display tracking-tight uppercase text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] text-center leading-tight whitespace-normal md:whitespace-nowrap">
                    {t("creativeStudio.summitTitle", "Full-Cycle Digital Creative & Tech Studio")}
                  </h1>

                  {/* Secondary Line: single line on desktop, clean Swiss white typography without gradient */}
                  <p className="mt-2.5 sm:mt-3 text-center max-w-5xl mx-auto text-base sm:text-lg md:text-xl lg:text-2xl font-medium sm:font-semibold tracking-tight text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] whitespace-normal md:whitespace-nowrap">
                    {t(
                      "creativeStudio.summitSubtitle",
                      "3D & CGI, AI avatars, playable rich media, and end-to-end web & app engineering."
                    )}
                  </p>

                  {/* Tertiary Status: To be featured soon */}
                  <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.25em] text-accent drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {t("creativeStudio.featuredSoon", "To be featured soon")}
                  </p>
                </motion.div>

                {/* 2. Capabilities Cards Grid: Clean, enlarged text, no tags, no footer */}
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
                  {STUDIO_CATEGORIES.map((cat, index) => (
                    <motion.article
                      key={cat.key}
                      initial={{ opacity: 0, y: 36, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.96, transition: { duration: 0.2 } }}
                      transition={{
                        delay: 0.25 + index * 0.18,
                        duration: 0.85,
                        ease: [0.16, 1, 0.3, 1],
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
                      className="case-preview-card group flex flex-col overflow-hidden rounded-2xl border border-border/80 dark:border-white/12 bg-bg-card shadow-2xl transition-[border-color,box-shadow] duration-300 hover:border-accent/50"
                      style={
                        {
                          "--case-accent": "var(--theme-accent)",
                          "--case-surface": "var(--theme-bg-card)",
                        } as React.CSSProperties
                      }
                    >
                      {/* Card Header: Bold title only, NO tag pills */}
                      <div className="relative overflow-hidden border-b border-border/40 dark:border-white/10 p-5 sm:p-6 shrink-0">
                        <div className="case-brand-header__wash" aria-hidden />
                        <div className="relative z-10">
                          <h2 className="text-xl sm:text-2xl lg:text-[1.7rem] font-bold tracking-tight text-fg">
                            {t(cat.titleKey, cat.defaultTitle)}
                          </h2>
                        </div>
                      </div>

                      {/* Card Body: Enlarged, bold, legible service items */}
                      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-center">
                        <ul className="space-y-4 my-auto">
                          {cat.items.map((item) => (
                            <li
                              key={item.key}
                              className="flex items-start gap-3.5 text-base sm:text-lg lg:text-xl text-fg/85 leading-snug group/item font-semibold"
                            >
                              <span className="w-2.5 h-2.5 rounded-full bg-accent/90 shrink-0 mt-1.5 transition-transform duration-200 group-hover/item:scale-125 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                              <span className="group-hover/item:text-fg transition-colors duration-200">
                                {t(item.key, item.defaultText)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.article>
                  ))}
                </div>

                {/* 3. Under Cards: Contact prompt and button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8 sm:mt-10 mb-14 sm:mb-16 flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4"
                >
                  <p className="text-base sm:text-lg lg:text-xl text-white/95 font-semibold leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mb-4">
                    {t(
                      "creativeStudio.contactPrompt",
                      "Get in touch to check out our recent work and start co-creating ahead of the official launch."
                    )}
                  </p>
                  <Link
                    to="/contact?source=studio"
                    state={{ fromStudio: true, source: "studio" }}
                    className={`inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-3.5 min-h-[44px] text-sm sm:text-base font-bold tracking-widest uppercase transition-all duration-200 select-none shadow-[0_6px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.4)] hover:scale-105 active:scale-95 ${
                      theme === "light"
                        ? "bg-[#EE1C25] text-white hover:bg-[#d91921]"
                        : "bg-accent text-[#0a0a0a] hover:bg-accent/90"
                    }`}
                  >
                    <span>{t("creativeStudio.contactButton", "Request the Pilot")}</span>
                    <svg
                      className={`w-4 h-4 ${theme === "light" ? "text-white" : "text-[#0a0a0a]"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </motion.div>
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
                  {theme === "light" ? "PITCH 03" : "PITCH 21"} · ASCENT ·{" "}
                  <span ref={altitudeRef}>{theme === "light" ? "98.0M" : "899.0M"}</span>
                </span>
                <div className="w-12 sm:w-16 h-1 rounded-full bg-border/50 overflow-hidden shrink-0">
                  <div
                    ref={progressBarRef}
                    className="h-full bg-accent rounded-full transition-all duration-75"
                    style={{ width: "0%" }}
                  />
                </div>
                <span className="text-accent text-[9px] uppercase tracking-wider pl-1 font-semibold group-hover:underline hidden sm:inline">
                  Scroll or tap
                </span>
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
