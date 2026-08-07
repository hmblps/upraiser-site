export const routePreloaders: Record<string, () => void> = {
  "/solutions": () => {
    void import("../pages/SolutionsPage");
    void import("../components/solutions/Phone3D").then((m) => {
      m.preloadPhone3DAssets("growth");
      m.preloadPhone3DAssets("infrastructure");
    });
  },
  "/company": () => {
    void import("../pages/CompanyPage");
  },
  "/clients": () => {
    void import("../pages/ClientsPage");
  },
  "/cases": () => {
    void import("../pages/CasesPage");
  },
  "/craft": () => {
    void import("../pages/CraftPage");
  },
  "/studio": () => {
    void import("../pages/StudioPage");
  },
};

export function preloadRoute(href: string) {
  const base = href.split("?")[0]?.split("#")[0];
  if (base && routePreloaders[base]) {
    routePreloaders[base]();
  }
}

// Automatically warm up solutions & company during browser idle time
if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
  window.requestIdleCallback(() => {
    preloadRoute("/solutions");
    preloadRoute("/company");
  });
} else if (typeof window !== "undefined") {
  window.setTimeout(() => {
    preloadRoute("/solutions");
    preloadRoute("/company");
  }, 1000);
}
