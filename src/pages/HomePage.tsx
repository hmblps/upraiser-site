import { lazy } from "react";
import { Outlet } from "react-router-dom";
import { Hero } from "../components/Hero";
import { LazySection } from "../layouts/SiteLayout";
import { SectionNav } from "../components/SectionNav";
import { HomePilotCta } from "../components/HomePilotCta";
import { PartnersCarousel } from "../components/PartnersCarousel";
import { useRoutesLane } from "../hooks/useRoutesLane";

const Audience = lazy(() => import("../components/Audience").then((m) => ({ default: m.Audience })));
const Process = lazy(() => import("../components/Process").then((m) => ({ default: m.Process })));
const CaseStudies = lazy(() =>
  import("../components/CaseStudies").then((m) => ({ default: m.CaseStudies })),
);
const PromiseSection = lazy(() =>
  import("../components/PromiseSection").then((m) => ({ default: m.PromiseSection })),
);

// New Routes implementation directly on Home
const ProgrammaticScrollSection = lazy(() => 
  import("../components/solutions/ProgrammaticScrollSection").then((m) => ({ default: m.ProgrammaticScrollSection }))
);
const RoutesLaneSwitcher = lazy(() => 
  import("../components/RoutesLaneSwitcher").then((m) => ({ default: m.RoutesLaneSwitcher }))
);

export function HomePage() {
  const { mode, lane, setLane, formats, headerLabel, headerTitle, headerDescription } = useRoutesLane();

  return (
    <>
      <main className="site-main">
        <div
          id="hero"
          className="relative z-[35] flex min-h-[100dvh] flex-col overflow-visible"
        >
          <Hero />
        </div>
        <LazySection minHeight="8rem">
          <PartnersCarousel />
        </LazySection>
        <LazySection minHeight="70dvh">
          <Audience />
        </LazySection>
        <LazySection minHeight="52dvh">
          <Process />
        </LazySection>
        
        {/* Replaced HomeRoutesSection with full Routes programmatic scroll */}
        <LazySection minHeight="100dvh">
          <ProgrammaticScrollSection sectionId="routes"
            lane={lane}
            mode={mode}
            laneSwitcher={
              <RoutesLaneSwitcher
                lane={lane}
                onLaneChange={setLane}
                layoutId="home-solutions-lane-pill"
              />
            }
            formats={formats}
            headerLabel={headerLabel}
            headerTitle={headerTitle}
            headerDescription={headerDescription}
          />
        </LazySection>

        {/* Full CaseStudies implementation on Home without variant="home" */}
        <LazySection minHeight="56dvh">
          <CaseStudies />
        </LazySection>
        
        {/* Render Modals like Case Details over Home Page */}
        <Outlet />

        <LazySection minHeight="70dvh">
          <PromiseSection />
        </LazySection>
        <LazySection minHeight="28dvh">
          <HomePilotCta />
        </LazySection>
      </main>
      <SectionNav />
    </>
  );
}
