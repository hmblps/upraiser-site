import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useScroll } from "../context/ScrollContext";

/** Reset window scroll on route change; `/path#section` deep links are aligned by SmoothScroll. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const { resetScroll } = useScroll();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const prevPath = prevPathRef.current;
    prevPathRef.current = pathname;

    if (hash) {
      return;
    }

    if (pathname.startsWith("/cases")) {
      return;
    }

    if (prevPath.startsWith("/cases") && pathname === "/") {
      return;
    }

    resetScroll();
    const timers = [40, 120, 320].map((ms) => window.setTimeout(resetScroll, ms));
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [pathname, hash, resetScroll]);

  return null;
}
