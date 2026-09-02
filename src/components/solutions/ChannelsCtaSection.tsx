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

        {/* Right: Glassmorphism device previews */}
        <div className="flex-1 relative w-full max-w-lg aspect-square flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ type: "spring", bounce: 0.1, duration: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="absolute w-[110%] aspect-video bg-bg-card/50 rounded-2xl border border-border/50 backdrop-blur-md shadow-2xl overflow-hidden flex items-end justify-center pb-4"
          >
            <div className="w-3/4 h-2/3 flex flex-col gap-3">
              <div className="w-1/3 h-6 bg-border/60 rounded-md" />
              <div className="w-full h-full bg-accent/20 rounded-lg" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 6 }}
            whileInView={{ opacity: 1, x: 20, rotate: 6 }}
            transition={{ type: "spring", bounce: 0.2, duration: 1, delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="absolute right-0 w-[55%] aspect-[3/4] bg-bg-elevated/80 rounded-3xl border border-border/50 backdrop-blur-xl shadow-2xl flex flex-col p-4 gap-4"
          >
            <div className="w-full h-32 bg-accent/30 rounded-xl" />
            <div className="w-2/3 h-4 bg-border/60 rounded-full" />
            <div className="w-4/5 h-4 bg-border/30 rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40, y: 40, rotate: -8 }}
            whileInView={{ opacity: 1, x: -30, y: 20, rotate: -8 }}
            transition={{ type: "spring", bounce: 0.2, duration: 1, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="absolute left-0 bottom-10 w-[35%] aspect-[9/19] bg-bg rounded-[2rem] border-4 border-border/40 shadow-2xl flex flex-col p-3 gap-3"
          >
            <div className="w-1/3 h-1 bg-border/50 mx-auto rounded-full mb-2" />
            <div className="w-full flex-1 bg-accent/40 rounded-xl" />
            <div className="w-full h-12 bg-border/20 rounded-xl" />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
