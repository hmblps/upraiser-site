import { Outlet } from "react-router-dom";
import { Hero } from "../components/Hero";
import { SectionNav } from "../components/SectionNav";
import { HomePilotCta } from "../components/HomePilotCta";
import { PartnersCarousel } from "../components/PartnersCarousel";
import { Audience } from "../components/Audience";
import { Process } from "../components/Process";
import { CaseStudies } from "../components/CaseStudies";
import { PromiseSection } from "../components/PromiseSection";
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

        <PartnersCarousel />
        <Audience />
        <Process />
        <ChannelsCtaSection />
        <CaseStudies />

        <Outlet />

        <PromiseSection />
        <AboutUsSection />
        <HomePilotCta />
      </main>
      <SectionNav />
    </>
  );
}
