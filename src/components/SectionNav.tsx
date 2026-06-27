import { useCallback, useState } from "react";
import { scrollSectionIds } from "../data/scrollSections";
import { useScroll } from "../context/ScrollContext";
import { useActiveSection } from "../hooks/useActiveSection";
import { useSectionKeyboardNav } from "../hooks/useSectionKeyboardNav";

/** Keyboard-only section navigation (↑ / ↓). No on-screen controls. */
export function SectionNav() {
  const { jumpToSection } = useScroll();
  const scrollActiveIndex = useActiveSection();
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);

  const activeIndex = pendingIndex ?? scrollActiveIndex;

  const go = useCallback(
    (direction: "up" | "down"): boolean => {
      const nextIndex = direction === "up" ? activeIndex - 1 : activeIndex + 1;
      if (nextIndex < 0 || nextIndex >= scrollSectionIds.length) return false;

      const targetId = scrollSectionIds[nextIndex];
      if (!targetId) return false;

      setPendingIndex(nextIndex);
      jumpToSection(targetId);
      requestAnimationFrame(() => setPendingIndex(null));
      return true;
    },
    [activeIndex, jumpToSection],
  );

  useSectionKeyboardNav(go);

  return null;
}
