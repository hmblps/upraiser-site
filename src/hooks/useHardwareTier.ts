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

function isAppleOrDiscreteGPU(renderer: string): boolean {
  const r = renderer.toLowerCase();
  return (
    r.includes("apple") ||
    r.includes("metal") ||
    r.includes("nvidia") ||
    r.includes("geforce") ||
    r.includes("radeon") ||
    r.includes("amd ")
  );
}

/** Sync so Intel never mounts a WebGL canvas for one frame before falling back. */
function detectHardwareTier(): HardwareTier {
  if (typeof window === "undefined") return "high";

  const params = new URLSearchParams(window.location.search);
  if (params.get("lite") === "1" || params.get("mode") === "lite") return "lite";

  let renderer = "";
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl && "getExtension" in gl) {
      const debugInfo = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const value = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (typeof value === "string") renderer = value;
      }
    }
  } catch {
    /* ignore */
  }

  // Mac / NVIDIA / AMD — never CSS-fallback a discrete or Apple GPU because
  // Chrome sometimes reports hardwareConcurrency 4 or deviceMemory 4.
  if (renderer && isAppleOrDiscreteGPU(renderer)) return "high";
  if (renderer && isIntegratedGPU(renderer)) return "lite";

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
  const cores = navigator.hardwareConcurrency || 8;
  const ram = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 8;

  if (isMobile || cores <= 4 || ram <= 4) return "lite";
  if (window.innerWidth <= 899) return "lite";

  return "high";
}

export function useHardwareTier(): HardwareTier {
  const [tier, setTier] = useState<HardwareTier>(detectHardwareTier);

  useEffect(() => {
    const sync = () => setTier(detectHardwareTier());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return tier;
}
