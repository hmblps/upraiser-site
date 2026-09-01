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


export function HomePage() {
  
  return (
    <React.Suspense fallback={<div style={{ minHeight: "50vh" }} />}>
    <>
      <main className="site-main">
        <div
          id="hero"
          className="relative flex min-h-[100dvh] flex-col overflow-visible"
        >
          <Hero />
        </div>
        <PartnersCarousel />
        <div id="audience"><Audience /></div>
        <div id="process"><Process /></div>
        
        <ChannelsCtaSection />

        <div id="cases"><CaseStudies /></div>
        
        <Outlet />

        <div id="promise"><PromiseSection /></div>
        <AboutUsSection />
        <div id="pilot"><HomePilotCta /></div>
      </main>
      <SectionNav />
    </>
    </React.Suspense>
  );
}
