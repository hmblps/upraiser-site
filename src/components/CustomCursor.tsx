import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, label, [role="button"], [data-cursor="pointer"]';

type CursorMode = "default" | "link" | "cta" | "card";

function resolveCursorMode(element: Element | null): CursorMode {
  if (!element) return "default";
  if (element.closest('[data-cursor="cta"], a.bg-orange, .bg-orange.btn-caps')) return "cta";
  if (element.closest(".card-lift")) return "card";
  if (element.closest(INTERACTIVE_SELECTOR)) return "link";
  return "default";
}

export function CustomCursor() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer || reduced) return;

    setActive(true);
    document.body.classList.add("custom-cursor-active");

    const onMove = (event: MouseEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
      const element = document.elementFromPoint(event.clientX, event.clientY);
      const nextMode = resolveCursorMode(element);
      setMode(nextMode);
      setHovering(nextMode !== "default" || !!element?.closest(INTERACTIVE_SELECTOR));
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    const onLeave = () => {
      setHovering(false);
      setMode("default");
    };

    const animate = () => {
      current.current.x += (target.current.x - current.current.x) * 0.18;
      current.current.y += (target.current.y - current.current.y) * 0.18;

      const x = current.current.x;
      const y = current.current.y;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseleave", onLeave);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  if (!active) return null;

  const modeClass = hovering ? `is-mode-${mode}` : "";

  return (
    <div aria-hidden className="custom-cursor-root">
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${hovering ? "is-hover" : ""} ${clicking ? "is-click" : ""} ${modeClass}`.trim()}
      />
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${hovering ? "is-hover" : ""} ${clicking ? "is-click" : ""} ${modeClass}`.trim()}
      />
    </div>
  );
}
