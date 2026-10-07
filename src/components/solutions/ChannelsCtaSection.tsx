import { useRef, useEffect } from "react";
import { warmStage } from "../../lib/scrollPreload";

import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { MotionValue } from "framer-motion";

function ChartBar({ h, i, scrollYProgress }: { h: number, i: number, scrollYProgress: MotionValue<number> }) {
  const yOffset = useTransform(scrollYProgress, [0.3 + i * 0.05, 1], [100, 100 - h]);
  return (
    <motion.div 
      className="flex-1 bg-accent rounded-sm shadow-[0_0_8px_var(--theme-accent)] origin-bottom" 
      style={{ 
        height: "100%",
        y: useMotionTemplate`${yOffset}%`,
        opacity: 0.4 + (h/100)*0.6 
      }} 
    />
  );
}

function WaveBar({ h, scrollYProgress }: { h: number, scrollYProgress: MotionValue<number> }) {
  const heightStr = useTransform(scrollYProgress, [0, 1], ["0%", h + "%"]);
  return (
    <motion.div 
      className="w-full bg-accent rounded-t-sm" 
      style={{ 
        height: heightStr,
        opacity: h / 100 
      }} 
    />
  );
}


function InteractiveVisuals() {
  const { scrollYProgress } = useScroll();
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (numRef.current) {
        const val = Math.min(98.0, Math.max(0, v * 2 * 98.0));
        numRef.current.innerText = val.toFixed(1);
      }
    });
  }, [scrollYProgress]);

  const bars = [25, 45, 35, 60, 50, 75, 95];

  // The gradient used for outlines
  const outlineGradient = "bg-gradient-to-br from-accent via-accent to-accent-secondary";

  return (
    <div className="relative flex-1 max-w-[500px] aspect-square mx-auto lg:mx-0 w-full flex items-center justify-center">
      
      {/* Glow aura */}
      <div className="absolute inset-0 bg-accent/5 blur-[100px] rounded-full scale-110 pointer-events-none" />

      {/* Desktop / Web Window (Back) - WIREFRAME */}
      <motion.div
        style={{
          y: useTransform(scrollYProgress, [0, 1], [40, 0]),
          scale: useTransform(scrollYProgress, [0, 1], [0.95, 1]),
          opacity: useTransform(scrollYProgress, [0, 0.5], [0, 1]),
        }}
        className={`absolute w-[90%] aspect-[4/3] rounded-[2rem] p-[1px] ${outlineGradient} shadow-[0_0_30px_rgba(251,191,36,0.1)]`}
      >
        <div className="w-full h-full bg-bg rounded-[2rem] flex flex-col p-6 overflow-hidden relative">
          
          <div className="w-full flex justify-between items-center mb-8">
            <div className="flex gap-2">
              <div className={`w-3 h-3 rounded-full p-[1px] ${outlineGradient}`}><div className="w-full h-full bg-bg rounded-full"/></div>
              <div className={`w-3 h-3 rounded-full p-[1px] ${outlineGradient}`}><div className="w-full h-full bg-bg rounded-full"/></div>
            </div>
          </div>
          
          <div className={`flex-1 rounded-2xl p-[1px] ${outlineGradient} flex flex-col items-center justify-center p-8 relative overflow-hidden`}>
            <div className="w-full h-full bg-bg rounded-2xl flex flex-col items-center justify-center p-8 relative">
              {/* grid lines */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--theme-accent) 1px, transparent 1px), linear-gradient(90deg, var(--theme-accent) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="w-[40%] h-[1px] bg-accent/60 mb-6 relative z-10" />
              <div className={`w-[60%] h-[70%] rounded-xl p-[1px] ${outlineGradient} relative z-10`}><div className="w-full h-full bg-bg/80 backdrop-blur-sm rounded-xl"/></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tablet / Metric Card (Right) - WIREFRAME */}
      <motion.div
        style={{
          x: useTransform(scrollYProgress, [0, 1], [80, 40]),
          rotate: useTransform(scrollYProgress, [0, 1], [0, 6]),
          opacity: useTransform(scrollYProgress, [0, 0.7], [0, 1]),
        }}
        className={`absolute right-0 w-[55%] aspect-[3/4] rounded-[2rem] p-[1px] ${outlineGradient} shadow-[0_0_30px_rgba(251,191,36,0.15)] z-10`}
      >
        <div className="w-full h-full bg-bg rounded-[2rem] flex flex-col p-6 sm:p-8 relative overflow-hidden">
          {/* subtle grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--theme-accent) 1px, transparent 1px), linear-gradient(90deg, var(--theme-accent) 1px, transparent 1px)', backgroundSize: '15px 15px' }} />

          <div className={`w-10 h-10 rounded-full p-[1px] ${outlineGradient} flex items-center justify-center mb-6 relative z-10`}>
             <div className="w-full h-full bg-bg rounded-full flex items-center justify-center">
               <div className="w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_8px_var(--theme-accent)]" />
             </div>
          </div>
          
          <div className="text-[3rem] sm:text-[3.5rem] leading-none font-bold tracking-tight text-text mb-6 relative z-10">
            <span ref={numRef}>98.0</span><span className="text-accent text-[2.5rem]">%</span>
          </div>
          
          <div className="w-16 h-[1px] bg-accent/40 mb-8 relative z-10" />

          <div className={`flex-1 w-full rounded-[1.5rem] p-[1px] ${outlineGradient} relative z-10`}>
            <div className="w-full h-full bg-bg rounded-[1.5rem] p-4 sm:p-5 flex items-end gap-2 overflow-hidden">
              {bars.map((h, i) => (
                 <ChartBar key={i} h={h} i={i} scrollYProgress={scrollYProgress} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Phone / Feed Card (Left) - WIREFRAME */}
      <motion.div
        style={{
          x: useTransform(scrollYProgress, [0, 1], [-80, -40]),
          y: useTransform(scrollYProgress, [0, 1], [40, 10]),
          rotate: useTransform(scrollYProgress, [0, 1], [0, -8]),
          opacity: useTransform(scrollYProgress, [0, 0.7], [0, 1]),
        }}
        className={`absolute left-0 bottom-4 w-[45%] aspect-[9/19] rounded-[2.5rem] p-[1px] ${outlineGradient} shadow-[0_0_30px_rgba(251,191,36,0.15)] z-20`}
      >
        <div className="w-full h-full bg-bg rounded-[2.5rem] flex flex-col p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--theme-accent) 1px, transparent 1px), linear-gradient(90deg, var(--theme-accent) 1px, transparent 1px)', backgroundSize: '15px 15px' }} />

          {/* Notch */}
          <div className="w-14 h-[2px] bg-accent/40 mx-auto rounded-full mb-6 shrink-0 relative z-10" />
          
          {/* Top Highlight Pill */}
          <div className={`w-full rounded-[1.5rem] p-[1px] ${outlineGradient} mb-6 relative z-10`}>
            <div className="w-full bg-bg rounded-[1.5rem] p-4 flex flex-col gap-4">
              <div className="w-4 h-4 bg-accent/80 rounded-full shadow-[0_0_10px_var(--theme-accent)]" />
              <div className={`w-full h-8 rounded-xl p-[1px] ${outlineGradient}`}><div className="w-full h-full bg-bg rounded-xl"/></div>
            </div>
          </div>

          {/* Feed Items */}
          <div className="flex-1 flex flex-col gap-4 relative z-10">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className={`w-full rounded-[1.25rem] p-[1px] ${outlineGradient}`}>
                <div className="w-full h-full bg-bg rounded-[1.25rem] p-3.5 flex items-center gap-4">
                  <div className="w-3.5 h-3.5 rounded-full p-[1px] bg-accent/60 shrink-0"><div className="w-full h-full bg-bg rounded-full"/></div>
                  <div className="flex-1 h-[2px] bg-accent/30 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
export function ChannelsCtaSection() {
  const reduced = useReducedMotion();

  useEffect(() => {
    warmStage("routes");
    warmStage("routes-tablet");
    warmStage("routes-tv");
  }, []);

  return (
    <section id="routes" className="section-band border-t border-border/30 relative overflow-hidden">
      <div className="page-container relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

        {/* Left: Typography and CTA */}
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

        <InteractiveVisuals />

      </div>
    </section>
  );
}
