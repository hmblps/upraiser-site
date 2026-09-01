
export function AboutUsSection() {
  return (
    <section className="py-32 px-[var(--site-pad)] bg-white dark:bg-[#06090e] border-t border-black/5 dark:border-white/5 relative overflow-hidden">
      {/* Subtle Visual Anchor - Topographic / Map Contour graphic */}
      <div className="absolute top-0 right-0 w-full max-w-3xl opacity-5 dark:opacity-[0.03] pointer-events-none translate-x-1/3 -translate-y-1/4">
        <svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="400" cy="400" r="150" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10"/>
          <circle cx="400" cy="400" r="250" stroke="currentColor" strokeWidth="2"/>
          <circle cx="400" cy="400" r="350" stroke="currentColor" strokeWidth="2" strokeDasharray="5 20"/>
          <path d="M400 100 L400 300 M400 500 L400 700 M100 400 L300 400 M500 400 L700 400" stroke="currentColor" strokeWidth="2"/>
          <circle cx="400" cy="400" r="8" fill="currentColor"/>
        </svg>
      </div>

      <div className="page-container relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 h-[2px] bg-[var(--theme-accent)]"></div>
          <p className="section-label uppercase tracking-widest text-[var(--theme-accent)] font-bold">The Expedition</p>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mb-10 text-black dark:text-white">
          We mapped the mobile advertising terrain.
        </h2>
        
        <div className="grid md:grid-cols-[1.5fr_1fr] gap-12 items-start">
          <div className="text-2xl md:text-3xl font-medium leading-snug text-black/80 dark:text-white/80">
            <span className="font-extrabold text-black dark:text-white">Basecamp London, since 2017. </span> 
            Systems, software, finance, and creative operators work at one desk. 
            You speak directly to the crew who wires Your pipes and trades Your budgets.
          </div>
          
          <div className="bg-black/5 dark:bg-white/5 p-8 rounded-3xl border border-black/10 dark:border-white/10 backdrop-blur-md">
            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-[var(--theme-accent)]">Our Disciplines</h3>
            <ul className="flex flex-col gap-4 text-black/70 dark:text-white/70 font-medium">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)]"></span>
                Systems & Architecture
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)]"></span>
                Software Engineering
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)]"></span>
                Financial Trading
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)]"></span>
                Creative Studio
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
