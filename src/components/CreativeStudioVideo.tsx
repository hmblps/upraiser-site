import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface CreativeStudioVideoProps {
  videoSrc: string;
  theme: "light" | "dark";
}

interface StudioCategory {
  key: string;
  index: string;
  meta: string;
  titleKey: string;
  defaultTitle: string;
  tags: string[];
  items: Array<{ key: string; defaultText: string }>;
}

const STUDIO_CATEGORIES: StudioCategory[] = [
  {
    key: "immersive",
    index: "01",
    meta: "DOMAIN 01 · IMMERSIVE",
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
    index: "02",
    meta: "DOMAIN 02 · PRODUCTION",
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
    index: "03",
    meta: "DOMAIN 03 · ENGINEERING",
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

  // Time in seconds to pause on the final mountain wall frame
  // light-loop.mp4 (6.01s): ~5.5s reaches full wide mountain wall
  // dark-loop.mp4 (11.01s): ~10.6s reaches top of the ice wall
  const pauseTime = theme === "light" ? 5.5 : 10.6;

  // Reset when video source changes
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
      className={`relative w-full h-[100dvh] overflow-hidden flex flex-col items-center justify-center select-none ${
        phase === "climbing" ? "cursor-pointer" : ""
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

      {/* Subtle theme-aware ambient scrim over the background */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          theme === "dark" ? "bg-black/40" : "bg-black/10"
        }`}
        style={{
          opacity: phase === "summit" ? 0.75 : 0.35,
        }}
      />

      {/* Main Content Area: safely cleared below top header island (pt-24 sm:pt-28), scrollable if viewport is tight */}
      <div className="relative z-20 w-full h-[100dvh] overflow-y-auto overscroll-contain site-scrollbar px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-24 pb-16">
        <div className="min-h-full w-full max-w-6xl mx-auto flex flex-col items-center justify-start md:justify-center">
          {/* Header (Title & Subtitle with site-standard typography & soft organic backdrop blur) */}
          <motion.div
            layout
            className="section-header text-center max-w-4xl mx-auto shrink-0 relative px-4"
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Seamless ambient backdrop blur matching AboutUsSection — zero hard box edges */}
            <div
              className="absolute -inset-x-12 -inset-y-8 z-[-1] pointer-events-none backdrop-blur-md"
              style={{
                maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
                WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
              }}
            />

            <p className="section-label">
              {t("creativeStudio.label", "UPRAISER · FULL-CYCLE STUDIO")}
            </p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`section-title text-balance text-fg transition-all duration-500 ${
                phase === "summit"
                  ? "!text-2xl sm:!text-3xl md:!text-4xl lg:!text-5xl"
                  : "!text-3xl sm:!text-4xl md:!text-5xl lg:!text-6xl"
              }`}
              style={{
                textShadow:
                  theme === "light"
                    ? "0 2px 24px rgba(255, 255, 255, 0.95), 0 1px 4px rgba(255, 255, 255, 0.9)"
                    : "0 4px 28px rgba(0, 0, 0, 0.9), 0 1px 4px rgba(0, 0, 0, 0.95)",
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
                  className="section-description text-balance text-fg/80 max-w-3xl mx-auto mt-3 sm:mt-4 text-xs sm:text-sm md:text-base leading-relaxed"
                  style={{
                    textShadow:
                      theme === "light"
                        ? "0 2px 16px rgba(255, 255, 255, 0.9), 0 1px 2px rgba(255, 255, 255, 0.85)"
                        : "0 2px 16px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 0.95)",
                  }}
                >
                  {subtitleText}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Phase 2: Full Capabilities Grid using the EXACT Case Preview Card system */}
          <AnimatePresence>
            {phase === "summit" && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="w-full mt-6 sm:mt-8 lg:mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
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
                    {/* Case Card Header matching CaseBrandHeader */}
                    <div className="case-brand-header relative overflow-hidden border-b border-border/40 p-5 sm:p-6 shrink-0">
                      <div className="case-brand-header__wash" aria-hidden />
                      <div className="relative z-10 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-micro font-bold tracking-[0.14em] uppercase text-accent">
                            {cat.meta}
                          </span>
                          <span className="case-brand-header__event-value font-mono text-[10px] text-muted opacity-80">
                            [{cat.index}]
                          </span>
                        </div>
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

                      {/* Clean baseline status matching case study bottom specs */}
                      <div className="pt-4 mt-auto border-t border-border/30 flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-muted">
                          UPRAISER STUDIO
                        </span>
                        <span className="case-preview-card__cta !mt-0 !pt-0 text-xs font-semibold">
                          <span>READY FOR SCALE</span>{" "}
                          <span aria-hidden="true" className="inline-block transition-transform duration-200">
                            →
                          </span>
                        </span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Replay Climb button using site standard btn-secondary styling */}
          {phase === "summit" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-6 sm:mt-8 flex items-center justify-center shrink-0"
            >
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
