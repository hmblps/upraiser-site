import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScrollMorph } from "../hooks/useScrollMorph";
import { useMode } from "./SectionHeader";
import { GhostBubbleMotion } from "./GhostBubbleMotion";

const PERIODS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type SeriesKey = "Primary" | "Secondary";

function growthTargets() {
  const primary = [42, 48, 55, 68, 79, 92, 108, 124, 141, 162, 188, 214];
  const secondary = [28, 31, 36, 40, 44, 49, 53, 58, 64, 71, 78, 86];
  return PERIODS.map((period, i) => ({
    date: period,
    Primary: primary[i]!,
    Secondary: secondary[i]!,
  }));
}

function fraudTargets() {
  const primary = [11.4, 10.6, 9.8, 8.7, 7.5, 6.4, 5.3, 4.2, 3.3, 2.4, 1.5, 0.8];
  const secondary = [7.1, 6.6, 5.9, 5.2, 4.6, 4.0, 3.4, 2.8, 2.2, 1.7, 1.1, 0.6];
  return PERIODS.map((period, i) => ({
    date: period,
    Primary: primary[i]!,
    Secondary: secondary[i]!,
  }));
}

function morphSeries(targets: any[], t: number, kind: "growth" | "fraud") {
  const keys: SeriesKey[] = ["Primary", "Secondary"];
  return targets.map((row) => {
    const next: any = { date: row.date };
    for (const key of keys) {
      const target = Number(row[key]);
      const rest = kind === "growth" ? target * 0.18 : lerp(target, target * 2.4, 0.55);
      next[key] = kind === "growth" ? lerp(rest, target, t) : lerp(Math.max(rest, target * 1.85), target, t);
    }
    return next;
  });
}

type GhostMetric = {
  id: string;
  label: string;
  left: string;
  originY: number;
  drift: number;
  duration: number;
  delay: number;
  format: (t: number) => string;
};

const GROWTH_GHOSTS: GhostMetric[] = [
  { id: "g1", label: "Q3 Run Rate", left: "28%", originY: 62, drift: 24, duration: 6, delay: 0, format: (t) => `$${(lerp(2.1, 14.4, t)).toFixed(1)}M` },
  { id: "g2", label: "LTV / CAC", left: "45%", originY: 34, drift: -18, duration: 8, delay: 1.5, format: (t) => `${(lerp(1.2, 3.8, t)).toFixed(1)}x` },
  { id: "g3", label: "Gross Margin", left: "62%", originY: 48, drift: 20, duration: 7, delay: 0.8, format: (t) => `${Math.round(lerp(24, 78, t))}%` },
  { id: "g4", label: "Active Users", left: "75%", originY: 22, drift: -22, duration: 6.5, delay: 2, format: (t) => `${(lerp(12, 145, t)).toFixed(0)}K` },
];

const FRAUD_GHOSTS: GhostMetric[] = [
  { id: "f1", label: "Bot Traffic", left: "32%", originY: 28, drift: 20, duration: 6.5, delay: 0, format: (t) => `${(lerp(48, 2, t)).toFixed(1)}%` },
  { id: "f2", label: "Chargebacks", left: "48%", originY: 42, drift: -16, duration: 7.5, delay: 1.2, format: (t) => `$${(lerp(120, 14, t)).toFixed(0)}K` },
  { id: "f3", label: "Spam Signups", left: "66%", originY: 25, drift: 22, duration: 8, delay: 0.5, format: (t) => `${Math.round(lerp(8500, 120, t))}` },
];

