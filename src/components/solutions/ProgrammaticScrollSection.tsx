import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useFormatScrollSection } from "../../hooks/useFormatScrollSection";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useHardwareTier } from "../../hooks/useHardwareTier";
import type { SiteMode } from "../../data/liveContent";
import { SectionHeader } from "../SectionHeader";
import { BrandAurora } from "../BrandAurora";
import { CanvasErrorBoundary } from "../CanvasErrorBoundary";
import { AD_FORMATS, type AdFormat } from "./ProgrammaticFormats";
import { FormatCopy } from "./FormatCopy";
import { ProgrammaticScrollSectionMobile } from "./ProgrammaticScrollSectionMobile";
import { warmStage } from "../../lib/scrollPreload";

import "../../styles/programmatic-scroll-section.css";
import "../../styles/programmatic-full-feed.css";

const Phone3D = lazy(() => import("./Phone3D").then((m) => ({ default: m.Phone3D })));
const Tablet3D = lazy(() =>
  import("../channel-visuals/Tablet3D").then((m) => ({ default: m.Tablet3D })),
);
const Tv3D = lazy(() => import("../channel-visuals/Tv3D").then((m) => ({ default: m.Tv3D })));

const DESKTOP_MIN_WIDTH = 1024;

// ─── 3-device Apple-like slide switcher ───────────────────────────────────────
// Phone · Tablet · TV occupy slots 0 · 1 · 2.
// Spring drives `phase`; three layered transforms create depth à la Emil Kowalski:
//
//   x       = (index − phase) × 100%   — hard slide, clipped by overflow:hidden
//   scale   = max(0.82, 1 − dist×0.18) — shrinks as it leaves (depth cue)
//   opacity = max(0,    1 − dist×1.15) — longer overlap while sliding
//
// Slide + soft opacity only (no CSS scale on WebGL — bilinear→native snap).
function DeviceCarousel3({
  mode,
  formatId,
  scene = "phone",
  className,
  flat = false,
}: {
  mode: SiteMode;
  formatId: string;
  scene?: "phone" | "tablet" | "tv";
  className?: string;
  /** Same GLBs, face-on — lite / Intel. */
  flat?: boolean;
}) {
  const targetPhase = scene === "tablet" ? 1 : scene === "tv" ? 2 : 0;
  const phaseRaw = useMotionValue(targetPhase);
  // Softer travel between phone → tablet → TV
  const phase = useSpring(phaseRaw, { stiffness: 160, damping: 28, mass: 0.95 });

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

  // ── Opacity — gentler crossfade so chassis never hard-cuts mid-slide ─────
  const phoneOpacity  = useTransform(phoneDist,  (d) => Math.max(0, 1 - d * 1.15));
  const tabletOpacity = useTransform(tabletDist, (d) => Math.max(0, 1 - d * 1.15));
  const tvOpacity     = useTransform(tvDist,     (d) => Math.max(0, 1 - d * 1.15));

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "visible" }}>
      {/* One WebGL device at a time — concurrent phone+tablet+TV canvases starve the
          tablet buffer (stuck 300×150) and flash the wrong chassis on format change. */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          x: phoneX,
          opacity: phoneOpacity,
          pointerEvents: scene === "phone" ? "auto" : "none",
          zIndex: scene === "phone" ? 3 : 1,
          overflow: "visible",
        }}
      >
        <div className="prog-device-slot prog-device-slot--phone" style={{ display: scene === "phone" ? undefined : "none" }}>
          <Suspense fallback={null}>
            <CanvasErrorBoundary fallback={null}>
              <Phone3D
                mode={mode}
                formatId={formatId}
                className={className}
                active={scene === "phone"}
                flat={flat}
              />
            </CanvasErrorBoundary>
          </Suspense>
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          x: tabletX,
          opacity: tabletOpacity,
          pointerEvents: scene === "tablet" ? "auto" : "none",
          /* Above copy / sticky chrome so rotate corners aren't eaten. */
          zIndex: scene === "tablet" ? 6 : 1,
          overflow: "visible",
        }}
      >
        <div className="prog-device-slot prog-device-slot--tablet" style={{ display: scene === "tablet" ? undefined : "none" }}>
          <Suspense fallback={null}>
            <CanvasErrorBoundary fallback={null}>
              <Tablet3D
                mode={mode}
                formatId={formatId}
                className={className}
                active={scene === "tablet"}
                flat={flat}
              />
            </CanvasErrorBoundary>
          </Suspense>
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          x: tvX,
          opacity: tvOpacity,
          pointerEvents: scene === "tv" ? "auto" : "none",
          zIndex: scene === "tv" ? 6 : 1,
          overflow: "visible",
        }}
      >
        <div className="prog-device-slot prog-device-slot--tv" style={{ display: scene === "tv" ? undefined : "none" }}>
          <Suspense fallback={null}>
            <CanvasErrorBoundary fallback={null}>
              <Tv3D
                mode={mode}
                formatId={formatId}
                className={className}
                active={scene === "tv"}
                flat={flat}
              />
            </CanvasErrorBoundary>
          </Suspense>
        </div>
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
  headerTitle?: React.ReactNode;
  headerDescription?: string;
};

