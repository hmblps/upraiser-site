import { DESKTOP_HERO_QUERY } from "./heroDesktop";
import { DRACO_PATH, MODEL_URL, MODEL_URL_LIGHT, SNOW_COLOR_URL, SNOW_NORMAL_URL, SNOW_ROUGH_URL, VOYAGER_URL } from "./heroModel";

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

/** Network-only: GLB + Draco before R3F parses. Safe to call more than once. */
export function preloadHeroTerrain(theme: "light" | "dark") {
  if (!isDesktopHeroViewport()) return;
  preloadFetch(heroModelUrl(theme), "fetch", "high");
  preloadFetch(`${DRACO_PATH}draco_decoder.wasm`, "fetch", "high");
  preloadFetch(`${DRACO_PATH}draco_wasm_wrapper.js`, "script", "high");
  if (theme === "light") {
    preloadFetch(SNOW_COLOR_URL, "fetch", "low");
    preloadFetch(SNOW_NORMAL_URL, "fetch", "low");
    preloadFetch(SNOW_ROUGH_URL, "fetch", "low");
  } else {
    preloadFetch(VOYAGER_URL, "fetch", "low");
  }
}

/** Resolves when the active GLB bytes are in cache (parse still happens in R3F). */
export function whenHeroTerrainBytes(theme: "light" | "dark") {
  preloadHeroTerrain(theme);
  const fetches = [fetch(heroModelUrl(theme), { credentials: "same-origin" }).then(() => undefined)];
  if (theme === "dark") {
    fetches.push(fetch(VOYAGER_URL, { credentials: "same-origin" }).then(() => undefined));
  }
  if (typeof fetch === "undefined") return Promise.resolve();
  return Promise.all(fetches).then(() => undefined);
}
