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

export function CreativeStudioVideo({ videoSrc, theme }: CreativeStudioVideoProps) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"climbing" | "summit">("climbing");
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [goldenVisible, setGoldenVisible] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const phaseRef = useRef<"climbing" | "summit">("climbing");
  const goldenVisibleRef = useRef(false);

  // Exact timestamp when camera cuts and climber is viewed from behind:
  // light-loop.mp4: 4.75s (cut & settle on wide wall with climber seen from behind)
  // dark-loop.mp4: 6.00s (headlamp strikes wall with climber seen from behind)
  const goldenStartTime = theme === "light" ? 4.75 : 6.0;

  // Natural 1.0x video playback — pause on reaching the mountain wall:
  // light-loop.mp4 (6.01s): ~5.5s reaches full wide mountain wall
  // dark-loop.mp4 (11.01s): ~10.6s reaches top of the ice wall
  const pauseTime = theme === "light" ? 5.5 : 10.6;

  // Reset when video source changes
  useEffect(() => {
    phaseRef.current = "climbing";
    setPhase("climbing");
    setSubtitleVisible(false);
    goldenVisibleRef.current = false;
    setGoldenVisible(false);

    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.playbackRate = 1.0;
      v.play().catch(() => {});
    }

    const timer = setTimeout(() => {
      setSubtitleVisible(true);
    }, 900);

    return () => clearTimeout(timer);
  }, [videoSrc]);

  // Precision 60 FPS time check for smooth golden filter appearance strictly on back-view
  useEffect(() => {
    let rafId: number;
    const check = () => {
      const v = videoRef.current;
      if (v && !v.paused) {
        const cur = v.currentTime;

        // Bloom golden filter strictly when climber is seen from behind
        if (cur >= goldenStartTime && !goldenVisibleRef.current) {
          goldenVisibleRef.current = true;
          setGoldenVisible(true);
        } else if (cur < goldenStartTime && goldenVisibleRef.current) {
          goldenVisibleRef.current = false;
          setGoldenVisible(false);
        }

        // Pause on summit wall
        if (cur >= pauseTime && phaseRef.current === "climbing") {
          v.pause();
          phaseRef.current = "summit";
          setPhase("summit");
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
  }, [goldenStartTime, pauseTime]);

  const handleVideoEnded = useCallback(() => {
    const v = videoRef.current;
    if (v) v.pause();
    phaseRef.current = "summit";
    setPhase("summit");
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
    setSubtitleVisible(false);
    goldenVisibleRef.current = false;
    setGoldenVisible(false);
    setReplayKey((k) => k + 1);
    v.play().catch(() => {});
    setTimeout(() => setSubtitleVisible(true), 900);
  }, []);

  const handleSkipToSummit = useCallback(() => {
    if (phaseRef.current === "summit") return;
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = pauseTime;
    v.pause();
    phaseRef.current = "summit";
    setPhase("summit");
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
      {/* Video with Theme-Specific Filters (natural 1.0x 60fps playback, no artificial yellow sepia) */}
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
            {/* Layer A: Ambient Warm Champagne Illumination (airy, subtle warmth without heavy tint) */}
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

            {/* Layer B: Cinematic Golden Sunrise Wave Crawling Upwards (subtle, transparent, soft blurred crest) */}
            <motion.div
              initial={{ y: "45%", opacity: 0 }}
              animate={{ y: "-6%", opacity: 1 }}
              transition={{ duration: 3.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 -bottom-24 h-[125%] pointer-events-none"
              style={{ mixBlendMode: "screen" }}
            >
              {/* Ultra-soft feathered golden flood (50% more transparent) */}
              <div
                className="w-full h-full"
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(to top, rgba(234, 179, 8, 0.15) 0%, rgba(217, 119, 6, 0.08) 35%, rgba(180, 83, 9, 0.02) 65%, transparent 100%)"
                      : "linear-gradient(to top, rgba(234, 179, 8, 0.17) 0%, rgba(245, 158, 11, 0.09) 35%, rgba(217, 119, 6, 0.03) 65%, transparent 100%)",
                }}
              />
              {/* Soft glowing crest at leading edge with 36px gaussian blur */}
              <div
                className="absolute inset-x-0 top-0 h-48 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 100% 60% at 50% 100%, rgba(254, 240, 138, 0.18) 0%, rgba(234, 179, 8, 0.08) 45%, transparent 80%)",
                  filter: "blur(36px)",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heavy Local Grain to ensure continuity with Hero */}
      <div className="site-grain absolute inset-0 z-10 opacity-60 pointer-events-none" />

      {/* Subtle theme-aware contrast overlay without artificial haze */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          theme === "dark" ? "bg-black/55" : "bg-black/35"
        }`}
        style={{
          opacity: phase === "summit" ? 0.70 : 0.40,
        }}
      />

      {/* Main Content Area: safely cleared below top header island (pt-24 sm:pt-28), scrollable if needed */}
      <div className="relative z-20 w-full h-[100dvh] overflow-y-auto overscroll-contain site-scrollbar px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-24 pb-16">
        <div className="min-h-full w-full max-w-6xl mx-auto flex flex-col items-center justify-start md:justify-center">
          {/* Header Typography with smooth layout transition */}
          <motion.div
            layout
            className="text-center max-w-4xl mx-auto shrink-0 relative px-4"
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Kicker label using Hero stat color (#cb310d in light, gold in dark) */}
            <p
              className="font-bold tracking-[0.16em] uppercase text-xs sm:text-sm mb-1 sm:mb-2"
              style={{ color: kickerColor }}
            >
              {t("creativeStudio.label", "UPRAISER · FULL-CYCLE STUDIO")}
            </p>

            {/* Slightly Enlarged 3-Row Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`font-display font-bold text-white tracking-tight uppercase leading-[1.08] transition-all duration-500 text-balance ${
                phase === "summit"
                  ? "text-xl sm:text-2xl md:text-3xl lg:text-4xl"
                  : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
              }`}
              style={{
                textShadow: "0 4px 28px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)",
              }}
            >
              <span className="block">Full-Cycle Digital</span>
              <span className="block">Creative & Tech</span>
              <span className="block">Studio</span>
            </motion.h1>

            {/* Slightly Enlarged 3-Row Subtitle in Clear, High-Contrast Typography */}
            <AnimatePresence>
              {subtitleVisible && (
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className={`font-sans text-white/95 max-w-3xl mx-auto font-medium text-balance transition-all duration-500 ${
                    phase === "summit"
                      ? "mt-2 sm:mt-3 text-xs sm:text-sm md:text-base leading-snug"
                      : "mt-4 sm:mt-5 text-sm sm:text-base md:text-lg lg:text-xl leading-snug sm:leading-relaxed"
                  }`}
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

          {/* Phase 2: Full Capabilities Grid using the Native Case Preview Card system */}
          <AnimatePresence>
            {phase === "summit" && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="w-full mt-4 sm:mt-6 lg:mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch"
              >
                {STUDIO_CATEGORIES.map((cat, idx) => (
                  <motion.article
                    key={cat.key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 + idx * 0.12, ease: "easeOut" }}
                    className="case-preview-card card-lift group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-bg-card transition duration-300 hover:border-accent/40 shadow-xl"
                    style={
                      {
                        "--case-accent": "var(--theme-accent)",
                        "--case-surface": "var(--theme-bg-card)",
                      } as React.CSSProperties
                    }
                  >
                    {/* Case Card Header matching CaseBrandHeader — clean, no 01/02/03 */}
                    <div className="case-brand-header relative overflow-hidden border-b border-border/40 p-5 sm:p-6 shrink-0">
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
                            className="flex items-start gap-3 text-xs sm:text-sm text-fg/80 leading-relaxed group/item"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-accent/80 shrink-0 mt-2 transition-transform duration-200 group-hover/item:scale-125" />
                            <span className="group-hover/item:text-fg transition-colors duration-200 font-medium">
                              {t(item.key, item.defaultText)}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Clean baseline with direct transition to Contact Form */}
                      <div className="pt-4 mt-auto border-t border-border/30 flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-muted">
                          {t("creativeStudio.cardFooterLabel", "Creative & Tech")}
                        </span>
                        <Link
                          to="/contact"
                          onClick={(e) => e.stopPropagation()}
                          className="case-preview-card__cta !mt-0 !pt-0 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors hover:text-accent"
                        >
                          <span>{t("creativeStudio.contactCta", "Discuss Project")}</span>
                          <span
                            aria-hidden="true"
                            className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Under Columns: "To be featured soon" + Replay Climb button */}
          {phase === "summit" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-5 sm:mt-6 pb-6 flex flex-col items-center justify-center gap-2.5 shrink-0"
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
