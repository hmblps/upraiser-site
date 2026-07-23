import { useCallback, useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { usePreferNativeScroll } from "../hooks/usePreferNativeScroll";
import { ScrollProvider } from "../context/ScrollContext";

const HEADER_OFFSET = 80;
const SCROLLING_CLASS_TIMEOUT_MS = 120;

function getSectionTop(el: HTMLElement, offset = HEADER_OFFSET) {
  return el.getBoundingClientRect().top + window.scrollY - offset;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const nativeScroll = usePreferNativeScroll();
  const useLenis = !reduced && !nativeScroll;
  const lenisRef = useRef<Lenis | null>(null);
  const listenersRef = useRef(new Set<(scrollY: number) => void>());
  const clearScrollClassTimeoutRef = useRef<number | null>(null);
  const rafRef = useRef(0);

  const notifyScroll = useCallback((scrollY: number) => {
    document.documentElement.classList.add("is-scrolling");
    if (clearScrollClassTimeoutRef.current !== null) {
      window.clearTimeout(clearScrollClassTimeoutRef.current);
    }
    clearScrollClassTimeoutRef.current = window.setTimeout(() => {
      document.documentElement.classList.remove("is-scrolling");
      clearScrollClassTimeoutRef.current = null;
    }, SCROLLING_CLASS_TIMEOUT_MS);
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
      return () => {
        window.removeEventListener("scroll", onScroll);
        document.documentElement.classList.remove("is-scrolling");
        if (clearScrollClassTimeoutRef.current !== null) {
          window.clearTimeout(clearScrollClassTimeoutRef.current);
        }
      };
    }

    const lenis = new Lenis({
      duration: 0.72,
      lerp: 0.14,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
      allowNestedScroll: true,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", (instance) => {
      notifyScroll(instance.scroll);
    });

    let running = true;
    let modalStopped = false;

    const raf = (time: number) => {
      if (!running) return;
      if (!document.hidden) {
        const modalOpen = document.documentElement.classList.contains("case-modal-open");
        if (modalOpen && !modalStopped) {
          lenis.stop();
          modalStopped = true;
        } else if (!modalOpen && modalStopped) {
          lenis.start();
          modalStopped = false;
        }
        if (!modalOpen) lenis.raf(time);
      }
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);
    notifyScroll(window.scrollY);

    const onVisibility = () => {
      if (!document.hidden) {
        notifyScroll(window.scrollY);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove("is-scrolling");
      if (clearScrollClassTimeoutRef.current !== null) {
        window.clearTimeout(clearScrollClassTimeoutRef.current);
      }
    };
  }, [useLenis, notifyScroll]);

  return (
    <ScrollProvider scrollTo={scrollTo} jumpToSection={jumpToSection} registerScrollListener={registerScrollListener}>
      {children}
    </ScrollProvider>
  );
}
