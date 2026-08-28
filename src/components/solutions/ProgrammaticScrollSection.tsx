import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useFormatScrollSection } from "../../hooks/useFormatScrollSection";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { SiteMode } from "../../data/liveContent";
import { SectionHeader } from "../SectionHeader";
import { BrandAurora } from "../BrandAurora";
import { CanvasErrorBoundary } from "../CanvasErrorBoundary";
import { AD_FORMATS, type AdFormat } from "./ProgrammaticFormats";
import { FormatCopy } from "./FormatCopy";
import { ProgrammaticScrollSectionMobile } from "./ProgrammaticScrollSectionMobile";

import "../../styles/programmatic-scroll-section.css";
import "../../styles/programmatic-full-feed.css";

const Phone3D = lazy(() =>
  import("./Phone3D").then((m) => ({ default: m.Phone3D })),
);

const phone3DImport   = () => import("./Phone3D").then((m) => ({ default: m.Phone3D }));
const tv3DImport      = () => import("../channel-visuals/Tv3D").then((m) => ({ default: m.Tv3D }));
const tablet3DImport  = () => import("../channel-visuals/Tablet3D").then((m) => ({ default: m.Tablet3D }));

const Tv3D     = lazy(tv3DImport);
const Tablet3D = lazy(tablet3DImport);

if (typeof window !== "undefined") {
  void phone3DImport();
  void tv3DImport();
  void tablet3DImport();
}

const DESKTOP_MIN_WIDTH = 1024;

// ─── 3-device Apple-like slide switcher ───────────────────────────────────────
// Phone · Tablet · TV occupy slots 0 · 1 · 2.
// Spring drives `phase`; three layered transforms create depth à la Emil Kowalski:
//
//   x       = (index − phase) × 100%   — hard slide, clipped by overflow:hidden
//   scale   = max(0.82, 1 − dist×0.18) — shrinks as it leaves (depth cue)
//   opacity = max(0,    1 − dist×1.9)  — fades fast on exit, blooms on entry
//   filter  = blur(dist × dist × 6px)  — peaks mid-travel, bridges the gap
//
// Emil: "blur bridges the visual gap — tricks the eye into a single smooth
// transformation instead of two objects swapping."
// Emil: "Nothing in the real world appears from nothing — start from scale(0.9)."
function DeviceCarousel3({
  mode,
  formatId,
  scene = "phone",
  entranceProgress,
  className,
}: {
  mode: SiteMode;
  formatId: string;
  scene?: "phone" | "tablet" | "tv";
  entranceProgress: MotionValue<number>;
  className?: string;
}) {
  const targetPhase = scene === "tablet" ? 1 : scene === "tv" ? 2 : 0;
  const phaseRaw = useMotionValue(targetPhase);
  // Slightly springy — feels alive without bouncing content off-screen
  const phase = useSpring(phaseRaw, { stiffness: 340, damping: 32, mass: 0.6 });

  useEffect(() => {
    phaseRaw.set(targetPhase);
  }, [targetPhase, phaseRaw]);

  // ── Signed distance from each slot (negative = left, positive = right) ────
  const phoneDist  = useTransform(phase, (p) => Math.abs(0 - p));
  const tabletDist = useTransform(phase, (p) => Math.abs(1 - p));
  const tvDist     = useTransform(phase, (p) => Math.abs(2 - p));

  // ── X — lateral slide (100% = one full column width) ─────────────────────
  const phoneX  = useTransform(phase, (p) => `${(0 - p) * 100}%`);
  const tabletX = useTransform(phase, (p) => `${(1 - p) * 100}%`);
  const tvX     = useTransform(phase, (p) => `${(2 - p) * 100}%`);

  // ── Opacity — fast exit fade, natural bloom on entry ─────────────────────
  // No CSS scale on WebGL canvases: the browser switches from bilinear
  // sampling to native pixel-mapping exactly at scale=1.0, producing a
  // visible snap. Slide + fade is sufficient for an Apple-like feel.
  const phoneOpacity  = useTransform(phoneDist,  (d) => Math.max(0, 1 - d * 1.9));
  const tabletOpacity = useTransform(tabletDist, (d) => Math.max(0, 1 - d * 1.9));
  const tvOpacity     = useTransform(tvDist,     (d) => Math.max(0, 1 - d * 1.9));

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Phone — App Growth formats
          Canvas capped at 62% column width: phone is a small device; the
          narrower stage makes that legible without faking real proportions. */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          x: phoneX,
          opacity: phoneOpacity,
          pointerEvents: scene === "phone" ? "auto" : "none",
        }}
      >
        <div style={{ width: "62%", height: "100%", position: "relative" }}>
          <Suspense fallback={<div className={className} />}>
            <CanvasErrorBoundary fallback={<div className={className} />}>
              <Phone3D
                mode={mode}
                formatId={formatId}
                entranceProgress={entranceProgress}
                className={className}
              />
            </CanvasErrorBoundary>
          </Suspense>
        </div>
      </motion.div>

      {/* Tablet — OEM formats
          85% width: tablet is mid-size; noticeably larger than phone. */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          x: tabletX,
          opacity: tabletOpacity,
          pointerEvents: scene === "tablet" ? "auto" : "none",
        }}
      >
        <div style={{ width: "85%", height: "100%", position: "relative" }}>
          <Suspense fallback={<div className={className} />}>
            <CanvasErrorBoundary fallback={<div className={className} />}>
              <Tablet3D mode={mode} formatId={formatId} className={className} />
            </CanvasErrorBoundary>
          </Suspense>
        </div>
      </motion.div>

      {/* TV — CTV formats — fills the full column (biggest screen) */}
      <motion.div
        className="absolute inset-0"
        style={{
          x: tvX,
          opacity: tvOpacity,
          pointerEvents: scene === "tv" ? "auto" : "none",
        }}
      >
        <Suspense fallback={null}>
          <CanvasErrorBoundary fallback={null}>
            <Tv3D mode={mode} className={className} />
          </CanvasErrorBoundary>
        </Suspense>
      </motion.div>
    </div>
  );
}

