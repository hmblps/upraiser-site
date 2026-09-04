import { useEffect, useState } from "react";

/** We now use Lenis smooth scroll on mobile as well for velocity control. */
const NATIVE_SCROLL_QUERY = "(max-width: 0px)";

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
