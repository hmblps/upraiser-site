import { useState, useEffect } from "react";

function isIntegratedGPU(renderer: string): boolean {
  const r = renderer.toLowerCase();
  if (/\barc\b/i.test(r) || /\brx\s*vega\b/i.test(r)) return false;
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
    r.includes("basic display") ||
    r.includes("swiftshader") ||
    r.includes("llvmpipe") ||
    // Entry-level AMD mobile iGPUs
    /\bradeon\b.*\b(610m|660m|740m|r[3457]\b)/i.test(r) ||
    // Low-end mobile & office discrete GPUs (weaker than modern iGPUs)
    r.includes("geforce mx") ||
    /\bmx\s*(110|130|150|230|250|330|350|450|550|570)\b/i.test(r) ||
    /\b(gt\s*[0-9]{3,4}|[6789][1234]0m|940mx|gtx\s*(650|745|750|850m|950m|960m)|quadro\s*(k[0-9]+|p[46]00|nvs|m[12]000)|nvs\s*[0-9]+)\b/i.test(r)
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
    /\barc\b/i.test(r) ||
    (r.includes("radeon") && (r.includes("rx ") || r.includes("rx-") || r.includes("pro") || r.includes("xt") || r.includes("780m") || r.includes("680m")))
  );
}

let cachedRenderer: string | null = null;

function getUnmaskedRenderer(): string {
  if (cachedRenderer !== null) return cachedRenderer;
  let renderer = "";
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (gl && "getExtension" in gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const value = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (typeof value === "string") renderer = value;
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    /* ignore */
  }
  cachedRenderer = renderer;
  return renderer;
}

/** Sync so Intel/weak systems never mount a WebGL canvas for one frame before falling back. */
export function detectHardwareTier(): HardwareTier {
  if (typeof window === "undefined") return "high";

  const params = new URLSearchParams(window.location.search);
  if (params.get("lite") === "1" || params.get("mode") === "lite" || params.get("tier") === "lite") return "lite";
  if (params.get("tier") === "high") return "high";
  if (window.location.port === "5174") return "lite";

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
  if (isMobile || window.innerWidth <= 899) return "lite";

  const isWindows =
    (typeof document !== "undefined" && document.documentElement.dataset.os === "windows") ||
    (typeof navigator !== "undefined" && /\b(win32|win64|windows|wow64)\b/i.test(navigator.userAgent));

  const cores = navigator.hardwareConcurrency || 8;
  const ram = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 8;

  const renderer = getUnmaskedRenderer();

  // 1. Confirmed integrated, mobile entry-level (MX/GT), or software GPU — always Lite 2D CSS
  if (renderer && isIntegratedGPU(renderer)) return "lite";

  // Firefox masks all NVIDIA GPUs (including MX130) as "GeForce GTX 980" and AMD as "Radeon R9 200"
  if (renderer && /\b(gtx\s*980|r9\s*200)\b/i.test(renderer) && cores <= 8) return "lite";

  // 2. Confirmed discrete GPU or Apple Silicon GPU — High tier 3D
  if (renderer && isAppleOrDiscreteGPU(renderer)) return "high";

  // 3. Fallback when GPU renderer info is masked / generic
  if (isWindows) {
    if (cores <= 8 || ram < 8) return "lite";
    return "high";
  }

  if (cores <= 4 || ram <= 4) return "lite";

  return "high";
}

export function useHardwareTier(): HardwareTier {
  const [tier, setTier] = useState<HardwareTier>(detectHardwareTier);

  useEffect(() => {
    const sync = () => setTier((prev) => {
      const next = detectHardwareTier();
      return prev === next ? prev : next;
    });
    sync();
    window.addEventListener("resize", sync, { passive: true });
    return () => window.removeEventListener("resize", sync);
  }, []);

  return tier;
}
