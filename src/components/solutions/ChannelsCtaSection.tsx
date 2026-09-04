import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export function ChannelsCtaSection() {
  const reduced = useReducedMotion();

  return (
    <section id="routes" className="section-band border-t border-border/30 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="page-container relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

        {/* Left: Typography and CTA — system tokens only */}
        <div className="flex-1 text-left">
          <div className="section-header">
            <p className="section-label">The Channels</p>
            <h2 className="section-title">
              Every Format.<br />
              <span className="text-muted">One Supply Path.</span>
            </h2>
            <p className="section-description">
              From Programmatic and Social to Connected TV and OEM. Explore our interactive channel visualizations and performance proofs.
            </p>
          </div>

          <motion.div
            className="mt-8 inline-block"
            whileHover={reduced ? undefined : { scale: 1.02 }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
          >
            <Link to="/channels" className="btn-caps btn-caps--primary inline-flex items-center gap-3 rounded-full px-8 py-3">
              Explore All Channels
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Right: Glassmorphism device & data previews */}
        <div className="flex-1 relative w-full max-w-lg aspect-square flex items-center justify-center">
          
          {/* Subtle brand glow behind the cards */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] opacity-40 dark:opacity-20 pointer-events-none">
             <div className="absolute inset-0 bg-accent blur-[100px] rounded-full mix-blend-screen" />
          </div>

          {/* Main Dashboard / CTV View (Center-Back) */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.1, duration: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="absolute w-[105%] aspect-video bg-bg-card/60 rounded-2xl border border-border/50 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col p-4"
          >
            {/* Header bar */}
            <div className="w-full flex justify-between items-center mb-6">
              <div className="w-1/4 h-3 bg-border/60 rounded-full" />
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-border/40" />
                <div className="w-3 h-3 rounded-full bg-border/40" />
              </div>
            </div>
            
            {/* Logo Watermark / Data Area */}
            <div className="relative flex-1 bg-border/10 rounded-xl border border-border/20 flex items-center justify-center overflow-hidden">
              {/* Giant faint logo in the background */}
              <img src="/logo.svg" alt="" className="absolute w-1/2 opacity-10 dark:opacity-20 grayscale mix-blend-overlay" />
              
              {/* Synthetic Data Wave */}
              <div className="absolute bottom-0 w-full flex items-end justify-between px-4 gap-1 opacity-60">
                {[40, 20, 60, 45, 80, 55, 90, 70, 100, 85, 40].map((h, i) => (
                  <div key={i} className="w-full bg-accent rounded-t-sm" style={{ height: `${h}%`, opacity: h / 100 }} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Tablet / Metric Card (Right) */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 4 }}
            whileInView={{ opacity: 1, x: 25, rotate: 4 }}
            transition={{ type: "spring", bounce: 0.2, duration: 1, delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="absolute right-0 w-[50%] aspect-[3/4] bg-bg-elevated/80 rounded-2xl border border-border/50 backdrop-blur-2xl shadow-2xl flex flex-col p-5 gap-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0 border border-accent/30">
                <div className="w-3 h-3 bg-accent rounded-full shadow-[0_0_10px_var(--theme-accent)]" />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="w-2/3 h-2 bg-text rounded-full" />
                <div className="w-1/3 h-2 bg-text-muted rounded-full" />
              </div>
            </div>
            
            {/* KPI Block */}
            <div className="space-y-2 mt-2">
              <div className="text-[2.5rem] leading-none font-bold tracking-tight font-mono text-text">
                99.8<span className="text-accent text-xl">%</span>
              </div>
              <div className="w-4/5 h-2 bg-border/40 rounded-full" />
            </div>

            {/* Glowing Chart */}
            <div className="flex-1 w-full bg-accent/5 rounded-xl border border-accent/10 flex items-end p-2 gap-1.5 mt-auto">
              {[20, 40, 30, 60, 50, 80, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-accent rounded-sm shadow-[0_0_8px_var(--theme-accent)]" style={{ height: `${h}%`, opacity: 0.4 + (h/100)*0.6 }} />
              ))}
            </div>
          </motion.div>

          {/* Phone / Feed Card (Left) */}
          <motion.div
            initial={{ opacity: 0, x: -50, y: 30, rotate: -6 }}
            whileInView={{ opacity: 1, x: -35, y: 20, rotate: -6 }}
            transition={{ type: "spring", bounce: 0.2, duration: 1, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="absolute left-0 bottom-6 w-[40%] aspect-[9/19] bg-bg-card/90 rounded-[2rem] border-4 border-border/40 backdrop-blur-2xl shadow-2xl flex flex-col p-3 gap-3 overflow-hidden"
          >
            {/* Notch */}
            <div className="w-1/3 h-1.5 bg-border/50 mx-auto rounded-full mb-1 shrink-0" />
            
            {/* Feed Items */}
            {[1, 2, 3].map((_, i) => (
              <div key={i} className={`w-full p-2.5 rounded-xl border border-border/30 flex flex-col gap-2 ${i === 0 ? 'bg-accent/10 border-accent/20' : 'bg-border/10'}`}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-accent/40 shrink-0" />
                  <div className="flex-1 space-y-1">
                     <div className="w-3/4 h-1.5 bg-text/60 rounded-full" />
                     <div className="w-1/2 h-1.5 bg-text-muted/40 rounded-full" />
                  </div>
                </div>
                {i === 0 && <div className="w-full h-12 bg-accent/20 rounded-lg mt-1 border border-accent/10" />}
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
