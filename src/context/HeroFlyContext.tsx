import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type MutableRefObject,
} from "react";
import { clamp, smoothstep } from "../lib/clamp";
import { useScroll } from "./ScrollContext";

/** Must stay in sync with Hero card reveal thresholds. */
export const HERO_CARD_REVEAL_AT = [0.18, 0.38, 0.58, 0.78] as const;

type HeroFlyContextValue = {
  /** Discrete reveal count for React (cards) — avoids per-frame Hero re-renders. */
  revealedCount: number;
  /** Continuous 0→1 for WebGL / imperative consumers. */
  progressRef: MutableRefObject<number>;
};

const HeroFlyContext = createContext<HeroFlyContextValue | null>(null);

function resolveFlyStage(cached: HTMLElement | null) {
  if (cached?.isConnected) return cached;
  return (
    (document.querySelector(".hero-stage--fly") as HTMLElement | null) ??
    (document.getElementById("hero") as HTMLElement | null)
  );
}

function flyProgressForScroll(stage: HTMLElement, scrollY: number) {
  const top = stage.getBoundingClientRect().top + scrollY;
  const runway = Math.max(stage.offsetHeight - window.innerHeight, 1);
  return clamp((scrollY - top) / runway, 0, 1);
}

function countRevealed(progress: number) {
  let n = 0;
  for (const at of HERO_CARD_REVEAL_AT) {
    if (progress >= at) n += 1;
  }
  return n;
}

/**
 * Shared Lenis progress for the pinned Hero fly runway (camera + cards + sun).
 * React only re-renders when a card threshold crosses — canvas reads progressRef.
 */
export function HeroFlyProvider({ children }: { children: ReactNode }) {
  const { registerScrollListener } = useScroll();
  const progressRef = useRef(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const stageRef = useRef<HTMLElement | null>(null);
  const lastRevealedRef = useRef(-1);

  useEffect(() => {
    const publish = (scrollY: number) => {
      const stage = resolveFlyStage(stageRef.current);
      stageRef.current = stage;
      if (!stage) {
        progressRef.current = 0;
        if (lastRevealedRef.current !== 0) {
          lastRevealedRef.current = 0;
          setRevealedCount(0);
        }
        return;
      }

      const next = flyProgressForScroll(stage, scrollY);
      progressRef.current = next;
      stage.style.setProperty("--hero-fly", next.toFixed(3));

      // Lenovo popup: appears on scroll
      const lenovoProgress = clamp((next - 0.3) / 0.25, 0, 1);
      const lenovoEase = lenovoProgress * lenovoProgress * (3 - 2 * lenovoProgress);
      
      stage.style.setProperty("--hero-lenovo-opacity", lenovoEase.toFixed(3));
      stage.style.setProperty("--hero-lenovo-y", ((1 - lenovoEase) * 150).toFixed(1));

      if (stage.dataset.lenovoDock !== (lenovoEase > 0.9 ? "1" : "0")) {
        stage.dataset.lenovoDock = lenovoEase > 0.9 ? "1" : "0";
      }

      // Soft handoff: only the last ~5% — after Lenovo is fully docked.
      const exit = clamp((next - 0.95) / 0.05, 0, 1);
      const exitEase = exit * exit * (3 - 2 * exit); // smoothstep
      stage.style.setProperty("--hero-exit", exitEase.toFixed(4));

      // Headline glued to the sticky frame: floats with the flight, doesn't fly away.
      // Soft sine drift (~±1.1vh) tracks the climb; opacity only softens on runway exit.
      const floatY = Math.sin(next * Math.PI) * 1.1;
      stage.style.setProperty("--hero-title-y", floatY.toFixed(2));
      stage.style.setProperty("--hero-title-scale", (1 - next * 0.012).toFixed(4));
      stage.style.setProperty("--hero-title-opacity", (1 - exitEase * 0.35).toFixed(4));

      // Label arrives with the first ghost figure — establish stays quiet.
      const labelIn = smoothstep(next, 0.14, 0.28);
      stage.style.setProperty("--hero-label-opacity", labelIn.toFixed(4));
      stage.style.setProperty("--hero-label-y", ((1 - labelIn) * 28).toFixed(2));

      const revealed = countRevealed(next);
      if (revealed !== lastRevealedRef.current) {
        lastRevealedRef.current = revealed;
        setRevealedCount(revealed);
      }
    };

    // Publish in the same turn as Lenis scroll notify — no deferred rAF lag vs R3F.
    const unsubscribe = registerScrollListener(publish);

    publish(window.scrollY);

    return () => {
      unsubscribe();
    };
  }, [registerScrollListener]);

  const value = useMemo(() => ({ revealedCount, progressRef }), [revealedCount]);

  return <HeroFlyContext.Provider value={value}>{children}</HeroFlyContext.Provider>;
}

export function useHeroFly() {
  const ctx = useContext(HeroFlyContext);
  if (!ctx) throw new Error("useHeroFly must be used within HeroFlyProvider");
  return ctx;
}

/** Optional — canvas may mount before provider in tests */
export function useHeroFlyOptional() {
  return useContext(HeroFlyContext);
}
