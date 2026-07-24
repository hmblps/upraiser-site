import type { CSSProperties } from "react";
import { measurementPage, primaryCta } from "../data/liveContent";
import { PERFORMANCE_CONTENT } from "../data/performanceData";
import { mmpPartnerSlugs, partnersBySlugs } from "../data/partners";
import { LazySection } from "../layouts/SiteLayout";
import { CaseMetricMatrix } from "../components/CaseMetricMatrix";
import { ClarityReconcile } from "../components/ClarityReconcile";
import { DepthCloseCta } from "../components/DepthCloseCta";
import { PageIntro } from "../components/PageIntro";
import { TrustMarquee } from "../components/TrustMarquee";
import { Reveal } from "../components/motion/Reveal";

/**
 * Measurement — Saatchi proprietary-tech IA (OneView → Clarity).
 * Hero → trust → receipt reconcile → wire → MMP → proof → CTA.
 * UPRAISER receipt language; no fake dashboard cards.
 */
export function MeasurementPage() {
  const tech = PERFORMANCE_CONTENT.techSpotlight;
  const footer = PERFORMANCE_CONTENT.footerCta;

  return (
    <main className="site-main depth-page depth-page--measurement pt-[var(--site-header-height)]">
      <PageIntro
        label={measurementPage.label}
        title={tech.productName}
        description={`${tech.title}. ${tech.description}`}
        ctaLabel={measurementPage.ctaLabel}
        ctaHref={primaryCta.href}
        secondaryLabel="View Solutions"
        secondaryHref="/solutions"
        dense={false}
      />

      <TrustMarquee label="Runs beside Your MMP stack" />

      <LazySection minHeight="44vh">
        <section id="measurement" className="section-band border-t border-border/40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ClarityReconcile />

            <Reveal delay={0.06} className="mt-16">
              <p className="section-label">{measurementPage.modulesHeading}</p>
              <ul className="depth-feature-list mt-10">
                {measurementPage.modules.map((item, index) => (
                  <li key={item.title} className="depth-feature-row">
                    <span className="depth-feature-row__index" aria-hidden>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="depth-feature-row__body">
                      <h3 className="depth-feature-row__title">{item.title}</h3>
                      <p className="depth-feature-row__text">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1} className="mt-16">
              <p className="section-label">{measurementPage.stepsHeading}</p>
              <ol className="clarity-wire mt-10">
                {measurementPage.steps.map((item, index) => (
                  <li key={item.step} className="clarity-wire__step">
                    {index > 0 ? <span className="clarity-wire__connector" aria-hidden /> : null}
                    <span className="clarity-wire__num">{item.step}</span>
                    <h3 className="clarity-wire__title">{item.title}</h3>
                    <p className="clarity-wire__text">{item.description}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={0.12} className="mt-16 border-t border-border/50 pt-12">
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
          </div>
        </section>
      </LazySection>

      <CaseMetricMatrix title="When bid-time and bill-time already agree" />

      <DepthCloseCta
        title={measurementPage.closeTitle}
        description={measurementPage.closeDescription}
        ctaLabel={footer.buttonText}
        ctaHref={footer.buttonHref}
      />
    </main>
  );
}
