import { useState, useEffect } from "react";

export function useWeakHardware() {
  const [weak, setWeak] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 4;
    setWeak(isMobile || cores <= 4);
  }, []);
  return weak;
}
