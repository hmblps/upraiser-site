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



function RotatingOmniChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Wheel rotation
  const rotateOuter = useTransform(scrollYProgress, [0, 1], [-60, 180]);
  const rotateInner = useTransform(scrollYProgress, [0, 1], [90, -90]);

  // Parallax and fade for floating data nodes (behaving like ghost numbers everywhere else)
  const y1 = useTransform(scrollYProgress, [0, 1], [150, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [200, 0]);
  const y3 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y4 = useTransform(scrollYProgress, [0, 1], [250, -50]);

  const o1 = useTransform(scrollYProgress, [0.1, 0.4, 0.8, 1], [0, 1, 1, 0]);
  const o2 = useTransform(scrollYProgress, [0.2, 0.5, 0.8, 1], [0, 1, 1, 0]);
  const o3 = useTransform(scrollYProgress, [0.3, 0.6, 0.9, 1], [0, 1, 1, 0]);
  const o4 = useTransform(scrollYProgress, [0.4, 0.7, 0.9, 1], [0, 1, 1, 0]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center pointer-events-none">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-1/2 left-[10%] -translate-y-1/2 w-[50%] h-[50%] bg-gradient-to-tr from-[#FBBF24] via-[#F97316] to-[#F43F5E] rounded-full blur-[140px] opacity-10 mix-blend-screen pointer-events-none" />

      {/* TICK MARKS (DIAL SCALE) */}
      <motion.div style={{ rotate: rotateInner }} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[55%] w-[800px] h-[800px] lg:w-[1400px] lg:h-[1400px] z-0 opacity-40">
        <svg className="w-full h-full" viewBox="-500 -500 1000 1000">
          {Array.from({ length: 72 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1="-440"
              x2="0"
              y2={i % 6 === 0 ? "-460" : "-450"}
              stroke="var(--brand-yellow)"
              strokeWidth={i % 6 === 0 ? "2" : "1"}
              strokeOpacity={i % 6 === 0 ? 0.6 : 0.2}
              transform={`rotate(${i * 5})`}
            />
          ))}
        </svg>
      </motion.div>

      {/* COMPLEX RECHARTS WHEEL */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[55%] w-[800px] h-[800px] lg:w-[1400px] lg:h-[1400px] z-0">
        
        {/* OUTER ROTATING RING */}
        <motion.div style={{ rotate: rotateOuter }} className="absolute inset-0 w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="68%"
                outerRadius="70%"
                paddingAngle={8}
                cornerRadius={10}
                dataKey="value"
                stroke="none"
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`outer-${index}`} fill={entry.color} opacity={entry.opacity} style={{ filter: "url(#neonGlow)" }} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* INNER DASHED RING */}
        <motion.div style={{ rotate: rotateInner }} className="absolute inset-0 w-full h-full opacity-30">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[{ value: 1 }]}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="60.5%"
                dataKey="value"
                fill="none"
                stroke="var(--theme-fg)"
                strokeWidth={2}
                strokeDasharray="4 12"
                isAnimationActive={false}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
        
        {/* INNERMOST SOLID RING */}
        <div className="absolute inset-0 w-full h-full opacity-10">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[{ value: 1 }]}
                cx="50%"
                cy="50%"
                innerRadius="53%"
                outerRadius="53.2%"
                dataKey="value"
                fill="none"
                stroke="var(--theme-fg)"
                strokeWidth={1}
                isAnimationActive={false}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ELEGANT SCATTERED GHOST LABELS */}
      <div className="absolute left-[30%] lg:left-[35%] top-0 w-[300px] h-full pointer-events-none z-10">
        
        <motion.div style={{ y: y1, opacity: o1 }} className="absolute top-[20%] left-[10%]">
          <div className="text-4xl lg:text-5xl font-bold text-fg/30 tracking-tight">45%</div>
          <div className="text-xs lg:text-sm font-semibold text-fg/40 uppercase tracking-widest mt-1">Programmatic</div>
        </motion.div>

        <motion.div style={{ y: y2, opacity: o2 }} className="absolute top-[40%] left-[80%]">
          <div className="text-4xl lg:text-5xl font-bold text-fg/30 tracking-tight">22%</div>
          <div className="text-xs lg:text-sm font-semibold text-fg/40 uppercase tracking-widest mt-1">Connected TV</div>
        </motion.div>

        <motion.div style={{ y: y3, opacity: o3 }} className="absolute top-[65%] left-[20%]">
          <div className="text-4xl lg:text-5xl font-bold text-fg/20 tracking-tight">18%</div>
          <div className="text-xs lg:text-sm font-semibold text-fg/30 uppercase tracking-widest mt-1">Social Ads</div>
        </motion.div>

        <motion.div style={{ y: y4, opacity: o4 }} className="absolute top-[85%] left-[60%]">
          <div className="text-3xl lg:text-4xl font-bold text-fg/10 tracking-tight">15%</div>
          <div className="text-[10px] lg:text-xs font-semibold text-fg/20 uppercase tracking-widest mt-1">OEM & Direct</div>
        </motion.div>

      </div>

    </div>
  );
}

export function ChannelsCtaSection() {
  return (
    <section id="routes" className="section-band border-t border-border/30 relative overflow-hidden bg-bg">
      <div className="relative flex flex-col lg:flex-row items-center w-full min-h-[70vh] lg:min-h-[100vh]">
        
        {/* WHEEL & GHOST LABELS COMPONENT */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <RotatingOmniChart />
        </div>

        {/* TEXT (RIGHT) */}
        <div className="page-container relative z-10 w-full flex justify-end items-center h-full py-32 lg:py-48">
          <div className="w-full lg:w-[45%] text-left pl-0 lg:pl-10">
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