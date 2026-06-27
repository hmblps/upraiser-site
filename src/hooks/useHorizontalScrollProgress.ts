import { useEffect, useState, type RefObject } from "react";

export function useHorizontalScrollProgress(ref: RefObject<HTMLElement | null>, itemCount: number) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element || itemCount <= 1) return;

    const onScroll = () => {
      const maxScroll = element.scrollWidth - element.clientWidth;
      if (maxScroll <= 0) {
        setActiveIndex(0);
        return;
      }
      const ratio = element.scrollLeft / maxScroll;
      setActiveIndex(Math.round(ratio * (itemCount - 1)));
    };

    onScroll();
    element.addEventListener("scroll", onScroll, { passive: true });
    return () => element.removeEventListener("scroll", onScroll);
  }, [ref, itemCount]);

  return activeIndex;
}
