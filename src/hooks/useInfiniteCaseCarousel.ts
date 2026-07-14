import { useEffect, useRef, useState, type RefObject } from "react";

/** Off-screen clone set for seamless manual loop (not shown as extra cards on screen). */
export const CASE_CAROUSEL_COPIES = 2;

type Options = {
  itemCount: number;
};

export function useInfiniteCaseCarousel(ref: RefObject<HTMLElement | null>, { itemCount }: Options) {
  const [activeIndex, setActiveIndex] = useState(0);
  const wrappingRef = useRef(false);
  const setWidthRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || itemCount <= 0) return;

    const measure = () => {
      setWidthRef.current = el.scrollWidth / CASE_CAROUSEL_COPIES;
    };

    const updateActiveIndex = () => {
      const setWidth = setWidthRef.current;
      if (setWidth <= 0) return;

      const loopOffset = ((el.scrollLeft % setWidth) + setWidth) % setWidth;
      const loopMax = Math.max(setWidth - el.clientWidth, 1);
      const ratio = loopOffset / loopMax;
      setActiveIndex(Math.round(ratio * Math.max(itemCount - 1, 0)));
    };

    const wrapScroll = () => {
      if (wrappingRef.current) return;

      const setWidth = setWidthRef.current;
      if (setWidth <= 0) return;

      if (el.scrollLeft >= setWidth) {
        wrappingRef.current = true;
        el.scrollLeft -= setWidth;
        wrappingRef.current = false;
      } else if (el.scrollLeft <= 0) {
        wrappingRef.current = true;
        el.scrollLeft += setWidth;
        wrappingRef.current = false;
      }

      updateActiveIndex();
    };

    measure();
    el.scrollLeft = 1;

    const onScroll = () => wrapScroll();

    const resizeObserver = new ResizeObserver(() => {
      measure();
      wrapScroll();
    });

    resizeObserver.observe(el);
    el.addEventListener("scroll", onScroll, { passive: true });
    updateActiveIndex();

    return () => {
      resizeObserver.disconnect();
      el.removeEventListener("scroll", onScroll);
    };
  }, [ref, itemCount]);

  const scrollByCard = (direction: "left" | "right") => {
    const el = ref.current;
    if (!el) return;

    const card = el.querySelector('[data-case-copy="0"]') as HTMLElement | null;
    const cardWidth = card?.offsetWidth ?? 420;
    const gap = 20;

    el.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (index: number) => {
    const el = ref.current;
    if (!el) return;

    const card = el.querySelector(`[data-case-copy="0"][data-case-index="${index}"]`) as HTMLElement | null;
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  return { activeIndex, scrollByCard, scrollToIndex };
}
