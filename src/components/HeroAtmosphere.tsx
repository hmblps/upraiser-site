import { Suspense, lazy, useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { DESKTOP_HERO_QUERY } from "../lib/heroDesktop";

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

/**
 * CSS sky paints immediately; WebGL mounts after idle so text/layout win first paint.
 * Model is Draco ~1MB (was 33MB) — no visual downgrade (same triangle count).
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

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(boot, { timeout: 900 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const t = window.setTimeout(boot, 120);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [use3d]);

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
