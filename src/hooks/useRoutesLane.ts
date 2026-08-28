import { useState } from "react";
import { useMode } from "../components/SectionHeader";
import { AD_FORMATS, OEM_CTV_FORMATS } from "../components/solutions/ProgrammaticFormats";

export type RoutesLaneId = "app-growth" | "oem-ctv";

export const ROUTES_LANE_TABS = [
  { id: "app-growth", label: "App Growth" },
  { id: "oem-ctv", label: "OEM & CTV" },
] as const;

/** Shared lane state + copy for home Routes and legacy Solutions page. */
export function useRoutesLane() {
  const { mode } = useMode();
  const [lane, setLane] = useState<RoutesLaneId>("app-growth");

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
