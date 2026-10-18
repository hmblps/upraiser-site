import { DESKTOP_HERO_QUERY } from "./heroDesktop";
import { DRACO_PATH, MODEL_URL, MODEL_URL_LIGHT } from "./heroModel";

const preloaded = new Set<string>();

export function isDesktopHeroViewport() {
  return typeof window !== "undefined" && window.matchMedia(DESKTOP_HERO_QUERY).matches;
}

export function heroModelUrl(theme: "light" | "dark") {
  return theme === "light" ? MODEL_URL_LIGHT : MODEL_URL;
}

export function preloadFetch(
  href: string,
  as: "fetch" | "script" = "fetch",
  priority: "high" | "low" = "high",
) {
  if (typeof document === "undefined" || preloaded.has(href)) return;
  preloaded.add(href);
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;
  link.crossOrigin = "anonymous";
  link.setAttribute("fetchpriority", priority);
  document.head.appendChild(link);
}

/** Network-only: GLB + Draco before R3F parses. No-op while HeroAtmosphere uses video mode. */
export function preloadHeroTerrain(_theme: "light" | "dark") {
  // 3D hero terrain is currently disabled in HeroAtmosphere (use3d = false);
  // skip preloading /hero/mountain-light-baked.glb and /hero/snow005/* textures.
}

/** Resolves when the mountain GLB is in cache. Voyager must not block first paint. */
export function whenHeroTerrainBytes(theme: "light" | "dark") {
  preloadHeroTerrain(theme);
  if (typeof fetch === "undefined") return Promise.resolve();
  const wasm = `${DRACO_PATH}draco_decoder.wasm`;
  return Promise.all([
    fetch(heroModelUrl(theme), { credentials: "same-origin" }),
    fetch(wasm, { credentials: "same-origin" }),
  ]).then(() => undefined);
}
