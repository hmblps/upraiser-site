import { useEffect, useRef, useState, type RefObject } from "react";

/** Three sets: start in the middle so right (and left) scroll can wrap forever. */
export const CASE_CAROUSEL_COPIES = 3;

type Options = {
  itemCount: number;
};

function measureSetWidth(el: HTMLElement) {
  const first = el.querySelector<HTMLElement>('[data-case-copy="0"][data-case-index="0"]');
  const second = el.querySelector<HTMLElement>('[data-case-copy="1"][data-case-index="0"]');
  if (first && second) {
    const delta = second.offsetLeft - first.offsetLeft;
    if (delta > 0) return delta;
  }
  return el.scrollWidth / CASE_CAROUSEL_COPIES;
}

export function useInfiniteCaseCarousel(ref: RefObject<HTMLElement | null>, { itemCount }: Options) {
  const [activeIndex, setActiveIndex] = useState(0);
  const wrappingRef = useRef(false);
  const setWidthRef = useRef(0);
  const readyRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || itemCount <= 0) return;

    const measure = () => {
      setWidthRef.current = measureSetWidth(el);
    };

    const updateActiveIndex = () => {
      const setWidth = setWidthRef.current;
      if (setWidth <= 0) return;

      const loopOffset = ((el.scrollLeft % setWidth) + setWidth) % setWidth;
      const card = el.querySelector<HTMLElement>('[data-case-copy="0"][data-case-index="0"]');
      const step = (card?.offsetWidth ?? 0) + 20;
      if (step <= 0) return;

      const index = Math.round(loopOffset / step) % itemCount;
      setActiveIndex(Math.max(0, Math.min(itemCount - 1, index)));
    };

    const wrapScroll = () => {
      if (wrappingRef.current) return;

      const setWidth = setWidthRef.current;
      if (setWidth <= 0) return;

      // Middle copy is the live lane. Crossing into copy 2 or past the start of copy 0 wraps.
      if (el.scrollLeft >= setWidth * 2) {
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
    // Land on the middle copy so rightward scroll has room to wrap.
    el.scrollLeft = setWidthRef.current;
    readyRef.current = true;
    updateActiveIndex();

    const onScroll = () => {
      if (!readyRef.current) return;
      wrapScroll();
    };

    const resizeObserver = new ResizeObserver(() => {
      const prevWidth = setWidthRef.current;
      const loopOffset =
        prevWidth > 0 ? ((el.scrollLeft % prevWidth) + prevWidth) % prevWidth : 0;
      measure();
      const nextWidth = setWidthRef.current;
      if (nextWidth > 0) {
        wrappingRef.current = true;
        el.scrollLeft = nextWidth + loopOffset;
        wrappingRef.current = false;
      }
      updateActiveIndex();
    });

    resizeObserver.observe(el);
    el.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      readyRef.current = false;
      resizeObserver.disconnect();
      el.removeEventListener("scroll", onScroll);
    };
  }, [ref, itemCount]);

  const scrollByCard = (direction: "left" | "right") => {
    const el = ref.current;
    if (!el) return;

    const card = el.querySelector<HTMLElement>('[data-case-copy="0"]');
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

    const setWidth = setWidthRef.current || measureSetWidth(el);
    const card = el.querySelector<HTMLElement>(
      `[data-case-copy="1"][data-case-index="${index}"]`,
    );
    if (card) {
      const left = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
      el.scrollTo({ left: Math.max(setWidth, left), behavior: "smooth" });
      return;
    }

    el.querySelector<HTMLElement>(
      `[data-case-copy="0"][data-case-index="${index}"]`,
    )?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return { activeIndex, scrollByCard, scrollToIndex };
}
