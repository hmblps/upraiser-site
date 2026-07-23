import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { type MotionValue } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { clamp } from "../lib/clamp";
import { useScrollScene, type RunwaySceneConfig } from "./useScrollScene";

type Point = { x: number; y: number };

type MeasureOptions = {
  stageRef: RefObject<HTMLElement | null>;
  inlineRef: RefObject<HTMLElement | null>;
  heroMeasureRef: RefObject<HTMLElement | null>;
  remeasureKey: string;
};

export function useSectionMeasure({ stageRef, inlineRef, heroMeasureRef, remeasureKey }: MeasureOptions) {
  const { theme } = useTheme();
  const [points, setPoints] = useState<{ start: Point; end: Point } | null>(null);
  const pointsRef = useRef<{ start: Point; end: Point } | null>(null);
  const endScaleRef = useRef(0.22);

  useLayoutEffect(() => {
    setPoints(null);
    pointsRef.current = null;

    const measure = () => {
      const stage = stageRef.current;
      const inline = inlineRef.current;
      if (!stage || !inline) return;

      const stageBox = stage.getBoundingClientRect();
      const inlineBox = inline.getBoundingClientRect();
      if (inlineBox.width <= 0) return;

      const heroBox = heroMeasureRef.current?.getBoundingClientRect();
      const nextPoints = {
        start: { x: stageBox.width * 0.5, y: stageBox.height * 0.28 },
        end: {
          x: inlineBox.left - stageBox.left + inlineBox.width * 0.5,
          y: inlineBox.top - stageBox.top + inlineBox.height * 0.5,
        },
      };

      pointsRef.current = nextPoints;
      setPoints(nextPoints);

      if (heroBox && heroBox.width > 0) {
        endScaleRef.current = clamp(inlineBox.width / heroBox.width, 0.12, 0.72);
      }
    };

    const frame = window.requestAnimationFrame(() => {
      measure();
      window.requestAnimationFrame(measure);
    });

    const observer = new ResizeObserver(measure);
    if (stageRef.current) observer.observe(stageRef.current);
    if (inlineRef.current) observer.observe(inlineRef.current);
    if (heroMeasureRef.current) observer.observe(heroMeasureRef.current);

    window.addEventListener("resize", measure);
    document.fonts?.ready.then(() => window.requestAnimationFrame(measure));

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [remeasureKey, theme, stageRef, inlineRef, heroMeasureRef]);

  return { points, pointsRef, endScaleRef };
}

/** Sticky runway progress for accent folds — locked to scroll wheel */
export function useSectionScrollProgress(
  sectionRef: RefObject<HTMLElement | null>,
  resetKey = "",
): MotionValue<number> {
  const config: RunwaySceneConfig = { mode: "runway", resetKey, spring: false };
  return useScrollScene(sectionRef, config);
}
