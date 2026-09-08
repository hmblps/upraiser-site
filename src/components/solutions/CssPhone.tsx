import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { SiteMode } from "../../data/liveContent";
import { FORMAT_HTML, FORMAT_STILL, FORMAT_VIDEO } from "../../data/deviceScreens";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import {
  isAnimatedTabletGlass,
  paintGlassAnim,
  paintStill,
  type GlassAnimId,
} from "../../lib/tabletGlassAnim";

type CssPhoneProps = {
  mode: SiteMode;
  formatId: string;
  className?: string;
};

const GLASS_SPRING = { type: "spring" as const, stiffness: 260, damping: 34, mass: 0.7 };

/** Lite tablet glass — same canvas painters as Tablet3D. */
function AnimatedTabletGlass({ formatId }: { formatId: GlassAnimId }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const still = FORMAT_STILL[formatId];

  useEffect(() => {
    if (!still) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let raf = 0;
    let img: HTMLImageElement | null = null;
    const t0 = performance.now();

    const tick = (now: number) => {
      if (cancelled || !img || !canvasRef.current) return;
      paintGlassAnim(formatId, canvasRef.current, img, (now - t0) / 1000, reduced);
      if (!reduced) raf = requestAnimationFrame(tick);
    };

    img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (cancelled || !canvasRef.current || !img) return;
      paintStill(canvasRef.current, img);
      raf = requestAnimationFrame(tick);
    };
    img.src = still;

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [formatId, still, reduced]);

  return (
    <motion.canvas
      key={`a-${formatId}`}
      ref={canvasRef}
      className="prog-css-phone__live-ad"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={GLASS_SPRING}
    />
  );
}

/**
 * Same glass files as Phone3D / Tablet3D / Tv3D (`deviceScreens.ts`).
 * Prefer live HTML → animated OEM canvas → MP4 → still.
 */
export function FormatGlass({ formatId }: { formatId: string }) {
  const html = FORMAT_HTML[formatId];
  const video = FORMAT_VIDEO[formatId];
  const still = FORMAT_STILL[formatId];
  const animated = isAnimatedTabletGlass(formatId);

  return (
    <div className="prog-format-glass">
      <AnimatePresence mode="sync" initial={false}>
        {html ? (
          <motion.iframe
            key={`h-${formatId}`}
            src={html}
            title={formatId}
            className="prog-css-phone__live-ad"
            scrolling="no"
            style={{ overflow: "hidden" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={GLASS_SPRING}
          />
        ) : animated && still ? (
          <AnimatedTabletGlass key={`a-${formatId}`} formatId={formatId} />
        ) : video ? (
          <motion.video
            key={`v-${formatId}`}
            src={video}
            poster={still}
            muted
            loop
            playsInline
            autoPlay
            className="prog-css-phone__live-ad"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={GLASS_SPRING}
          />
        ) : still ? (
          <motion.img
            key={`s-${formatId}`}
            src={still}
            alt=""
            className="prog-css-phone__live-ad"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={GLASS_SPRING}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/**
 * Thin Pro Max–proportion chassis — load fallback + true mobile + lite tablet/TV.
 * Desktop lite phone still uses flat GLB; tablet/TV stay CSS (no CSS→GLB fly-off).
 */
export function CssPhone({ mode, formatId, className = "" }: CssPhoneProps) {
  const finish = mode === "growth" ? "deepblue" : "orange";

  return (
    <div className={`prog-css-phone prog-css-phone--${finish} ${className}`.trim()}>
      <span className="prog-css-phone__btn prog-css-phone__btn--silent" aria-hidden />
      <span className="prog-css-phone__btn prog-css-phone__btn--vol-up" aria-hidden />
      <span className="prog-css-phone__btn prog-css-phone__btn--vol-down" aria-hidden />
      <span className="prog-css-phone__btn prog-css-phone__btn--power" aria-hidden />
      <div className="prog-css-phone__bezel">
        <div className="prog-css-phone__island" aria-hidden />
        <div className="prog-css-phone__screen">
          <FormatGlass formatId={formatId} />
        </div>
      </div>
    </div>
  );
}

export function CssTablet({ mode, formatId, className = "" }: CssPhoneProps) {
  const finish = mode === "growth" ? "deepblue" : "orange";

  return (
    <div className={`prog-css-tablet prog-css-phone--${finish} ${className}`.trim()}>
      <div className="prog-css-tablet__bezel">
        <FormatGlass formatId={formatId} />
      </div>
    </div>
  );
}

export function CssTv({ mode, formatId, className = "" }: CssPhoneProps) {
  const finish = mode === "growth" ? "deepblue" : "orange";
  const glassId = FORMAT_VIDEO[formatId] || FORMAT_STILL[formatId] ? formatId : "ctv-spot";

  return (
    <div className={`prog-css-tv prog-css-phone--${finish} ${className}`.trim()}>
      <div className="prog-css-tv__bezel">
        <FormatGlass formatId={glassId} />
      </div>
      <div className="prog-css-tv__foot" aria-hidden />
    </div>
  );
}
