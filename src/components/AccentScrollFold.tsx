import { lazy, Suspense, useRef, type ReactNode, type RefObject } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { useSectionMeasure, useSectionScrollProgress } from "../hooks/useSectionScrollProgress";
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

import { clamp } from "../lib/clamp";

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
  className?: string;
};

/**
 * Shared sticky word-fold used by Audience (SCALE/PROOF) and Promise (RESULTS/CLARITY).
 */
export function AccentScrollFold({
  id,
  remountKey,
  label,
  scrollHeroWord,
  ambient = "none",
  children,
  className = "",
}: AccentScrollFoldProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inlineRef = useRef<HTMLSpanElement>(null);
  const heroMeasureRef = useRef<HTMLSpanElement>(null);

  const { mode } = useMode();
  const progress = useSectionScrollProgress(sectionRef, remountKey);
  const { points, endScaleRef } = useSectionMeasure({
    stageRef,
    inlineRef,
    heroMeasureRef,
    remeasureKey: remountKey,
  });

  const heroOpacity = useTransform(progress, [0, 0.1, 0.62, 0.74], [1, 1, 1, 0]);
  const inlineOpacity = useTransform(progress, [0, 0.66, 0.8], [0, 0, 1]);
  const lineOpacity = useTransform(progress, [0.48, 0.62], [0, 1]);
  const lineX = useTransform(progress, [0.48, 0.62], [-14, 0]);
  const bodyOpacity = useTransform(progress, [0.58, 0.72], [0, 1]);
  const bodyX = useTransform(progress, [0.58, 0.72], [-14, 0]);
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

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`accent-scroll-section accent-scroll-section--lite scroll-scene scroll-scene--fold section-band section-band--quiet ${className}`.trim()}
    >
      <div className="accent-scroll-sticky mx-auto max-w-7xl px-6 lg:px-8">
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
            <span ref={heroMeasureRef} className="accent-scroll-hero-word accent-scroll-hero-word-red opacity-0">
              {scrollHeroWord}
            </span>
          </div>

          {points ? (
            <motion.div
              aria-hidden
              className="accent-scroll-float pointer-events-none absolute z-10 origin-center"
              style={{ left: points.start.x, top: points.start.y, x, y, scale, opacity: heroOpacity }}
            >
              <span className="accent-scroll-hero-word accent-scroll-hero-word-red">{scrollHeroWord}</span>
            </motion.div>
          ) : (
            <div className="accent-scroll-float-placeholder pointer-events-none absolute inset-x-0 top-0" aria-hidden>
              <span className="accent-scroll-hero-word accent-scroll-hero-word-red opacity-0">{scrollHeroWord}</span>
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
