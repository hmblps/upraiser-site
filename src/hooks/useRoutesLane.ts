import { useEffect, useState } from "react";
import { useMode } from "../components/SectionHeader";
import type { SiteMode } from "../data/liveContent";
import { AD_FORMATS, OEM_CTV_FORMATS } from "../components/solutions/ProgrammaticFormats";

export type RoutesLaneId = "app-growth" | "oem-ctv";

export const ROUTES_LANE_TABS = [
  { id: "app-growth", label: "App Growth" },
  { id: "oem-ctv", label: "OEM & CTV" },
] as const;

function preloadPhoneGlb(mode: SiteMode) {
  const href = mode === "growth" ? "/phones/deep-blue.glb" : "/phones/orange.glb";
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "fetch";
  link.href = href;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
  return () => {
    link.remove();
  };
}

/** Shared lane state + copy for home Routes and legacy Solutions page. */
export function useRoutesLane() {
  const { mode } = useMode();
  const [lane, setLane] = useState<RoutesLaneId>("app-growth");

  useEffect(() => preloadPhoneGlb(mode), [mode]);

  const formats = lane === "app-growth" ? AD_FORMATS : OEM_CTV_FORMATS;

  const headerTitle =
    lane === "app-growth" ? "Every Format. One Supply Path." : "OEM & CTV. Measured supply";

  const headerDescription =
    lane === "app-growth"
      ? "Equipment for altitude. Formats on a direct supply path You can defend."
      : "Pre-install, OEM storefronts, and CTV. Fixed lines that survive procurement.";

  return {
    mode,
    lane,
    setLane,
    formats,
    headerLabel: "The Routes" as const,
    headerTitle,
    headerDescription,
  };
}
