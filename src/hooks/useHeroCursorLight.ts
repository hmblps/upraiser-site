import { useEffect, type RefObject } from "react";

type Options = {
  defaultX?: number;
  defaultY?: number;
  lerp?: number;
  minY?: number;
  maxY?: number;
};

export function useHeroCursorLight(
  containerRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  { defaultX = 74, defaultY = 36, lerp = 0.1, minY, maxY }: Options = {},
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!enabled || !container) return;

    const clampY = (value: number) => {
      let y = value;
      if (minY !== undefined) y = Math.max(minY, y);
      if (maxY !== undefined) y = Math.min(maxY, y);
      return y;
    };

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) {
      container.style.setProperty("--hero-light-x", `${defaultX}%`);
      container.style.setProperty("--hero-light-y", `${clampY(defaultY)}%`);
      return;
    }

    let targetX = defaultX;
    let targetY = clampY(defaultY);
    let currentX = defaultX;
    let currentY = clampY(defaultY);
    let rafId = 0;

    const onMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relX = ((event.clientX - rect.left) / rect.width) * 100;
      const relY = ((event.clientY - rect.top) / rect.height) * 100;
      const inside = relX >= 0 && relX <= 100 && relY >= 0 && relY <= 100;

      if (!inside) {
        targetX = defaultX;
        targetY = clampY(defaultY);
        return;
      }

      targetX = relX;
      targetY = clampY(relY);
    };

    const tick = () => {
      currentX += (targetX - currentX) * lerp;
      currentY += (targetY - currentY) * lerp;
      container.style.setProperty("--hero-light-x", `${currentX.toFixed(2)}%`);
      container.style.setProperty("--hero-light-y", `${currentY.toFixed(2)}%`);
      rafId = requestAnimationFrame(tick);
    };

    container.style.setProperty("--hero-light-x", `${defaultX}%`);
    container.style.setProperty("--hero-light-y", `${clampY(defaultY)}%`);

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      container.style.removeProperty("--hero-light-x");
      container.style.removeProperty("--hero-light-y");
    };
  }, [containerRef, enabled, defaultX, defaultY, lerp, minY, maxY]);
}
