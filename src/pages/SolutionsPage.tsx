import { primaryCta } from "../data/liveContent";
import { DepthCloseCta } from "../components/DepthCloseCta";
import { ProgrammaticScrollSection } from "../components/solutions/ProgrammaticScrollSection";
import { RoutesLaneSwitcher } from "../components/RoutesLaneSwitcher";
import { useBrandAuroraNav } from "../hooks/useBrandAuroraNav";
import { useRoutesLane } from "../hooks/useRoutesLane";

/** Legacy depth page — redirects to home `#routes`; kept for deep links. */
export function SolutionsPage() {
  useBrandAuroraNav();
  const { mode, lane, setLane, formats, headerLabel, headerTitle, headerDescription } = useRoutesLane();

  return (
    <main id="channels" className="site-main depth-page depth-page--solutions">
      <ProgrammaticScrollSection
        key={lane}
        mode={mode}
        laneSwitcher={
          <RoutesLaneSwitcher
            lane={lane}
            onLaneChange={setLane}
            layoutId="solutions-lane-pill"
          />
        }
        formats={formats}
        headerLabel={headerLabel}
        headerTitle={headerTitle}
        headerDescription={headerDescription}
      />

      <DepthCloseCta
        title="Ready to be Upraised?"
        description="Brief the route: vertical, GEO, and KPI event. We route to the right inventory lane."
        ctaLabel={primaryCta.label}
        ctaHref={primaryCta.href}
        contactIntent="brand"
      />
    </main>
  );
}
