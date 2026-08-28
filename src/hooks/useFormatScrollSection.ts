import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useMotionValue } from "framer-motion";
import { useScroll } from "../context/ScrollContext";
import {
  FORMAT_SCROLL_ITEM_HEIGHT,
  formatScrollTargetY,
  progressToFormatIndex,
} from "../lib/formatScroll";

type UseFormatScrollSectionOptions = {
  enabled: boolean;
  formatCount: number;
  reduced: boolean;
  /** App Growth vs OEM — each lane keeps its own format index. */
  lane?: string;
};

/**
 * Sticky Routes scroll — Lenis-aware progress via registerScrollListener + runwayProgress.
 */
const INTRO_SCROLL_PX = 650; // Phone arrives before copy is fully read

export function useFormatScrollSection(
  sectionRef: RefObject<HTMLElement | null>,
  { enabled, formatCount, reduced, lane = "app-growth" }: UseFormatScrollSectionOptions,
) {
  const { scrollToY, registerScrollListener } = useScroll();
  const [activeIndex, setActiveIndex] = useState(0);
  const entranceProgress = useMotionValue(0);
  const lastIndexRef = useRef(0);
  const indexByLaneRef = useRef<Record<string, number>>({});
  const laneRef = useRef(lane);
  const ignoreSyncRef = useRef(false);
  const pendingJumpRef = useRef<number | null>(null);
  const ignoreTimerRef = useRef(0);

  if (laneRef.current !== lane) {
    indexByLaneRef.current[laneRef.current] = lastIndexRef.current;
    const restore = Math.min(indexByLaneRef.current[lane] ?? 0, Math.max(0, formatCount - 1));
    laneRef.current = lane;
    lastIndexRef.current = restore;
    pendingJumpRef.current = restore;
    setActiveIndex(restore);
  }

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    const sync = () => {
      raf = 0;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      
      // Entrance progress covers both the scroll into view (innerHeight) + pinned intro (INTRO_SCROLL_PX)
      const scrolledInPx = window.innerHeight - rect.top;
      const totalIntroPx = window.innerHeight + INTRO_SCROLL_PX;
      const rawEntrance = scrolledInPx / totalIntroPx;
      entranceProgress.set(Math.max(0, Math.min(1, rawEntrance)));

      // Content progress starts ONLY AFTER the intro scroll is finished
      const totalPinnedScroll = section.offsetHeight - window.innerHeight;
      const contentScrollable = totalPinnedScroll - INTRO_SCROLL_PX;
      const contentScrollPx = -rect.top - INTRO_SCROLL_PX;
      
      let contentP = 0;
      if (contentScrollable > 0 && contentScrollPx > 0) {
        contentP = Math.min(1, contentScrollPx / contentScrollable);
      }
      
      const next = progressToFormatIndex(contentP, formatCount);
      if (ignoreSyncRef.current) {
        if (next === lastIndexRef.current) ignoreSyncRef.current = false;
        else return;
      }
      if (next !== lastIndexRef.current) {
        lastIndexRef.current = next;
        setActiveIndex(next);
        indexByLaneRef.current[laneRef.current] = next;
      }
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(sync);
    };

    schedule();
    const offScroll = registerScrollListener(schedule);
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      offScroll();
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled, formatCount, registerScrollListener, sectionRef, entranceProgress]);

  const jumpTo = useCallback(
    (idx: number, opts?: { immediate?: boolean }) => {
      const section = sectionRef.current;
      if (!section) return;
      const clamped = Math.min(Math.max(0, idx), Math.max(0, formatCount - 1));
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const contentTarget = formatScrollTargetY(
        sectionTop,
        section.offsetHeight - INTRO_SCROLL_PX,
        clamped,
        formatCount,
      );
      const target = contentTarget + INTRO_SCROLL_PX;
      const immediate = opts?.immediate ?? reduced;

      lastIndexRef.current = clamped;
      setActiveIndex(clamped);
      indexByLaneRef.current[laneRef.current] = clamped;

      if (immediate) {
        ignoreSyncRef.current = true;
        window.clearTimeout(ignoreTimerRef.current);
        ignoreTimerRef.current = window.setTimeout(() => {
          ignoreSyncRef.current = false;
        }, 280);
      }

      scrollToY(target, { immediate });
    },
    [formatCount, reduced, scrollToY, sectionRef],
  );

  useEffect(() => {
    const pending = pendingJumpRef.current;
    if (pending === null) return;
    pendingJumpRef.current = null;
    if (!enabled) return;
    jumpTo(pending, { immediate: true });
  }, [lane, enabled, jumpTo]);

  const totalVirtual = (formatCount * FORMAT_SCROLL_ITEM_HEIGHT) + INTRO_SCROLL_PX;

  return { activeIndex, jumpTo, totalVirtual, entranceProgress };
}
