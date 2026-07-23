import type { CSSProperties } from "react";
import { measurementPage, primaryCta } from "../data/liveContent";
import { mmpPartnerSlugs, partnersBySlugs } from "../data/partners";
import { LazySection } from "../layouts/SiteLayout";
import { EditorialItem, EditorialStack } from "../components/Editorial";
import { PageCtaRow, PageIntro } from "../components/PageIntro";
import { Reveal } from "../components/motion/Reveal";
import { Stagger, StaggerItem } from "../components/motion/Stagger";
import { SPRING_SOFT } from "../lib/motion";

const cardSpawn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Measurement — Saatchi/OneView product story.
 * No specs, no FAQ dump, no latency theatre. Mechanism in plain language.
 */
export function MeasurementPage() {
  return (
    <main className="site-main pt-[var(--site-header-height)]">
      <PageIntro
        label={measurementPage.label}
        title={measurementPage.title}
        description={measurementPage.heroLead}
        ctaLabel={measurementPage.ctaLabel}
        ctaHref={primaryCta.href}
        secondaryLabel="View Solutions"
        secondaryHref="/solutions"
        dense={false}
      />

      <LazySection minHeight="40vh">
        <section id="measurement" className="section-band section-band--ambience border-t border-border/40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Reveal>
              <p className="section-label">{measurementPage.principlesHeading}</p>
              <EditorialStack className="mt-8">
                {measurementPage.principles.map((item, index) => (
                  <EditorialItem
                    key={item.title}
                    variant="step"
                    step={String(index + 1).padStart(2, "0")}
                  >
                    <p className="text-base font-semibold tracking-tight text-fg sm:text-lg">{item.title}</p>
                    <p className="copy mt-2 max-w-2xl text-sm text-muted">{item.description}</p>
                  </EditorialItem>
                ))}
              </EditorialStack>
            </Reveal>

            <Reveal delay={0.08} className="mt-16">
              <p className="section-label">{measurementPage.capabilitiesHeading}</p>
              <Stagger stagger={0.05} className="tech-feature-grid mt-8">
                {measurementPage.capabilities.map((item) => (
                  <StaggerItem key={item.title} variants={cardSpawn} transition={SPRING_SOFT}>
                    <article className="tech-feature-card">
                      <h3 className="text-lg font-bold tracking-tight text-fg">{item.title}</h3>
                      <p className="copy mt-3 text-sm text-muted">{item.description}</p>
                    </article>
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>

            <Reveal delay={0.1} className="mt-16">
              <p className="section-label">{measurementPage.mmpHeading}</p>
              <p className="copy mt-3 max-w-xl text-sm text-muted">{measurementPage.mmpLead}</p>
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

            <Reveal delay={0.12} className="mt-12">
              <PageCtaRow
                primaryLabel={measurementPage.ctaLabel}
                primaryHref={primaryCta.href}
                secondaryLabel="View Solutions"
                secondaryHref="/solutions"
              />
            </Reveal>
          </div>
        </section>
      </LazySection>
    </main>
  );
}
