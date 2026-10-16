import { useEffect, useState } from "react";

function checkReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  // Windows OS (especially LTSC / Best Performance preset) disables desktop window animations
  // by default, which forces prefers-reduced-motion: reduce in Chromium even when users
  // expect normal web scrolling and animations.
  const isWindows =
    document.documentElement.dataset.os === "windows" ||
    /Win/i.test(navigator.platform || "") ||
    /Windows/i.test(navigator.userAgent || "");
  if (isWindows) {
    return new URLSearchParams(window.location.search).get("reducedMotion") === "1";
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(checkReducedMotion);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(checkReducedMotion());
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
