import { useEffect, type RefObject } from "react";

/** Per-element cursor position for subtle radial highlight (desktop, fine pointer). */
export function useProximityGlow(
  elementRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const element = elementRef.current;
    if (!enabled || !element) return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const onMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      element.style.setProperty("--proximity-x", `${x.toFixed(1)}%`);
      element.style.setProperty("--proximity-y", `${y.toFixed(1)}%`);
      element.dataset.proximity = "active";
    };

    const onLeave = () => {
      element.style.setProperty("--proximity-x", "50%");
      element.style.setProperty("--proximity-y", "40%");
      delete element.dataset.proximity;
    };

    element.addEventListener("mousemove", onMove, { passive: true });
    element.addEventListener("mouseleave", onLeave);

    return () => {
      element.removeEventListener("mousemove", onMove);
      element.removeEventListener("mouseleave", onLeave);
      element.style.removeProperty("--proximity-x");
      element.style.removeProperty("--proximity-y");
      delete element.dataset.proximity;
    };
  }, [elementRef, enabled]);
}
