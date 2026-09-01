import { COMPANY_CONTENT } from "../data/innerPagesData";

export function AboutUsSection() {
  const { camps, blocks } = COMPANY_CONTENT.aboutExpedition;
  
  return (
    <section className="py-24 px-[var(--site-pad)] bg-white dark:bg-[#06090e] border-t border-black/5 dark:border-white/5">
      <div className="page-container">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight max-w-2xl mb-16">
          {COMPANY_CONTENT.aboutExpedition.hero.title}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <div className="text-xl md:text-2xl font-medium leading-relaxed max-w-xl text-black/80 dark:text-white/80">
            {COMPANY_CONTENT.aboutExpedition.hero.text}
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {camps.map(camp => (
              <div key={camp.id} className="pt-4 border-t border-black/10 dark:border-white/10">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--theme-accent)] mb-2">{camp.altitude}</p>
                <h3 className="text-lg font-bold mb-2 leading-tight">{camp.title}</h3>
                <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed">{camp.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {blocks.map(block => (
            <div key={block.id} className="bg-black/5 dark:bg-white/5 p-8 rounded-2xl">
              <h4 className="text-xl font-bold mb-4">{block.title}</h4>
              <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed whitespace-pre-wrap">{block.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
