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
  { name: "Programmatic", value: 100, color: "#F43F5E", opacity: 1 },
  { name: "Connected TV", value: 100, color: "#F97316", opacity: 1 },
  { name: "Social Ads", value: 100, color: "#FBBF24", opacity: 1 },
  { name: "OEM / On-Device", value: 100, color: "var(--theme-fg)", opacity: 0.3 },
  { name: "Search Ads", value: 100, color: "var(--theme-fg)", opacity: 0.15 },
  { name: "In-App Networks", value: 100, color: "var(--theme-fg)", opacity: 0.05 }
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = outerRadius * 1.15;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="var(--theme-fg)" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-lg md:text-3xl font-bold uppercase tracking-[0.3em] opacity-40"
    >
      {data[index].name}
    </text>
  );
};

function RotatingOmniChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // A wide rotation so multiple labels sweep past
  const rotate = useTransform(scrollYProgress, [0, 1], [-45, 135]);
  
  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center pointer-events-none">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-gradient-to-tr from-[#F97316] to-[#F43F5E] rounded-full blur-[120px] opacity-15 mix-blend-screen pointer-events-none" />

      {/* ROTATING RECHARTS PIE */}
      <motion.div style={{ rotate }} className="absolute inset-0 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.2" />
              </filter>
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="65%"
              paddingAngle={2}
              cornerRadius={24}
              dataKey="value"
              stroke="var(--theme-bg)"
              strokeWidth={8}
              isAnimationActive={false}
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  opacity={entry.opacity} 
                  style={{ filter: "drop-shadow(0px 12px 24px rgba(0,0,0,0.15))" }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

export function ChannelsCtaSection() {
  return (
    <section id="routes" className="section-band border-t border-border/30 relative overflow-hidden bg-bg">
      <div className="relative flex flex-col lg:flex-row items-center w-full min-h-[60vh] lg:min-h-[90vh]">
        
        {/* HALF WHEEL (LEFT) */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[40%] w-[800px] h-[800px] lg:w-[1400px] lg:h-[1400px] pointer-events-none z-0">
          <RotatingOmniChart />
        </div>

        {/* TEXT (RIGHT) */}
        <div className="page-container relative z-10 w-full flex justify-end items-center h-full py-24 lg:py-32">
          <div className="w-full lg:w-[50%] text-left pl-0 lg:pl-10">
            <div className="section-header">
              <p className="section-label">The Channels</p>
              <h2 className="section-title">
                <span className="text-muted">Every Format.</span><br/>
                One Supply Path.
              </h2>
              <p className="section-description text-lg">
                From Programmatic and Social to Connected TV and OEM. Explore our interactive channel visualizations and see how we integrate fragmented traffic sources into one unified ecosystem with absolute attribution proof.
              </p>
            </div>
            
            <div className="mt-10 inline-block">
              <Link 
                to="/channels" 
                className="btn-caps btn-caps--primary inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-bold tracking-widest"
                onMouseEnter={warmStage}
              >
                <span>Explore All Channels</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}