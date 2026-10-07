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
    offset: ["start 0.8", "center center"]
  });

  // Draw progress for the bright gradient overlay
  const drawDesktop = useTransform(scrollYProgress, [0.0, 0.6], [0, 1]);
  const drawTablet  = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);
  const drawPhone   = useTransform(scrollYProgress, [0.4, 1.0], [0, 1]);

  return (
    <div ref={containerRef} className="relative flex-1 w-full max-w-[800px] aspect-[4/3] mx-auto lg:mx-0 flex items-center justify-center pointer-events-none">
      <svg viewBox="0 0 800 600" className="w-full h-full overflow-visible" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>
          
          <linearGradient id="brandGradDark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <g strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
          
          {/* --- DESKTOP (Back, Largest) --- */}
          <g transform="translate(100, 60)">
            {/* Base Outline (Always fully drawn, faint) */}
            <rect x="0" y="0" width="600" height="400" rx="16" stroke="url(#brandGradDark)" />
            <line x1="0" y1="50" x2="600" y2="50" stroke="url(#brandGradDark)" />
            
            {/* Animated Highlight (Draws over the base) */}
            <motion.rect x="0" y="0" width="600" height="400" rx="16" stroke="url(#brandGrad)" style={{ pathLength: drawDesktop }} />
            <motion.line x1="0" y1="50" x2="600" y2="50" stroke="url(#brandGrad)" style={{ pathLength: drawDesktop }} />
            
            {/* Simple UI hints */}
            <circle cx="30" cy="25" r="4" stroke="url(#brandGradDark)" />
            <circle cx="50" cy="25" r="4" stroke="url(#brandGradDark)" />
            <motion.circle cx="30" cy="25" r="4" stroke="url(#brandGrad)" style={{ pathLength: drawDesktop }} />
            <motion.circle cx="50" cy="25" r="4" stroke="url(#brandGrad)" style={{ pathLength: drawDesktop }} />
          </g>

          {/* --- TABLET (Right, Medium) --- */}
          <g transform="translate(520, 180)">
            {/* Base */}
            <rect x="0" y="0" width="240" height="340" rx="20" stroke="url(#brandGradDark)" />
            <rect x="20" y="20" width="200" height="300" rx="8" stroke="url(#brandGradDark)" strokeWidth="1.5" />
            
            {/* Animated */}
            <motion.rect x="0" y="0" width="240" height="340" rx="20" stroke="url(#brandGrad)" style={{ pathLength: drawTablet }} />
            <motion.rect x="20" y="20" width="200" height="300" rx="8" stroke="url(#brandGrad)" strokeWidth="1.5" style={{ pathLength: drawTablet }} />
          </g>

          {/* --- PHONE (Left, Tall) --- */}
          <g transform="translate(30, 220)">
            {/* Base */}
            <rect x="0" y="0" width="180" height="360" rx="28" stroke="url(#brandGradDark)" />
            <line x1="60" y1="20" x2="120" y2="20" stroke="url(#brandGradDark)" strokeWidth="4" />
            <rect x="15" y="45" width="150" height="300" rx="12" stroke="url(#brandGradDark)" strokeWidth="1.5" />
            
            {/* Animated */}
            <motion.rect x="0" y="0" width="180" height="360" rx="28" stroke="url(#brandGrad)" style={{ pathLength: drawPhone }} />
            <motion.line x1="60" y1="20" x2="120" y2="20" stroke="url(#brandGrad)" strokeWidth="4" style={{ pathLength: drawPhone }} />
            <motion.rect x="15" y="45" width="150" height="300" rx="12" stroke="url(#brandGrad)" strokeWidth="1.5" style={{ pathLength: drawPhone }} />
          </g>
          
        </g>
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
