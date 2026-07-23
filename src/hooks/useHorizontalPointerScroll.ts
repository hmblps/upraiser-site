import { useEffect, type RefObject } from "react";
import { useReducedMotion } from "./useReducedMotion";

/** Mouse drag + wheel → horizontal scroll for overflow-x carousels (desktop). Touch unchanged. */
export function useHorizontalPointerScroll(ref: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let snapRestoreTimer: ReturnType<typeof setTimeout> | undefined;

    const onWheel = (event: WheelEvent) => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 1) return;

      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);

      if (absY >= absX || absX === 0) return;

      const delta = event.deltaX;
      const infinite = el.classList.contains("cases-carousel-loop");
      const forward = delta > 0;
      const atStart = el.scrollLeft <= 1;
      const atEnd = el.scrollLeft >= maxScroll - 1;

      if (!infinite && ((forward && atEnd) || (!forward && atStart))) return;

      event.preventDefault();
      event.stopPropagation();

      el.style.scrollSnapType = "none";
      el.scrollLeft += delta;

      clearTimeout(snapRestoreTimer);
      snapRestoreTimer = setTimeout(() => {
        el.style.scrollSnapType = "";
      }, 150);
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) {
      return () => el.removeEventListener("wheel", onWheel);
    }

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startScrollLeft = 0;
    let activePointerId: number | null = null;
    const DRAG_THRESHOLD = 18;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || event.pointerType !== "mouse") return;
      dragging = true;
      moved = false;
      startX = event.clientX;
      startScrollLeft = el.scrollLeft;
      activePointerId = event.pointerId;
      // Capture only after real drag — otherwise card clicks never fire.
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging || activePointerId !== event.pointerId) return;
      const dx = event.clientX - startX;
      if (!moved && Math.abs(dx) > DRAG_THRESHOLD) {
        moved = true;
        el.classList.add("is-drag-scrolling");
        try {
          el.setPointerCapture(event.pointerId);
        } catch {
          /* ignore */
        }
      }
      if (moved) el.scrollLeft = startScrollLeft - dx;
    };

    const endDrag = (event: PointerEvent) => {
      if (!dragging || (activePointerId !== null && activePointerId !== event.pointerId)) return;
      dragging = false;
      activePointerId = null;
      el.classList.remove("is-drag-scrolling");
      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }
      // Keep `moved` through the click event, then clear on next tick.
      if (moved) {
        window.setTimeout(() => {
          moved = false;
        }, 0);
      }
    };

    const onClickCapture = (event: MouseEvent) => {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      clearTimeout(snapRestoreTimer);
      el.style.scrollSnapType = "";
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("click", onClickCapture, true);
      el.classList.remove("is-drag-scrolling");
    };
  }, [ref, reduced]);
}
