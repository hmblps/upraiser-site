import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { useScroll } from "../context/ScrollContext";
import { useTheme } from "../context/ThemeContext";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

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
        start: { x: stageBox.width * 0.5, y: stageBox.height * 0.34 },
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

/** Scroll progress 0→1 through a sticky accent section. Uses getBoundingClientRect (Lenis-safe). */
export function useSectionScrollProgress(sectionRef: RefObject<HTMLElement | null>, resetKey = ""): MotionValue<number> {
  const { registerScrollListener } = useScroll();
  const progress = useMotionValue(0);

  useLayoutEffect(() => {
    const update = () => {
      const node = sectionRef.current;
      if (!node) return;

      const scrollRange = node.offsetHeight - window.innerHeight;
      if (scrollRange <= 0) {
        progress.set(0);
        return;
      }

      // Negative top = how far the section has scrolled past the viewport top
      const scrolled = -node.getBoundingClientRect().top;
      progress.set(clamp(scrolled / scrollRange, 0, 1));
    };

    update();
    const unsubscribe = registerScrollListener(update);
    const observer = new ResizeObserver(update);
    if (sectionRef.current) observer.observe(sectionRef.current);
    window.addEventListener("resize", update);

    return () => {
      unsubscribe();
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [progress, registerScrollListener, resetKey, sectionRef]);

  return useSpring(progress, { stiffness: 220, damping: 36, restDelta: 0.002, mass: 0.65 });
}
