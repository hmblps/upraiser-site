import { GhostBubbleMotion } from "../GhostBubbleMotion";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import { useRef } from "react";
import { warmStage } from "../../lib/scrollPreload";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

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
  // Parallax and fade for floating data nodes (behaving like ghost numbers everywhere else)
  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center pointer-events-none">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute top-1/2 left-[10%] -translate-y-1/2 w-[50%] h-[50%] bg-gradient-to-tr from-[#FBBF24] via-[#F97316] to-[#F43F5E] rounded-full blur-[140px] opacity-10 mix-blend-screen pointer-events-none" />

      {/* TICK MARKS (DIAL SCALE) */}
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 150, ease: "linear" }} className="absolute left-0 top-1/2 lg:top-[calc(50%+3rem)] -translate-y-1/2 -translate-x-[55%] w-[800px] h-[800px] lg:w-[1100px] lg:h-[1100px] z-0 opacity-40">
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
      <div className="absolute left-0 top-1/2 lg:top-[calc(50%+3rem)] -translate-y-1/2 -translate-x-[55%] w-[800px] h-[800px] lg:w-[1100px] lg:h-[1100px] z-0">
        
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
                innerRadius="60%"
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
        <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 60, ease: "linear" }} className="absolute inset-0 w-full h-full opacity-30">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[{ value: 1 }]}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="50.2%"
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
                innerRadius="35%"
                outerRadius="35.2%"
                dataKey="value"
                fill="none"
                stroke="var(--theme-fg)"
                strokeWidth={1}
                isAnimationActive={false}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      
        {/* ULTRA INNER SOLID RING */}
        <div className="absolute inset-0 w-full h-full opacity-5">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[{ value: 1 }]}
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="20.1%"
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
{/* ELEGANT SCATTERED GHOST LABELS (BUBBLING) */}
      <div className="absolute left-[15%] lg:left-[22%] top-0 w-[300px] h-full pointer-events-none z-10">
        <GhostBubbleMotion left="10%" originY={40} drift={-15} duration={6} delay={0} peakOpacity={0.4}>
          <div className="text-4xl lg:text-5xl font-bold text-fg/30 tracking-tight">45%</div>
          <div className="text-xs lg:text-sm font-semibold text-fg/40 uppercase tracking-widest mt-1">Programmatic</div>
        </GhostBubbleMotion>

        <GhostBubbleMotion left="80%" originY={60} drift={20} duration={7.5} delay={1.2} peakOpacity={0.4}>
          <div className="text-4xl lg:text-5xl font-bold text-fg/30 tracking-tight">22%</div>
          <div className="text-xs lg:text-sm font-semibold text-fg/40 uppercase tracking-widest mt-1">Connected TV</div>
        </GhostBubbleMotion>

        <GhostBubbleMotion left="20%" originY={80} drift={10} duration={6.8} delay={3.5} peakOpacity={0.3}>
          <div className="text-4xl lg:text-5xl font-bold text-fg/20 tracking-tight">18%</div>
          <div className="text-xs lg:text-sm font-semibold text-fg/30 uppercase tracking-widest mt-1">Social Ads</div>
        </GhostBubbleMotion>

        <GhostBubbleMotion left="70%" originY={95} drift={-10} duration={8} delay={2.1} peakOpacity={0.2}>
          <div className="text-3xl lg:text-4xl font-bold text-fg/10 tracking-tight">15%</div>
          <div className="text-[10px] lg:text-xs font-semibold text-fg/20 uppercase tracking-widest mt-1">OEM & Direct</div>
        </GhostBubbleMotion>
      </div>

    </div>
  );
}

export function ChannelsCtaSection() {
  return (
    <section id="routes" className="section-band border-t border-border/30 relative overflow-visible z-[100] bg-bg">
      <div className="relative flex flex-col lg:flex-row items-center w-full">
        
        {/* WHEEL & GHOST LABELS COMPONENT */}
        <div className="absolute inset-0 z-50 pointer-events-none">
          <RotatingOmniChart />
        </div>

        {/* TEXT (RIGHT) */}
        <div className="page-container relative z-10 w-full flex justify-end items-center h-full py-0">
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
                onMouseEnter={() => warmStage("routes")}
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