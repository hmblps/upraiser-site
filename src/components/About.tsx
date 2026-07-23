import { Link } from "react-router-dom";
import { aboutPage, primaryCta } from "../data/liveContent";
import { AboutFaq } from "./AboutFaq";
import { EditorialItem, EditorialStack } from "./Editorial";
import { PageCtaRow } from "./PageIntro";
import { SectionAmbience } from "./SectionAmbience";
import { Reveal } from "./motion/Reveal";
import { SectionHeader } from "./SectionHeader";

const FACTS = [
  { label: "Entity", value: "UPRAISER Agency LLP · London" },
  { label: "Founded", value: "17 July 2017" },
  { label: "ICO", value: "ZC000436" },
  { label: "Address", value: "128 City Road, London EC1V 2NX, UK" },
] as const;

/**
 * About owns: who we are · how we work with You · legal facts · FAQ.
 * Not here: OEM (Solutions), case outcomes (Cases/Home), measurement story (/measurement).
 */
export function About() {
  return (
    <section id="about" className="section-band section-band--ambience relative overflow-hidden">
      <SectionAmbience tone="warm" />
      <div className="relative z-[1] mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-20">
        <SectionHeader
          animated={false}
          label={aboutPage.label}
          title={aboutPage.title}
          description={aboutPage.description}
        />

        <Reveal delay={0.06} className="mt-8">
          <p className="about-positioning text-2xl font-bold tracking-tight text-fg sm:text-3xl md:text-4xl">
            {aboutPage.positioningLead}{" "}
            <span className="text-orange">{aboutPage.positioningAccent}</span>
          </p>
        </Reveal>

        <Reveal delay={0.08} className="section-stack">
          <EditorialStack>
            {aboutPage.storySegments.map((segment) => (
              <EditorialItem key={segment.title} as="article">
                <h3 className="text-base font-bold tracking-tight text-fg">{segment.title}</h3>
                <p className="copy mt-3 text-sm text-muted">{segment.body}</p>
              </EditorialItem>
            ))}
          </EditorialStack>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 max-w-2xl">
          <p className="section-label">{aboutPage.teamLabel}</p>
          <p className="copy mt-3">{aboutPage.teamLead}</p>
          <EditorialStack className="mt-8">
            {FACTS.map((fact) => (
              <EditorialItem key={fact.label} variant="split">
                <p className="text-sm font-semibold text-fg">{fact.label}</p>
                <p className="copy text-sm text-muted">{fact.value}</p>
              </EditorialItem>
            ))}
          </EditorialStack>
        </Reveal>

        <Reveal delay={0.12} className="mt-16">
          <AboutFaq />
        </Reveal>

        <Reveal delay={0.14} className="mt-12">
          <p className="text-sm text-muted">
            <Link to="/solutions?pillar=oem" className="font-semibold text-fg underline-offset-4 hover:underline">
              Solutions
            </Link>
            {" · "}
            <Link to="/measurement" className="font-semibold text-fg underline-offset-4 hover:underline">
              Measurement
            </Link>
            {" · "}
            <Link to="/cases" className="font-semibold text-fg underline-offset-4 hover:underline">
              Cases
            </Link>
          </p>
          <PageCtaRow
            className="mt-8"
            primaryLabel={aboutPage.ctaLabel}
            primaryHref={primaryCta.href}
            secondaryLabel="Cases"
            secondaryHref="/cases"
          />
        </Reveal>
      </div>
    </section>
  );
}
