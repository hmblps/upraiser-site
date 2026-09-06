import { useState, useEffect } from "react";

function isIntegratedGPU(renderer: string): boolean {
  const r = renderer.toLowerCase();
  return (
    r.includes("intel") || 
    r.includes("uhd") || 
    r.includes("iris") || 
    r.includes("hd graphics") ||
    r.includes("mali") ||
    r.includes("adreno") ||
    r.includes("powervr")
  );
}

export type HardwareTier = "high" | "lite";

export function useHardwareTier(): HardwareTier {
  const [tier, setTier] = useState<HardwareTier>("high");
  
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Developer override
    const params = new URLSearchParams(window.location.search);
    if (params.get("lite") === "1" || params.get("mode") === "lite") {
      setTier("lite");
      return;
    }

    // 1. Mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // 2. Weak CPU or low RAM
    const cores = navigator.hardwareConcurrency || 4;
    // @ts-ignore
    const ram = navigator.deviceMemory || 8;
    
    if (isMobile || cores <= 4 || ram <= 4) {
      setTier("lite");
      return;
    }

    // 3. Detect integrated GPU via WebGL
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (gl) {
        const debugInfo = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          if (renderer && isIntegratedGPU(renderer)) {
            console.log("[useHardwareTier] Integrated GPU detected:", renderer);
            setTier("lite");
            return;
          }
        }
      }
    } catch (e) {
      // Ignore
    }

    // 4. Force fallback if screen is very narrow
    if (window.innerWidth <= 899) {
      setTier("lite");
      return;
    }

    setTier("high");
  }, []);
  
  return tier;
}
