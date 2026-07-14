import { useCallback, useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { usePreferNativeScroll } from "../hooks/usePreferNativeScroll";
import { ScrollProvider } from "../context/ScrollContext";

const HEADER_OFFSET = 80;

function getSectionTop(el: HTMLElement, offset = HEADER_OFFSET) {
  return el.getBoundingClientRect().top + window.scrollY - offset;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const nativeScroll = usePreferNativeScroll();
  const useLenis = !reduced && !nativeScroll;
  const lenisRef = useRef<Lenis | null>(null);
  const listenersRef = useRef(new Set<(scrollY: number) => void>());

  const notifyScroll = useCallback((scrollY: number) => {
    listenersRef.current.forEach((listener) => listener(scrollY));
  }, []);

  const registerScrollListener = useCallback((listener: (scrollY: number) => void) => {
    listenersRef.current.add(listener);
    listener(window.scrollY);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const scrollTo = useCallback(
    (targetId: string, offset = -HEADER_OFFSET) => {
      const el = document.getElementById(targetId);
      if (!el) return;

      if (lenisRef.current && useLenis) {
        lenisRef.current.scrollTo(el, { offset, duration: 1.05 });
        return;
      }

      window.scrollTo({ top: getSectionTop(el, -offset), behavior: reduced ? "auto" : "smooth" });
    },
    [reduced, useLenis],
  );

  const jumpToSection = useCallback((targetId: string) => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const top = getSectionTop(el);

    if (lenisRef.current) {
      lenisRef.current.scrollTo(top, { immediate: true, force: true });
      return;
    }

    window.scrollTo({ top, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (!useLenis) {
      const onScroll = () => notifyScroll(window.scrollY);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      duration: 1.05,
      lerp: 0.085,
      smoothWheel: true,
      touchMultiplier: 1.2,
      allowNestedScroll: true,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", (instance) => {
      notifyScroll(instance.scroll);
    });

    let frame = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);
    notifyScroll(window.scrollY);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [useLenis, notifyScroll]);

  return (
    <ScrollProvider scrollTo={scrollTo} jumpToSection={jumpToSection} registerScrollListener={registerScrollListener}>
      {children}
    </ScrollProvider>
  );
}
