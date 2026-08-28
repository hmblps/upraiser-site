import { useEffect, type RefObject } from "react";

const DRAG_THRESHOLD_PX = 8;

function marqueeAnimation(track: HTMLElement): Animation | undefined {
  return track.getAnimations().find((animation) => {
    if (!("animationName" in animation)) return false;
    return String((animation as CSSAnimation).animationName).includes("partners-marquee");
  });
}

function currentTimeMs(animation: Animation): number {
  return typeof animation.currentTime === "number" ? animation.currentTime : 0;
}

/**
 * Click-drag scrubs a CSS marquee; release continues from the new offset.
 * A tap (no drag) still reaches child click handlers (client modal).
 */
export function useMarqueePointerDrag(trackRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const track = trackRef.current;
    const viewport = track?.parentElement;
    if (!track || !viewport) return;

    let pointerId: number | null = null;
    let startX = 0;
    let startTime = 0;
    let loopPx = 1;
    let durationMs = 1;
    let dragging = false;
    let armed = false;

    const prefersReduced = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || prefersReduced()) return;
      if (!marqueeAnimation(track)) return;

      pointerId = event.pointerId;
      startX = event.clientX;
      dragging = false;
      armed = true;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!armed || event.pointerId !== pointerId) return;

      const dx = event.clientX - startX;
      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
        const animation = marqueeAnimation(track);
        if (!animation) {
          armed = false;
          return;
        }
        dragging = true;
        animation.pause();
        startTime = currentTimeMs(animation);
        startX = event.clientX;
        loopPx = Math.max(track.scrollWidth / 2, 1);
        const durationSec = parseFloat(getComputedStyle(track).animationDuration);
        durationMs = (Number.isFinite(durationSec) ? durationSec : 52) * 1000;
        viewport.classList.add("is-marquee-dragging");
        try {
          viewport.setPointerCapture(event.pointerId);
        } catch {
          /* capture is optional — window listeners still scrub */
        }
        return;
      }

      const animation = marqueeAnimation(track);
      if (!animation) return;
      const dt = (-dx / loopPx) * durationMs;
      const wrapped = ((startTime + dt) % durationMs + durationMs) % durationMs;
      animation.currentTime = wrapped;
    };

    const finish = (event: PointerEvent) => {
      if (!armed || event.pointerId !== pointerId) return;
      const didDrag = dragging;
      armed = false;
      dragging = false;
      pointerId = null;
      viewport.classList.remove("is-marquee-dragging");
      marqueeAnimation(track)?.play();
      if (didDrag) {
        viewport.dataset.marqueeDidDrag = "1";
        requestAnimationFrame(() => {
          delete viewport.dataset.marqueeDidDrag;
        });
      }
    };

    const onClickCapture = (event: MouseEvent) => {
      if (viewport.dataset.marqueeDidDrag !== "1") return;
      event.preventDefault();
      event.stopPropagation();
      (document.activeElement as HTMLElement | null)?.blur();
    };

    viewport.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
    viewport.addEventListener("click", onClickCapture, true);

    return () => {
      viewport.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      viewport.removeEventListener("click", onClickCapture, true);
      viewport.classList.remove("is-marquee-dragging");
      delete viewport.dataset.marqueeDidDrag;
    };
  }, [trackRef]);
}
