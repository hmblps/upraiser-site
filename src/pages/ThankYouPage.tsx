import { useRef, useState, useEffect, useCallback } from "react";
import { Link, useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Magnetic } from "../components/motion-preview/Magnetic";
import { useTheme } from "../context/ThemeContext";

/**
 * Post-submit confirmation page for Pilot Briefings & Creative Studio.
 * Plays the cinematic victory summit video (day in light theme, night in dark theme).
 * Videos are normalized to an identical 8.0s duration without looping.
 * Confirmation cards gracefully appear towards the climax of the video (5.2s), freezing on the summit.
 * On page reload / direct re-visit without submission, safely returns to the active flow.
 */
export function ThankYouPage() {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const themeParam =
    (searchParams.get("theme") as "light" | "dark" | null) ||
    (location.state as { theme?: "light" | "dark" } | null)?.theme;
  const activeTheme: "light" | "dark" =
    themeParam === "light" || themeParam === "dark"
      ? themeParam
      : theme === "light"
      ? "light"
      : "dark";

  const sourceParam =
    searchParams.get("source") ||
    (location.state as { source?: string } | null)?.source;
  const isStudio = sourceParam === "studio";

  // Play cinematic ascent first, then reveal confirmation card at climax (5.2s)
  const [phase, setPhase] = useState<"celebrating" | "reached">(
    searchParams.get("preview") === "reached" ? "reached" : "celebrating"
  );
  const [skipped, setSkipped] = useState(false);
  const easeCurve = [0.22, 1, 0.36, 1] as const;

  const videoSrc =
    activeTheme === "light"
      ? "/creative/studio-success-day.mp4"
      : "/creative/studio-success-night.mp4";

  const posterSrc =
    activeTheme === "light"
      ? "/creative/studio-success-day-poster.jpg"
      : "/creative/studio-success-night-poster.jpg";

  // When refreshing the confirmation page or direct opening without submission, return safely
  useEffect(() => {
    if (searchParams.has("preview")) return;

    const navEntry = performance.getEntriesByType?.("navigation")?.[0] as
      | PerformanceNavigationTiming
      | undefined;
    const isDocReloadOfSent =
      navEntry?.type === "reload" && Boolean(navEntry?.name?.includes("/contact/sent"));

    const hasClientSubmit = Boolean(
      (location.state as { submitted?: boolean } | null)?.submitted
    );
    const submitTime = Math.max(
      Number(sessionStorage.getItem("upraiser_studio_submitted") || "0"),
      Number(sessionStorage.getItem("upraiser_pilot_submitted") || "0")
    );
    const isRecentSubmit = submitTime > 0 && Date.now() - submitTime < 120_000;

    if (isDocReloadOfSent || (!hasClientSubmit && !isRecentSubmit)) {
      sessionStorage.removeItem("upraiser_studio_submitted");
      sessionStorage.removeItem("upraiser_pilot_submitted");
      const returnUrl = isStudio
        ? `/craft?theme=${activeTheme}`
        : `/?theme=${activeTheme}`;
      navigate(returnUrl, { replace: true });
    }
  }, [activeTheme, isStudio, location.state, navigate, searchParams]);

  // Video autoplay & WebKit/Safari muted property enforcement
  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.defaultMuted = true;
      v.currentTime = 0;
      const playPromise = v.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [videoSrc]);

  // Skip video to climax on click
  const handleSkip = useCallback(() => {
    if (phase === "reached") return;
    const v = videoRef.current;
    if (v) {
      v.currentTime = 7.95;
      v.pause();
    }
    setSkipped(true);
    setPhase("reached");
  }, [phase]);

  const handleTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    // Reveal confirmation card gently as camera reveals the wide panorama (5.2s), no loop
    if (v.currentTime >= 5.2 && phase === "celebrating") {
      setPhase("reached");
    }
  }, [phase]);

  // Guaranteed fallback timer for smooth reveal at 5.2s even if timeupdate is throttled
  useEffect(() => {
    if (phase === "reached") return;
    const timer = setTimeout(() => {
      setPhase("reached");
    }, 5200);
    return () => clearTimeout(timer);
  }, [phase]);

  const handleVideoEnded = useCallback(() => {
    const v = videoRef.current;
    if (v) v.pause();
    setPhase("reached");
  }, []);

  return (
    <main
      onClick={phase === "celebrating" ? handleSkip : undefined}
      className={`site-main relative min-h-[100dvh] flex items-center pt-[var(--site-header-height)] overflow-hidden select-none ${
        activeTheme === "light"
          ? "bg-[#f8fafc] text-white"
          : "bg-[#06070a] text-white"
      } ${phase === "celebrating" ? "cursor-pointer" : ""}`}
    >
      {/* Victory Video Ambient Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: easeCurve }}
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      >
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter:
              activeTheme === "light"
                ? "contrast(1.05) saturate(1.18) brightness(1.15)"
                : "contrast(1.12) saturate(1.48) brightness(1.20)",
          }}
        />

        {/* Light Theme: Radiant Golden Sunrise & Day Sun Bloom */}
        {activeTheme === "light" && (
          <>
            {/* Luminous sun burst centered on the horizon / summit */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                mixBlendMode: "screen",
                background:
                  "radial-gradient(ellipse 95% 75% at 55% 25%, rgba(255, 240, 205, 0.38) 0%, rgba(255, 215, 140, 0.20) 35%, rgba(251, 191, 36, 0.08) 60%, transparent 80%)",
              }}
            />
            {/* Warm morning atmosphere flood */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                mixBlendMode: "color-dodge",
                background:
                  "radial-gradient(circle at 50% 30%, rgba(255, 225, 160, 0.22) 0%, rgba(245, 158, 11, 0.08) 45%, transparent 75%)",
              }}
            />
          </>
        )}

        {/* Dark Theme: Aurora Borealis Radiant Celestial Bloom */}
        {activeTheme === "dark" && (
          <>
            {/* Vivid Emerald & Violet Aurora spectral wave in the sky */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                mixBlendMode: "screen",
                background:
                  "radial-gradient(ellipse 90% 55% at 70% 25%, rgba(52, 211, 153, 0.32) 0%, rgba(168, 85, 247, 0.35) 38%, rgba(139, 92, 246, 0.15) 60%, transparent 80%)",
              }}
            />
            {/* Concentrated Aurora Core Luminescence */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                mixBlendMode: "color-dodge",
                background:
                  "radial-gradient(ellipse 75% 45% at 65% 20%, rgba(110, 231, 183, 0.26) 0%, rgba(192, 132, 252, 0.28) 45%, transparent 75%)",
              }}
            />
          </>
        )}

        {/* Film Grain matching Hero and Creative Studio */}
        <div
          className={`site-grain absolute inset-0 z-10 pointer-events-none ${
            activeTheme === "light" ? "opacity-35" : "opacity-50"
          }`}
        />

        {/* Dark alpine bedrock grounding (anchors rocks below without dimming sky/sun) */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              activeTheme === "dark"
                ? "radial-gradient(ellipse 100% 65% at 50% 100%, rgba(4, 7, 12, 0.60) 0%, rgba(4, 7, 12, 0.15) 55%, transparent 90%)"
                : "radial-gradient(ellipse 100% 55% at 50% 100%, rgba(20, 10, 5, 0.30) 0%, rgba(20, 10, 5, 0.08) 50%, transparent 85%)",
          }}
        />

        {/* Precision typography scrim (left side only — leaves climber, sun, and aurora pure & bright) */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              activeTheme === "dark"
                ? "linear-gradient(to right, rgba(0, 0, 0, 0.62) 0%, rgba(0, 0, 0, 0.38) 32%, rgba(0, 0, 0, 0.08) 55%, transparent 75%)"
                : "linear-gradient(to right, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.22) 32%, rgba(0, 0, 0, 0.04) 55%, transparent 75%)",
          }}
        />
      </motion.div>

      {/* Confirmation Content Card — reveals smoothly as camera enters graceful deceleration */}
      <div className="section-inner py-16 sm:py-20 relative z-20 w-full">
        <AnimatePresence mode="wait">
          {phase === "reached" && (
            <motion.div
              key="confirmation-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: skipped ? 0.3 : 1.1, ease: easeCurve }}
              className="max-w-2xl"
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: skipped ? 0.25 : 0.75, ease: easeCurve }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-[11px] font-bold tracking-wider uppercase mb-5 backdrop-blur-md"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                {isStudio
                  ? "Creative Studio · Pilot Brief Logged"
                  : "Pilot Brief Logged · Priority Intake"}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: skipped ? 0.25 : 0.85,
                  delay: skipped ? 0 : 0.12,
                  ease: easeCurve,
                }}
                className="section-label !text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              >
                Basecamp Reached
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: skipped ? 0.25 : 0.95,
                  delay: skipped ? 0 : 0.24,
                  ease: easeCurve,
                }}
                className="section-heading--lg max-w-2xl !text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
              >
                Let us guide You now to the top. Big milestone ahead.
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: skipped ? 0.25 : 0.85,
                  delay: skipped ? 0 : 0.40,
                  ease: easeCurve,
                }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                {isStudio ? (
                  <>
                    <Magnetic>
                      <Link
                        to={`/craft?theme=${activeTheme}`}
                        data-cursor="cta"
                        className="btn-caps btn-caps--primary inline-flex min-h-[44px] items-center rounded-full px-7 py-3.5 touch-manipulation shadow-lg"
                      >
                        Back to Studio
                      </Link>
                    </Magnetic>
                    <Magnetic strength={0.22}>
                      <Link
                        to="/#cases"
                        className="btn-caps inline-flex min-h-[44px] items-center rounded-full px-7 py-3.5 touch-manipulation bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-colors"
                      >
                        Proven Summits
                      </Link>
                    </Magnetic>
                    <Magnetic strength={0.22}>
                      <Link
                        to={`/contact?source=studio&theme=${activeTheme}`}
                        className="btn-caps inline-flex min-h-[44px] items-center rounded-full px-7 py-3.5 touch-manipulation bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-colors"
                      >
                        Send another brief
                      </Link>
                    </Magnetic>
                  </>
                ) : (
                  <>
                    <Magnetic>
                      <Link
                        to="/#cases"
                        data-cursor="cta"
                        className="btn-caps btn-caps--primary inline-flex min-h-[44px] items-center rounded-full px-7 py-3.5 touch-manipulation shadow-lg"
                      >
                        Proven Summits
                      </Link>
                    </Magnetic>
                    <Magnetic strength={0.22}>
                      <Link
                        to={`/craft?theme=${activeTheme}`}
                        className="btn-caps inline-flex min-h-[44px] items-center rounded-full px-7 py-3.5 touch-manipulation bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-colors"
                      >
                        Creative Studio
                      </Link>
                    </Magnetic>
                    <Magnetic strength={0.22}>
                      <Link
                        to={`/contact?theme=${activeTheme}`}
                        className="btn-caps inline-flex min-h-[44px] items-center rounded-full px-7 py-3.5 touch-manipulation bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-colors"
                      >
                        Send another brief
                      </Link>
                    </Magnetic>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Skip/Indicator Pill while celebrating */}
      <AnimatePresence>
        {phase === "celebrating" && (
          <motion.div
            key="celebrating-indicator"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeOut" } }}
            className="fixed bottom-6 sm:bottom-8 inset-x-0 z-30 pointer-events-none flex items-center justify-center px-4"
          >
            <div className="pointer-events-auto min-h-[44px] flex items-center bg-bg-elevated/75 backdrop-blur-xl rounded-full border border-border/40 shadow-lg px-4 py-2 gap-2.5 text-[10px] sm:text-[11px] font-bold tracking-wide uppercase font-sans select-none cursor-pointer text-fg-muted hover:text-fg transition-colors group">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
              <span className="text-fg/90 whitespace-nowrap">
                SUMMIT REACHED · 8.0S
              </span>
              <span className="text-accent text-[9px] uppercase tracking-wider pl-1 font-semibold group-hover:underline">
                Skip to brief
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
