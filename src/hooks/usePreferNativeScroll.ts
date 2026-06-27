import { useEffect, useState } from "react";

/** Touch / mobile — native scroll instead of Lenis (lighter, scroll blocks stay in sync). */
const NATIVE_SCROLL_QUERY = "(max-width: 767px), (pointer: coarse)";

export function usePreferNativeScroll() {
  const [nativeScroll, setNativeScroll] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(NATIVE_SCROLL_QUERY).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(NATIVE_SCROLL_QUERY);
    const sync = () => setNativeScroll(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return nativeScroll;
}
