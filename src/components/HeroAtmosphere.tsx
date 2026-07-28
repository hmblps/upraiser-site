import { Suspense, lazy, useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { DESKTOP_HERO_QUERY } from "../lib/heroDesktop";
import { MODEL_URL, MODEL_URL_LIGHT, VOYAGER_URL } from "../lib/heroModel";

const HeroTerrainCanvas = lazy(() =>
  import("./HeroTerrainCanvas").then((m) => ({ default: m.HeroTerrainCanvas })),
);

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

function prefetchHeroGlb(href: string) {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = href;
  link.as = "fetch";
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
  return link;
}

/**
 * CSS sky paints immediately; WebGL mounts after idle.
 * Prefetch both Everest GLBs so theme toggle does not wait on a cold light download.
 */
export function HeroAtmosphere() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const reduced = useReducedMotion();
  const desktop = useDesktopHero();
  const use3d = desktop && !reduced;
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    if (!use3d) {
      setCanvasReady(false);
      return;
    }

    let cancelled = false;
    const boot = () => {
      if (cancelled) return;
      setCanvasReady(true);
    };

    const darkPrefetch = prefetchHeroGlb(MODEL_URL);
    const lightPrefetch = prefetchHeroGlb(MODEL_URL_LIGHT);
    const voyagerPrefetch = !isLight ? prefetchHeroGlb(`${VOYAGER_URL}?v=tex6`) : null;

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(boot, { timeout: 900 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
        darkPrefetch.remove();
        lightPrefetch.remove();
        voyagerPrefetch?.remove();
      };
    }

    const t = window.setTimeout(boot, 120);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
      darkPrefetch.remove();
      lightPrefetch.remove();
      voyagerPrefetch?.remove();
    };
  }, [use3d, isLight]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 hero-atmosphere${isLight ? " hero-atmosphere--light" : " hero-atmosphere--dark"}${desktop ? "" : " hero-atmosphere--mobile"}`}
      aria-hidden
    >
      <div className="hero-atmosphere__sky hero-terrain-shell">
        {use3d && canvasReady ? (
          <Suspense fallback={null}>
            <HeroTerrainCanvas className="hero-terrain-root" />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
}
