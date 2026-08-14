import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useScroll } from "../context/ScrollContext";
import {
  FORMAT_SCROLL_ITEM_HEIGHT,
  formatScrollTargetY,
  progressToFormatIndex,
} from "../lib/formatScroll";
import { runwayProgress } from "../lib/scrollScene";

type UseFormatScrollSectionOptions = {
  enabled: boolean;
  formatCount: number;
  reduced: boolean;
};

/**
 * Sticky Routes scroll — Lenis-aware progress via registerScrollListener + runwayProgress.
 */
export function useFormatScrollSection(
  sectionRef: RefObject<HTMLElement | null>,
  { enabled, formatCount, reduced }: UseFormatScrollSectionOptions,
) {
  const { scrollToY, registerScrollListener } = useScroll();
  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndexRef = useRef(0);

  useEffect(() => {
    lastIndexRef.current = 0;
    setActiveIndex(0);
  }, [formatCount]);

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    const sync = () => {
      raf = 0;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const progress = runwayProgress(rect.top, section.offsetHeight, window.innerHeight);
      const next = progressToFormatIndex(progress, formatCount);
      if (next !== lastIndexRef.current) {
        lastIndexRef.current = next;
        setActiveIndex(next);
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
  }, [enabled, formatCount, registerScrollListener, sectionRef]);

  const jumpTo = useCallback(
    (idx: number) => {
      const section = sectionRef.current;
      if (!section) return;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const target = formatScrollTargetY(sectionTop, section.offsetHeight, idx, formatCount);
      lastIndexRef.current = idx;
      setActiveIndex(idx);
      scrollToY(target, { immediate: reduced });
    },
    [formatCount, reduced, scrollToY, sectionRef],
  );

  const totalVirtual = formatCount * FORMAT_SCROLL_ITEM_HEIGHT;

  return { activeIndex, jumpTo, totalVirtual };
}
