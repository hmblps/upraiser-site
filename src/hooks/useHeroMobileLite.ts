import { useEffect, useState } from "react";

const MOBILE_LITE_QUERY = "(max-width: 767px), (pointer: coarse)";

export function useHeroMobileLite() {
  const [mobileLite, setMobileLite] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(MOBILE_LITE_QUERY).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_LITE_QUERY);
    const sync = () => setMobileLite(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return mobileLite;
}
