import { lazy, Suspense, useRef, type ReactNode, type RefObject } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { clamp } from "../lib/clamp";
import { accentScrollHeroWordClass } from "../lib/accent";
import { useSectionMeasure, useSectionScrollProgress } from "../hooks/useSectionScrollProgress";
import { useScrollScene } from "../hooks/useScrollScene";
import { useMode } from "./SectionHeader";
import { InfrastructureGrid } from "./InfrastructureGrid";

const FoldChart = lazy(() => import("./ModeChart").then((m) => ({ default: m.FoldChart })));
const FoldAreaMass = lazy(() => import("./FoldAreaMass").then((m) => ({ default: m.FoldAreaMass })));
const FraudScrollChart = lazy(() =>
  import("./FraudScrollChart").then((m) => ({ default: m.FraudScrollChart })),
);

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function inlineWordWidth(word: string) {
  return `${Math.max(word.length + 1, 7)}ch`;
}

type AccentScrollFoldProps = {
  id: string;
  remountKey: string;
  label: ReactNode;
  scrollHeroWord: string;
  /** Ambient visual in the empty fold air */
  ambient?: "chart" | "bars" | "fraud" | "none";
  children: (ctx: {
    progress: MotionValue<number>;
    inlineRef: RefObject<HTMLSpanElement | null>;
    lineOpacity: MotionValue<number>;
    lineX: MotionValue<number>;
    bodyOpacity: MotionValue<number>;
    bodyX: MotionValue<number>;
    inlineOpacity: MotionValue<number>;
  }) => ReactNode;
  /** Full-bleed layer behind sticky fold content (z-0). */
  backdrop?: (ctx: { progress: MotionValue<number> }) => ReactNode;
  /** `anchor` = natural section height, progress tied to copy block (no sticky runway) */
  runway?: "default" | "compact" | "anchor";
  className?: string;
  startLine?: number;
};

/**
 * Shared sticky word-fold used by Audience (SCALE/PROOF) and Promise (RESULTS).
 */
export function AccentScrollFold({
  id,
  remountKey,
  label,
  scrollHeroWord,
  ambient = "none",
  backdrop,
  runway = "default",
  children,
  className = "",
  startLine = 0.92,
}: AccentScrollFoldProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inlineRef = useRef<HTMLSpanElement>(null);
  const heroMeasureRef = useRef<HTMLSpanElement>(null);

  const { mode } = useMode();
  const heroWordClass = accentScrollHeroWordClass(mode);
  const runwayProgress = useSectionScrollProgress(sectionRef, remountKey);
  const anchorProgress = useScrollScene(sectionRef, {
    mode: "anchor",
    anchorRef: stageRef,
    startLine,
    endLine: 0.28,
    spring: false,
    resetKey: remountKey,
  });
  const progress = runway === "anchor" ? anchorProgress : runwayProgress;
  const { points, endScaleRef } = useSectionMeasure({
    stageRef,
    inlineRef,
    heroMeasureRef,
    remeasureKey: remountKey,
  });

  const heroOpacity = useTransform(progress, [0, 0.1, 0.52, 0.64], [1, 1, 1, 0]);
  const inlineOpacity = useTransform(progress, [0, 0.66, 0.8], [0, 0, 1]);
  const lineOpacity = useTransform(progress, [0.36, 0.52], [0, 1]);
  const lineX = useTransform(progress, [0.36, 0.52], [-14, 0]);
  const bodyOpacity = useTransform(progress, [0.64, 0.76], [0, 1]);
  const bodyX = useTransform(progress, [0.64, 0.76], [-14, 0]);
  const scale = useTransform(progress, (value) => {
    const t = clamp((value - 0.06) / 0.62, 0, 1);
    return lerp(1, endScaleRef.current, t);
  });
  const x = useTransform(progress, (value) => {
    if (!points) return 0;
    const t = clamp((value - 0.08) / 0.58, 0, 1);
    return lerp(points.start.x, points.end.x, t) - points.start.x;
  });
  const y = useTransform(progress, (value) => {
    if (!points) return 0;
    const t = clamp((value - 0.08) / 0.58, 0, 1);
    return lerp(points.start.y, points.end.y, t) - points.start.y;
  });

  const runwayClass =
    runway === "anchor"
      ? "accent-scroll-section--anchor"
      : runway === "compact"
        ? "scroll-scene--fold-compact"
        : "scroll-scene--fold";
  const sceneClass = runway === "anchor" ? "" : "scroll-scene";

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`accent-scroll-section accent-scroll-section--lite ${sceneClass} ${runwayClass} section-band section-band--quiet ${className}`.trim()}
    >
      <div className="accent-scroll-sticky section-inner relative">
        {backdrop?.({ progress })}
        {ambient === "chart" ? (
          mode === "infrastructure" ? (
            <InfrastructureGrid progress={progress} />
          ) : (
            <Suspense fallback={null}>
              <FoldChart progress={progress} />
            </Suspense>
          )
        ) : null}
        {ambient === "bars" ? (
          <Suspense fallback={null}>
            <FoldAreaMass progress={progress} />
          </Suspense>
        ) : null}
        {ambient === "fraud" ? (
          <Suspense fallback={null}>
            <FraudScrollChart progress={progress} />
          </Suspense>
        ) : null}

        {label}
        <div ref={stageRef} className="accent-scroll-stage relative mt-4 md:mt-5">
          <div className="accent-scroll-float-placeholder pointer-events-none absolute inset-x-0 top-0" aria-hidden>
            <span ref={heroMeasureRef} className={`accent-scroll-hero-word ${heroWordClass} opacity-0`}>
              {scrollHeroWord}
            </span>
          </div>

          {points ? (
            <motion.div
              aria-hidden
              className="accent-scroll-float pointer-events-none absolute z-10 origin-center"
              style={{ left: points.start.x, top: points.start.y, x, y, scale, opacity: heroOpacity }}
            >
              <span className={`accent-scroll-hero-word ${heroWordClass}`}>{scrollHeroWord}</span>
            </motion.div>
          ) : (
            <div className="accent-scroll-float-placeholder pointer-events-none absolute inset-x-0 top-0" aria-hidden>
              <span className={`accent-scroll-hero-word ${heroWordClass} opacity-0`}>{scrollHeroWord}</span>
            </div>
          )}

          <div className="accent-scroll-copy accent-scroll-copy--lite">
            {children({
              progress,
              inlineRef,
              lineOpacity,
              lineX,
              bodyOpacity,
              bodyX,
              inlineOpacity,
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
