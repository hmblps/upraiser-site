import { Link } from "react-router-dom";

export function ChannelsCtaSection() {
  return (
    <section id="routes" className="py-32 px-[var(--site-pad)] bg-gray-50 dark:bg-[#0a0f17] relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--theme-accent)]/10 dark:bg-[var(--theme-accent)]/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="page-container relative z-10 flex flex-col items-center text-center">
        <p className="section-label mb-6">The Channels</p>
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          Every Format.<br />
          <span className="text-black/40 dark:text-white/40">One Supply Path.</span>
        </h2>
        <p className="text-xl md:text-2xl text-black/60 dark:text-white/60 max-w-2xl mb-12">
          From Programmatic and Social to Connected TV and OEM. Explore our interactive channel visualizations and performance proofs.
        </p>
        
        <Link 
          to="/channels"
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-lg overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-white/20 dark:bg-black/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          <span className="relative z-10">Explore All Channels</span>
          <svg className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
