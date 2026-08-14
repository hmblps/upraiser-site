export const routePreloaders: Record<string, () => void> = {
  "/": () => {
    void import("../components/solutions/Phone3D").then((m) => {
      m.preloadPhone3DAssets("growth");
      m.preloadPhone3DAssets("infrastructure");
    });
  },
  "/expedition": () => {
    void import("../pages/ExpeditionPage");
  },
  "/craft": () => {
    void import("../pages/CraftPage");
  },
};

export function preloadRoute(href: string) {
  const base = href.split("?")[0]?.split("#")[0];
  if (base && routePreloaders[base]) {
    routePreloaders[base]();
  }
}

// Automatically warm up assets during browser idle time
if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
  window.requestIdleCallback(() => {
    preloadRoute("/");
    preloadRoute("/expedition");
  });
} else if (typeof window !== "undefined") {
  window.setTimeout(() => {
    preloadRoute("/");
    preloadRoute("/expedition");
  }, 1000);
}
