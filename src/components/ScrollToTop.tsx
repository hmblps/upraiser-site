import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useScroll } from "../context/ScrollContext";

/** Reset window scroll on route change; honor `/path#section` deep links. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const { scrollTo, resetScroll } = useScroll();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    const prevPath = prevPathRef.current;
    prevPathRef.current = pathname;

    if (hash) {
      const id = hash.replace(/^#/, "");
      if (!id) return;

      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          window.setTimeout(() => scrollTo(id), 150);
          return;
        }
        attempts += 1;
        if (attempts < 30) window.setTimeout(tryScroll, 50);
      };

      const frame = window.requestAnimationFrame(tryScroll);
      return () => window.cancelAnimationFrame(frame);
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
  }, [pathname, hash, scrollTo, resetScroll]);

  return null;
}
