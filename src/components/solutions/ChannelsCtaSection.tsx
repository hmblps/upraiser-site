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

  // A single, continuous draw animation for the main graph line
  const drawLine = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);
  
  // Opacity fade for the grid and axes
  const opacityFade = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <div ref={containerRef} className="relative flex-1 max-w-[700px] aspect-[16/9] mx-auto lg:mx-0 w-full flex items-center justify-center pointer-events-none">
      <svg viewBox="0 0 700 400" className="w-full h-full overflow-visible" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>
          
          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <motion.g style={{ opacity: opacityFade }}>
          {/* NOTEBOOK GRID (Тетрадка) */}
          <g stroke="currentColor" strokeOpacity="0.06" strokeWidth="1">
            {/* Horizontal Grid Lines */}
            <line x1="0" y1="50" x2="700" y2="50" />
            <line x1="0" y1="125" x2="700" y2="125" />
            <line x1="0" y1="200" x2="700" y2="200" />
            <line x1="0" y1="275" x2="700" y2="275" />
            <line x1="0" y1="350" x2="700" y2="350" />
            
            {/* Vertical Grid Lines */}
            <line x1="100" y1="0" x2="100" y2="400" />
            <line x1="225" y1="0" x2="225" y2="400" />
            <line x1="350" y1="0" x2="350" y2="400" />
            <line x1="475" y1="0" x2="475" y2="400" />
            <line x1="600" y1="0" x2="600" y2="400" />
          </g>

          {/* DEVICES AS SCHEMATIC AXES (Very faint, clean) */}
          <g stroke="currentColor" strokeOpacity="0.15" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            
            {/* Phone Schematic (Left) */}
            <rect x="100" y="125" width="90" height="190" rx="16" />
            <line x1="130" y1="135" x2="160" y2="135" strokeWidth="2" />
            
            {/* Tablet Schematic (Center) */}
            <rect x="225" y="75" width="160" height="240" rx="12" />
            <circle cx="305" cy="95" r="4" />
            
            {/* Desktop Schematic (Right) */}
            <rect x="420" y="50" width="220" height="140" rx="8" />
            <line x1="420" y1="70" x2="640" y2="70" />
            <circle cx="435" cy="60" r="2" />
            <circle cx="445" cy="60" r="2" />
          </g>
        </motion.g>

        {/* ONE CONTINUOUS, MASSIVE GRAPH LINE */}
        <motion.path 
          d="M 50 320 C 150 320, 180 250, 250 250 C 320 250, 360 120, 450 120 C 500 120, 550 60, 650 40" 
          stroke="url(#chartGrad)" 
          strokeWidth="5" 
          fill="none"
          strokeLinecap="round" 
          style={{ pathLength: drawLine }} 
        />
        
        {/* Glow fill under the line */}
        <motion.path 
          d="M 50 320 C 150 320, 180 250, 250 250 C 320 250, 360 120, 450 120 C 500 120, 550 60, 650 40 L 650 400 L 50 400 Z" 
          fill="url(#chartGlow)" 
          style={{ opacity: useTransform(scrollYProgress, [0.5, 0.9], [0, 1]) }} 
        />

        {/* Data Points / Markers */}
        <motion.g style={{ opacity: useTransform(scrollYProgress, [0.8, 1], [0, 1]) }} fill="url(#chartGrad)">
          {/* Point on Phone */}
          <circle cx="145" cy="290" r="5" stroke="currentColor" strokeWidth="2" />
          {/* Point on Tablet */}
          <circle cx="305" cy="210" r="5" stroke="currentColor" strokeWidth="2" />
          {/* Point on Desktop */}
          <circle cx="530" cy="88" r="5" stroke="currentColor" strokeWidth="2" />
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
