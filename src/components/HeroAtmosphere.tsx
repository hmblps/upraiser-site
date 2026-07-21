import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useHeroCursorLight } from "../hooks/useHeroCursorLight";
import { useHeroMobileLite } from "../hooks/useHeroMobileLite";
import { useReducedMotion } from "../hooks/useReducedMotion";

const MOUNTAINS_MP4 = "/hero/light-mountains-loop.mp4";

type HeroMountainsLoopProps = {
  pauseOffscreen?: boolean;
  /** Desktop: load immediately with preload auto. Mobile: defer + metadata. */
  eager?: boolean;
};

function HeroMountainsLoop({ pauseOffscreen = false, eager = false }: HeroMountainsLoopProps) {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sourceReady, setSourceReady] = useState(eager);

  useEffect(() => {
    if (eager) return;

    const activate = () => setSourceReady(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(activate, { timeout: 900 });
      return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(activate, 350);
    return () => window.clearTimeout(id);
  }, [eager]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !sourceReady) return;

    if (reduced) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    if (pauseOffscreen) return;

    video.play().catch(() => {});
  }, [reduced, pauseOffscreen, sourceReady]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced || !pauseOffscreen || !sourceReady) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          return;
        }
        video.pause();
      },
      { threshold: 0.12 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced, pauseOffscreen, sourceReady]);

  const preload = eager ? "auto" : "metadata";

  return (
    <video
      ref={videoRef}
      className="hero-mountains-video is-active"
      muted
      loop
      playsInline
      preload={sourceReady ? preload : "none"}
      tabIndex={-1}
    >
      {sourceReady ? <source src={MOUNTAINS_MP4} type="video/mp4" /> : null}
    </video>
  );
}

export function HeroAtmosphere() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const reduced = useReducedMotion();
  const mobileLite = useHeroMobileLite();
  const containerRef = useRef<HTMLDivElement>(null);
  const useSpotlight = !mobileLite && !reduced;

  useHeroCursorLight(containerRef, useSpotlight, {
    defaultX: isLight ? 70 : 56,
    defaultY: isLight ? 34 : 66,
    minY: isLight ? undefined : 38,
    maxY: isLight ? undefined : 88,
    maxX: isLight ? undefined : 78,
    lerp: 0.052,
  });

  const videoProps = {
    pauseOffscreen: mobileLite,
    eager: !mobileLite && !reduced,
  };

  const baseClass = isLight ? "hero-light-mountains-base" : "hero-dark-mountains-base";
  const layerClass = isLight ? "hero-mountains-layer" : "hero-dark-mountains-layer";
  const dimClass = isLight ? "hero-video-dim hero-video-dim--light" : "hero-video-dim hero-video-dim--dark";

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 hero-cursor-light-active${mobileLite ? " hero-atmosphere-mobile-lite" : ""}${useSpotlight ? " hero-atmosphere-spotlight" : ""}${isLight ? " hero-atmosphere-light" : " hero-atmosphere-dark"}`}
      aria-hidden
    >
      <div className="hero-copy-wash" />
      <div className={`${layerClass} hero-atmosphere-layer-stack`}>
        <div className={baseClass}>
          <HeroMountainsLoop {...videoProps} />
          {useSpotlight ? (
            <>
              <div className={dimClass} aria-hidden />
              {!isLight ? <div className="hero-video-dim hero-video-dim--dark-corner-lock" aria-hidden /> : null}
            </>
          ) : null}
        </div>

        {isLight ? (
          <>
            <div className="hero-mountains-warmwash" />
            <div className="hero-mountains-scrim" />
          </>
        ) : (
          <div className="hero-dark-mountains-scrim" />
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 hero-bottom-fade-bridge" />
    </div>
  );
}
