import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Routes that must fit one viewport — no page scroll, no partners/footer runway. */
const VIEWPORT_PREFIXES = [
  "/studio",
  "/cases",
  "/clients",
  "/company",
  "/contact",
] as const;

export function isViewportPath(pathname: string) {
  if (pathname === "/") return false;
  return VIEWPORT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Locks document scroll while on inner viewport pages. */
export function useViewportRoute() {
  const { pathname } = useLocation();
  const active = isViewportPath(pathname);

  useEffect(() => {
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
