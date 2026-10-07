import {
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


import { useId } from "react";
import { Area } from "recharts";

const data = [
  { name: "Mobile", value: 300, device: "phone" },
  { name: "Tablet", value: 650, device: "tablet" },
  { name: "Desktop", value: 950, device: "desktop" }
];

const CustomDeviceBar = (props: any) => {
  const { x = 0, y = 0, width = 0, height = 0, payload } = props;
  
  const device = payload?.device || payload?.payload?.device;
  if (!device || Number.isNaN(x) || Number.isNaN(y)) return null;

  const cx = x + (width || 0) / 2;
  const bottomY = y + (height || 0);
  
  return (
    <g className="transition-all duration-700 ease-out">
      {device === "phone" && (
        <g transform={`translate(${cx - 45}, ${bottomY - 180})`}>
          <rect x="0" y="0" width="90" height="180" rx="16" fill="var(--theme-bg)" stroke="var(--theme-border)" strokeWidth="2" />
          <rect x="0" y="0" width="90" height="180" rx="16" fill="url(#chartGrad)" opacity="0.05" />
          {/* Screen */}
          <rect x="6" y="6" width="78" height="168" rx="10" fill="var(--theme-bg-elevated)" stroke="var(--theme-border)" strokeOpacity="0.5" />
          <line x1="35" y1="12" x2="55" y2="12" stroke="var(--theme-muted)" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {device === "tablet" && (
        <g transform={`translate(${cx - 85}, ${bottomY - 220})`}>
          <rect x="0" y="0" width="170" height="220" rx="20" fill="var(--theme-bg)" stroke="var(--theme-border)" strokeWidth="2" />
          <rect x="0" y="0" width="170" height="220" rx="20" fill="url(#chartGrad)" opacity="0.1" />
          {/* Screen */}
          <rect x="8" y="8" width="154" height="204" rx="12" fill="var(--theme-bg-elevated)" stroke="var(--theme-border)" strokeOpacity="0.5" />
          <circle cx="85" cy="18" r="3" fill="var(--theme-muted)" />
        </g>
      )}
      {device === "desktop" && (
        <g transform={`translate(${cx - 150}, ${bottomY - 260})`}>
          <rect x="0" y="0" width="300" height="190" rx="16" fill="var(--theme-bg)" stroke="var(--theme-border)" strokeWidth="2" />
          <rect x="0" y="0" width="300" height="190" rx="16" fill="url(#chartGrad)" opacity="0.15" />
          {/* Screen */}
          <rect x="8" y="8" width="284" height="154" rx="8" fill="var(--theme-bg-elevated)" stroke="var(--theme-border)" strokeOpacity="0.5" />
          <circle cx="150" cy="16" r="3" fill="var(--theme-muted)" />
          {/* Base */}
          <path d="M120 190 L100 250 L200 250 L180 190 Z" fill="var(--theme-bg)" stroke="var(--theme-border)" strokeWidth="2" strokeLinejoin="round" />
          <rect x="80" y="250" width="140" height="10" rx="4" fill="var(--theme-border)" />
        </g>
      )}
    </g>
  );
};

function InteractiveVisuals() {
  const id = useId().replace(/:/g, "");
  
  return (
    <div className="relative flex-1 w-full max-w-[800px] h-[450px] mx-auto lg:mx-0 pointer-events-none mode-line-chart">
      {/* Decorative blurred glow behind the chart */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-gradient-to-tr from-[#F97316] to-[#F43F5E] rounded-full blur-[100px] opacity-20 dark:opacity-30 mix-blend-screen" />
      
      <ResponsiveContainer width="100%" height={450}>
        <ComposedChart data={data} margin={{ top: 40, right: 30, left: 30, bottom: 20 }}>
          <defs>
            <linearGradient id={`chartGrad-${id}`} x1={0} y1={0} x2={1} y2={0}>
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
            <linearGradient id={`areaGrad-${id}`} x1={0} y1={0} x2={0} y2={1}>
              <stop offset="0%" stopColor="#F97316" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity={0} />
            </linearGradient>
            <filter id={`glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          <CartesianGrid stroke="var(--theme-border)" strokeOpacity={0.4} vertical={false} strokeDasharray="4 8" />
          
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "var(--theme-fg)", fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }} 
            dy={25} 
          />
          
          <Bar dataKey="value" shape={<CustomDeviceBar />} barSize={60} isAnimationActive={false} />
          
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="none" 
            fill={`url(#areaGrad-${id})`} 
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
          />
          
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={`url(#chartGrad-${id})`} 
            strokeWidth={5} 
            dot={{ r: 8, fill: "var(--theme-bg)", stroke: "#F97316", strokeWidth: 3 }} 
            activeDot={{ r: 12, fill: "#FBBF24", stroke: "var(--theme-bg)", strokeWidth: 4, filter: `url(#glow-${id})` }}
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
            filter={`url(#glow-${id})`}
          />
        </ComposedChart>
      </ResponsiveContainer>
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
