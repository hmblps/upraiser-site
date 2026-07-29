import { lazy, useEffect } from "react";
import { Hero } from "../components/Hero";
import { LazySection } from "../layouts/SiteLayout";
import { SectionNav } from "../components/SectionNav";
import { HomePilotCta } from "../components/HomePilotCta";

const Audience = lazy(() => import("../components/Audience").then((m) => ({ default: m.Audience })));
const Process = lazy(() => import("../components/Process").then((m) => ({ default: m.Process })));
const TrafficChannels = lazy(() =>
  import("../components/TrafficChannels").then((m) => ({ default: m.TrafficChannels })),
);
const CasesTeaser = lazy(() =>
  import("../components/CasesTeaser").then((m) => ({ default: m.CasesTeaser })),
);
const PromiseSection = lazy(() =>
  import("../components/PromiseSection").then((m) => ({ default: m.PromiseSection })),
);

function usePreloadHome() {
  useEffect(() => {
    const runNear = () => {
      void import("../components/Audience");
    };
    const runMid = () => {
      void import("../components/Process");
      void import("../components/TrafficChannels");
      void import("../components/CasesTeaser");
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

/**
 * Home pitch — hero fly (Lenovo docks flush at sticky bottom) → killer folds.
 */
export function HomePage() {
  usePreloadHome();

  return (
    <>
      <main className="site-main">
        <div
          id="hero"
          className="relative z-[35] flex min-h-[100dvh] flex-col overflow-visible"
        >
          <Hero />
        </div>
        <LazySection minHeight="70vh">
          <Audience />
        </LazySection>
        <LazySection minHeight="52vh">
          <Process />
        </LazySection>
        <LazySection minHeight="44vh">
          <TrafficChannels variant="home" />
        </LazySection>
        <LazySection minHeight="40vh">
          <CasesTeaser />
        </LazySection>
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
