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
      <div
        className="viewport-page__shell section-inner flex flex-col pr-1 pb-16 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ overflowY: "auto", flex: "1 1 auto", minHeight: 0 }}
      >
        {/* Dossier Header */}
        <header className="viewport-page__intro shrink-0">
          <p className="section-label">Basecamp</p>
          <h1 className="section-title mt-1.5">Expedition Profile</h1>
          <p className="section-description mt-3 max-w-2xl">
            UPRAISER Agency LLP · London performance desk since 2017. Direct OEM distribution, programmatic buying, and pre-bid fraud filtration.
          </p>
        </header>

        {/* Section 1: Ascent Milestones */}
        <section className="py-6 shrink-0">
          <div className="mb-4">
            <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-widest text-muted block mb-1">
              Timeline
            </span>
            <h2 className="text-lg font-bold text-fg font-sans">Milestone Scrubber</h2>
          </div>
          <CompanyStoryTimeline />
        </section>

        <hr className="border-border/20 my-6" />

        {/* Section 2: Global Operations */}
        <section className="py-4 shrink-0">
          <CompanyFootprint variant="flat" />
        </section>

        <hr className="border-border/20 my-6" />

        {/* Section 3: Registry & Directives */}
        <section className="py-4 shrink-0">
          <div className="grid grid-cols-1 lg:grid-cols-[0.4fr_0.6fr] gap-8 items-start">
            
            {/* Left: Registry Profile */}
            <div className="bg-bg-card/30 border border-border/20 rounded-xl p-5 sm:p-6 shrink-0">
              <h3 className="font-mono text-[0.6875rem] font-bold uppercase tracking-widest text-orange mb-4">
                Registry Profile
              </h3>
              <dl className="space-y-3.5 text-xs">
                <div className="flex justify-between border-b border-border/10 pb-2">
                  <dt className="text-muted font-mono">Entity Name</dt>
                  <dd className="text-fg font-sans font-semibold">UPRAISER Agency LLP</dd>
                </div>
                <div className="flex justify-between border-b border-border/10 pb-2">
                  <dt className="text-muted font-mono">Jurisdiction</dt>
                  <dd className="text-fg font-sans font-semibold">United Kingdom</dd>
                </div>
                <div className="flex justify-between border-b border-border/10 pb-2">
                  <dt className="text-muted font-mono">Registry ID</dt>
                  <dd className="text-fg font-mono font-semibold">OC417436</dd>
                </div>
                <div className="flex justify-between border-b border-border/10 pb-2">
                  <dt className="text-muted font-mono">Registered Office</dt>
                  <dd className="text-fg font-sans font-semibold text-right max-w-[180px] leading-snug">
                    128 City Road, London EC1V 2NX
                  </dd>
                </div>
                <div className="flex justify-between border-b border-border/10 pb-2">
                  <dt className="text-muted font-mono">ICO Registration</dt>
                  <dd className="text-fg font-mono font-semibold">ZC000436</dd>
                </div>
                <div className="flex justify-between pb-1">
                  <dt className="text-muted font-mono">Data Compliance</dt>
                  <dd className="text-fg font-sans font-semibold text-right">GDPR S2S Log Audited</dd>
                </div>
              </dl>
            </div>

            {/* Right: The Ascent Protocol */}
            <div>
              <div className="mb-6">
                <p className="stat-label text-orange">Expedition Manual</p>
                <h2 className="text-lg font-bold text-fg font-sans mt-2">The Ascent Protocol</h2>
              </div>
              <AscentProtocol />
            </div>

          </div>
        </section>
        
      </div>
    </div>
  );
}
