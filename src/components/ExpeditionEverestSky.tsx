import { useEffect, useState } from "react";
import { motion, type MotionValue } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { DESKTOP_HERO_QUERY } from "../lib/heroDesktop";
import { whenHeroTerrainBytes } from "../lib/heroBoot";
import { CanvasErrorBoundary } from "./CanvasErrorBoundary";
import { HeroTerrainCanvas, EXPEDITION_ASCENT } from "./hero-terrain/HeroTerrainCanvas";

const POSTER_LIGHT = "/hero/light-mountains-fallback.png";
const POSTER_DARK = "/hero/dark-mountain-fallback.png";

type ExpeditionEverestSkyProps = {
  veil?: MotionValue<number>;
  settle?: MotionValue<number>;
};

function useDesktopEverest() {
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

export function ExpeditionEverestSky({ veil, settle }: ExpeditionEverestSkyProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const reduced = useReducedMotion();
  const desktop = useDesktopEverest();
  const use3d = desktop && !reduced;
  const [boot3d, setBoot3d] = useState(false);
  const poster = isLight ? POSTER_LIGHT : POSTER_DARK;

  useEffect(() => {
    if (!use3d) return;
    let cancelled = false;
    const boot = () => {
      if (!cancelled) setBoot3d(true);
    };
    const force = window.setTimeout(boot, 8000);
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
      className={`expedition-sky${isLight ? " is-light" : " is-dark"}`}
      aria-hidden
    >
      <img
        className="expedition-sky__poster"
        src={poster}
        alt=""
        decoding="async"
        fetchPriority="low"
      />
      {use3d && boot3d ? (
        <CanvasErrorBoundary>
          <HeroTerrainCanvas
            className="expedition-sky__canvas"
            path={EXPEDITION_ASCENT}
            variant="expedition"
          />
        </CanvasErrorBoundary>
      ) : null}
      <motion.div className="expedition-sky__veil" style={{ opacity: veil ?? 1 }} />
      <motion.div
        className="expedition-sky__settle"
        style={{ opacity: settle ?? 0.08 }}
      />
    </div>
  );
}
