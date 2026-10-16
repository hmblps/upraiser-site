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

/** Sticky Routes scroll — Lenis-aware progress via registerScrollListener + runwayProgress. */
/** Was 650px phone-arrival runway; entrance dolly removed → no dead intro scroll. */
const INTRO_SCROLL_PX = 0;
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
      
      // Entrance progress kept at 1 — phone no longer dollies in on scroll.
      entranceProgress.set(1);
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
    (idx: number, opts?: { immediate?: boolean; duration?: number }) => {
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
      const duration = opts?.duration ?? 0.55;

      lastIndexRef.current = clamped;
      setActiveIndex(clamped);
      indexByLaneRef.current[laneRef.current] = clamped;

      ignoreSyncRef.current = true;
      window.clearTimeout(ignoreTimerRef.current);
      ignoreTimerRef.current = window.setTimeout(
        () => {
          ignoreSyncRef.current = false;
        },
        immediate ? 280 : Math.round(duration * 1000) + 80,
      );

      scrollToY(target, { immediate, duration });
    },
    [formatCount, reduced, scrollToY, sectionRef],
  );

  // Mouse-wheel stepper: touchpad keeps continuous 1500px/card runway, while a
  // discrete mouse wheel advances 1 format per wheel gesture instead of 5 scrolls.
  useEffect(() => {
    if (!enabled) return;

    let touchpadActiveUntil = 0;
    let wheelCooldownUntil = 0;

    const onWheel = (e: WheelEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey) return;
      if (
        document.documentElement.classList.contains("case-modal-open") ||
        document.documentElement.classList.contains("scroll-locked")
      ) {
        return;
      }

      const now = performance.now();
      const absY = Math.abs(e.deltaY);
      const absX = Math.abs(e.deltaX);

      // Touchpad gestures begin with small ramp-up deltas (< 15px) or slight horizontal drift (absX > 0),
      // and continue as a high-frequency stream (frames every 8–16ms).
      // Physical mouse wheels fire discrete jumps (absY >= 15, absX === 0) with no ramp-up.
      const looksLikeTouchpadStart =
        e.deltaMode === 0 && (absX > 0 || absY < 15);

      if (looksLikeTouchpadStart || now < touchpadActiveUntil) {
        touchpadActiveUntil = now + 320;
        return;
      }

      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const isPinned = rect.top <= 24 && rect.bottom >= window.innerHeight - 24;

      if (!isPinned) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (now < wheelCooldownUntil) {
        return;
      }

      wheelCooldownUntil = now + 420;
      const dir = e.deltaY > 0 ? 1 : -1;
      const currentIdx = lastIndexRef.current;
      const nextIdx = currentIdx + dir;

      if (nextIdx >= 0 && nextIdx < formatCount) {
        jumpTo(nextIdx, { duration: 0.46 });
        return;
      }

      const sectionTop = rect.top + window.scrollY;
      const totalPinnedScroll = Math.max(0, section.offsetHeight - window.innerHeight);

      if (dir > 0 && currentIdx >= formatCount - 1) {
        scrollToY(sectionTop + totalPinnedScroll + 200, { duration: 0.46 });
      } else if (dir < 0 && currentIdx <= 0) {
        scrollToY(Math.max(0, sectionTop - 200), { duration: 0.46 });
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
    };
  }, [enabled, formatCount, jumpTo, scrollToY, sectionRef]);

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
