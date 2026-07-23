import { Link } from "react-router-dom";
import { aboutPage, primaryCta } from "../data/liveContent";
import { EditorialItem, EditorialStack } from "./Editorial";
import { SectionAmbience } from "./SectionAmbience";
import { Magnetic } from "./motion-preview/Magnetic";
import { Reveal } from "./motion/Reveal";
import { ScrollLink } from "./ScrollLink";
import { SectionHeader } from "./SectionHeader";

const FACTS = [
  { label: "Entity", value: "UPRAISER Agency LLP · London" },
  { label: "Founded", value: "17 July 2017" },
  { label: "ICO", value: "ZC000436" },
  { label: "Address", value: "128 City Road, London EC1V 2NX, UK" },
] as const;

/** Institutional about — mode-agnostic page copy from aboutPage. */
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

        <Reveal delay={0.12} className="mt-12 max-w-2xl">
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

        <Reveal delay={0.16}>
          <div className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <ScrollLink
                href={primaryCta.href}
                data-cursor="cta"
                className="btn-caps inline-block rounded-full bg-orange px-7 py-3.5 text-sm font-semibold text-on-accent hover:bg-orange-light"
              >
                {aboutPage.ctaLabel}
              </ScrollLink>
            </Magnetic>
            <Magnetic strength={0.22}>
              <Link
                to="/technology"
                className="btn-caps btn-secondary inline-block rounded-full px-7 py-3.5 text-sm font-semibold hover:border-orange/35"
              >
                Technology
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
