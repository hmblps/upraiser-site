import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, label, [role="button"], [data-cursor="pointer"]';

type CursorMode = "default" | "link" | "cta" | "card";

function resolveCursorMode(element: Element | null): CursorMode {
  if (!element) return "default";
  if (element.closest('[data-cursor="cta"], a.bg-orange, .bg-orange.btn-caps')) return "cta";
  if (element.closest(".card-lift")) return "card";
  if (element.closest('[data-cursor="link"], ' + INTERACTIVE_SELECTOR)) return "link";
  return "default";
}

function syncCursorClasses(
  el: HTMLElement | null,
  { hovering, clicking, mode, visible }: { hovering: boolean; clicking: boolean; mode: CursorMode; visible: boolean },
) {
  if (!el) return;
  el.classList.toggle("is-hover", hovering);
  el.classList.toggle("is-click", clicking);
  el.classList.toggle("is-mode-link", mode === "link");
  el.classList.toggle("is-mode-cta", mode === "cta");
  el.classList.toggle("is-mode-card", mode === "card");
  el.classList.toggle("is-visible", visible);
}

/**
 * Imperative cursor — no React setState on the mousemove hot path
 * (elementFromPoint + re-renders were fighting Lenis / WebGL).
 */
export function CustomCursor() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const current = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const frameRef = useRef(0);
  const hitTestUntil = useRef(0);
  const modeRef = useRef<CursorMode>("default");
  const hoveringRef = useRef(false);
  const clickingRef = useRef(false);
  const visibleRef = useRef(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer || reduced) return;

    setActive(true);
    document.body.classList.add("custom-cursor-active");

    const paintClasses = () => {
      const state = {
        hovering: hoveringRef.current,
        clicking: clickingRef.current,
        mode: modeRef.current,
        visible: visibleRef.current,
      };
      syncCursorClasses(dotRef.current, state);
      syncCursorClasses(ringRef.current, state);
    };

    const snapTo = (x: number, y: number) => {
      target.current.x = x;
      target.current.y = y;
      current.current.x = x;
      current.current.y = y;
      ring.current.x = x;
      ring.current.y = y;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };

    const onMove = (event: MouseEvent) => {
      const x = event.clientX;
      const y = event.clientY;

      if (!visibleRef.current) {
        visibleRef.current = true;
        paintClasses();
        snapTo(x, y);
      } else {
        // Fast jumps (route change / tab return) — snap so the trail doesn't "lose" the pointer
        const jump = Math.hypot(x - current.current.x, y - current.current.y);
        if (jump > 140) {
          snapTo(x, y);
        } else {
          target.current.x = x;
          target.current.y = y;
        }
      }

      const now = performance.now();
      if (now < hitTestUntil.current) return;
      hitTestUntil.current = now + 48;

      const element = document.elementFromPoint(x, y);
      const nextMode = resolveCursorMode(element);
      const nextHover = nextMode !== "default" || !!element?.closest(INTERACTIVE_SELECTOR);
      if (nextMode !== modeRef.current || nextHover !== hoveringRef.current) {
        modeRef.current = nextMode;
        hoveringRef.current = nextHover;
        paintClasses();
      }
    };

    const onDown = () => {
      clickingRef.current = true;
      paintClasses();
    };
    const onUp = () => {
      clickingRef.current = false;
      paintClasses();
    };
    const onLeave = () => {
      visibleRef.current = false;
      hoveringRef.current = false;
      modeRef.current = "default";
      paintClasses();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        visibleRef.current = false;
        paintClasses();
      }
    };

    const animate = () => {
      const tx = target.current.x;
      const ty = target.current.y;

      current.current.x += (tx - current.current.x) * 0.42;
      current.current.y += (ty - current.current.y) * 0.42;
      ring.current.x += (tx - ring.current.x) * 0.22;
      ring.current.y += (ty - ring.current.y) * 0.22;

      const dx = current.current.x;
      const dy = current.current.y;
      const rx = ring.current.x;
      const ry = ring.current.y;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  if (!active) return null;

  return (
    <div aria-hidden className="custom-cursor-root">
      <div ref={ringRef} className="custom-cursor-ring" />
      <div ref={dotRef} className="custom-cursor-dot" />
    </div>
  );
}