export type ProgrammaticScrollSectionProps = {
  mode: SiteMode;
  lane?: string;
  laneSwitcher?: ReactNode;
  sectionId?: string;
  formats?: readonly AdFormat[];
  headerLabel?: string;
  headerTitle?: string;
  headerDescription?: string;
};

/**
 * Native sticky scroll drives the active format — no wheel hijack.
 * Desktop: 3D phone. Mobile / reduced: stacked cards + CssPhone dock.
 */
export function ProgrammaticScrollSection({
  mode,
  lane = "app-growth",
  laneSwitcher,
  sectionId,
  formats = AD_FORMATS,
  headerLabel = "Lanes",
  headerTitle = "Every Format. One Supply Path.",
  headerDescription,
}: ProgrammaticScrollSectionProps) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const desktopEnabled = !isMobile && !reduced;

  const { activeIndex, jumpTo, totalVirtual, entranceProgress } = useFormatScrollSection(sectionRef, {
    enabled: desktopEnabled,
    formatCount: formats.length,
    reduced,
    lane,
  });

  // Track lane changes to drive the correct text transition direction
  const prevLaneRef = useRef(lane);
  const [textTransition, setTextTransition] = useState<{ dir: "scroll" | "lane"; laneDir: number }>({
    dir: "scroll",
    laneDir: 1,
  });

  useEffect(() => {
    if (lane !== prevLaneRef.current) {
      const isForward = lane > prevLaneRef.current;
      prevLaneRef.current = lane;
      setTextTransition({ dir: "lane", laneDir: isForward ? 1 : -1 });
      // Reset to vertical after the spring+exit animation settles (~450 ms).
      // Previously we reset via an activeIndex effect, but that fired immediately
      // when activeIndex reset to 0 on lane change — causing mixed h/v animation
      // that read as a diagonal slide.
      const t = setTimeout(() => setTextTransition({ dir: "scroll", laneDir: 1 }), 450);
      return () => clearTimeout(t);
    }
  }, [lane]);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${DESKTOP_MIN_WIDTH - 1}px)`);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!desktopEnabled) return;
    void import("./Phone3D").then((m) => {
      m.preloadPhone3DAssets(mode);
    });
  }, [desktopEnabled, mode]);

  const format = formats[activeIndex] ?? formats[0]!;

  if (!desktopEnabled) {
    return (
      <div id={sectionId} className="prog-scroll-outer-mobile">
        <ProgrammaticScrollSectionMobile
          mode={mode}
          lane={lane}
          laneSwitcher={laneSwitcher}
          formats={formats}
          headerLabel={headerLabel}
          headerTitle={headerTitle}
          headerDescription={headerDescription}
        />
      </div>
    );
  }

  return (
    <div
      id={sectionId}
      ref={sectionRef}
      className="prog-scroll-outer"
      style={{ height: `calc(100dvh + ${totalVirtual}px)` }}
      aria-label="Ad formats"
    >
      <div className="prog-scroll-sticky">
        <div className="prog-scroll-ambience" aria-hidden />
        <BrandAurora tone="routes" className="prog-scroll-stage-aurora" />
        <div className="prog-scroll-sticky-inner">
          <div className="prog-scroll-headline">
            <SectionHeader label={headerLabel} title={headerTitle} description={headerDescription} />
          </div>
          <div className="prog-scroll-layout">
            {/* ── Unified 3-device spatial carousel: Phone · Tablet · TV ── */}
            <div
              className="prog-scroll-phone-col"
              style={{ position: "relative", overflow: "hidden" }}
            >
              <DeviceCarousel3
                mode={mode}
                formatId={format.id}
                scene={format.scene ?? "phone"}
                entranceProgress={entranceProgress}
                className="prog-scroll-canvas"
              />
            </div>

            <div className="prog-scroll-copy-col">
              <div className="prog-scroll-copy-stack">
                {laneSwitcher && (
                  <div className="prog-scroll-copy-tumbler">
                    {laneSwitcher}
                  </div>
                )}

                <FormatCopy
                  format={format}
                  index={activeIndex}
                  total={formats.length}
                  mode={mode}
                  reduced={false}
                  transitionDir={textTransition.dir}
                  laneDirection={textTransition.laneDir}
                  formats={formats}
                  onJump={jumpTo}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
