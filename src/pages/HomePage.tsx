import { lazy } from "react";
import { Outlet } from "react-router-dom";
import { Hero } from "../components/Hero";
import { LazySection } from "../layouts/SiteLayout";
import { SectionNav } from "../components/SectionNav";
import { HomePilotCta } from "../components/HomePilotCta";

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
import { ChannelsCtaSection } from "../components/solutions/ChannelsCtaSection";
import { AboutUsSection } from "../components/AboutUsSection";


export function HomePage() {
  
  return (
    <>
      <main className="site-main">
        <div
          id="hero"
          className="relative flex min-h-[100dvh] flex-col overflow-visible"
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
        
        <ChannelsCtaSection />

        <LazySection id="cases" minHeight="56dvh" warm="cases">
          <CaseStudies />
        </LazySection>
        
        <Outlet />

        <LazySection id="promise" minHeight="70dvh" warm="promise" gate="hero">
          <PromiseSection />
        </LazySection>
        <AboutUsSection />
        <LazySection id="pilot" minHeight="28dvh">
          <HomePilotCta />
        </LazySection>
      </main>
      <SectionNav />
    </>
  );
}
