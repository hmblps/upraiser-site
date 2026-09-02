import React from "react";
import { lazy } from "react";
import { Outlet } from "react-router-dom";
import { Hero } from "../components/Hero";
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


const SECTION_FALLBACK = <div style={{ minHeight: "12rem" }} />;

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

        <React.Suspense fallback={SECTION_FALLBACK}>
          <PartnersCarousel />
        </React.Suspense>

        <React.Suspense fallback={SECTION_FALLBACK}>
          <Audience />
        </React.Suspense>

        <React.Suspense fallback={SECTION_FALLBACK}>
          <Process />
        </React.Suspense>

        <ChannelsCtaSection />

        <React.Suspense fallback={SECTION_FALLBACK}>
          <CaseStudies />
        </React.Suspense>

        <Outlet />

        <React.Suspense fallback={SECTION_FALLBACK}>
          <PromiseSection />
        </React.Suspense>

        <AboutUsSection />
        <HomePilotCta />
      </main>
      <SectionNav />
    </>
  );
}
