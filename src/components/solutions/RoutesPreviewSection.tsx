import { Link } from "react-router-dom";
import { AD_FORMATS, OEM_CTV_FORMATS } from "./ProgrammaticFormats";

export function RoutesPreviewSection() {
  // Combine all formats for the preview grid
  const formats = [...AD_FORMATS, ...OEM_CTV_FORMATS];
  
  return (
    <section id="routes" className="py-24 px-[var(--site-pad)] bg-gray-50 dark:bg-[#0a0f17]">
      <div className="page-container">
        <div className="mb-16">
          <p className="section-label mb-4">Routes & Formats</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Channels we trade on</h2>
          <p className="mt-4 text-xl text-black/60 dark:text-white/60 max-w-2xl">
            Select a route to view interactive channel visualisations, metrics, and proofs.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {formats.map(format => (
            <Link 
              key={format.id} 
              to={`/route/${format.id}`}
              className="group relative flex flex-col bg-white dark:bg-black p-8 rounded-3xl border border-black/5 dark:border-white/5 hover:border-[var(--theme-accent)] transition-colors overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--theme-accent)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[var(--theme-accent)]/20 transition-colors"></div>
              
              <h3 className="text-2xl font-bold mb-2 relative z-10">{format.label}</h3>
              <p className="text-sm font-semibold text-[var(--theme-accent)] uppercase tracking-wide mb-4 relative z-10">{format.tagline}</p>
              
              <p className="text-sm text-black/70 dark:text-white/70 leading-relaxed mb-8 relative z-10 line-clamp-3">
                {format.description}
              </p>
              
              <div className="mt-auto relative z-10 flex items-center text-sm font-bold text-black/50 dark:text-white/50 group-hover:text-[var(--theme-accent)] transition-colors">
                View Channel Experience
                <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
