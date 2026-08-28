/**
 * Scroll-synced preload: Everest owns the network until it is on screen,
 * then each home block warms the next one as it approaches the viewport.
 *
 *   hero  →  mid (audience/process)  →  routes phone  →  tablet  →  tv
 *         →  cases  →  promise
 *
 * `warmStage` is idempotent. Routes 3D never starts until `markHeroReady`.
 */

export type PreloadStage =
  | "mid"
  | "routes"
  | "routes-tablet"
  | "routes-tv"
  | "cases"
  | "promise";

const warmed = new Set<string>();
let heroReady = false;
const afterHero: Array<() => void> = [];

export function isHeroReady() {
  return heroReady;
}

export function markHeroReady() {
  if (heroReady) return;
  heroReady = true;
  const queued = afterHero.splice(0);
  for (const fn of queued) fn();
}

/** Run `fn` now, or as soon as Everest has painted. Returns unsubscribe. */
export function whenHeroReady(fn: () => void): () => void {
  if (heroReady) {
    fn();
    return () => {};
  }
  afterHero.push(fn);
  return () => {
    const i = afterHero.indexOf(fn);
    if (i >= 0) afterHero.splice(i, 1);
  };
}

function once(id: string, run: () => void) {
  if (warmed.has(id)) return;
  warmed.add(id);
  run();
}

export function warmStage(id: PreloadStage) {
  once(id, () => {
    switch (id) {
      case "mid":
        whenHeroReady(() => {
          void import("../components/Audience");
          void import("../components/Process");
        });
        break;
      case "routes":
        whenHeroReady(() => {
          void import("../components/solutions/ProgrammaticScrollSection");
          void import("../components/RoutesLaneSwitcher");
          void import("../components/solutions/Phone3D").then((m) => {
            m.preloadPhone3DAssets("growth");
          });
        });
        break;
      case "routes-tablet":
        whenHeroReady(() => {
          void import("../components/channel-visuals/Tablet3D");
        });
        break;
      case "routes-tv":
        whenHeroReady(() => {
          void import("../components/channel-visuals/Tv3D");
        });
        break;
      case "cases":
        void import("../components/CaseStudies");
        break;
      case "promise":
        whenHeroReady(() => {
          void import("../components/PromiseSection");
        });
        break;
      default:
        break;
    }
  });
}

export function warmFromHref(href: string) {
  const hash = href.includes("#") ? href.slice(href.indexOf("#") + 1) : "";
  if (hash === "routes") {
    warmStage("routes");
    return;
  }
  if (hash === "cases") {
    warmStage("cases");
    return;
  }
  if (hash === "promise" || hash === "pilot") {
    warmStage("promise");
  }
}

if (typeof window !== "undefined") {
  window.setTimeout(() => markHeroReady(), 4000);
}
