import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { useScroll } from "../context/ScrollContext";
import { useReducedMotion } from "./useReducedMotion";
import { anchorProgress, runwayProgress, viewportBandProgress } from "../lib/scrollScene";

const SPRING_SOFT = { stiffness: 128, damping: 34, restDelta: 0.0008, mass: 0.9 };
const SPRING_LOCKED = { stiffness: 900, damping: 90, restDelta: 0.001, mass: 0.35 };

type ScrollSceneBase = {
  resetKey?: string;
  spring?: boolean;
};

export type RunwaySceneConfig = ScrollSceneBase & {
  mode: "runway";
  enterOffset?: number;
};

export type AnchorSceneConfig = ScrollSceneBase & {
  mode: "anchor";
  anchorRef: RefObject<HTMLElement | null>;
  startLine?: number;
  endLine?: number;
};

export type ViewportBandSceneConfig = ScrollSceneBase & {
  mode: "viewportBand";
  bandStart?: number;
  bandEnd?: number;
  heightBias?: number;
};

export type ScrollSceneConfig = RunwaySceneConfig | AnchorSceneConfig | ViewportBandSceneConfig;

export function useScrollScene(
  sectionRef: RefObject<HTMLElement | null>,
  config: ScrollSceneConfig,
): MotionValue<number> {
  const { registerScrollListener } = useScroll();
  const raw = useMotionValue(0);
  const progress = useSpring(raw, config.spring ? SPRING_SOFT : SPRING_LOCKED);

  const mode = config.mode;
  const resetKey = config.resetKey ?? "";
  const enterOffset = config.mode === "runway" ? config.enterOffset ?? 0 : 0;
  const anchorRef = config.mode === "anchor" ? config.anchorRef : null;
  const startLine = config.mode === "anchor" ? config.startLine ?? 0.88 : 0.88;
  const endLine = config.mode === "anchor" ? config.endLine ?? 0.22 : 0.22;
  const bandStart = config.mode === "viewportBand" ? config.bandStart ?? 0.72 : 0.72;
  const bandEnd = config.mode === "viewportBand" ? config.bandEnd ?? 0.28 : 0.28;
  const heightBias = config.mode === "viewportBand" ? config.heightBias ?? 0.35 : 0.35;

  useLayoutEffect(() => {
    const anchorObserved = { current: null as Element | null };

    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const viewport = window.innerHeight;
      const sectionTop = section.getBoundingClientRect().top;
      const sectionHeight = section.offsetHeight;

      if (mode === "runway") {
        raw.set(runwayProgress(sectionTop, sectionHeight, viewport, enterOffset));
        return;
      }

      if (mode === "anchor") {
        const anchor = anchorRef?.current;
        if (!anchor) {
          raw.set(0);
          return;
        }
        const box = anchor.getBoundingClientRect();
        raw.set(anchorProgress(box.top, box.height, viewport, startLine, endLine));
        return;
      }

      raw.set(viewportBandProgress(sectionTop, sectionHeight, viewport, bandStart, bandEnd, heightBias));
    };

    update();
    const unsubscribe = registerScrollListener(update);
    const observer = new ResizeObserver(update);

    const maybeObserveAnchor = () => {
      const anchor = anchorRef?.current;
      if (anchor && anchorObserved.current !== anchor) {
        observer.observe(anchor);
        anchorObserved.current = anchor;
      }
    };

    if (sectionRef.current) observer.observe(sectionRef.current);
    maybeObserveAnchor();

    const anchorPoll = window.setInterval(maybeObserveAnchor, 200);
    window.addEventListener("resize", update);

    return () => {
      unsubscribe();
      observer.disconnect();
      window.clearInterval(anchorPoll);
      window.removeEventListener("resize", update);
    };
  }, [
    anchorRef,
    bandEnd,
    bandStart,
    enterOffset,
    endLine,
    heightBias,
    mode,
    raw,
    registerScrollListener,
    resetKey,
    sectionRef,
    startLine,
  ]);

  return progress;
}

/** Desktop ≥768px + motion ok — gate for runway scrollytelling */
export function useScrollRunwayEnabled() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reduced) {
      setEnabled(false);
      return;
    }
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduced]);

  return enabled;
}
