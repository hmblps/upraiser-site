import { Link } from "react-router-dom";
import { aboutPage, primaryCta } from "../data/liveContent";
import { PERFORMANCE_CONTENT } from "../data/performanceData";
import { AboutFaq } from "./AboutFaq";
import { CaseMetricMatrix } from "./CaseMetricMatrix";
import { DepthCloseCta } from "./DepthCloseCta";
import { LenovoProofStrip } from "./LenovoProofStrip";
import { PageIntro } from "./PageIntro";
import { PhilosophyBand } from "./PhilosophyBand";
import { TrustMarquee } from "./TrustMarquee";
import { Reveal } from "./motion/Reveal";

/**
 * About — Saatchi about IA in archive visual language.
 * Hero → trust → philosophy → archive → registry → Lenovo → FAQ → proof → CTA.
 * No anonymous quotes. No Home / Cases / Contact edits.
 */
export function About() {
  const footer = PERFORMANCE_CONTENT.footerCta;

  return (
    <div className="depth-page depth-page--about">
      <PageIntro
        label={aboutPage.label}
        title={aboutPage.title}
        description={aboutPage.description}
        ctaLabel={aboutPage.ctaLabel}
        ctaHref={primaryCta.href}
        secondaryLabel="Cases"
        secondaryHref="/cases"
        dense={false}
      />

      <TrustMarquee />
      <PhilosophyBand />

      <section className="section-band border-t border-border/40 about-archive">
        <div className="about-archive__year" aria-hidden>
          2017
        </div>
        <div className="relative z-[1] mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <p className="about-positioning text-2xl font-bold tracking-tight text-fg sm:text-3xl md:text-4xl">
              {aboutPage.positioningLead}{" "}
              <span className="text-orange">{aboutPage.positioningAccent}</span>
            </p>
          </Reveal>

          <Reveal delay={0.06} className="mt-14">
            <p className="section-label">Archive</p>
            <ol className="about-timeline mt-8">
              {aboutPage.storySegments.map((segment) => (
                <li key={segment.title} className="about-timeline__item">
                  <span className="about-timeline__mark">{segment.mark}</span>
                  <div className="about-timeline__body">
                    <h3 className="about-timeline__title">{segment.title}</h3>
                    <p className="about-timeline__text">{segment.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="section-band section-band--dense border-y border-border/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <p className="section-label">{aboutPage.teamLabel}</p>
            <p className="copy mt-3 max-w-2xl">{aboutPage.teamLead}</p>
          </Reveal>
          <div className="about-registry mt-10">
            {aboutPage.facts.map((fact) => (
              <div key={fact.label} className="about-registry__field">
                <p className="about-registry__label">{fact.label}</p>
                <p className="about-registry__value">{fact.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LenovoProofStrip />

      <section className="section-band">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <AboutFaq />
          </Reveal>
          <Reveal delay={0.08} className="mt-12">
            <p className="text-sm text-muted">
              Continue →{" "}
              <Link to="/solutions" className="font-semibold text-fg underline-offset-4 hover:underline">
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
          </Reveal>
        </div>
      </section>

      <CaseMetricMatrix />

      <DepthCloseCta
        title={footer.title}
        description={footer.subtitle}
        ctaLabel={footer.buttonText}
        ctaHref={footer.buttonHref}
      />
    </div>
  );
}
