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
