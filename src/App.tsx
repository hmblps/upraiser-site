import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { LenovoTrustStrip } from "./components/LenovoTrustStrip";
import { Audience } from "./components/Audience";
import { ValueProps } from "./components/ValueProps";
import { PromiseSection } from "./components/PromiseSection";
import { Difference } from "./components/Difference";
import { Objectives } from "./components/Objectives";
import { TrafficChannels } from "./components/TrafficChannels";
import { CaseStudies } from "./components/CaseStudies";
import { Testimonials } from "./components/Testimonials";
import { Technology } from "./components/Technology";
import { About } from "./components/About";
import { Process } from "./components/Process";
import { Contact } from "./components/Contact";
import { PartnersCarousel } from "./components/PartnersCarousel";
import { Footer } from "./components/Footer";
import { SmoothScroll } from "./components/SmoothScroll";
import { CustomCursor } from "./components/CustomCursor";
import { MobileSectionNav } from "./components/MobileSectionNav";
import { SectionNav } from "./components/SectionNav";
import { SiteGrain } from "./components/SiteGrain";
import { ApplePreviewPanel } from "./components/apple-preview/ApplePreviewPanel";
import { useApplePreview } from "./hooks/useApplePreview";

function MainContent() {
  const { isPreviewMode: applePreview, features: appleFeatures } = useApplePreview();

  return (
    <>
      <main>
        <div id="hero" className="relative flex min-h-0 flex-col overflow-hidden border-b border-border scroll-mt-24 md:min-h-[calc(100dvh-4.75rem)]">
          <Hero />
          <LenovoTrustStrip />
        </div>
        <Audience />
        <ValueProps />
        <PromiseSection />
        <Difference />
        <Objectives />
        <TrafficChannels />
        <Testimonials />
        <CaseStudies />
        <Technology />
        <About />
        <Process />
        <Contact />
      </main>
      <PartnersCarousel />
      <Footer />
      <MobileSectionNav />
      <SectionNav />
      {applePreview && appleFeatures ? <ApplePreviewPanel active={appleFeatures} /> : null}
    </>
  );
}

export default function App() {
  return (
    <SmoothScroll>
      <SiteGrain />
      <CustomCursor />
      <Header />
      <MainContent />
    </SmoothScroll>
  );
}
