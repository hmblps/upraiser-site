import {
  PieChart,
  Pie,
  Tooltip,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Area
} from "recharts";
import { useRef, useEffect, useId } from "react";
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






const data = [
  { name: "Programmatic", value: 100, color: "#F43F5E" }, // Rose
  { name: "Connected TV", value: 100, color: "#F97316" }, // Orange
  { name: "Social Ads", value: 100, color: "#FBBF24" },   // Yellow
  { name: "OEM & On-Device", value: 100, color: "#34D399" }, // Emerald
  { name: "Search Ads", value: 100, color: "#3B82F6" },   // Blue
  { name: "In-App Networks", value: 100, color: "#8B5CF6" }  // Violet
];

function RotatingOmniChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Rotate 360 degrees as the user scrolls past the section
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  
  // The center text stays unrotated
  return (
    <div ref={containerRef} className="relative flex-1 w-full max-w-[600px] aspect-square mx-auto lg:mx-0 flex items-center justify-center pointer-events-none lg:pointer-events-auto">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-gradient-to-tr from-[var(--brand-orange)] to-[var(--brand-red)] rounded-full blur-[100px] opacity-15 mix-blend-screen pointer-events-none" />

      {/* ROTATING RECHARTS PIE */}
      <motion.div style={{ rotate }} className="absolute inset-0 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.3" />
              </filter>
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="90%"
              paddingAngle={4}
              cornerRadius={16}
              dataKey="value"
              stroke="var(--theme-bg)"
              strokeWidth={4}
              isAnimationActive={true}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  opacity={0.85} 
                  style={{ filter: "drop-shadow(0px 8px 16px rgba(0,0,0,0.2))" }}
                />
              ))}
            </Pie>
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--theme-bg-elevated)', 
                borderColor: 'var(--theme-border)',
                borderRadius: '16px',
                padding: '12px 20px',
                fontWeight: 600
              }} 
              itemStyle={{ color: 'var(--theme-fg)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* STATIC CENTER TEXT */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <div className="w-[45%] h-[45%] bg-bg rounded-full shadow-[inset_0_4px_20px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center border-4 border-bg-elevated">
          <span className="font-bold text-lg md:text-xl text-fg tracking-tight leading-tight">ONE SUPPLY</span>
          <span className="font-bold text-lg md:text-xl text-muted tracking-tight leading-tight">PATH</span>
        </div>
      </div>
      
      {/* FLOATING LABELS (We map them statically so they don't spin wildly, or let them spin) */}
      {/* To keep it clean, Recharts Tooltip handles hover, and the core graphic spins. */}
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

        <RotatingOmniChart />

      </div>
    </section>
  );
}
