import { lazy } from "react";
import { Outlet } from "react-router-dom";
import { Hero } from "../components/Hero";
import { LazySection } from "../layouts/SiteLayout";
import { SectionNav } from "../components/SectionNav";
import { HomePilotCta } from "../components/HomePilotCta";
import { useRoutesLane } from "../hooks/useRoutesLane";

const PartnersCarousel = lazy(() =>
  import("../components/PartnersCarousel").then((m) => ({ default: m.PartnersCarousel })),
);
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
        <LazySection minHeight="8rem" gate="hero">
          <PartnersCarousel />
        </LazySection>
        <LazySection id="audience" minHeight="70dvh" warm="mid" gate="hero">
          <Audience />
        </LazySection>
        <LazySection id="process" minHeight="52dvh" warm="mid" gate="hero">
          <Process />
        </LazySection>
        
        <LazySection id="routes" minHeight="100dvh" warm="routes" gate="hero">
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

        <LazySection id="cases" minHeight="56dvh" warm="cases">
          <CaseStudies />
        </LazySection>
        
        <Outlet />

        <LazySection id="promise" minHeight="70dvh" warm="promise" gate="hero">
          <PromiseSection />
        </LazySection>
        <LazySection id="pilot" minHeight="28dvh">
          <HomePilotCta />
        </LazySection>
      </main>
      <SectionNav />
    </>
  );
}
