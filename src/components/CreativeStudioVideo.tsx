import { useRef, useState, useEffect, useCallback } from "react";
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
  items: Array<{ key: string; defaultText: string }>;
}

const STUDIO_CATEGORIES: StudioCategory[] = [
  {
    key: "immersive",
    titleKey: "creativeStudio.categories.immersive.title",
    defaultTitle: "Immersive & High-Tech",
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
    items: [
      { key: "creativeStudio.categories.engineering.items.0", defaultText: "End-to-End Web Development" },
      { key: "creativeStudio.categories.engineering.items.1", defaultText: "Mobile Application Development" },
      { key: "creativeStudio.categories.engineering.items.2", defaultText: "Cloud Infrastructure & System Architecture" },
    ],
  },
];

export function CreativeStudioVideo({ videoSrc, theme }: CreativeStudioVideoProps) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"climbing" | "summit">("climbing");
  const [subtitleVisible, setSubtitleVisible] = useState(false);

  // Time in seconds to pause on the final mountain wall frame
  // light-loop.mp4 (6.01s): ~5.5s reaches full wide mountain wall
  // dark-loop.mp4 (11.01s): ~10.6s reaches top of the ice wall
  const pauseTime = theme === "light" ? 5.5 : 10.6;

  // Stagger subtitle appearance during climbing phase
  useEffect(() => {
    setPhase("climbing");
    setSubtitleVisible(false);

    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }

    const timer = setTimeout(() => {
      setSubtitleVisible(true);
    }, 900);

    return () => clearTimeout(timer);
  }, [videoSrc]);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;

    if (v.currentTime >= pauseTime && phase === "climbing") {
      v.pause();
      setPhase("summit");
      setSubtitleVisible(true);
    }
  }, [pauseTime, phase]);

  const handleVideoEnded = useCallback(() => {
    const v = videoRef.current;
    if (v) v.pause();
    setPhase("summit");
    setSubtitleVisible(true);
  }, []);

  const handleReplay = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    setPhase("climbing");
    setSubtitleVisible(false);
    v.play().catch(() => {});
    setTimeout(() => setSubtitleVisible(true), 900);
  }, []);

  const handleSkipToSummit = useCallback(() => {
    if (phase === "summit") return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = pauseTime;
    v.pause();
    setPhase("summit");
    setSubtitleVisible(true);
  }, [pauseTime, phase]);

  const titleText = t("creativeStudio.title", "Full-Cycle Digital Creative & Tech Studio");
  const subtitleText = t(
    "creativeStudio.subtitle",
    "Driving digital growth: from immersive 3D and AI concepts to high-performance content and enterprise tech."
  );

  return (
    <div
      onClick={phase === "climbing" ? handleSkipToSummit : undefined}
      className={`relative w-full h-[100dvh] overflow-hidden bg-black flex flex-col items-center justify-center select-none ${
        phase === "climbing" ? "cursor-pointer" : ""
      }`}
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

      {/* Contrast Overlay: gently deepens on summit pause to ensure crystal-clear text readability over rock cracks */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          theme === "dark" ? "bg-black/55" : "bg-black/40"
        }`}
        style={{
          opacity: phase === "summit" ? 0.88 : 0.45,
        }}
      />

      {/* Main Content Area: safely cleared below top header island (pt-24 sm:pt-28), scrollable if viewport is tight */}
      <div className="relative z-20 w-full h-[100dvh] overflow-y-auto overscroll-contain site-scrollbar px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-24 pb-16">
        <div className="min-h-full w-full max-w-6xl mx-auto flex flex-col items-center justify-start md:justify-center">
          {/* Header (Title & Subtitle) */}
          <motion.div
            layout
            className="text-center max-w-4xl mx-auto shrink-0"
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`font-bold text-white tracking-tight uppercase leading-tight transition-all duration-500 text-balance ${
                phase === "summit"
                  ? "text-xl sm:text-2xl md:text-4xl lg:text-5xl"
                  : "text-2xl sm:text-3xl md:text-5xl lg:text-6xl"
              }`}
              style={{
                textShadow: "0 4px 28px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)",
              }}
            >
              {titleText}
            </motion.h1>

            <AnimatePresence>
              {subtitleVisible && (
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base font-mono text-white/90 max-w-3xl mx-auto leading-relaxed tracking-wide text-balance"
                  style={{
                    textShadow: "0 2px 16px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.95)",
                  }}
                >
                  {subtitleText}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Phase 2: Full Capabilities 3-Column Grid */}
          <AnimatePresence>
            {phase === "summit" && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="w-full mt-6 sm:mt-8 lg:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-stretch"
              >
                {STUDIO_CATEGORIES.map((cat, idx) => (
                  <motion.div
                    key={cat.key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 + idx * 0.12, ease: "easeOut" }}
                    className="relative rounded-2xl p-5 sm:p-6 lg:p-7 flex flex-col justify-start bg-black/55 backdrop-blur-md border border-white/12 shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:border-white/25 transition-all duration-300"
                  >
                    {/* Subtle top highlight border */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

                    {/* Category Title with uniform min-height for baseline harmony */}
                    <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/12 min-h-[44px]">
                      <span className="w-2 h-2 rounded-full bg-accent shrink-0 shadow-[0_0_8px_var(--theme-accent)]" />
                      <h2 className="text-xs sm:text-sm lg:text-base font-bold text-white uppercase tracking-wider font-mono">
                        {t(cat.titleKey, cat.defaultTitle)}
                      </h2>
                    </div>

                    {/* Services List */}
                    <ul className="space-y-3 sm:space-y-3.5">
                      {cat.items.map((item) => (
                        <li
                          key={item.key}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-white/85 leading-relaxed group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0 mt-1.5 group-hover:bg-accent transition-colors" />
                          <span className="group-hover:text-white transition-colors">
                            {t(item.key, item.defaultText)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Replay Climb button on Summit phase */}
          {phase === "summit" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-6 sm:mt-8 flex items-center justify-center"
            >
              <button
                type="button"
                onClick={handleReplay}
                className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] min-w-[44px] rounded-full text-xs font-mono uppercase tracking-wider text-white/70 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-all duration-200"
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
