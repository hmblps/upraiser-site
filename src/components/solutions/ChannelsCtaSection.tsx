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
      className="flex-1 bg-gradient-to-t from-[#FBBF24] to-[#F43F5E] rounded-sm shadow-[0_0_8px_#F43F5E] origin-bottom" 
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "center center"]
  });

  // Animation values for drawing the paths
  const drawDesktop = useTransform(scrollYProgress, [0.0, 0.6], [0, 1]);
  const drawTablet  = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);
  const drawPhone   = useTransform(scrollYProgress, [0.4, 1.0], [0, 1]);
  
  // Opacity fades
  const opacityFade = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <div ref={containerRef} className="relative flex-1 max-w-[600px] aspect-[4/3] mx-auto lg:mx-0 w-full flex items-center justify-center pointer-events-none">
      
      {/* Subtle Glow aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FBBF24]/5 to-[#F43F5E]/5 blur-[80px] rounded-full scale-110 pointer-events-none" />

      <svg viewBox="0 0 600 450" className="w-full h-full overflow-visible" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>
          
          <linearGradient id="brandGradFade" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* --- DESKTOP (Back) --- */}
        <motion.g 
          style={{ opacity: opacityFade, y: useTransform(scrollYProgress, [0, 1], [30, 0]) }}
          stroke="url(#brandGradFade)" 
          fill="none" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Main Desktop Frame */}
          <motion.rect x="50" y="80" width="400" height="260" rx="20" style={{ pathLength: drawDesktop }} />
          {/* Header Line */}
          <motion.line x1="50" y1="120" x2="450" y2="120" strokeWidth="1" style={{ pathLength: drawDesktop }} />
          {/* Window controls */}
          <motion.circle cx="80" cy="100" r="4" style={{ pathLength: drawDesktop }} />
          <motion.circle cx="100" cy="100" r="4" style={{ pathLength: drawDesktop }} />
          
          {/* Desktop Content Graph Line (Thick & Bright) */}
          <motion.path d="M90 280 C 150 270, 200 320, 250 200 C 300 80, 350 180, 410 160" strokeWidth="2.75" stroke="url(#brandGrad)" style={{ pathLength: drawDesktop }} />
        </motion.g>

        {/* --- TABLET (Right) --- */}
        <motion.g 
          style={{ opacity: opacityFade, x: useTransform(scrollYProgress, [0, 1], [40, 20]), y: 20, rotate: 4 }}
          stroke="url(#brandGradFade)" 
          fill="none" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Tablet Frame */}
          <motion.rect x="320" y="50" width="220" height="300" rx="24" style={{ pathLength: drawTablet }} />
          {/* Inner Content Box */}
          <motion.rect x="340" y="200" width="180" height="120" rx="16" strokeWidth="1" style={{ pathLength: drawTablet }} />
          {/* Circle Graphic */}
          <motion.circle cx="370" cy="100" r="12" style={{ pathLength: drawTablet }} />
          <motion.circle cx="370" cy="100" r="4" fill="url(#brandGradFade)" stroke="none" style={{ pathLength: drawTablet }} />
          
          {/* Tablet Content Graph Line (Thick & Bright) */}
          <motion.path d="M340 290 C 370 280, 400 310, 440 240 C 480 170, 500 250, 520 220" stroke="url(#brandGrad)" strokeWidth="2.75" style={{ pathLength: drawTablet }} />
        </motion.g>

        {/* --- PHONE (Left) --- */}
        <motion.g 
          style={{ opacity: opacityFade, x: useTransform(scrollYProgress, [0, 1], [-20, 0]), y: 50, rotate: -6 }}
          stroke="url(#brandGradFade)" 
          fill="none" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Phone Frame */}
          <motion.rect x="40" y="30" width="160" height="340" rx="32" style={{ pathLength: drawPhone }} />
          {/* Notch */}
          <motion.line x1="90" y1="50" x2="150" y2="50" strokeWidth="3" style={{ pathLength: drawPhone }} />
          
          {/* Highlight pill */}
          <motion.rect x="60" y="70" width="120" height="50" rx="25" strokeWidth="1" style={{ pathLength: drawPhone }} />
          <motion.circle cx="85" cy="95" r="6" fill="url(#brandGradFade)" stroke="none" style={{ pathLength: drawPhone, opacity: drawPhone }} />
          
          {/* Feed Lines (Data) */}
          <motion.line x1="70" y1="150" x2="170" y2="150" stroke="url(#brandGrad)" strokeWidth="2.5" style={{ pathLength: drawPhone }} />
          <motion.circle cx="60" cy="150" r="4" style={{ pathLength: drawPhone }} />
          
          <motion.line x1="70" y1="200" x2="170" y2="200" stroke="url(#brandGrad)" strokeWidth="2.5" style={{ pathLength: drawPhone }} />
          <motion.circle cx="60" cy="200" r="4" style={{ pathLength: drawPhone }} />
          
          <motion.line x1="70" y1="250" x2="170" y2="250" stroke="url(#brandGrad)" strokeWidth="2.5" style={{ pathLength: drawPhone }} />
          <motion.circle cx="60" cy="250" r="4" style={{ pathLength: drawPhone }} />
          
          <motion.line x1="70" y1="300" x2="170" y2="300" stroke="url(#brandGrad)" strokeWidth="2.5" style={{ pathLength: drawPhone }} />
          <motion.circle cx="60" cy="300" r="4" style={{ pathLength: drawPhone }} />
        </motion.g>

      </svg>
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
