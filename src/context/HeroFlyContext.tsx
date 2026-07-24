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
import { MathUtils } from "three";
import { useScroll } from "./ScrollContext";

type HeroFlyContextValue = {
  /** 0 at pin start → 1 when sticky runway ends */
  progress: number;
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
  return MathUtils.clamp((scrollY - top) / runway, 0, 1);
}

/**
 * Shared Lenis progress for the pinned Hero fly runway (camera + cards + sun).
 */
export function HeroFlyProvider({ children }: { children: ReactNode }) {
  const { registerScrollListener } = useScroll();
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const stageRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const publish = (scrollY: number) => {
      const stage = resolveFlyStage(stageRef.current);
      stageRef.current = stage;
      if (!stage) {
        progressRef.current = 0;
        setProgress(0);
        return;
      }

      const next = flyProgressForScroll(stage, scrollY);
      progressRef.current = next;
      setProgress((prev) => (Math.abs(prev - next) > 0.001 ? next : prev));
    };

    const unsubscribe = registerScrollListener((scrollY) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => publish(scrollY));
    });

    publish(window.scrollY);

    return () => {
      unsubscribe();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [registerScrollListener]);

  const value = useMemo(() => ({ progress, progressRef }), [progress]);

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
