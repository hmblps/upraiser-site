import { useEffect, useState } from "react";
import { scrollSectionIds } from "../data/scrollSections";

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

export function useActiveSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const update = () => setActiveIndex(resolveActiveIndex());

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return activeIndex;
}
