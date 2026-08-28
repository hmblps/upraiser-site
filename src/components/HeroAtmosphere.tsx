import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { DESKTOP_HERO_QUERY } from "../lib/heroDesktop";
import { preloadHeroTerrain } from "../lib/heroBoot";
import { CanvasErrorBoundary } from "./CanvasErrorBoundary";

const loadHeroTerrain = () =>
  import("./hero-terrain/HeroTerrainCanvas").then((m) => ({ default: m.HeroTerrainCanvas }));

const HeroTerrainCanvas = lazy(loadHeroTerrain);

if (typeof window !== "undefined" && window.matchMedia(DESKTOP_HERO_QUERY).matches) {
  void loadHeroTerrain();
}

const MOUNTAINS_MP4 = "/hero/light-mountains-loop.mp4";
const MOUNTAINS_POSTER_LIGHT = "/hero/light-mountains-fallback.png";
const MOUNTAINS_POSTER_DARK = "/hero/dark-mountain-fallback.png";

function useDesktopHero() {
  const [ok, setOk] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(DESKTOP_HERO_QUERY).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_HERO_QUERY);
    const sync = () => setOk(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return ok;
}

/** Mobile / reduced-motion atmosphere. Desktop is WebGL Everest, no poster. */
function HeroMountainsMobile({ isLight, reduced }: { isLight: boolean; reduced: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const poster = isLight ? MOUNTAINS_POSTER_LIGHT : MOUNTAINS_POSTER_DARK;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          video.play().catch(() => {});
          return;
        }
        video.pause();
      },
      { threshold: 0.12 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div
      className={`hero-mountains-layer hero-mountains-layer--mobile${isLight ? " is-light" : " is-dark"}`}
    >
      <img
        className="hero-mountains-poster"
        src={poster}
        alt=""
        decoding="async"
        fetchPriority="low"
      />
      {reduced ? null : (
        <video
          ref={videoRef}
          className="hero-mountains-video is-active"
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          tabIndex={-1}
        >
          <source src={MOUNTAINS_MP4} type="video/mp4" />
        </video>
      )}
      <div className="hero-mountains-scrim" />
      <div className="hero-bottom-fade-bridge" />
    </div>
  );
}

/** CSS sky immediately; WebGL canvas mounts on the first desktop paint. */
export function HeroAtmosphere() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const reduced = useReducedMotion();
  const desktop = useDesktopHero();
  const use3d = desktop && !reduced;

  if (use3d) void loadHeroTerrain();

  useEffect(() => {
    if (!use3d) return;
    preloadHeroTerrain(theme);
  }, [use3d, theme]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 hero-atmosphere${isLight ? " hero-atmosphere--light" : " hero-atmosphere--dark"}${desktop ? "" : " hero-atmosphere--mobile"}`}
      aria-hidden
    >
      <div className="hero-atmosphere__sky hero-terrain-shell">
        {use3d ? (
          <CanvasErrorBoundary>
            <Suspense fallback={null}>
              <HeroTerrainCanvas className="hero-terrain-root" />
            </Suspense>
          </CanvasErrorBoundary>
        ) : null}
        {!desktop ? <HeroMountainsMobile isLight={isLight} reduced={reduced} /> : null}
      </div>
    </div>
  );
}
