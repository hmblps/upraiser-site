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
  revealedCount: number;
  isVideoDriven: boolean;
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

/** Visual sticky-runway progress — do not mix Lenis scrollY with getBoundingClientRect. */
export function flyProgressForStage(stage: HTMLElement) {
  const runway = Math.max(stage.offsetHeight - window.innerHeight, 1);
  return clamp(-stage.getBoundingClientRect().top / runway, 0, 1);
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
  const [revealState, setRevealState] = useState({ count: 0, videoDriven: false });
  const revealedCount = revealState.count;
  const isVideoDriven = revealState.videoDriven;
  const stageRef = useRef<HTMLElement | null>(null);
  const lastRevealedRef = useRef(-1);

  const videoProgressRef = useRef(0);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const updateDOM = () => {
      const stage = resolveFlyStage(stageRef.current);
      stageRef.current = stage;
      if (!stage) {
        progressRef.current = 0;
        if (lastRevealedRef.current !== 0) {
          lastRevealedRef.current = 0;
          setRevealState({ count: 0, videoDriven: false });
        }
        return;
      }

      const scrollProgress = scrollProgressRef.current;
      const videoProgress = videoProgressRef.current;
      const effectiveProgress = Math.max(scrollProgress, videoProgress);
      
      progressRef.current = scrollProgress;
      stage.style.setProperty("--hero-fly", effectiveProgress.toFixed(3));

      const lenovoProgress = clamp((scrollProgress - 0.3) / 0.25, 0, 1);
      const lenovoEase = lenovoProgress * lenovoProgress * (3 - 2 * lenovoProgress);
      
      stage.style.setProperty("--hero-lenovo-opacity", lenovoEase.toFixed(3));
      stage.style.setProperty("--hero-lenovo-y", ((1 - lenovoEase) * 150).toFixed(1));

      if (stage.dataset.lenovoDock !== (lenovoEase > 0.9 ? "1" : "0")) {
        stage.dataset.lenovoDock = lenovoEase > 0.9 ? "1" : "0";
      }

      const exit = clamp((scrollProgress - 0.95) / 0.05, 0, 1);
      const exitEase = exit * exit * (3 - 2 * exit);
      stage.style.setProperty("--hero-exit", exitEase.toFixed(4));

      const floatY = 0;
      stage.style.setProperty("--hero-title-y", floatY.toFixed(2));
      stage.style.setProperty("--hero-title-scale", (1 - scrollProgress * 0.012).toFixed(4));
      stage.style.setProperty("--hero-title-opacity", (1 - exitEase * 0.35).toFixed(4));

      const labelIn = smoothstep(effectiveProgress, 0.14, 0.28);
      stage.style.setProperty("--hero-label-opacity", labelIn.toFixed(4));
      stage.style.setProperty("--hero-label-y", ((1 - labelIn) * 28).toFixed(2));

      const revealed = countRevealed(effectiveProgress);
      if (revealed !== lastRevealedRef.current) {
        lastRevealedRef.current = revealed;
        setRevealState({ count: revealed, videoDriven: videoProgress >= scrollProgress });
      }
    };

    const onScroll = () => {
      const stage = resolveFlyStage(stageRef.current);
      if (stage) {
        scrollProgressRef.current = flyProgressForStage(stage);
        updateDOM();
      }
    };

    const unsubscribe = registerScrollListener(onScroll);
    onScroll();

    const onVideoProgress = (e: Event) => {
      videoProgressRef.current = (e as CustomEvent<number>).detail;
      updateDOM();
    };
    window.addEventListener('hero-video-stats-progress', onVideoProgress);

    return () => {
      unsubscribe();
      window.removeEventListener('hero-video-stats-progress', onVideoProgress);
    };
  }, [registerScrollListener]);

  const value = useMemo(() => ({ revealedCount, isVideoDriven, progressRef }), [revealedCount, isVideoDriven]);

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

/** Drive the existing Everest camera from any 0→1 ref (Expedition fold, tests). */
export function HeroFlyProgressBridge({
  progressRef,
  children,
}: {
  progressRef: MutableRefObject<number>;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ revealedCount: 0, isVideoDriven: false, progressRef }), [progressRef]);
  return <HeroFlyContext.Provider value={value}>{children}</HeroFlyContext.Provider>;
}
