import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { useHeroCursorLight } from "../hooks/useHeroCursorLight";
import { useHeroMobileLite } from "../hooks/useHeroMobileLite";
import { useReducedMotion } from "../hooks/useReducedMotion";

const MOUNTAINS_MP4 = "/hero/light-mountains-loop.mp4";
const MOUNTAINS_WEBM = "/hero/light-mountains-loop.webm";

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
      <source src={MOUNTAINS_WEBM} type="video/webm" />
    </video>
  );
}

export function HeroAtmosphere() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const reduced = useReducedMotion();
  const mobileLite = useHeroMobileLite();
  const containerRef = useRef<HTMLDivElement>(null);
  const useLitLayer = !mobileLite && !reduced;

  useHeroCursorLight(containerRef, useLitLayer, {
    defaultX: isLight ? 70 : 74,
    defaultY: isLight ? 34 : 36,
    minY: isLight ? undefined : 22,
  });

  const videoProps = {
    pauseOffscreen: mobileLite,
    preload: mobileLite ? ("metadata" as const) : ("auto" as const),
  };

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 hero-cursor-light-active${mobileLite ? " hero-atmosphere-mobile-lite" : ""}${isLight ? " hero-atmosphere-light" : " hero-atmosphere-dark"}`}
      aria-hidden
    >
      {isLight ? (
        <div className="hero-mountains-layer">
          <div className="hero-light-mountains-base">
            <HeroMountainsLoop {...videoProps} />
          </div>
          {useLitLayer ? (
            <div className="hero-light-mountains-lit hero-mountains-lit">
              <HeroMountainsLoop />
            </div>
          ) : null}
          <div className="hero-mountains-warmwash" />
          <div className="hero-mountains-scrim" />
        </div>
      ) : (
        <div className="hero-dark-mountains-layer">
          <div className="hero-dark-mountains-base">
            <HeroMountainsLoop {...videoProps} />
          </div>
          {useLitLayer ? (
            <div className="hero-dark-mountains-lit hero-mountains-lit">
              <HeroMountainsLoop />
            </div>
          ) : null}
          <div className="hero-dark-mountains-scrim" />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 hero-bottom-fade-bridge" />
    </div>
  );
}