function GhostBubble({ metric, morph }: { metric: GhostMetric; morph: MotionValue<number> }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const updateDOM = (v: number) => {
      if (!containerRef.current) return;
      const strVal = metric.format(v);
      const match = strVal.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);
      
      if (!match) {
        containerRef.current.textContent = strVal;
        return;
      }
      const [, prefix, num, suffix] = match;
      
      let html = "";
      if (prefix) html += `<span class="font-sans font-semibold tracking-normal text-[0.7em] mr-[0.1em] opacity-80">${prefix}</span>`;
      html += num;
      if (suffix) html += `<span class="font-sans font-semibold tracking-normal text-[0.7em] ml-[0.05em] opacity-80">${suffix}</span>`;
      
      containerRef.current.innerHTML = html;
    };
    
    const unsub = morph.on("change", updateDOM);
    updateDOM(morph.get());
    return unsub;
  }, [morph, metric]);

  
  

  return (
    <GhostBubbleMotion
      left={metric.left}
      originY={metric.originY}
      drift={metric.drift}
      duration={metric.duration}
      delay={metric.delay}
    >
      <span className="fold-chart-ghost-value">
        <span ref={containerRef}></span>
      </span>
      <span className="fold-chart-ghost-label">{metric.label}</span>
    </GhostBubbleMotion>
  );
}

function smoothLine(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) * 0.15;
    const cp1y = p1.y + (p2.y - p0.y) * 0.15;
    const cp2x = p2.x - (p3.x - p1.x) * 0.15;
    const cp2y = p2.y - (p3.y - p1.y) * 0.15;
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return path;
}

type FoldChartProps = {
  progress: MotionValue<number>;
};

export function FoldChart({ progress }: FoldChartProps) {
  const { mode } = useMode();
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const isGrowth = mode === "growth";
  const morph = useScrollMorph(progress, enabled, {
    start: 0.02,
    span: 0.74,
    lerp: 0.12,
  });
  
  const targets = useMemo(() => (isGrowth ? growthTargets() : fraudTargets()), [isGrowth]);
  const ghosts = isGrowth ? GROWTH_GHOSTS : FRAUD_GHOSTS;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setEnabled(mq.matches && !reduced);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduced]);

  const yDomain = isGrowth ? [0, 240] : [0, 14];
  const chartHeight = 400;
  const chartWidth = 1200;
  const paddingY = 50;
  const usableHeight = chartHeight - paddingY * 2;

  // Zero-cost SVG morphing via framer-motion useTransform
  const dPrimary = useTransform(morph, (m) => {
    const data = morphSeries(targets, m, isGrowth ? "growth" : "fraud");
    return smoothLine(data.map((d, i) => ({
      x: (i / (data.length - 1)) * chartWidth,
      y: chartHeight - paddingY - (d.Primary / yDomain[1]) * usableHeight,
    })));
  });

  const dSecondary = useTransform(morph, (m) => {
    const data = morphSeries(targets, m, isGrowth ? "growth" : "fraud");
    return smoothLine(data.map((d, i) => ({
      x: (i / (data.length - 1)) * chartWidth,
      y: chartHeight - paddingY - (d.Secondary / yDomain[1]) * usableHeight,
    })));
  });

  const opacity = useTransform(progress, [0, 0.06, 0.5, 0.88, 1], [0, 0.85, 1, 1, 1]);

  if (!enabled) return null;

  return (
    <motion.div 
      className={`fold-chart fold-chart--${mode}`} 
      style={{ opacity }} 
      aria-hidden
    >
      <div className="fold-chart-ghosts">
        {ghosts.map((g) => (
          <GhostBubble key={g.id} metric={g} morph={morph} />
        ))}
      </div>

      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <svg 
          className="w-full h-full overflow-visible" 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
          }}
        >
          <g transform={`translate(0, 0)`}>
            {targets.map((_, i) => {
              const x = (i / (targets.length - 1)) * chartWidth;
              return (
                <line
                  key={i}
                  x1={x}
                  y1={350}
                  x2={x}
                  y2={370}
                  stroke="var(--theme-accent)"
                  strokeOpacity="0.3"
                  strokeWidth="2"
                />
              );
            })}
          </g>

          <motion.path
            d={dSecondary}
            fill="none"
            stroke="var(--theme-accent-secondary)"
            strokeWidth="3"
            strokeOpacity="0.8"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 4px 12px var(--theme-accent-dim))" }}
          />

          <motion.path
            d={dPrimary}
            fill="none"
            stroke="var(--theme-accent)"
            strokeWidth="5"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 4px 16px var(--theme-accent-dim))" }}
          />
        </svg>
      </div>
    </motion.div>
  );
}
