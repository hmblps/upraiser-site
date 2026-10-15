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
    r.includes("powervr") ||
    r.includes("radeon(tm) graphics") ||
    r.includes("radeon graphics") ||
    r.includes("vega") ||
    r.includes("microsoft basic render") ||
    r.includes("swiftshader") ||
    r.includes("llvmpipe")
  );
}

export type HardwareTier = "high" | "lite";

function isAppleOrDiscreteGPU(renderer: string): boolean {
  const r = renderer.toLowerCase();
  if (isIntegratedGPU(r)) return false;
  return (
    r.includes("apple") ||
    r.includes("metal") ||
    r.includes("nvidia") ||
    r.includes("geforce") ||
    r.includes("rtx") ||
    r.includes("gtx") ||
    r.includes("quadro") ||
    r.includes("tesla") ||
    (r.includes("radeon") && (r.includes("rx ") || r.includes("rx-") || r.includes("pro") || r.includes("xt")))
  );
}

/** Sync so Intel/weak systems never mount a WebGL canvas for one frame before falling back. */
function detectHardwareTier(): HardwareTier {
  if (typeof window === "undefined") return "high";

  const params = new URLSearchParams(window.location.search);
  if (params.get("lite") === "1" || params.get("mode") === "lite" || params.get("tier") === "lite") return "lite";
  if (params.get("tier") === "high") return "high";
  if (window.location.port === "5174") return "lite";

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
  if (isMobile || window.innerWidth <= 899) return "lite";

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

  // 1. Confirmed integrated or software GPU — always fallback to Lite CSS
  if (renderer && isIntegratedGPU(renderer)) return "lite";

  // 2. Confirmed discrete or Apple Silicon GPU — High tier 3D
  if (renderer && isAppleOrDiscreteGPU(renderer)) return "high";

  // 3. Fallback when GPU renderer info is masked / generic
  const isWindows =
    (typeof document !== "undefined" && document.documentElement.dataset.os === "windows") ||
    (typeof navigator !== "undefined" && (
      /Windows/i.test(navigator.userAgent) ||
      navigator.userAgent.toLowerCase().includes("win")
    ));

  const cores = navigator.hardwareConcurrency || 8;
  const ram = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 8;

  // Weak office Windows machines (<= 8 cores or <= 8GB RAM) default to Lite CSS,
  // while high-end rigs (> 8 cores and > 8GB RAM) or Apple Macs run 3D.
  if (isWindows) {
    if (cores <= 8 || ram <= 8) return "lite";
    return "high";
  }

  if (cores <= 4 || ram <= 4) return "lite";

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
