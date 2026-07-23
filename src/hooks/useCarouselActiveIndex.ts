import { useEffect, useState, type RefObject } from "react";

export function useCarouselActiveIndex(
  containerRef: RefObject<HTMLElement | null>,
  itemCount: number,
  cellSelector = ".hero-stats__cell",
) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || itemCount <= 1) {
      setActiveIndex(0);
      return;
    }

    const update = () => {
      const firstCell = container.querySelector(cellSelector) as HTMLElement | null;
      if (!firstCell) return;

      const styles = getComputedStyle(container);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
      const step = firstCell.offsetWidth + gap;
      if (step <= 0) return;

      const index = Math.round(container.scrollLeft / step);
      setActiveIndex(Math.min(itemCount - 1, Math.max(0, index)));
    };

    update();
    container.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      container.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [cellSelector, containerRef, itemCount]);

  return activeIndex;
}
