import { useMode } from "../components/SectionHeader";
import { AD_FORMATS, OEM_CTV_FORMATS } from "../components/solutions/ProgrammaticFormats";

export type RoutesLaneId = "app-growth" | "oem-ctv" | "unified";

export const ROUTES_LANE_TABS = [
  { id: "app-growth", label: "App Growth" },
  { id: "oem-ctv", label: "OEM & CTV" },
] as const;

/** Unified sequential flow: Phone -> Tablet -> TV */
export function useRoutesLane() {
  const { mode } = useMode();

  const formats = [...AD_FORMATS, ...OEM_CTV_FORMATS];

  const headerTitle = (
    <>
      Every Format<br />
      <span className="text-accent">One Supply Path</span>
    </>
  );

  const headerDescription = "From in-app display to living-room CTV. Equipment for altitude on a direct supply path you can defend.";

  return {
    mode,
    lane: "unified", // keep for compatibility if used internally
    setLane: () => {},
    formats,
    headerLabel: "The Routes" as const,
    headerTitle,
    headerDescription,
  };
}
