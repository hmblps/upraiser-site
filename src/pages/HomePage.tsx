import { lazy, useEffect } from "react";
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

function usePreloadHome() {
  useEffect(() => {
    const runNear = () => {
      void import("../components/Audience");
    };
    const runMid = () => {
      void import("../components/Process");
      void import("../components/solutions/ProgrammaticScrollSection");
      void import("../components/RoutesLaneSwitcher");
      void import("../components/CaseStudies");
    };
    const runFar = () => {
      void import("../components/PromiseSection");
    };
    if (typeof window.requestIdleCallback === "function") {
      const nearId = window.requestIdleCallback(runNear, { timeout: 1000 });
      const midId = window.requestIdleCallback(runMid, { timeout: 2400 });
      const farId = window.requestIdleCallback(runFar, { timeout: 4000 });
      return () => {
        window.cancelIdleCallback(nearId);
        window.cancelIdleCallback(midId);
        window.cancelIdleCallback(farId);
      };
    }
    const nearT = window.setTimeout(runNear, 300);
    const midT = window.setTimeout(runMid, 1200);
    const farT = window.setTimeout(runFar, 2200);
    return () => {
      window.clearTimeout(nearT);
      window.clearTimeout(midT);
      window.clearTimeout(farT);
    };
  }, []);
}

export function HomePage() {
  usePreloadHome();
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
        <LazySection minHeight="70vh">
          <Audience />
        </LazySection>
        <LazySection minHeight="52vh">
          <Process />
        </LazySection>
        
        {/* Replaced HomeRoutesSection with full Routes programmatic scroll */}
        <LazySection minHeight="100dvh">
          <ProgrammaticScrollSection
            key={lane}
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
        <LazySection minHeight="56vh">
          <CaseStudies />
        </LazySection>
        
        {/* Render Modals like Case Details over Home Page */}
        <Outlet />

        <LazySection minHeight="70vh">
          <PromiseSection />
        </LazySection>
        <LazySection minHeight="28vh">
          <HomePilotCta />
        </LazySection>
      </main>
      <SectionNav />
    </>
  );
}
