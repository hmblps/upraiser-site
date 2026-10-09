import { AnimatePresence, motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AD_W, AD_H } from "./PhoneConstants";
import type { SiteMode } from "../../data/liveContent";
import { FORMAT_HTML, FORMAT_STILL, FORMAT_VIDEO } from "../../data/deviceScreens";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import {
  isAnimatedTabletGlass,
  paintGlassAnim,
  paintStill,
  type GlassAnimId,
} from "../../lib/tabletGlassAnim";


function useCssDrag() {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const rotX = useTransform(smoothY, [-1, 1], [15, -15]);
  const rotY = useTransform(smoothX, [-1, 1], [-20, 20]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (reduced) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) / (rect.width / 2));
    y.set((e.clientY - cy) / (rect.height / 2));
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { rotX, rotY, handlePointerMove, handlePointerLeave };
}


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
 * Prefer HTML when both exist (interactive rich / OEM store on CSS glass).
 * 3D phone still uses FORMAT_VIDEO / FORMAT_STILL textures.
 * App Growth banner/native/interstitial = still; rich + video = MP4; CTV Video = MP4.
 */
export function FormatGlass({ formatId }: { formatId: string }) {
  const html = FORMAT_HTML[formatId];
  const video = FORMAT_VIDEO[formatId];
  const still = FORMAT_STILL[formatId];
  const animated = isAnimatedTabletGlass(formatId);

  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const isTablet = formatId === "oem-store";
  const intrinsicW = isTablet ? 768 : AD_W;
  const intrinsicH = isTablet ? 1024 : AD_H;

  useEffect(() => {
    if (!html) return;
    const el = wrapRef.current;
    if (!el) return;
    
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0) {
        const scaleW = width / intrinsicW;
        const scaleH = height > 0 ? height / intrinsicH : 1;
        // Don't scale up past 1, but do scale down to fit small monitors
        setScale(Math.min(1, scaleW, scaleH));
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [html, intrinsicW, intrinsicH]);

  return (
    <div className="prog-format-glass" ref={wrapRef}>
      <AnimatePresence mode="sync" initial={false}>
        {html ? (
          <motion.div
            key={`hw-${formatId}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={GLASS_SPRING}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: intrinsicW,
              height: intrinsicH,
              transformOrigin: "center",
              transform: `translate(-50%, -50%) scale(${scale})`,
              overflow: "hidden"
            }}
          >
            <iframe
              src={html}
              title={formatId}
              scrolling="no"
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            />
          </motion.div>
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
  const { rotX, rotY, handlePointerMove, handlePointerLeave } = useCssDrag();

  return (
    <div 
      style={{ perspective: 1200, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div 
        className={`prog-css-phone prog-css-phone--${finish} ${className}`.trim()}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
      >
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
      </motion.div>
    </div>
  );
}

export function CssTablet({ mode, formatId, className = "" }: CssPhoneProps) {
  const finish = mode === "growth" ? "deepblue" : "orange";
  const { rotX, rotY, handlePointerMove, handlePointerLeave } = useCssDrag();

  return (
    <div 
      style={{ perspective: 1200, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div 
        className={`prog-css-tablet prog-css-phone--${finish} ${className}`.trim()}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)" }}
      >
      <div className="prog-css-tablet__bezel">
        <FormatGlass formatId={formatId} />
      </div>
      </motion.div>
    </div>
  );
}

export function CssTv({ mode, formatId, className = "" }: CssPhoneProps) {
  const finish = mode === "growth" ? "deepblue" : "orange";
  const glassId = FORMAT_VIDEO[formatId] || FORMAT_STILL[formatId] ? formatId : "ctv-spot";
  const { rotX, rotY, handlePointerMove, handlePointerLeave } = useCssDrag();

  return (
    <div 
      style={{ perspective: 1200, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div 
        className={`prog-css-tv prog-css-phone--${finish} ${className}`.trim()}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d", boxShadow: "0 35px 60px -15px rgba(0,0,0,0.6)" }}
      >
      <div className="prog-css-tv__bezel">
        <FormatGlass formatId={glassId} />
      </div>
      <div className="prog-css-tv__foot" aria-hidden />
      </motion.div>
    </div>
  );
}
