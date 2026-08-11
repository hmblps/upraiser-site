import { useEffect } from "react";

/** Enables frosted navbar so brand aurora can wash underneath. */
export function useBrandAuroraNav() {
  useEffect(() => {
    document.documentElement.dataset.brandAurora = "1";
    return () => {
      delete document.documentElement.dataset.brandAurora;
    };
  }, []);
}
