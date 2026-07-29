import { useState, type ReactNode } from "react";
import { primaryCta } from "../data/liveContent";
import { DepthCloseCta } from "../components/DepthCloseCta";
import { SectionHeader, useMode } from "../components/SectionHeader";
import { SlideTabs } from "../components/SlideTabs";
import { ProgrammaticScrollSection } from "../components/solutions/ProgrammaticScrollSection";
import { AD_FORMATS, OEM_CTV_FORMATS } from "../components/solutions/ProgrammaticFormats";

/**
 * Solutions — App Growth (scroll formats + phone) / OEM & CTV.
 * Lane switcher lives in the right column above format copy.
 */
export function SolutionsPage() {
  const { mode } = useMode();
  const [lane, setLane] = useState<"app-growth" | "oem-ctv">("app-growth");

  const laneTabs = [
    { id: "app-growth", label: "App Growth" },
    { id: "oem-ctv", label: "OEM & CTV" },
  ];

  const laneSwitcher: ReactNode = (
    <SlideTabs
      items={laneTabs}
      activeId={lane}
      onChange={(id) => setLane(id === "oem-ctv" ? "oem-ctv" : "app-growth")}
      layoutId="solutions-lane-pill"
      className="format-lane-tabs"
    />
  );

  const headerTitle = lane === "app-growth" ? "Every Format. One Supply Path." : "OEM / CTV — measured supply";
  const headerDescription =
    lane === "app-growth"
      ? undefined
      : "Pre-install, OEM storefronts, and CTV — same sticky format path, proof that survives procurement.";

  return (
    <main className="site-main depth-page depth-page--solutions pt-[var(--site-header-height)]">
      <div className="section-band section-band--strip solutions-intro">
        <div className="section-inner">
          <SectionHeader label="Lanes" title={headerTitle} description={headerDescription} />
        </div>
      </div>

      <ProgrammaticScrollSection
        key={lane}
        mode={mode}
        laneSwitcher={laneSwitcher}
        formats={lane === "app-growth" ? AD_FORMATS : OEM_CTV_FORMATS}
      />

      <DepthCloseCta
        title="Brief the channel You need"
        description="Tell us vertical, GEO, and KPI event — we route to the right inventory lane."
        ctaLabel={primaryCta.label}
        ctaHref={primaryCta.href}
        contactIntent="brand"
      />
    </main>
  );
}
