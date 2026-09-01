import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function ChannelsCtaSection() {
  return (
    <section id="routes" className="py-32 px-[var(--site-pad)] bg-white dark:bg-[#06090e] border-t border-black/5 dark:border-white/5 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--theme-accent)]/5 dark:bg-[var(--theme-accent)]/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="page-container relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left side: Typography and CTA */}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-[2px] bg-[var(--theme-accent)]"></div>
            <p className="section-label uppercase tracking-widest text-[var(--theme-accent)] font-bold">The Channels</p>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 text-black dark:text-white">
            Every Format.<br />
            <span className="text-black/40 dark:text-white/40">One Supply Path.</span>
          </h2>
          <p className="text-xl md:text-2xl text-black/60 dark:text-white/60 max-w-xl mb-12 leading-relaxed">
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

        {/* Right side: Lightweight CSS Visual Anchor (Glassmorphism Devices) */}
        <div className="flex-1 relative w-full max-w-lg aspect-square flex items-center justify-center pointer-events-none">
          {/* TV / Monitor */}
          <motion.div 
            initial={{ opacity: 0, y: 20, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ type: "spring", bounce: 0.1, duration: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="absolute w-[110%] aspect-video bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 backdrop-blur-md shadow-2xl overflow-hidden flex items-end justify-center pb-4"
          >
            {/* Fake UI bars */}
            <div className="w-3/4 h-2/3 flex flex-col gap-3">
               <div className="w-1/3 h-6 bg-black/10 dark:bg-white/10 rounded-md"></div>
               <div className="w-full h-full bg-[var(--theme-accent)]/20 rounded-lg"></div>
            </div>
          </motion.div>

          {/* Tablet */}
          <motion.div 
            initial={{ opacity: 0, x: 40, rotate: 6 }}
            whileInView={{ opacity: 1, x: 20, rotate: 6 }}
            transition={{ type: "spring", bounce: 0.2, duration: 1, delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="absolute right-0 w-[55%] aspect-[3/4] bg-white/80 dark:bg-[#0a0f17]/80 rounded-3xl border border-black/10 dark:border-white/10 backdrop-blur-xl shadow-2xl flex flex-col p-4 gap-4"
          >
             <div className="w-full h-32 bg-[var(--theme-accent)]/30 rounded-xl"></div>
             <div className="w-2/3 h-4 bg-black/10 dark:bg-white/10 rounded-full"></div>
             <div className="w-4/5 h-4 bg-black/5 dark:bg-white/5 rounded-full"></div>
          </motion.div>

          {/* Phone */}
          <motion.div 
            initial={{ opacity: 0, x: -40, y: 40, rotate: -8 }}
            whileInView={{ opacity: 1, x: -30, y: 20, rotate: -8 }}
            transition={{ type: "spring", bounce: 0.2, duration: 1, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="absolute left-0 bottom-10 w-[35%] aspect-[9/19] bg-white dark:bg-black rounded-[2rem] border-4 border-black/10 dark:border-white/20 shadow-2xl flex flex-col p-3 gap-3"
          >
             <div className="w-1/3 h-1 bg-black/20 dark:bg-white/20 mx-auto rounded-full mb-2"></div>
             <div className="w-full flex-1 bg-[var(--theme-accent)]/40 rounded-xl"></div>
             <div className="w-full h-12 bg-black/5 dark:bg-white/10 rounded-xl"></div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
