import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, label, [role="button"], [data-cursor="pointer"]';

type CursorMode = "default" | "link" | "cta" | "card";

function resolveCursorMode(element: Element | null): CursorMode {
  if (!element) return "default";
  if (element.closest('[data-cursor="cta"], a.bg-accent, .bg-accent.btn-caps')) return "cta";
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

const SPRING_CONFIG = { stiffness: 400, damping: 30, mass: 0.5 };
const RING_SPRING_CONFIG = { stiffness: 250, damping: 35, mass: 0.8 };

export function CustomCursor() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  const dotX = useSpring(mouseX, SPRING_CONFIG);
  const dotY = useSpring(mouseY, SPRING_CONFIG);
  
  const ringX = useSpring(mouseX, RING_SPRING_CONFIG);
  const ringY = useSpring(mouseY, RING_SPRING_CONFIG);

  
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
      mouseX.set(x);
      mouseY.set(y);
      dotX.jump(x);
      dotY.jump(y);
      ringX.jump(x);
      ringY.jump(y);
    };

    const applyPoint = (x: number, y: number) => {
      if (!visibleRef.current) {
        visibleRef.current = true;
        paintClasses();
        snapTo(x, y);
        return;
      }
      const jump = Math.hypot(x - dotX.get(), y - dotY.get());
      if (jump > 140) {
        snapTo(x, y);
      } else {
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    const onMouseOver = (event: MouseEvent) => {
      const element = event.target as Element;
      const nextMode = resolveCursorMode(element);
      const nextHover = nextMode !== "default" || !!element?.closest(INTERACTIVE_SELECTOR);
      if (nextMode !== modeRef.current || nextHover !== hoveringRef.current) {
        modeRef.current = nextMode;
        hoveringRef.current = nextHover;
        paintClasses();
      }
    };
    window.addEventListener("mouseover", onMouseOver, { passive: true });
    const onMove = (event: MouseEvent) => {
      applyPoint(event.clientX, event.clientY);
    };

    const onAdCursor = (event: MessageEvent) => {
      const data = event.data as {
        source?: string;
        type?: string;
        clientX?: number;
        clientY?: number;
        hovering?: boolean;
        mode?: CursorMode;
        clicking?: boolean;
      } | null;
      if (event.origin !== window.location.origin) return;
      if (!data || data.source !== "upraiser-ad" || data.type !== "cursor") return;
      if (typeof data.clientX !== "number" || typeof data.clientY !== "number") return;

      const iframe = [...document.querySelectorAll("iframe")].find(
        (frame) => frame.contentWindow === event.source,
      );
      if (!iframe) return;

      const rect = iframe.getBoundingClientRect();
      const iw = iframe.contentWindow?.innerWidth || rect.width || 1;
      const ih = iframe.contentWindow?.innerHeight || rect.height || 1;
      applyPoint(rect.left + (data.clientX / iw) * rect.width, rect.top + (data.clientY / ih) * rect.height);

      const nextMode = data.mode === "cta" || data.mode === "link" || data.mode === "card" ? data.mode : "default";
      const nextHover = Boolean(data.hovering);
      const nextClick = data.clicking === true;
      if (
        nextMode !== modeRef.current ||
        nextHover !== hoveringRef.current ||
        (data.clicking !== undefined && nextClick !== clickingRef.current)
      ) {
        modeRef.current = nextMode;
        hoveringRef.current = nextHover;
        if (data.clicking !== undefined) clickingRef.current = nextClick;
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

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("message", onAdCursor);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("message", onAdCursor);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced, dotX, dotY, mouseX, mouseY, ringX, ringY]);

  if (!active) return null;

  return (
    <div aria-hidden className="custom-cursor-root">
      <motion.div 
        ref={ringRef} 
        className="custom-cursor-ring" 
        style={{ x: ringX, y: ringY, z: 0, willChange: "transform" }} 
      />
      <motion.div 
        ref={dotRef} 
        className="custom-cursor-dot" 
        style={{ x: dotX, y: dotY, z: 0, willChange: "transform" }} 
      />
    </div>
  );
}
