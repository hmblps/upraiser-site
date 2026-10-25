import { useRef, useEffect } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Magnetic } from "../components/motion-preview/Magnetic";
import { useTheme } from "../context/ThemeContext";

/**
 * Post-submit confirmation page.
 * Plays victory summit video ONLY if the user originated from Creative Studio (/craft).
 */
export function ThankYouPage() {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);

  const isStudio =
    searchParams.get("source") === "studio" ||
    (location.state as { source?: string } | null)?.source === "studio";

  const videoSrc =
    theme === "light"
      ? "/creative/studio-success-day.mp4"
      : "/creative/studio-success-night.mp4";

  const posterSrc =
    theme === "light"
      ? "/creative/studio-success-day-poster.jpg"
      : "/creative/studio-success-night-poster.jpg";

  useEffect(() => {
    if (isStudio && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [isStudio, videoSrc]);

  return (
    <main
      className={`site-main relative min-h-[100dvh] flex items-center pt-[var(--site-header-height)] overflow-hidden select-none ${
        isStudio ? "bg-black text-white" : ""
      }`}
    >
      {/* Studio Victory Video Ambient Background (Rendered strictly for Studio submitters) */}
      {isStudio && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <video
            ref={videoRef}
            key={videoSrc}
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            loop
            muted
            playsInline
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

          {/* Atmosphere / Color Grade Overlay matching Creative Studio */}
          <div
            className={`absolute inset-0 pointer-events-none mix-blend-overlay ${
              theme === "light"
                ? "bg-gradient-to-b from-[#e0eaf5]/40 to-[#c8d6e5]/40"
                : "bg-gradient-to-b from-[#111a24]/40 to-[#080d14]/60"
            }`}
          />

          {/* Cinematic Golden Ascent Flood Filter */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              mixBlendMode: "color-dodge",
              background:
                theme === "dark"
                  ? "radial-gradient(ellipse 100% 70% at 50% 100%, rgba(234, 179, 8, 0.12) 0%, rgba(180, 83, 9, 0.04) 50%, transparent 85%)"
                  : "radial-gradient(ellipse 110% 80% at 50% 100%, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.05) 50%, transparent 85%)",
            }}
          />

          {/* Film Grain matching Hero and Creative Studio */}
          <div className="site-grain absolute inset-0 z-10 opacity-60 pointer-events-none" />

          {/* Centered cinematic contrast vignette for crisp typography */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                theme === "dark"
                  ? "radial-gradient(ellipse 85% 65% at 50% 35%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)"
                  : "radial-gradient(ellipse 85% 65% at 50% 35%, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)",
            }}
          />

          {/* Contrast backdrop */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
              theme === "dark" ? "bg-black/55" : "bg-black/35"
            }`}
          />
        </div>
      )}

      {/* Confirmation Content Card */}
      <div className="section-inner py-16 sm:py-20 relative z-20 w-full">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          {isStudio && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-[11px] font-bold tracking-wider uppercase mb-5 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Creative Studio · Pilot Brief Logged
            </div>
          )}

          <p
            className={`section-label ${
              isStudio ? "!text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" : ""
            }`}
          >
            Basecamp Reached
          </p>

          <h1
            className={`section-heading--lg max-w-2xl ${
              isStudio ? "!text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]" : ""
            }`}
          >
            Let us guide You now to the top. Big milestone ahead.
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {isStudio ? (
              <>
                <Magnetic>
                  <Link
                    to="/craft"
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
                    to="/contact?source=studio"
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
                    className="btn-caps btn-caps--primary inline-flex min-h-[44px] items-center rounded-full px-7 py-3.5 touch-manipulation"
                  >
                    Proven Summits
                  </Link>
                </Magnetic>
                <Magnetic strength={0.22}>
                  <Link
                    to="/contact"
                    className="btn-caps btn-secondary inline-flex min-h-[44px] items-center rounded-full px-7 py-3.5 touch-manipulation"
                  >
                    Send another brief
                  </Link>
                </Magnetic>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
