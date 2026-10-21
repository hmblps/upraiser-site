import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface CreativeStudioVideoProps {
  videoSrc: string;
  theme: "light" | "dark";
}

type Stage = "initial" | "title" | "subtitle" | "summit";

export function CreativeStudioVideo({ videoSrc, theme }: CreativeStudioVideoProps) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState<Stage>("initial");

  // Ascent timeline choreography (seconds):
  // light-loop.mp4 (6.01s):
  //   0.0s – 0.9s: Initial hold ("The Craft In Development" / "To be released soon")
  //   0.9s – 2.2s: First frames ("Full-Cycle Digital Creative & Tech Studio" in 3 rows)
  //   2.2s – 5.3s: Next frames reveal larger subtitle in 3 rows
  //   >= 5.3s: Mountain summit hold -> "To be featured soon" appears at bottom
  //
  // dark-loop.mp4 (11.01s):
  //   0.0s – 1.0s: Initial hold
  //   1.0s – 2.5s: First frames
  //   2.5s – 10.4s: Subtitle in 3 rows
  //   >= 10.4s: Ice wall summit hold -> "To be featured soon" appears at bottom
  const titleSwitchTime = theme === "light" ? 0.9 : 1.0;
  const subtitleAppearTime = theme === "light" ? 2.2 : 2.5;
  const pauseTime = theme === "light" ? 5.3 : 10.4;

  // Reset timeline when video source changes
  useEffect(() => {
    setStage("initial");
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  }, [videoSrc]);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    const cur = v.currentTime;

    if (cur >= pauseTime) {
      v.pause();
      setStage("summit");
      return;
    }

    if (cur >= subtitleAppearTime) {
      setStage("subtitle");
    } else if (cur >= titleSwitchTime) {
      setStage("title");
    } else {
      setStage("initial");
    }
  }, [pauseTime, subtitleAppearTime, titleSwitchTime]);

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
    setStage("initial");
    v.play().catch(() => {});
  }, []);

  const handleSkipToSummit = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = pauseTime;
    v.pause();
    setStage("summit");
  }, [pauseTime]);

  const handleContainerClick = useCallback(() => {
    if (stage === "summit") {
      handleReplay();
    } else {
      handleSkipToSummit();
    }
  }, [stage, handleReplay, handleSkipToSummit]);

  return (
    <div
      onClick={handleContainerClick}
      className="relative w-full h-[100dvh] overflow-hidden flex flex-col items-center justify-between select-none cursor-pointer"
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
          opacity: stage === "summit" ? 0.7 : 0.45,
        }}
      />

      {/* Top spacing: clears header capsule safely */}
      <div className="relative z-20 w-full pt-20 sm:pt-24 shrink-0 pointer-events-none" />

      {/* Main Center Stage */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col items-center justify-center text-center">
        <AnimatePresence>
          {stage === "initial" ? (
            <motion.div
              key="stage-initial"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center px-4"
            >
              <h2
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight uppercase max-w-4xl leading-[1.1] text-balance font-display"
                style={{
                  textShadow: "0 4px 28px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)",
                }}
              >
                <span className="block">The Craft</span>
                <span className="block">In Development</span>
              </h2>
              <p
                className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg font-mono text-accent tracking-[0.25em] uppercase font-semibold"
                style={{ textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}
              >
                {t("To be released soon", "To be released soon")}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="stage-active"
              initial={{ opacity: 0, scale: 0.97, y: 14, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center px-4 max-w-5xl mx-auto"
            >
              {/* 3-Row Title */}
              <h1
                className="font-display font-bold text-white tracking-tight uppercase leading-[1.08] text-balance text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
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
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-6 sm:mt-8 md:mt-10 font-sans text-white/95 font-medium tracking-normal text-balance text-base sm:text-xl md:text-2xl lg:text-[1.65rem] leading-snug sm:leading-relaxed"
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
      </div>

      {/* Bottom Stage: Holds stable height so center text never jumps */}
      <div className="relative z-20 w-full px-4 pb-8 sm:pb-12 min-h-[110px] flex flex-col items-center justify-end shrink-0">
        <AnimatePresence>
          {stage === "summit" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center justify-center gap-3"
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
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-full text-xs font-mono uppercase tracking-wider text-white/80 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 transition-all duration-200"
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
        </AnimatePresence>
      </div>
    </div>
  );
}
