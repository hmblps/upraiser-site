import { COMPANY_CONTENT } from "../data/innerPagesData";
import { AscentProtocol } from "./AscentProtocol";

/**
 * About/Expedition — Monolithic engineering dossier layout.
 * Clean 1-screen presentation focused purely on the Basecamp intro and the Ascent Protocol.
 */
export function Company() {
  return (
    <div className="depth-page depth-page--company viewport-page">
      <div className="viewport-page__shell section-inner flex flex-col lg:flex-row lg:gap-16 pt-8 pb-12 lg:pt-16 min-h-0">
        
        {/* Left: Basecamp Intro */}
        <header className="viewport-page__intro shrink-0 lg:w-5/12 lg:flex lg:flex-col lg:justify-between pb-8 lg:pb-0">
          <div>
            <p className="section-label text-accent">Basecamp</p>
            <h1 className="section-title mt-2 lg:mt-4 text-4xl lg:text-5xl tracking-tight leading-[1.1]">{COMPANY_CONTENT.hero.h1}</h1>
            <p className="section-description mt-4 lg:mt-6 max-w-xl text-lg text-muted-light">
              {COMPANY_CONTENT.hero.description}
            </p>
          </div>
          
          <div className="mt-8 lg:mt-auto hidden lg:block">
            <p className="stat-label text-accent">Expedition Manual</p>
            <h2 className="text-xl font-bold text-fg font-sans mt-2">The Ascent Protocol</h2>
          </div>
        </header>

        {/* Right: The Ascent Protocol */}
        <section className="flex-1 min-h-0 flex flex-col">
          <div className="lg:hidden mb-4 shrink-0">
            <p className="stat-label text-accent">Expedition Manual</p>
            <h2 className="text-xl font-bold text-fg font-sans mt-2">The Ascent Protocol</h2>
          </div>
          <AscentProtocol />
        </section>
        
      </div>
    </div>
  );
}
