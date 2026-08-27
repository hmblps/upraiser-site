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
};

/**
 * Sticky Routes scroll — Lenis-aware progress via registerScrollListener + runwayProgress.
 */
const INTRO_SCROLL_PX = 650; // Phone arrives before copy is fully read

export function useFormatScrollSection(
  sectionRef: RefObject<HTMLElement | null>,
  { enabled, formatCount, reduced }: UseFormatScrollSectionOptions,
) {
  const { scrollToY, registerScrollListener } = useScroll();
  const [activeIndex, setActiveIndex] = useState(0);
  const entranceProgress = useMotionValue(0);
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
  }, [enabled, formatCount, registerScrollListener, sectionRef, entranceProgress]);

  const jumpTo = useCallback(
    (idx: number) => {
      const section = sectionRef.current;
      if (!section) return;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      
      // Target for formats must account for the intro offset!
      // jumpTo currently uses formatScrollTargetY which might not know about INTRO_SCROLL_PX
      // We will offset it manually
      const contentTarget = formatScrollTargetY(sectionTop, section.offsetHeight - INTRO_SCROLL_PX, idx, formatCount);
      const target = contentTarget + INTRO_SCROLL_PX;
      
      lastIndexRef.current = idx;
      setActiveIndex(idx);
      scrollToY(target, { immediate: reduced });
    },
    [formatCount, reduced, scrollToY, sectionRef],
  );

  const totalVirtual = (formatCount * FORMAT_SCROLL_ITEM_HEIGHT) + INTRO_SCROLL_PX;

  return { activeIndex, jumpTo, totalVirtual, entranceProgress };
}
