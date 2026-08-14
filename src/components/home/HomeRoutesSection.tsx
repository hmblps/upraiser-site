import { useEffect, useState, type ReactNode } from "react";
import { SlideTabs } from "../SlideTabs";
import { useMode } from "../SectionHeader";
import { ProgrammaticScrollSection } from "../solutions/ProgrammaticScrollSection";
import { AD_FORMATS, OEM_CTV_FORMATS } from "../solutions/ProgrammaticFormats";

/**
 * Home `#routes` — same sticky phone + format scroll as `/solutions`, embedded in the pitch.
 */
export function HomeRoutesSection() {
  const { mode } = useMode();
  const [lane, setLane] = useState<"app-growth" | "oem-ctv">("app-growth");

  useEffect(() => {
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
  }, [mode]);

  const laneTabs = [
    { id: "app-growth", label: "App Growth" },
    { id: "oem-ctv", label: "OEM & CTV" },
  ];

  const laneSwitcher: ReactNode = (
    <SlideTabs
      items={laneTabs}
      activeId={lane}
      onChange={(id) => setLane(id === "oem-ctv" ? "oem-ctv" : "app-growth")}
      layoutId="home-routes-lane-pill"
      className="format-lane-tabs"
    />
  );

  const headerTitle = lane === "app-growth" ? "Every Format. One Supply Path." : "OEM & CTV. Measured supply";
  const headerDescription =
    lane === "app-growth"
      ? "Equipment for altitude. Formats on a direct supply path You can defend."
      : "Pre-install, OEM storefronts, and CTV. Fixed lines that survive procurement.";

  return (
    <ProgrammaticScrollSection
      key={lane}
      sectionId="routes"
      mode={mode}
      laneSwitcher={laneSwitcher}
      formats={lane === "app-growth" ? AD_FORMATS : OEM_CTV_FORMATS}
      headerLabel="The Routes"
      headerTitle={headerTitle}
      headerDescription={headerDescription}
    />
  );
}
