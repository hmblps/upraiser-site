import { COMPANY_CONTENT } from "../data/innerPagesData";
import { formatEventNames } from "../lib/formatEventNames";

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
              </article>
            ))}

            {/* CTA Block */}
            <article className="mt-8 rounded-lg border border-border/40 bg-card p-6 sm:p-8">
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
            </article>
          </div>
        </section>
        
      </div>
    </div>
  );
}
