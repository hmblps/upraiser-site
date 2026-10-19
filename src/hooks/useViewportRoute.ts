import { useState, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/** Routes that must fit one viewport — no page scroll, no partners/footer runway. */
const VIEWPORT_PREFIXES = [
  "/company",
  "/contact",
] as const;

export function isViewportPath(pathname: string) {
  if (pathname === "/" || pathname === "/contact/sent") return false;
  return VIEWPORT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Locks document scroll while on inner viewport pages — ONLY on desktop screens (>= 1024px).
 * On mobile/tablets (< 1024px), contact briefing is a tall scrollable form and must scroll naturally. */
export function useViewportRoute() {
  const { pathname } = useLocation();
  const isPath = isViewportPath(pathname);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 1024;
  });

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsDesktop(mq.matches);
    setIsDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const active = isPath && isDesktop;

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!active) {
      root.classList.remove("viewport-route");
      return;
    }
    root.classList.add("viewport-route");
    return () => root.classList.remove("viewport-route");
  }, [active]);

  return active;
}
