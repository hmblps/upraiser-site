import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { SmoothScroll } from "./components/SmoothScroll";
import { SectionNav } from "./components/SectionNav";
import { SiteGrain } from "./components/SiteGrain";
import { useApplePreview } from "./hooks/useApplePreview";

const ApplePreviewPanel = lazy(() =>
  import("./components/apple-preview/ApplePreviewPanel").then((m) => ({ default: m.ApplePreviewPanel })),
);

const CustomCursor = lazy(() =>
  import("./components/CustomCursor").then((m) => ({ default: m.CustomCursor })),
);

const LenovoTrustStrip = lazy(() =>
  import("./components/LenovoTrustStrip").then((m) => ({ default: m.LenovoTrustStrip })),
);

const Audience = lazy(() => import("./components/Audience").then((m) => ({ default: m.Audience })));
const ValueProps = lazy(() => import("./components/ValueProps").then((m) => ({ default: m.ValueProps })));
const PromiseSection = lazy(() =>
  import("./components/PromiseSection").then((m) => ({ default: m.PromiseSection })),
);
const Difference = lazy(() => import("./components/Difference").then((m) => ({ default: m.Difference })));
const Objectives = lazy(() => import("./components/Objectives").then((m) => ({ default: m.Objectives })));
const TrafficChannels = lazy(() =>
  import("./components/TrafficChannels").then((m) => ({ default: m.TrafficChannels })),
);
const Testimonials = lazy(() => import("./components/Testimonials").then((m) => ({ default: m.Testimonials })));
const CaseStudies = lazy(() => import("./components/CaseStudies").then((m) => ({ default: m.CaseStudies })));
const Technology = lazy(() => import("./components/Technology").then((m) => ({ default: m.Technology })));
const About = lazy(() => import("./components/About").then((m) => ({ default: m.About })));
const Process = lazy(() => import("./components/Process").then((m) => ({ default: m.Process })));
const Contact = lazy(() => import("./components/Contact").then((m) => ({ default: m.Contact })));
const PartnersCarousel = lazy(() =>
  import("./components/PartnersCarousel").then((m) => ({ default: m.PartnersCarousel })),
);
const Footer = lazy(() => import("./components/Footer").then((m) => ({ default: m.Footer })));
const MobileSectionNav = lazy(() =>
  import("./components/MobileSectionNav").then((m) => ({ default: m.MobileSectionNav })),
);

function DeferredCustomCursor() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 900 });
      return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(() => setReady(true), 400);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <CustomCursor />
    </Suspense>
  );
}

function LazySection({ children, minHeight = "28vh" }: { children: ReactNode; minHeight?: string }) {
  return (
    <Suspense fallback={<div className="section-lazy-slot" style={{ minHeight }} aria-hidden />}>
      {children}
    </Suspense>
  );
}

function usePreloadBelowFold() {
  useEffect(() => {
    const preload = () => {
      void import("./components/LenovoTrustStrip");
      void import("./components/Audience");
      void import("./components/ValueProps");
      void import("./components/PromiseSection");
      void import("./components/Difference");
      void import("./components/Objectives");
      void import("./components/TrafficChannels");
      void import("./components/Testimonials");
      void import("./components/CaseStudies");
      void import("./components/Technology");
      void import("./components/About");
      void import("./components/Process");
      void import("./components/Contact");
      void import("./components/PartnersCarousel");
      void import("./components/Footer");
      void import("./components/MobileSectionNav");
    };

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(preload, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(preload, 1200);
    return () => window.clearTimeout(id);
  }, []);
}

function MainContent() {
  const { isPreviewMode: applePreview, features: appleFeatures } = useApplePreview();
  usePreloadBelowFold();

  return (
    <>
      <main>
        <div id="hero" className="relative flex min-h-0 flex-col overflow-hidden border-b border-border scroll-mt-24 md:min-h-[calc(100dvh-4.75rem)]">
          <Hero />
          <Suspense fallback={null}>
            <LenovoTrustStrip />
          </Suspense>
        </div>
        <LazySection minHeight="120vh">
          <Audience />
        </LazySection>
        <LazySection>
          <ValueProps />
        </LazySection>
        <LazySection minHeight="120vh">
          <PromiseSection />
        </LazySection>
        <LazySection>
          <Difference />
        </LazySection>
        <LazySection>
          <Objectives />
        </LazySection>
        <LazySection minHeight="52vh">
          <TrafficChannels />
        </LazySection>
        <LazySection>
          <Testimonials />
        </LazySection>
        <LazySection minHeight="48vh">
          <CaseStudies />
        </LazySection>
        <LazySection>
          <Technology />
        </LazySection>
        <LazySection>
          <About />
        </LazySection>
        <LazySection>
          <Process />
        </LazySection>
        <LazySection minHeight="56vh">
          <Contact />
        </LazySection>
      </main>
      <LazySection minHeight="12vh">
        <PartnersCarousel />
      </LazySection>
      <LazySection minHeight="20vh">
        <Footer />
      </LazySection>
      <Suspense fallback={null}>
        <MobileSectionNav />
      </Suspense>
      <SectionNav />
      {applePreview && appleFeatures ? (
        <Suspense fallback={null}>
          <ApplePreviewPanel active={appleFeatures} />
        </Suspense>
      ) : null}
    </>
  );
}

export default function App() {
  return (
    <SmoothScroll>
      <a href="#audience" className="skip-link">
        Skip to content
      </a>
      <SiteGrain />
      <DeferredCustomCursor />
      <Header />
      <MainContent />
    </SmoothScroll>
  );
}
