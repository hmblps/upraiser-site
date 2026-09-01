import { warmFromHref } from "./scrollPreload";

export function preloadRoute(href: string) {
  warmFromHref(href);

  const base = href.split("?")[0]?.split("#")[0];
  if (!base || base === "/") return;

  
  if (base === "/craft") {
    void import("../pages/CraftPage");
  }
}
