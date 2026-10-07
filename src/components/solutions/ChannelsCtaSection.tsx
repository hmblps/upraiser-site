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



const data = [
  { name: "Mobile", value: 300, device: "phone" },
  { name: "Tablet", value: 500, device: "tablet" },
  { name: "Desktop", value: 850, device: "desktop" }
];

const CustomDeviceBar = (props: any) => {
  const { x = 0, y = 0, width = 0, height = 0, payload } = props;
  
  const device = payload?.device || payload?.payload?.device;
  if (!device || Number.isNaN(x) || Number.isNaN(y)) return null;

  const cx = x + (width || 0) / 2;
  const bottomY = y + (height || 0);
  
  return (
    <g className="transition-all duration-700 ease-out" opacity="0.9">
      {device === "phone" && (
        <g transform={`translate(${cx - 80}, ${bottomY - 140})`}>
          {/* Standing up, slightly angled */}
          <g transform="rotate(-15) skewY(15) scale(0.9)">
            {/* Phone Base/Shadow */}
            <rect x="5" y="5" width="90" height="180" rx="16" fill="var(--theme-border)" opacity="0.5" />
            <rect x="0" y="0" width="90" height="180" rx="16" fill="var(--theme-bg)" stroke="var(--theme-border)" strokeWidth="2" />
            <rect x="6" y="6" width="78" height="168" rx="10" fill="var(--theme-bg-elevated)" stroke="var(--theme-border)" strokeOpacity="0.5" />
            {/* Minimalist UI lines inside */}
            <rect x="15" y="20" width="40" height="6" rx="3" fill="var(--theme-border)" />
            <rect x="15" y="35" width="60" height="40" rx="6" fill="var(--theme-border)" opacity="0.2" />
            <rect x="15" y="85" width="50" height="4" rx="2" fill="var(--theme-border)" />
          </g>
        </g>
      )}
      {device === "tablet" && (
        <g transform={`translate(${cx - 100}, ${bottomY - 100})`}>
          {/* Lying down flat isometric */}
          <g transform="rotate(-45) skewX(50) scale(1.1)">
            {/* Shadow/Thickness */}
            <rect x="5" y="5" width="160" height="220" rx="12" fill="var(--theme-border)" opacity="0.4" />
            <rect x="0" y="0" width="160" height="220" rx="12" fill="var(--theme-bg)" stroke="var(--theme-border)" strokeWidth="1.5" />
            {/* Screen */}
            <rect x="8" y="8" width="144" height="204" rx="6" fill="var(--theme-bg-elevated)" stroke="var(--theme-border)" strokeOpacity="0.5" />
            {/* Mock UI */}
            <circle cx="25" cy="25" r="8" fill="var(--theme-border)" />
            <rect x="40" y="22" width="60" height="6" rx="3" fill="var(--theme-border)" />
            <rect x="20" y="50" width="120" height="80" rx="8" fill="var(--theme-border)" opacity="0.1" />
          </g>
        </g>
      )}
      {device === "desktop" && (
        <g transform={`translate(${cx - 100}, ${bottomY - 260})`}>
          {/* Desktop/Laptop open */}
          <g transform="scale(1.1)">
            {/* Screen part (standing) */}
            <g transform="rotate(-10) skewY(10)">
              <rect x="5" y="5" width="220" height="140" rx="8" fill="var(--theme-border)" opacity="0.3" />
              <rect x="0" y="0" width="220" height="140" rx="8" fill="var(--theme-bg)" stroke="var(--theme-border)" strokeWidth="2" />
              <rect x="6" y="6" width="208" height="128" rx="4" fill="var(--theme-bg-elevated)" stroke="var(--theme-border)" strokeOpacity="0.5" />
              <rect x="20" y="20" width="160" height="60" rx="6" fill="var(--theme-border)" opacity="0.1" />
            </g>
            {/* Keyboard base (lying flat) */}
            <g transform="translate(-10, 150) rotate(-45) skewX(50)">
              <rect x="0" y="0" width="220" height="140" rx="8" fill="var(--theme-bg)" stroke="var(--theme-border)" strokeWidth="2" />
              {/* Keyboard mock */}
              <rect x="15" y="15" width="190" height="60" rx="4" fill="var(--theme-border)" opacity="0.2" />
              <rect x="75" y="85" width="70" height="40" rx="4" fill="var(--theme-border)" opacity="0.3" />
            </g>
          </g>
        </g>
      )}
    </g>
  );
};

function InteractiveVisuals() {
  const id = useId().replace(/:/g, "");
  
  return (
    <div className="relative flex-1 w-full max-w-[900px] h-[550px] mx-auto lg:mx-0 pointer-events-none mode-line-chart mt-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-gradient-to-tr from-[#F97316] to-[#F43F5E] rounded-full blur-[120px] opacity-15 mix-blend-screen" />
      
      <ResponsiveContainer width="100%" height={550}>
        <ComposedChart data={data} margin={{ top: 80, right: 40, left: 40, bottom: 40 }}>
          <defs>
            <linearGradient id={`chartGrad-${id}`} x1={0} y1={0} x2={1} y2={0}>
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
            <linearGradient id={`areaGrad-${id}`} x1={0} y1={0} x2={0} y2={1}>
              <stop offset="0%" stopColor="#F97316" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity={0} />
            </linearGradient>
            <filter id={`glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          <CartesianGrid stroke="var(--theme-border)" strokeOpacity={0.3} vertical={false} strokeDasharray="3 9" />
          
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "var(--theme-fg)", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }} 
            dy={35} 
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
            strokeWidth={4} 
            dot={{ r: 7, fill: "var(--theme-bg)", stroke: "#F97316", strokeWidth: 3 }} 
            activeDot={{ r: 10, fill: "#FBBF24", stroke: "var(--theme-bg)", strokeWidth: 3, filter: `url(#glow-${id})` }}
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
