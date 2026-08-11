import { COMPANY_CONTENT, ASCENT_PROTOCOLS } from "../data/innerPagesData";
import { formatEventNames } from "../lib/formatEventNames";
import { BorderBeam } from "./BorderBeam";
import { TerminalBlock, NodeGraphDecoration } from "./CompanyVisuals";

/**
 * About/Expedition — Monolithic engineering dossier layout.
 * Clean 1-screen presentation focused purely on the Basecamp intro and the Ascent Protocol.
 */
export function Company() {
  const { aboutExpedition } = COMPANY_CONTENT;

  return (
    <div className="depth-page depth-page--company viewport-page">
      <div className="viewport-page__shell section-inner flex flex-col lg:flex-row lg:gap-16 pt-8 pb-12 lg:pt-16 min-h-0">
        
        {/* Left: Basecamp Intro */}
        <header className="viewport-page__intro shrink-0 lg:w-5/12 lg:flex lg:flex-col lg:justify-between pb-8 lg:pb-0">
          <div>
            <p className="section-label text-accent">{aboutExpedition.hero.label}</p>
            <h1 className="section-title mt-2 lg:mt-4 text-4xl lg:text-5xl tracking-tight leading-[1.1]">
              {aboutExpedition.hero.title}
            </h1>
            <p className="section-description mt-4 lg:mt-6 max-w-xl text-lg text-muted-light whitespace-pre-wrap">
              {aboutExpedition.hero.text}
            </p>
          </div>
        </header>

        {/* Right: The Expedition Blocks */}
        <section className="flex-1 min-h-0 flex flex-col overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-12 pb-16">
            {aboutExpedition.blocks.map((block) => (
              <article key={block.id} className="relative">
                <p className="font-mono text-xs font-semibold tracking-wider text-accent mb-2">
                  {block.label}
                </p>
                <h2 className="font-sans text-xl sm:text-2xl font-bold leading-snug text-fg mb-4">
                  {block.title}
                </h2>
                <p className="font-sans text-sm sm:text-base leading-relaxed text-muted-light whitespace-pre-wrap">
                  {formatEventNames(block.text)}
                </p>
                
                {/* Insert terminal block after the first block */}
                {block.id === "convergence" && <TerminalBlock />}
              </article>
            ))}

            {/* FAQ Block (The Protocols) */}
            <article className="mt-8 relative">
              <NodeGraphDecoration />
              <p className="font-mono text-xs font-semibold tracking-wider text-accent mb-2">
                The Protocols
              </p>
              <h2 className="font-sans text-xl sm:text-2xl font-bold leading-snug text-fg mb-6">
                Frequently Asked Questions
              </h2>
              <div className="flex flex-col gap-4">
                {ASCENT_PROTOCOLS.map((item, i) => (
                  <details
                    key={i}
                    className="group rounded-xl border border-border/40 bg-card overflow-hidden transition-colors hover:border-accent/30"
                  >
                    <summary className="flex cursor-pointer items-center justify-between p-5 sm:p-6 font-sans font-bold text-fg select-none marker:content-none [&::-webkit-details-marker]:hidden">
                      <span className="pr-6">{item.question}</span>
                      <span className="shrink-0 text-accent transition-transform duration-300 group-open:rotate-45">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </span>
                    </summary>
                    <div className="px-5 pb-6 sm:px-6 sm:pb-7">
                      <p className="font-sans text-sm sm:text-base leading-relaxed text-muted-light whitespace-pre-wrap">
                        {formatEventNames(item.answer)}
                      </p>
                      <div className="mt-4 inline-flex items-center rounded-full border border-border bg-bg-elevated px-3 py-1 text-xs font-mono text-accent">
                        {item.ogilvyProof}
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </article>

            {/* CTA Block */}
            <article className="mt-8 relative overflow-hidden rounded-xl border border-border/40 bg-card p-6 sm:p-8">
              <BorderBeam
                className="z-0"
                duration={12}
                size={300}
                colorFrom="var(--theme-accent-light)"
                colorTo="var(--color-magenta)"
              />
              <div className="relative z-10">
                <h2 className="font-sans text-xl sm:text-2xl font-bold leading-snug text-fg mb-3">
                  {aboutExpedition.cta.title}
                </h2>
                <p className="font-sans text-sm sm:text-base leading-relaxed text-muted-light mb-6">
                  {aboutExpedition.cta.text}
                </p>
                <button 
                  data-cursor="pointer"
                  className="inline-flex items-center justify-center bg-accent text-accent-fg font-sans font-bold text-sm sm:text-base px-6 py-3 rounded hover:bg-accent/90 transition-colors"
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                >
                  {aboutExpedition.cta.button}
                </button>
              </div>
            </article>
          </div>
        </section>
        
      </div>
    </div>
  );
}
