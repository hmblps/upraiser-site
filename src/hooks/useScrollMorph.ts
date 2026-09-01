import { useEffect } from "react";
import { type MotionValue, useMotionValue } from "framer-motion";
import { clamp } from "../lib/clamp";

type Options = {
  /** Scroll progress slice start */
  start?: number;
  /** Scroll progress slice end (mapped to morph 1) */
  span?: number;
  /** Lerp factor per frame toward target morph (0–1) */
  lerp?: number;
  /** Optional easing on raw scroll before lerp target */
  ease?: (t: number) => number;
};

function easeOutQuad(t: number) {
  return 1 - (1 - t) * (1 - t);
}

/** 
 * Smooth scroll-driven 0→1 morph — rAF lerp decouples from scroll event cadence.
 * Andy Kowalski Note: Returning a MotionValue instead of React State guarantees
 * ZERO React renders during scroll. Updates go straight to DOM via motion styles.
 */
export function useScrollMorph(progress: MotionValue<number>, enabled: boolean, options: Options = {}) {
  const { start = 0.02, span = 0.78, lerp = 0.1, ease = easeOutQuad } = options;
  const morph = useMotionValue(0);

  useEffect(() => {
    if (!enabled) {
      morph.set(0);
      return;
    }

    let target = 0;
    let current = morph.get();
    let raf = 0;
    let active = true;

    const mapProgress = (value: number) => ease(clamp((value - start) / span, 0, 1));

    const syncTarget = (value: number) => {
      target = mapProgress(value);
    };

    syncTarget(progress.get());
    const unsub = progress.on("change", syncTarget);

    const tick = () => {
      if (!active) return;
      const delta = target - current;
      if (Math.abs(delta) > 0.00015) {
        current += delta * lerp;
        morph.set(current); // Goes directly to framer-motion subscribers, bypassing React tree
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      active = false;
      unsub();
      cancelAnimationFrame(raf);
    };
  }, [enabled, progress, start, span, lerp, ease, morph]);

  return morph;
}
