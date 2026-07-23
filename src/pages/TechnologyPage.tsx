import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { technologyPage, primaryCta } from "../data/liveContent";
import { mmpPartnerSlugs, partnersBySlugs } from "../data/partners";
import { LazySection } from "../layouts/SiteLayout";
import { EditorialItem, EditorialStack } from "../components/Editorial";
import { Magnetic } from "../components/motion-preview/Magnetic";
import { Reveal } from "../components/motion/Reveal";
import { ScrollLink } from "../components/ScrollLink";
import { SectionHeader } from "../components/SectionHeader";

export function TechnologyPage() {
  return (
    <main className="site-main pt-[var(--site-header-height)]">
      <LazySection minHeight="48vh">
        <section id="technology" className="section-band section-band--ambience">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader
              animated={false}
              label={technologyPage.label}
              title={technologyPage.title}
              description={technologyPage.description}
            />

            <Reveal delay={0.08} className="section-stack">
              <EditorialStack>
                {technologyPage.painPoints.map((item) => (
                  <EditorialItem key={item.question}>
                    <p className="text-sm font-semibold text-fg">{item.question}</p>
                    <p className="copy mt-2 text-sm text-muted">{item.answer}</p>
                  </EditorialItem>
                ))}
              </EditorialStack>
            </Reveal>

            <Reveal delay={0.1} className="mt-16">
              <p className="section-label">Data flow</p>
              <EditorialStack className="mt-4">
                {technologyPage.dataFlow.map((item) => (
                  <EditorialItem key={item.step} variant="step" step={item.step}>
                    <p className="text-sm font-semibold text-fg">{item.title}</p>
                    <p className="copy mt-2 text-sm text-muted">{item.description}</p>
                  </EditorialItem>
                ))}
              </EditorialStack>
            </Reveal>

            <Reveal delay={0.12} className="mt-16 grid gap-12 md:grid-cols-2">
              <div>
                <p className="section-label">Security and compliance</p>
                <ul className="mt-5 space-y-3">
                  {technologyPage.securityBullets.map((item) => (
                    <li key={item} className="channel-inventory-points__item copy text-sm text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="section-label">Performance</p>
                <EditorialStack className="mt-4">
                  {technologyPage.specs.map((item) => (
                    <EditorialItem key={item.label} variant="split">
                      <p className="text-sm text-muted">{item.label}</p>
                      <p className="text-lg font-bold tracking-tight text-fg">{item.value}</p>
                    </EditorialItem>
                  ))}
                </EditorialStack>
              </div>
            </Reveal>

            <Reveal delay={0.14} className="mt-16">
              <p className="section-label">{technologyPage.mmpHeading}</p>
              <p className="copy mt-3 max-w-2xl">{technologyPage.mmpLead}</p>
              <div className="mt-8 flex flex-wrap items-center gap-8">
                {partnersBySlugs(mmpPartnerSlugs).map((partner) => (
                  <div
                    key={partner.slug}
                    className="partner-logo-slot"
                    style={{ "--logo-scale": partner.scale ?? 1 } as CSSProperties}
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="partner-logo"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-12 flex flex-wrap gap-3">
                <Magnetic>
                  <ScrollLink
                    href={primaryCta.href}
                    data-cursor="cta"
                    className="btn-caps inline-block rounded-full bg-orange px-7 py-3.5 text-sm font-semibold text-on-accent hover:bg-orange-light"
                  >
                    {technologyPage.ctaLabel}
                  </ScrollLink>
                </Magnetic>
                <Magnetic strength={0.22}>
                  <Link
                    to="/solutions"
                    className="btn-caps btn-secondary inline-block rounded-full px-7 py-3.5 text-sm font-semibold hover:border-orange/35"
                  >
                    View Solutions
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </section>
      </LazySection>
    </main>
  );
}
