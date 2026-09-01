import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { useSectionScrollProgress } from "../hooks/useSectionScrollProgress";
import { useScrollRunwayEnabled } from "../hooks/useScrollScene";
import { useTheme } from "../context/ThemeContext";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { CanvasErrorBoundary } from "./CanvasErrorBoundary";
import { HeroTerrainCanvas, EXPEDITION_ASCENT } from "./hero-terrain/HeroTerrainCanvas";
import { whenHeroTerrainBytes } from "../lib/heroBoot";
import { DESKTOP_HERO_QUERY } from "../lib/heroDesktop";
import { useState, useEffect } from "react";
import "../styles/expedition.css";

// ─── helpers ─────────────────────────────────────────────────────────────────
function smoothstep(x: number, edge0: number, edge1: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// ─── Static fallback (mobile / reduced-motion) ───────────────────────────────
function AscentHeroStatic() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const poster = isLight ? "/hero/light-mountains-fallback.png" : "/hero/dark-mountain-fallback.png";

  return (
    <section className="ascent-hero ascent-hero--static">
      <div className="ascent-hero__bg">
        <img
          className="ascent-hero__poster"
          src={poster}
          alt=""
          decoding="async"
          fetchPriority="high"
        />
        <div className="ascent-hero__fog ascent-hero__fog--static" />
        <div className="ascent-hero__veil" />
      </div>
      <div className="ascent-hero__content section-inner">
        <p className="section-label ascent-hero__label">The Expedition</p>
        <h1 className="ascent-hero__headline">
          We mapped the<br />
          mobile advertising<br />
          terrain.
        </h1>
        <p className="ascent-hero__sub">
          Basecamp London, since 2017.
        </p>
      </div>
    </section>
  );
}

// ─── Animated version ────────────────────────────────────────────────────────
function useDesktop() {
  const [ok, setOk] = useState(
    () => typeof window !== "undefined" && window.matchMedia(DESKTOP_HERO_QUERY).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_HERO_QUERY);
    const sync = () => setOk(mq.matches);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return ok;
}

function AscentHeroAnimated() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const poster = isLight ? "/hero/light-mountains-fallback.png" : "/hero/dark-mountain-fallback.png";
  const sectionRef = useRef<HTMLElement>(null);
  const desktop = useDesktop();
  const [boot3d, setBoot3d] = useState(false);

  useEffect(() => {
    if (!desktop) return;
    let cancelled = false;
    const boot = () => { if (!cancelled) setBoot3d(true); };
    const force = window.setTimeout(boot, 8000);
    void whenHeroTerrainBytes(theme).finally(() => {
      window.clearTimeout(force);
      if (!cancelled) requestAnimationFrame(boot);
    });
    return () => { cancelled = true; window.clearTimeout(force); };
  }, [desktop, theme]);

  const progress = useSectionScrollProgress(sectionRef, "ascent-hero");

  // ── Sky parallax: poster moves upward as we scroll ──────────────────────────
  // At p=0: sky at +18dvh (we see the base), at p=1: sky at -22dvh (we see the summit)
  const skyY = useTransform(progress, (p) => {
    const t = smoothstep(p, 0, 1);
    return lerp(18, -22, t) + "dvh";
  });

  // ── Fog: starts thick (0.9), clears as we rise ───────────────────────────────
  const fogOpacity = useTransform(progress, (p) => {
    // Clears between 10%–60%
    return 1 - smoothstep(p, 0.1, 0.65);
  });

  // ── Dark veil fades slightly so mountain is crisper ─────────────────────────
  const veilOpacity = useTransform(progress, (p) => {
    const base = isLight ? 0.55 : 0.72;
    const min = isLight ? 0.15 : 0.38;
    return lerp(base, min, smoothstep(p, 0.1, 0.7));
  });

  // ── Headline enters from bottom ──────────────────────────────────────────────
  const headlineOpacity = useTransform(progress, (p) => smoothstep(p, 0.3, 0.55));
  const headlineY = useTransform(progress, (p) => {
    const t = smoothstep(p, 0.3, 0.58);
    return lerp(40, 0, t) + "px";
  });

  // ── Sub copy enters slightly later ──────────────────────────────────────────
  const subOpacity = useTransform(progress, (p) => smoothstep(p, 0.45, 0.65));
  const subY = useTransform(progress, (p) => {
    const t = smoothstep(p, 0.45, 0.68);
    return lerp(28, 0, t) + "px";
  });

  // ── Scroll hint fades out early ──────────────────────────────────────────────
  const hintOpacity = useTransform(progress, (p) => 1 - smoothstep(p, 0, 0.12));

  return (
    <section
      ref={sectionRef}
      className="ascent-hero ascent-hero--animated"
      aria-label="Expedition intro"
    >
      {/* Sticky viewport frame */}
      <div className="ascent-hero__pin">

        {/* Background — poster + optional 3D canvas, moves up as we scroll */}
        <div className="ascent-hero__bg">
          <motion.div className="ascent-hero__sky" style={{ y: skyY }}>
            <img
              className="ascent-hero__poster"
              src={poster}
              alt=""
              decoding="async"
              fetchPriority="high"
            />
            {desktop && boot3d ? (
              <CanvasErrorBoundary>
                <HeroTerrainCanvas
                  className="ascent-hero__canvas"
                  path={EXPEDITION_ASCENT}
                  variant="expedition"
                />
              </CanvasErrorBoundary>
            ) : null}
          </motion.div>

          {/* Fog layer — thick at base, clears toward summit */}
          <motion.div
            className="ascent-hero__fog"
            style={{ opacity: fogOpacity }}
          />

          {/* Atmospheric veil (directional colour wash) */}
          <motion.div
            className={`ascent-hero__veil ascent-hero__veil--${isLight ? "light" : "dark"}`}
            style={{ opacity: veilOpacity }}
          />
        </div>

        {/* Typography */}
        <div className="ascent-hero__content section-inner">
          <motion.p
            className="section-label ascent-hero__label"
            style={{ opacity: headlineOpacity, y: headlineY }}
          >
            The Expedition
          </motion.p>
          <motion.h1
            className="ascent-hero__headline"
            style={{ opacity: headlineOpacity, y: headlineY }}
          >
            We mapped the<br />
            mobile advertising<br />
            terrain.
          </motion.h1>
          <motion.p
            className="ascent-hero__sub"
            style={{ opacity: subOpacity, y: subY }}
          >
            Basecamp London, since 2017.
          </motion.p>
        </div>

        {/* Scroll hint arrow */}
        <motion.div className="ascent-hero__hint" style={{ opacity: hintOpacity }} aria-hidden>
          <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
            <line x1="10" y1="0" x2="10" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <polyline points="4,14 10,22 16,14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
export function ExpeditionAscentHero() {
  const runway = useScrollRunwayEnabled();
  const reduced = useReducedMotion();
  if (!runway || reduced) return <AscentHeroStatic />;
  return <AscentHeroAnimated />;
}
