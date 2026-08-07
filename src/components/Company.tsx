import { Link } from "react-router-dom";
import { primaryCta } from "../data/liveContent";
import { COMPANY_CONTENT } from "../data/innerPagesData";
import { AscentProtocol } from "./AscentProtocol";
import { CompanyFootprint } from "./CompanyFootprint";
import { CompanyStoryTimeline } from "./CompanyStoryTimeline";
import { LenovoProofStrip } from "./LenovoProofStrip";
import { ScrollLink } from "./ScrollLink";

/**
 * About/Expedition — Monolithic engineering dossier layout.
 * Combines history timeline, world operations map, and Ascent Protocol FAQs into a single scroll.
 */
export function Company() {
  return (
    <div className="depth-page depth-page--company viewport-page">
      <div className="viewport-page__shell section-inner flex flex-col overflow-y-auto h-full pr-1 pb-16 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        
        {/* Section 1: Intro & Story Timeline */}
        <section className="py-8 shrink-0">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="flex flex-col justify-between">
              <div>
                <p className="section-label">{COMPANY_CONTENT.hero.badge}</p>
                <h1 className="section-title mt-2">{COMPANY_CONTENT.hero.h1}</h1>
                <p className="section-description mt-3">{COMPANY_CONTENT.hero.description}</p>
                
                <div className="mt-6 space-y-3.5 pr-4">
                  <p className="panel-lede text-fg/90">{COMPANY_CONTENT.expedition.synergy}</p>
                  <p className="panel-lede text-fg/90">{COMPANY_CONTENT.expedition.uniqueness}</p>
                  <p className="copy font-semibold text-fg mt-4">
                    {COMPANY_CONTENT.philosophy.text}{" "}
                    <span className="text-orange">{COMPANY_CONTENT.expedition.proofLine}</span>
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <LenovoProofStrip variant="inline" />
                <div className="flex items-center gap-4">
                  <ScrollLink
                    href={primaryCta.href}
                    data-cursor="cta"
                    className="btn-caps btn-caps--primary"
                  >
                    {COMPANY_CONTENT.close.ctaLabel}
                  </ScrollLink>
                  <Link to="/clients" className="link-quiet">
                    See clients →
                  </Link>
                </div>
              </div>
            </div>

            <div className="min-h-[300px] flex flex-col">
              <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-widest text-muted mb-3 block">
                Ascent Milestones
              </span>
              <div className="flex-1 min-h-0">
                <CompanyStoryTimeline />
              </div>
            </div>
          </div>
        </section>

        <hr className="border-border/20 my-6" />

        {/* Section 2: Global Footprint */}
        <section className="py-4 shrink-0">
          <CompanyFootprint variant="flat" />
        </section>

        <hr className="border-border/20 my-6" />

        {/* Section 3: The Ascent Protocol */}
        <section className="py-4 shrink-0">
          <div className="mb-6">
            <p className="stat-label text-orange">Expedition Manual</p>
            <h2 className="text-lg font-bold text-fg font-sans mt-2">The Ascent Protocol</h2>
          </div>
          <AscentProtocol />
        </section>
        
      </div>
    </div>
  );
}
