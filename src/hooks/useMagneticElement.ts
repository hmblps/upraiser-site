import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useMagneticElement<T extends HTMLElement>(strength = 0.32): RefObject<T | null> {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const enabled = !reduced;

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) {
      if (node) node.style.transform = "";
      return;
    }

    const onMove = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      node.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
    };

    const onLeave = () => {
      node.style.transform = "translate3d(0, 0, 0)";
    };

    node.addEventListener("mousemove", onMove);
    node.addEventListener("mouseleave", onLeave);

    return () => {
      node.removeEventListener("mousemove", onMove);
      node.removeEventListener("mouseleave", onLeave);
      node.style.transform = "";
    };
  }, [enabled, strength]);

  return ref;
}
