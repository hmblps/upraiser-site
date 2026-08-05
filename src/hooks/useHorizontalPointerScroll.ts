import { useEffect, type RefObject } from "react";
import { useReducedMotion } from "./useReducedMotion";

type HorizontalScrollOptions = {
  wheel?: boolean;
  /**
   * When true, vertical wheel/trackpad pans the carousel.
   * Default `"viewport-locked"` — only when `html.viewport-route` (e.g. /cases).
   */
  mapVertical?: boolean | "viewport-locked";
};

const DRAG_THRESHOLD_PX = 8;

/** Mouse drag + wheel → horizontal scroll for overflow-x carousels (desktop). */
export function useHorizontalPointerScroll(
  ref: RefObject<HTMLElement | null>,
  { wheel = true, mapVertical = "viewport-locked" }: HorizontalScrollOptions = {},
) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let snapRestoreTimer: ReturnType<typeof setTimeout> | undefined;

    const shouldMapVertical = () => {
      if (mapVertical === true) return true;
      if (mapVertical === false) return false;
      return document.documentElement.classList.contains("viewport-route");
    };

    const onWheel = (event: WheelEvent) => {
      if (!wheel) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 1) return;

      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);
      if (absX < 0.5 && absY < 0.5) return;

      let delta = 0;
      if (absX > absY) {
        delta = event.deltaX;
      } else if (shouldMapVertical()) {
        // Locked viewport pages have nowhere for vertical scroll to go — drive the deck.
        delta = event.deltaY;
      } else {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      // Mandatory snap rejects small scrollLeft nudges; disable briefly for wheel/trackpad.
      el.style.scrollSnapType = "none";
      el.scrollLeft += delta;

      clearTimeout(snapRestoreTimer);
      snapRestoreTimer = setTimeout(() => {
        el.style.scrollSnapType = "";
      }, 150);
    };

    if (wheel) {
      el.addEventListener("wheel", onWheel, { passive: false });
    }

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) {
      return () => {
        if (wheel) el.removeEventListener("wheel", onWheel);
      };
    }

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startScrollLeft = 0;
    let activePointerId: number | null = null;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || event.pointerType !== "mouse") return;
      // Don't steal the gesture until the pointer actually drags —
      // Responsively / DevTools mobile panes still report pointer:fine.
      dragging = true;
      moved = false;
      activePointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = el.scrollLeft;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== activePointerId) return;
      const dx = event.clientX - startX;
      if (!moved && Math.abs(dx) < DRAG_THRESHOLD_PX) return;

      if (!moved) {
        moved = true;
        el.classList.add("is-drag-scrolling");
        el.style.scrollSnapType = "none";
        // Capture only after a real drag so clicks on cards still fire.
        if (!el.hasPointerCapture(event.pointerId)) {
          el.setPointerCapture(event.pointerId);
        }
      }
      el.scrollLeft = startScrollLeft - dx;
    };

    const endDrag = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== activePointerId) return;
      dragging = false;
      activePointerId = null;
      el.classList.remove("is-drag-scrolling");
      el.style.scrollSnapType = "";
      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }
      // Keep `moved` until click capture sees it (same event turn / next click).
      window.setTimeout(() => {
        moved = false;
      }, 0);
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      clearTimeout(snapRestoreTimer);
      el.style.scrollSnapType = "";
      if (wheel) el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("click", onClickCapture, true);
      el.classList.remove("is-drag-scrolling");
    };
  }, [ref, reduced, wheel, mapVertical]);
}
