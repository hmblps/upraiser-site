import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

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

type Stage = "initial" | "title" | "subtitle" | "summit";

export function CreativeStudioVideo({ videoSrc, theme }: CreativeStudioVideoProps) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState<Stage>("initial");

  // Calibrated video thresholds & slow-motion window:
  // When looking at the mountain ridge from behind, playbackRate slows down
  // to tame frantic dynamics and give each text reveal generous breathing space.
  //
  // light-loop.mp4 (6.01s):
  //   0.0s – 1.1s: Normal speed (1.0x). Initial hold ("The Craft In Development" / "To be released soon")
  //   1.1s – 4.8s: Slow-motion (0.55x). Camera ascends mountain from behind.
  //                1.1s: Title enters in 3 rows alone
  //                2.5s: Subtitle enters below in 3 rows
  //   4.8s – 5.2s: Gentle ease (0.8x) into summit panorama
  //   >= 5.2s: Summit hold -> 3 clean typography columns + "To be featured soon"
  //
  // dark-loop.mp4 (11.01s):
  //   0.0s – 1.8s: Normal speed (1.0x). Initial hold
  //   1.8s – 8.8s: Slow-motion (0.65x). Ice face climb from behind.
  //                1.8s: Title enters in 3 rows alone
  //                4.0s: Subtitle enters below in 3 rows
  //   8.8s – 10.3s: Gentle ease (0.85x) into summit ridge
  //   >= 10.3s: Summit hold -> 3 clean typography columns + "To be featured soon"
  const titleSwitchTime = theme === "light" ? 1.1 : 1.8;
  const subtitleAppearTime = theme === "light" ? 2.5 : 4.0;
  const pauseTime = theme === "light" ? 5.2 : 10.3;

  const slowStart = theme === "light" ? 1.0 : 1.8;
  const slowEnd = theme === "light" ? 4.8 : 8.8;
  const slowRate = theme === "light" ? 0.55 : 0.65;

  // Reset timeline when video source changes
  useEffect(() => {
    setStage("initial");
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.playbackRate = 1.0;
      v.play().catch(() => {});
    }
  }, [videoSrc]);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const cur = v.currentTime;

    // Final summit check
    if (cur >= pauseTime) {
      v.pause();
      setStage("summit");
      return;
    }

    // Dynamic playback rate to soften rapid camera motion when mountain is viewed from behind
    if (cur >= slowStart && cur < slowEnd) {
      if (v.playbackRate !== slowRate) v.playbackRate = slowRate;
    } else if (cur >= slowEnd) {
      if (v.playbackRate !== 0.8) v.playbackRate = 0.8;
    } else {
      if (v.playbackRate !== 1.0) v.playbackRate = 1.0;
    }

    // Stage progression with distinct intervals
    if (cur >= subtitleAppearTime) {
      setStage("subtitle");
    } else if (cur >= titleSwitchTime) {
      setStage("title");
    } else {
      setStage("initial");
    }
  }, [pauseTime, slowStart, slowEnd, slowRate, subtitleAppearTime, titleSwitchTime]);

  const handleVideoEnded = useCallback(() => {
    const v = videoRef.current;
    if (v) v.pause();
    setStage("summit");
  }, []);

  const handleReplay = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.playbackRate = 1.0;
    setStage("initial");
    v.play().catch(() => {});
  }, []);

  const handleSkipToSummit = useCallback(() => {
    if (stage === "summit") return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = pauseTime;
    v.pause();
    setStage("summit");
  }, [pauseTime, stage]);

  // Accent kicker color
  const kickerColor =
    theme === "light" ? "var(--hero-light-stat-label, #cb310d)" : "var(--theme-accent, #eab308)";

  return (
    <div
      onClick={stage !== "summit" ? handleSkipToSummit : undefined}
      className={`relative w-full h-[100dvh] overflow-hidden flex flex-col items-center justify-center select-none ${
        stage !== "summit" ? "cursor-pointer" : ""
      }`}
      style={{ background: "var(--theme-bg)" }}
    >
      {/* Video with Theme-Specific Filters */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          theme === "light"
            ? "opacity-90 contrast-125 saturate-150 sepia-[.1] hue-rotate-[-10deg]"
            : "opacity-100 contrast-[1.15] saturate-[0.8]"
        }`}
        style={{
          filter:
            theme === "light"
              ? "contrast(1.15) saturate(1.1) brightness(1.1)"
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

      {/* Heavy Local Grain to ensure continuity with Hero */}
      <div className="site-grain absolute inset-0 z-10 opacity-60 pointer-events-none" />

      {/* Subtle theme-aware contrast overlay without artificial haze */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          theme === "dark" ? "bg-black/55" : "bg-black/35"
        }`}
        style={{
          opacity: stage === "summit" ? 0.65 : 0.40,
        }}
      />

      {/* Main Content Area: safely cleared below top header island (pt-24 sm:pt-28), scrollable when summit columns mount */}
      <div className="relative z-20 w-full h-[100dvh] overflow-y-auto overscroll-contain site-scrollbar px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-24 pb-16">
        <div className="min-h-full w-full max-w-6xl mx-auto flex flex-col items-center justify-start md:justify-center">
          {/* Header Typography with smooth layout animation */}
          <motion.div
            layout
            className="text-center max-w-4xl mx-auto shrink-0 relative px-4"
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              {stage === "initial" ? (
                <motion.div
                  key="initial-header"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98, y: -10 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center px-4"
                >
                  <h2
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight uppercase max-w-4xl leading-[1.08] font-display text-balance"
                    style={{
                      textShadow: "0 4px 28px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)",
                    }}
                  >
                    <span className="block">The Craft</span>
                    <span className="block">In Development</span>
                  </h2>
                  <p
                    className="mt-5 sm:mt-6 md:mt-7 text-base sm:text-lg md:text-xl font-mono text-accent tracking-[0.25em] uppercase font-semibold"
                    style={{ textShadow: "0 2px 16px rgba(0,0,0,0.9)" }}
                  >
                    {t("To be released soon", "To be released soon")}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="active-header"
                  initial={{ opacity: 0, scale: 0.96, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center px-4"
                >
                  {/* Kicker label */}
                  <p
                    className="font-bold tracking-[0.16em] uppercase text-xs sm:text-sm mb-2"
                    style={{ color: kickerColor }}
                  >
                    {t("creativeStudio.label", "UPRAISER · FULL-CYCLE STUDIO")}
                  </p>

                  {/* 3-Row Main Title */}
                  <h1
                    className={`font-display font-bold text-white tracking-tight uppercase leading-[1.08] transition-all duration-500 text-balance ${
                      stage === "summit"
                        ? "text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                        : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                    }`}
                    style={{
                      textShadow: "0 4px 28px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)",
                    }}
                  >
                    <span className="block">Full-Cycle Digital</span>
                    <span className="block">Creative & Tech</span>
                    <span className="block">Studio</span>
                  </h1>

                  {/* 3-Row Subtitle in Visibly Larger Size */}
                  <AnimatePresence>
                    {(stage === "subtitle" || stage === "summit") && (
                      <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="font-sans text-white/95 max-w-3xl mx-auto mt-4 sm:mt-5 text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-snug sm:leading-relaxed text-balance"
                        style={{
                          textShadow: "0 2px 20px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.95)",
                        }}
                      >
                        <span className="block">Driving digital growth:</span>
                        <span className="block">from immersive 3D and AI concepts</span>
                        <span className="block">to high-performance content and enterprise tech.</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Summit Phase: 3 Clean Typography Columns (NO Card Background Boxes) */}
          <AnimatePresence>
            {stage === "summit" && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
                className="w-full mt-8 sm:mt-12 lg:mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 items-start text-left"
              >
                {STUDIO_CATEGORIES.map((cat, idx) => (
                  <motion.div
                    key={cat.key}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.18 + idx * 0.12, ease: "easeOut" }}
                    className="flex flex-col justify-between h-full group"
                  >
                    {/* Category Header: Clean typography over video with subtle hairline divider */}
                    <div className="pb-3 border-b border-white/20">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 shadow-[0_0_8px_var(--theme-accent)]" />
                        <h2
                          className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-white uppercase font-display"
                          style={{ textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}
                        >
                          {t(cat.titleKey, cat.defaultTitle)}
                        </h2>
                      </div>

                      {/* Domain / format pills */}
                      <p
                        className="text-[11px] font-mono tracking-widest uppercase text-white/60"
                        style={{ textShadow: "0 1px 8px rgba(0,0,0,0.85)" }}
                      >
                        {cat.tags.join(" · ")}
                      </p>
                    </div>

                    {/* Services List: Clean floating list with high-contrast text shadow */}
                    <ul className="space-y-3.5 my-5 flex-1">
                      {cat.items.map((item) => (
                        <li
                          key={item.key}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-white/90 leading-relaxed font-medium group/item"
                          style={{
                            textShadow: "0 1px 12px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.9)",
                          }}
                        >
                          <span className="text-accent/90 font-mono text-xs shrink-0 select-none transition-transform duration-200 group-hover/item:translate-x-0.5">
                            /
                          </span>
                          <span className="group-hover/item:text-white transition-colors duration-200">
                            {t(item.key, item.defaultText)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Direct text link to Contact Form */}
                    <div className="pt-3 border-t border-white/15 flex items-center justify-between mt-auto">
                      <span
                        className="text-[10px] font-mono font-bold tracking-wider uppercase text-white/50"
                        style={{ textShadow: "0 1px 6px rgba(0,0,0,0.8)" }}
                      >
                        {t("creativeStudio.cardFooterLabel", "Creative & Tech")}
                      </span>
                      <Link
                        to="/contact"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-semibold text-accent hover:text-white inline-flex items-center gap-1.5 transition-colors group/cta"
                        style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}
                      >
                        <span>{t("creativeStudio.contactCta", "Discuss Project")}</span>
                        <span
                          aria-hidden="true"
                          className="inline-block transition-transform duration-200 group-hover/cta:translate-x-1"
                        >
                          →
                        </span>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Under Columns: "To be featured soon" + Replay Climb button */}
          {stage === "summit" && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-8 sm:mt-12 pb-6 flex flex-col items-center justify-center gap-3 shrink-0"
            >
              <p
                className="font-mono text-accent tracking-[0.25em] uppercase text-xs sm:text-sm md:text-base font-semibold text-center"
                style={{ textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}
              >
                {t("creativeStudio.featuredSoon", "To be featured soon")}
              </p>
              <button
                type="button"
                onClick={handleReplay}
                className="btn-caps btn-secondary inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs tracking-wider"
                aria-label="Replay climb"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>{t("creativeStudio.replayClimb", "Replay Climb")}</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
