import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { CLARITY_CONTENT } from "../data/innerPagesData";
import { measurementPage } from "../data/liveContent";
import { mmpPartnerSlugs, partnersBySlugs } from "../data/partners";
import { ClarityReconcile } from "../components/ClarityReconcile";
import { ProofFrame } from "../components/ProofFrame";
import { ScrollLink } from "../components/ScrollLink";

/**
 * Clarity — Technology-style viewport.
 * Unique widget: AnimatedList (ClarityReconcile). No Beam / Bento here.
 */
export function ClarityPage() {
  const modules = measurementPage.modules;

  return (
    <main className="site-main depth-page depth-page--clarity viewport-page pt-[var(--site-header-height)]">
      <div className="viewport-page__shell section-inner flex flex-col">
        <header className="viewport-page__intro shrink-0">
          <p className="section-label">{CLARITY_CONTENT.hero.badge}</p>
          <h1 className="section-title max-w-3xl">{CLARITY_CONTENT.hero.h1}</h1>
          <p className="copy mt-2 max-w-2xl text-sm text-muted">{CLARITY_CONTENT.hero.lead}</p>
        </header>

        <div className="viewport-page__panel relative min-h-0 flex-1 pt-3">
          <div className="grid h-full min-h-0 gap-5 overflow-hidden lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8">
            <div className="flex min-h-0 flex-col overflow-hidden">
              <p className="copy max-w-xl text-sm font-medium text-fg">{CLARITY_CONTENT.promise}</p>

              <ul className="depth-feature-list mt-3 min-h-0 overflow-hidden">
                {CLARITY_CONTENT.deliverables.map((item, index) => (
                  <li key={item} className="depth-feature-row">
                    <span className="depth-feature-row__index" aria-hidden>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="depth-feature-row__body">
                      <p className="depth-feature-row__text line-clamp-2">{item}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <ol className="mt-3 grid shrink-0 grid-cols-3 gap-2 border-t border-border/45 pt-3">
                {CLARITY_CONTENT.process.map((step, index) => (
                  <li key={step.title} className="min-w-0">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-orange">
                      {String(index + 1).padStart(2, "0")} · {step.title}
                    </p>
                    <p className="mt-1 line-clamp-3 text-[0.7rem] leading-snug text-muted">{step.body}</p>
                  </li>
                ))}
              </ol>

              <ul className="mt-3 grid shrink-0 grid-cols-3 gap-2 border-t border-border/45 pt-3">
                {CLARITY_CONTENT.stats.map((stat) => (
                  <li key={stat.label} className="min-w-0">
                    <p className="text-lg font-bold tracking-tight text-fg sm:text-xl">{stat.value}</p>
                    <p className="mt-0.5 text-[0.65rem] uppercase tracking-[0.08em] text-muted">
                      {stat.label}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex shrink-0 flex-col gap-2 pt-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <ScrollLink
                    href={`/contact?intent=${CLARITY_CONTENT.close.contactIntent}`}
                    data-cursor="cta"
                    className="btn-caps inline-block rounded-full bg-orange px-5 py-2.5 text-xs font-semibold text-on-accent"
                  >
                    {CLARITY_CONTENT.close.ctaLabel}
                  </ScrollLink>
                </div>
                <p className="text-[0.7rem] text-muted">
                  Related:{" "}
                  {CLARITY_CONTENT.related.map((item, index) => (
                    <span key={item.href}>
                      {index > 0 ? " · " : null}
                      <Link to={item.href} className="font-semibold text-fg/80 transition hover:text-orange">
                        {item.label}
                      </Link>
                    </span>
                  ))}
                </p>
              </div>
            </div>

            <div className="flex min-h-0 flex-col overflow-hidden">
              <ProofFrame label="Clarity · reconcile" meta="bid ↔ bill" className="h-full min-h-0">
                <div className="flex h-full min-h-0 flex-col overflow-hidden">
                  <div className="min-h-0 flex-1 overflow-hidden">
                    <ClarityReconcile compact />
                  </div>
                  <div className="mt-3 shrink-0 border-t border-border/40 pt-3">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-orange">
                      {modules[0]?.title} · {modules[1]?.title} · {modules[2]?.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[0.7rem] leading-snug text-muted">
                      {CLARITY_CONTENT.mmpHeading}. {CLARITY_CONTENT.mmpLead}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-3">
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
                  </div>
                </div>
              </ProofFrame>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
