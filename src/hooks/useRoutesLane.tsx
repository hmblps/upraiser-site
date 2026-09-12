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

  // 6 curated formats for the unified sequence (2 phone, 2 tablet, 2 TV)
  const formats = [
    AD_FORMATS.find((f) => f.id === "banner")!,
    AD_FORMATS.find((f) => f.id === "native")!,
    AD_FORMATS.find((f) => f.id === "interstitial")!,
    AD_FORMATS.find((f) => f.id === "rich")!,
    AD_FORMATS.find((f) => f.id === "video")!,
    OEM_CTV_FORMATS.find((f) => f.id === "pre-install")!,
    OEM_CTV_FORMATS.find((f) => f.id === "oem-store")!,
    OEM_CTV_FORMATS.find((f) => f.id === "system-ui")!,
    OEM_CTV_FORMATS.find((f) => f.id === "ctv-spot")!,
    OEM_CTV_FORMATS.find((f) => f.id === "ctv-video")!,
  ];

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
