import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";
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


const data = [
  { name: "Phone", value: 200, device: "phone" },
  { name: "Tablet", value: 500, device: "tablet" },
  { name: "Desktop", value: 800, device: "desktop" }
];

const CustomDeviceBar = (props: any) => {
  const { x = 0, y = 0, width = 0, height = 0, payload } = props;
  if (!payload) return null;
  const device = payload.device || payload.payload?.device;
  if (!device) return null;
  if (Number.isNaN(x) || Number.isNaN(y)) return null;
  const isPhone = device === "phone";
  const isTablet = device === "tablet";
  const isDesktop = device === "desktop";
  
  // Create a device outline based on the bar's bounding box
  // We'll scale the device to fit inside the bar width/height
  const cx = x + width / 2;
  const bottomY = y + height;
  
  return (
    <g stroke="var(--theme-border)" strokeWidth="2" fill="none" opacity="0.4">
      {isPhone && (
        <g transform={`translate(${cx - 40}, ${bottomY - 160})`}>
          <rect x="0" y="0" width="80" height="160" rx="12" />
          <line x1="30" y1="10" x2="50" y2="10" />
        </g>
      )}
      {isTablet && (
        <g transform={`translate(${cx - 70}, ${bottomY - 200})`}>
          <rect x="0" y="0" width="140" height="200" rx="16" />
          <circle cx="70" cy="15" r="4" />
        </g>
      )}
      {isDesktop && (
        <g transform={`translate(${cx - 120}, ${bottomY - 240})`}>
          <rect x="0" y="0" width="240" height="160" rx="12" />
          <line x1="0" y1="20" x2="240" y2="20" />
          <rect x="90" y="160" width="60" height="30" />
          <line x1="60" y1="190" x2="180" y2="190" strokeWidth="4" />
        </g>
      )}
    </g>
  );
};

function InteractiveVisuals() {
  return (
    <div className="relative flex-1 w-full max-w-[800px] h-[400px] mx-auto lg:mx-0 pointer-events-none mode-line-chart">
      <ResponsiveContainer width="100%" height="100%">
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
          </defs>
        </svg>
        <ComposedChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          
          <CartesianGrid stroke="var(--theme-border)" strokeOpacity={0.55} vertical={false} strokeDasharray="3 6" />
          
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--theme-muted)", fontSize: 11, fontWeight: 500 }} dy={10} />
          
          {/* The Devices drawn as Bars */}
          <Bar dataKey="value" shape={<CustomDeviceBar />} barSize={40} isAnimationActive={false} />
          
          {/* The Data Line drawn on top */}
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="url(#chartGrad)" 
            strokeWidth={4.5} 
            dot={{ r: 6, fill: "var(--theme-bg)", stroke: "#F97316", strokeWidth: 2 }} 
            activeDot={false}
            isAnimationActive={false}
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
