import type { CSSProperties } from "react";
import { partnersPage, primaryCta } from "../data/liveContent";
import { partnersBySlugs, supplyPartnerSlugs } from "../data/partners";
import { LazySection } from "../layouts/SiteLayout";
import { EditorialItem, EditorialStack } from "../components/Editorial";
import { Magnetic } from "../components/motion-preview/Magnetic";
import { Reveal } from "../components/motion/Reveal";
import { ScrollLink } from "../components/ScrollLink";
import { SectionHeader } from "../components/SectionHeader";
import { PartnersClientBoard } from "../components/PartnersClientBoard";

/**
 * Partners — editorial stacks over card grids.
 * Brands board + creator lane + supply logos; integrations stay in footer marquee.
 */
export function PartnersPage() {
  const logos = partnersBySlugs(supplyPartnerSlugs);

  return (
    <main className="site-main pt-[var(--site-header-height)]">
      <LazySection minHeight="48vh">
        <section id="partners" className="section-band">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader
              animated={false}
              label={partnersPage.label}
              title={partnersPage.title}
              description={partnersPage.description}
            />

            <Reveal delay={0.06} className="section-stack">
              <p className="section-label">{partnersPage.pathsHeading}</p>
              <EditorialStack className="mt-4">
                {partnersPage.paths.map((path) => (
                  <EditorialItem key={path.id} variant="split">
                    <div className="min-w-0">
                      <h3 className="text-base font-bold tracking-tight text-fg">{path.title}</h3>
                      <p className="copy mt-2 text-sm text-muted">{path.description}</p>
                    </div>
                    <Magnetic strength={0.2}>
                      <ScrollLink
                        href={primaryCta.href}
                        contactIntent={path.contactIntent}
                        data-cursor="cta"
                        className="mt-4 inline-flex shrink-0 text-sm font-semibold text-fg transition hover:text-orange md:mt-0"
                      >
                        {path.cta} <span aria-hidden>→</span>
                      </ScrollLink>
                    </Magnetic>
                  </EditorialItem>
                ))}
              </EditorialStack>
            </Reveal>

            <Reveal delay={0.1} className="mt-16" id="creators">
              <p className="section-label">{partnersPage.influencerHeading}</p>
              <h3 className="mt-3 max-w-2xl text-2xl font-bold tracking-tight text-fg md:text-3xl">
                Join. Create. Get paid on events.
              </h3>
              <p className="copy mt-3 max-w-2xl text-sm text-muted">{partnersPage.influencerLead}</p>

              <EditorialStack className="mt-8">
                {partnersPage.influencerSteps.map((item) => (
                  <EditorialItem key={item.step} variant="step" step={item.step}>
                    <p className="text-sm font-semibold text-fg">{item.title}</p>
                    <p className="copy mt-2 text-sm text-muted">{item.description}</p>
                  </EditorialItem>
                ))}
              </EditorialStack>

              <ul className="mt-8 space-y-3 border-t border-border/50 pt-6">
                {partnersPage.influencerPoints.map((point) => (
                  <li key={point} className="channel-inventory-points__item copy text-sm text-muted">
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.12} className="mt-16" id="brands">
              <p className="section-label">{partnersPage.brandsHeading}</p>
              <p className="copy mt-3 max-w-2xl text-sm text-muted">{partnersPage.brandsLead}</p>
              <div className="mt-8">
                <PartnersClientBoard />
              </div>
            </Reveal>

            <Reveal delay={0.14} className="mt-16">
              <p className="section-label">Partnership models</p>
              <EditorialStack className="mt-4">
                {partnersPage.partnershipModels.map((item) => (
                  <EditorialItem key={item.title} variant="split">
                    <p className="shrink-0 text-sm font-semibold text-fg md:w-40">{item.title}</p>
                    <p className="copy text-sm text-muted">{item.description}</p>
                  </EditorialItem>
                ))}
              </EditorialStack>
            </Reveal>

            <Reveal delay={0.16} className="mt-16">
              <p className="section-label">{partnersPage.offerHeading}</p>
              <EditorialStack className="mt-4">
                {partnersPage.offers.map((offer) => (
                  <EditorialItem key={offer.title}>
                    <h3 className="text-sm font-semibold text-fg">{offer.title}</h3>
                    <p className="copy mt-2 text-sm text-muted">{offer.description}</p>
                  </EditorialItem>
                ))}
              </EditorialStack>
            </Reveal>

            <Reveal delay={0.18} className="mt-16 grid gap-12 md:grid-cols-2">
              <div>
                <p className="section-label">Onboarding</p>
                <EditorialStack className="mt-4">
                  {partnersPage.onboardingSteps.map((item) => (
                    <EditorialItem key={item.step} variant="step" step={item.step}>
                      <p className="text-sm font-semibold text-fg">{item.title}</p>
                      <p className="copy mt-2 text-sm text-muted">{item.description}</p>
                    </EditorialItem>
                  ))}
                </EditorialStack>
              </div>

              <div>
                <p className="section-label">Supply platforms</p>
                <p className="copy mt-3 text-sm text-muted">
                  Media and OEM supply we buy against — separate from the client brands above.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-8">
                  {logos.map((partner) => (
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
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-12">
                <Magnetic>
                  <ScrollLink
                    href={primaryCta.href}
                    contactIntent={partnersPage.contactIntent}
                    data-cursor="cta"
                    className="btn-caps inline-block rounded-full bg-orange px-7 py-3.5 text-sm font-semibold text-on-accent hover:bg-orange-light"
                  >
                    {partnersPage.ctaLabel}
                  </ScrollLink>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </section>
      </LazySection>
    </main>
  );
}
