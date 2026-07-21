import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { useHeroCursorLight } from "../hooks/useHeroCursorLight";
import { useHeroMobileLite } from "../hooks/useHeroMobileLite";
import { useReducedMotion } from "../hooks/useReducedMotion";

const MOUNTAINS_MP4 = "/hero/light-mountains-loop.mp4";

type HeroMountainsLoopProps = {
  pauseOffscreen?: boolean;
  preload?: "auto" | "metadata" | "none";
};

function HeroMountainsLoop({ pauseOffscreen = false, preload = "auto" }: HeroMountainsLoopProps) {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reduced) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    if (pauseOffscreen) return;

    video.play().catch(() => {});
  }, [reduced, pauseOffscreen]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced || !pauseOffscreen) return;

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
  }, [reduced, pauseOffscreen]);

  return (
    <video
      ref={videoRef}
      className="hero-mountains-video is-active"
      muted
      loop
      playsInline
      preload={preload}
      tabIndex={-1}
    >
      <source src={MOUNTAINS_MP4} type="video/mp4" />
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
    defaultX: isLight ? 72 : 76,
    defaultY: isLight ? 36 : 38,
    minY: isLight ? undefined : 20,
    lerp: 0.085,
  });

  const videoProps = {
    pauseOffscreen: mobileLite,
    preload: mobileLite ? ("metadata" as const) : ("auto" as const),
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
      <div className={layerClass}>
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
      <div className="hero-copy-wash" />
    </div>
  );
}