/**
 * Native sticky scroll drives the active format — no wheel hijack.
 * Desktop high-tier: perspective GLB. Desktop lite / `?lite=1`: flat GLB
 * (phone · tablet · TV) — no CSS chassis stand-ins (avoids big→small snap).
 * Width < 1024 or reduced-motion: ProgrammaticScrollSectionMobile (same glass files).
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
  const tier = useHardwareTier();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < DESKTOP_MIN_WIDTH : false,
  );
  const desktopEnabled = !isMobile && !reduced;
  const use3d = desktopEnabled && tier === "high";

  const { activeIndex, jumpTo, totalVirtual } = useFormatScrollSection(sectionRef, {
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

  const format = formats[activeIndex] ?? formats[0]!;

  // Pre-warm TV assets immediately on section mount (not lazily on approach).
  // tv-draco.glb is only 546KB but the Draco WASM decoder needs ~400ms to
  // compile — starting that download immediately hides the latency entirely.
  useEffect(() => {
    if (!desktopEnabled) return;
    warmStage("routes-tablet");
    warmStage("routes-tv");
  }, [desktopEnabled]);

  useEffect(() => {
    if (!desktopEnabled) return;
    const scene = format.scene ?? "phone";
    if (scene === "tablet" || scene === "tv") {
      warmStage("routes-tablet");
      warmStage("routes-tv");
    } else {
      warmStage("routes");
    }

    const ahead = formats[Math.min(activeIndex + 1, formats.length - 1)];
    const aheadScene = ahead?.scene ?? "phone";
    if (aheadScene === "tablet") warmStage("routes-tablet");
    if (aheadScene === "tv") warmStage("routes-tv");
  }, [desktopEnabled, format, activeIndex, formats]);

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

        {/*
          Device stage is a sibling ABOVE sticky-inner (not nested in the
          gutter/grid). 3D TV/tablet yaw no longer gets corner-chopped by
          layout overflow / isolation on the copy column.
        */}
        <div className="prog-scroll-device-lift">
          <div className="prog-scroll-device-lift__frame" data-scene={format.scene ?? "phone"}>
            <div className="prog-scroll-phone-col prog-scroll-phone-col--lifted">
              <DeviceCarousel3
                mode={mode}
                formatId={format.id}
                scene={format.scene ?? "phone"}
                className="prog-scroll-canvas"
                flat={!use3d}
              />
            </div>
          </div>
        </div>

        <div className="prog-scroll-sticky-inner">
          <div className="prog-scroll-headline">
            <SectionHeader label={headerLabel} title={headerTitle} description={headerDescription} />
          </div>
          <div className="prog-scroll-layout">
            {/* Optical spacer — mirrors lifted device column for copy alignment */}
            <div className="prog-scroll-phone-col prog-scroll-phone-col--spacer" aria-hidden />

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
