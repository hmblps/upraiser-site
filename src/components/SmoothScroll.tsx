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
  const heroLockedRef = useRef(false);
  const modalStoppedRef = useRef(false);

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

  const applyScrollLock = useCallback(() => {
    const locked = heroLockedRef.current || document.documentElement.classList.contains("case-modal-open");
    const lenis = lenisRef.current;

    if (locked) {
      document.documentElement.classList.add("scroll-locked");
      if (lenis && !modalStoppedRef.current) {
        lenis.stop();
        modalStoppedRef.current = true;
      }
    } else {
      document.documentElement.classList.remove("scroll-locked");
      if (lenis && modalStoppedRef.current) {
        lenis.start();
        modalStoppedRef.current = false;
      }
    }
  }, []);

  const setScrollLocked = useCallback(
    (locked: boolean) => {
      heroLockedRef.current = locked;
      applyScrollLock();
    },
    [applyScrollLock],
  );

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
        document.documentElement.classList.remove("is-scrolling", "scroll-locked");
        if (clearScrollClassTimeoutRef.current !== null) {
          window.clearTimeout(clearScrollClassTimeoutRef.current);
        }
      };
    }

    const lenis = new Lenis({
      duration: 1.05,
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.82,
      touchMultiplier: 1,
      allowNestedScroll: true,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", (instance) => {
      notifyScroll(instance.scroll);
    });

    let running = true;

    const raf = (time: number) => {
      if (!running) return;
      if (!document.hidden) {
        const modalOpen = document.documentElement.classList.contains("case-modal-open");
        const shouldStop = modalOpen || heroLockedRef.current;
        if (shouldStop && !modalStoppedRef.current) {
          lenis.stop();
          modalStoppedRef.current = true;
          document.documentElement.classList.add("scroll-locked");
        } else if (!shouldStop && modalStoppedRef.current) {
          lenis.start();
          modalStoppedRef.current = false;
          document.documentElement.classList.remove("scroll-locked");
        }
        if (!shouldStop) lenis.raf(time);
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
      document.documentElement.classList.remove("is-scrolling", "scroll-locked");
      if (clearScrollClassTimeoutRef.current !== null) {
        window.clearTimeout(clearScrollClassTimeoutRef.current);
      }
    };
  }, [useLenis, notifyScroll]);

  return (
    <ScrollProvider
      scrollTo={scrollTo}
      jumpToSection={jumpToSection}
      registerScrollListener={registerScrollListener}
      setScrollLocked={setScrollLocked}
    >
      {children}
    </ScrollProvider>
  );
}
