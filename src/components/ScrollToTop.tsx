import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useScroll } from "../context/ScrollContext";

/** Reset window scroll on route change; honor `/path#section` deep links. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const { scrollTo } = useScroll();

  useEffect(() => {
    if (hash) {
      const id = hash.replace(/^#/, "");
      if (!id) return;

      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          scrollTo(id);
          return;
        }
        attempts += 1;
        if (attempts < 20) window.setTimeout(tryScroll, 50);
      };

      const frame = window.requestAnimationFrame(tryScroll);
      return () => window.cancelAnimationFrame(frame);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash, scrollTo]);

  return null;
}
