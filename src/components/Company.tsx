import { Link } from "react-router-dom";
import { primaryCta } from "../data/liveContent";
import { COMPANY_CONTENT } from "../data/innerPagesData";
import { AboutFaq } from "./AboutFaq";
import { CompanyFootprint } from "./CompanyFootprint";
import { DepthCloseCta } from "./DepthCloseCta";
import { LenovoProofStrip } from "./LenovoProofStrip";
import { PageIntro } from "./PageIntro";
import { Reveal } from "./motion/Reveal";

/**
 * Company — balance: editorial blocks stay text-led;
 * WorldMap owns the footprint widget beat. No double essays.
 */
export function Company() {
  return (
    <div className="depth-page depth-page--company">
      <PageIntro
        label={COMPANY_CONTENT.hero.badge}
        title={COMPANY_CONTENT.hero.h1}
        description={COMPANY_CONTENT.hero.description}
        ctaLabel={primaryCta.label}
        ctaHref={primaryCta.href}
        secondaryLabel="Expertise"
        secondaryHref="/expertise"
        dense={false}
      />

      <section className="section-band border-t border-border/40 about-archive">
        <div className="about-archive__year" aria-hidden>
          2017
        </div>
        <div className="relative z-[1] mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <p className="about-positioning text-2xl font-bold tracking-tight text-fg sm:text-3xl md:text-4xl">
              {COMPANY_CONTENT.positioningLead}{" "}
              <span className="text-orange">{COMPANY_CONTENT.positioningAccent}</span>
            </p>
          </Reveal>

          <Reveal delay={0.06} className="mt-12">
            <p className="section-label">Compliance</p>
            <ul className="depth-feature-list mt-8">
              {COMPANY_CONTENT.compliance.map((item, index) => (
                <li key={item.title} className="depth-feature-row">
                  <span className="depth-feature-row__index" aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="depth-feature-row__body">
                    <h3 className="depth-feature-row__title">{item.title}</h3>
                    <p className="depth-feature-row__text">{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section-band section-band--dense border-y border-border/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:px-8">
          <Reveal>
            <p className="section-label">Archive</p>
            <ol className="about-timeline mt-6">
              {COMPANY_CONTENT.archive.map((segment) => (
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

          <Reveal delay={0.06}>
            <p className="section-label">Legal entity</p>
            <div className="about-registry mt-6">
              {COMPANY_CONTENT.facts.map((fact) => (
                <div key={fact.label} className="about-registry__field">
                  <p className="about-registry__label">{fact.label}</p>
                  <p className="about-registry__value">{fact.value}</p>
                </div>
              ))}
            </div>
            <p className="copy mt-8 text-sm text-muted">{COMPANY_CONTENT.philosophy.text}</p>
          </Reveal>
        </div>
      </section>

      <LenovoProofStrip />

      <CompanyFootprint />

      <section className="section-band">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <AboutFaq
              heading={COMPANY_CONTENT.faqHeading}
              items={[...COMPANY_CONTENT.faq]}
            />
          </Reveal>
          <Reveal delay={0.08} className="mt-12">
            <p className="text-sm text-muted">
              Continue →{" "}
              <Link to="/expertise" className="font-semibold text-fg underline-offset-4 hover:underline">
                Expertise
              </Link>
              {" · "}
              <Link to="/cases" className="font-semibold text-fg underline-offset-4 hover:underline">
                Cases
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <DepthCloseCta
        title={COMPANY_CONTENT.close.title}
        description={COMPANY_CONTENT.close.description}
        ctaLabel={COMPANY_CONTENT.close.ctaLabel}
      />
    </div>
  );
}
