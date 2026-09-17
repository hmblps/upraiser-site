import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useHardwareTier } from "../hooks/useHardwareTier";
import { DESKTOP_HERO_QUERY } from "../lib/heroDesktop";
import { whenHeroTerrainBytes } from "../lib/heroBoot";
import { markHeroReady } from "../lib/scrollPreload";
import { CanvasErrorBoundary } from "./CanvasErrorBoundary";
import { HeroTerrainCanvas } from "./hero-terrain/HeroTerrainCanvas";
import { HeroVideoFallback } from "./hero-terrain/HeroVideoFallback";

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

export function HeroAtmosphere() {
  const { theme } = useTheme();
  const [params] = useSearchParams();
  const forceMobileFrames = params.get("mobile") === "1";
  const isLight = theme === "light";
  const reduced = useReducedMotion();
  const desktop = useDesktopHero();
  const tier = useHardwareTier();
  
  const lite = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("lite");
  const use3d = desktop && !reduced && tier === "high" && !lite;
  const [boot3d, setBoot3d] = useState(false);

  useEffect(() => {
    if (!use3d || lite) markHeroReady();
  }, [use3d, lite]);

  useEffect(() => {
    if (!use3d) return;
    let cancelled = false;
    const boot = () => {
      if (!cancelled) setBoot3d(true);
    };
    const force = window.setTimeout(boot, 2500);
    void whenHeroTerrainBytes(theme).finally(() => {
      window.clearTimeout(force);
      if (cancelled) return;
      requestAnimationFrame(boot);
    });
    return () => {
      cancelled = true;
      window.clearTimeout(force);
    };
  }, [use3d, theme]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 hero-atmosphere${isLight ? " hero-atmosphere--light" : " hero-atmosphere--dark"}${desktop ? "" : " hero-atmosphere--mobile"}`}
      aria-hidden
    >
      <div className="hero-atmosphere__sky hero-terrain-shell">
        {use3d && boot3d ? (
          <CanvasErrorBoundary
            key={theme}
            fallback={
              <div className={`hero-mountains-layer hero-mountains-layer--mobile is-active`}>
                <HeroVideoFallback variant="home" forceMobile={forceMobileFrames || undefined} />
                <div className="hero-mountains-scrim" />
                {!isLight ? <div className="hero-bottom-fade-bridge" /> : null}
              </div>
            }
          >
            <HeroTerrainCanvas className="hero-terrain-root" />
          </CanvasErrorBoundary>
        ) : null}
        
        {!use3d ? (
          <div className="hero-mountains-layer hero-mountains-layer--mobile is-active">
            <HeroVideoFallback variant="home" forceMobile={forceMobileFrames || undefined} />
            <div className="hero-mountains-scrim" />
            {!isLight ? <div className="hero-bottom-fade-bridge" /> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
