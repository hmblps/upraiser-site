import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { usePreferNativeScroll } from "../hooks/usePreferNativeScroll";
import { isViewportPath } from "../hooks/useViewportRoute";
import { ScrollProvider } from "../context/ScrollContext";

const HEADER_OFFSET = 80;
const SCROLLING_CLASS_TIMEOUT_MS = 120;

function getSectionTop(el: HTMLElement, offset = HEADER_OFFSET) {
  return el.getBoundingClientRect().top + window.scrollY - offset;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const nativeScroll = usePreferNativeScroll();
  const { pathname } = useLocation();
  const viewportRoute = isViewportPath(pathname);
  const useLenis = !reduced && !nativeScroll;
  const lenisRef = useRef<Lenis | null>(null);
  const listenersRef = useRef(new Set<(scrollY: number) => void>());
  const clearScrollClassTimeoutRef = useRef<number | null>(null);
  const rafRef = useRef(0);
  const heroLockedRef = useRef(false);
  const modalStoppedRef = useRef(false);

  const notifyScroll = useCallback((scrollY: number) => {
    const root = document.documentElement;
    if (!root.classList.contains("is-scrolling")) {
      root.classList.add("is-scrolling");
    }
    if (clearScrollClassTimeoutRef.current !== null) {
      window.clearTimeout(clearScrollClassTimeoutRef.current);
    }
    clearScrollClassTimeoutRef.current = window.setTimeout(() => {
      root.classList.remove("is-scrolling");
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

  const scrollToY = useCallback(
    (top: number, opts?: { immediate?: boolean }) => {
      const immediate = opts?.immediate ?? false;
      if (lenisRef.current && useLenis) {
        lenisRef.current.scrollTo(top, {
          immediate,
          force: true,
          duration: immediate ? 0 : 0.95,
        });
        return;
      }
      window.scrollTo({ top, behavior: immediate || reduced ? "auto" : "smooth" });
    },
    [reduced, useLenis],
  );

  const resetScroll = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true, force: true });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    notifyScroll(0);
  }, [notifyScroll]);

  useEffect(() => {
    if (typeof history !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (!useLenis) {
      const onScroll = () => notifyScroll(window.scrollY);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });

      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        document.documentElement.scrollTop = 0;
      }

      return () => {
        window.removeEventListener("scroll", onScroll);
        document.documentElement.classList.remove("is-scrolling", "scroll-locked");
        if (clearScrollClassTimeoutRef.current !== null) {
          window.clearTimeout(clearScrollClassTimeoutRef.current);
        }
      };
    }

    const lenis = new Lenis({
      // Lower lerp and wheelMultiplier to gently cap scroll velocity for better asset preloading,
      // while keeping the feeling natural and smooth (no forced heavy dragging).
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      syncTouch: true,
      syncTouchLerp: 0.08,
      touchMultiplier: 0.9,
      allowNestedScroll: true,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", (instance) => {
      notifyScroll(instance.scroll);
    });

    const hasHash = Boolean(window.location.hash);
    let userIntent = false;
    const markUserIntent = () => {
      userIntent = true;
    };
    window.addEventListener("wheel", markUserIntent, { passive: true, once: true });
    window.addEventListener("touchstart", markUserIntent, { passive: true, once: true });
    window.addEventListener("keydown", markUserIntent, { passive: true, once: true });

    const pinTop = () => {
      if (hasHash || userIntent) return;
      lenis.scrollTo(0, { immediate: true, force: true });
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    pinTop();

    // Browser often restores scroll *after* first paint on tall pages — re-pin briefly.
    const pinUntil = performance.now() + 1000;
    const guardRestore = () => {
      if (hasHash || userIntent || performance.now() > pinUntil) return;
      if (window.scrollY > 1) {
        pinTop();
        notifyScroll(0);
      }
    };
    window.addEventListener("scroll", guardRestore, { passive: true });
    const pinTimers = [0, 50, 150, 400, 800].map((ms) => window.setTimeout(pinTop, ms));

    let running = true;

    const raf = (time: number) => {
      if (!running) return;
      if (!document.hidden) {
        const modalOpen = document.documentElement.classList.contains("case-modal-open");
        const viewportLocked = document.documentElement.classList.contains("viewport-route");
        const shouldStop = modalOpen || heroLockedRef.current || viewportLocked;
        if (shouldStop && !modalStoppedRef.current) {
          lenis.stop();
          modalStoppedRef.current = true;
          document.documentElement.classList.add("scroll-locked");
        } else if (!shouldStop && modalStoppedRef.current) {
          lenis.start();
          modalStoppedRef.current = false;
          document.documentElement.classList.remove("scroll-locked");
        }
        if (!shouldStop) {
          if (!hasHash && !userIntent && performance.now() < pinUntil) guardRestore();
          lenis.raf(time);
        }
      }
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);
    notifyScroll(hasHash ? window.scrollY : 0);

    const onVisibility = () => {
      if (!document.hidden) {
        notifyScroll(window.scrollY);
      }
    };

    const onPageShow = () => {
      if (!window.location.hash) {
        pinTop();
        notifyScroll(0);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      pinTimers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("scroll", guardRestore);
      window.removeEventListener("wheel", markUserIntent);
      window.removeEventListener("touchstart", markUserIntent);
      window.removeEventListener("keydown", markUserIntent);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onPageShow);
      lenis.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove("is-scrolling", "scroll-locked");
      if (clearScrollClassTimeoutRef.current !== null) {
        window.clearTimeout(clearScrollClassTimeoutRef.current);
      }
    };
  }, [useLenis, notifyScroll]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (viewportRoute) {
      lenis.stop();
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      notifyScroll(0);
      return;
    }
    if (!heroLockedRef.current && !document.documentElement.classList.contains("case-modal-open")) {
      lenis.start();
    }
  }, [viewportRoute, notifyScroll]);

  return (
    <ScrollProvider
      scrollTo={scrollTo}
      jumpToSection={jumpToSection}
      scrollToY={scrollToY}
      resetScroll={resetScroll}
      registerScrollListener={registerScrollListener}
      setScrollLocked={setScrollLocked}
    >
      {children}
    </ScrollProvider>
  );
}
