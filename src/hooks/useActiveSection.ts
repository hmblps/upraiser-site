import { useEffect, useState } from "react";
import { scrollSectionIds } from "../data/scrollSections";
import { useScroll } from "../context/ScrollContext";

const HEADER_OFFSET = 80;

function resolveActiveIndex(): number {
  let active = 0;
  const marker = HEADER_OFFSET + 8;

  for (let i = 0; i < scrollSectionIds.length; i++) {
    const el = document.getElementById(scrollSectionIds[i]);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= marker) {
      active = i;
    }
  }

  return active;
}

/** Active section index — listens through Lenis-aware scroll bus when available. */
export function useActiveSection() {
  const { registerScrollListener } = useScroll();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const update = () => setActiveIndex(resolveActiveIndex());
    update();
    const unsubscribe = registerScrollListener(update);
    window.addEventListener("resize", update);
    return () => {
      unsubscribe();
      window.removeEventListener("resize", update);
    };
  }, [registerScrollListener]);

  return activeIndex;
}
