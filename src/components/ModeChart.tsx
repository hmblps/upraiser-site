import { ChartGhostValue } from "./ChartGhostValue";
import { useEffect, useMemo, useState } from "react";
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

// We use `any` here for simplicity to replace the old LineChartDatum requirement
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
  {
    id: "users",
    label: "Users",
    left: "10%",
    originY: 74,
    drift: 16,
    duration: 7.2,
    delay: 0,
    format: (t) => `${lerp(8.4, 31.2, t).toFixed(1)}k`,
  },
  {
    id: "impressions",
    label: "Impressions",
    left: "28%",
    originY: 80,
    drift: -12,
    duration: 7.8,
    delay: 1.1,
    format: (t) => `${lerp(1.8, 9.4, t).toFixed(1)}M`,
  },
  {
    id: "roi",
    label: "ROI",
    left: "48%",
    originY: 70,
    drift: 14,
    duration: 8.1,
    delay: 2.0,
    format: (t) => `${lerp(0.9, 2.7, t).toFixed(1)}x`,
  },
  {
    id: "ltv",
    label: "LTV",
    left: "66%",
    originY: 76,
    drift: -10,
    duration: 6.6,
    delay: 2.8,
    format: (t) => `$${lerp(22, 54, t).toFixed(0)}`,
  },
  {
    id: "revenue",
    label: "Revenue",
    left: "84%",
    originY: 82,
    drift: 11,
    duration: 7.8,
    delay: 0.7,
    format: (t) => `$${lerp(18.6, 74.3, t).toFixed(1)}k`,
  },
];

const FRAUD_GHOSTS: GhostMetric[] = [
  {
    id: "fraud",
    label: "Fraud rate",
    left: "16%",
    originY: 74,
    drift: 14,
    duration: 7.4,
    delay: 0.2,
    format: (t) => `${lerp(9.8, 1.2, t).toFixed(1)}%`,
  },
  {
    id: "blocked",
    label: "Blocked",
    left: "38%",
    originY: 80,
    drift: -12,
    duration: 8,
    delay: 1.6,
    format: (t) => `${lerp(91.2, 97.1, t).toFixed(1)}%`,
  },
  {
    id: "clean",
    label: "Clean traffic",
    left: "62%",
    originY: 68,
    drift: 10,
    duration: 6.8,
    delay: 2.8,
    format: (t) => `${Math.round(lerp(82, 96, t))}%`,
  },
  {
    id: "risk",
    label: "Residual risk",
    left: "82%",
    originY: 84,
    drift: -16,
    duration: 7.6,
    delay: 1,
    format: (t) => `${lerp(4.8, 0.7, t).toFixed(1)}%`,
  },
];

function GhostBubble({ metric, morph }: { metric: GhostMetric; morph: number }) {
  return (
    <GhostBubbleMotion
      left={metric.left}
      originY={metric.originY}
      drift={metric.drift}
      duration={metric.duration}
      delay={metric.delay}
    >
      <ChartGhostValue value={metric.format(morph)} />
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
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    // Catmull-Rom to Bezier conversion
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

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

  const data = useMemo(
    () => morphSeries(targets, morph, isGrowth ? "growth" : "fraud"),
    [targets, morph, isGrowth],
  );

  const yDomain = isGrowth ? [0, 240] : [0, 14];
  const chartHeight = 400;
  const chartWidth = 1200;

  // Calculate points mapped to SVG coordinates
  // We add vertical padding so the chart doesn't clip the bottom edge
  const paddingY = 50;
  const usableHeight = chartHeight - paddingY * 2;

  const pointsPrimary = data.map((d, i) => ({
    x: (i / (data.length - 1)) * chartWidth,
    y: chartHeight - paddingY - (d.Primary / yDomain[1]) * usableHeight,
  }));
  
  const pointsSecondary = data.map((d, i) => ({
    x: (i / (data.length - 1)) * chartWidth,
    y: chartHeight - paddingY - (d.Secondary / yDomain[1]) * usableHeight,
  }));

  const dPrimary = smoothLine(pointsPrimary);
  const dSecondary = smoothLine(pointsSecondary);

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
          {/* СЛОЙ 1: «Штрих-код» (вертикальные тики) */}
          <g className="opacity-10">
            {Array.from({ length: 40 }).map((_, i) => {
              const x = i * 30;
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

          {/* СЛОЙ 2: Вторичная линия (Unique users / Residual risk) */}
          <motion.path
            d={dSecondary}
            fill="none"
            stroke="var(--theme-accent-secondary)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ 
              filter: "drop-shadow(0px 4px 8px var(--theme-accent-secondary))",
              WebkitFilter: "drop-shadow(0px 4px 8px var(--theme-accent-secondary))",
              opacity: 0.6
            }}
          />

          {/* СЛОЙ 3: Первичная линия (Revenue index / Fraud rate) */}
          <motion.path
            d={dPrimary}
            fill="none"
            stroke="var(--theme-accent)"
            strokeWidth="4"
            strokeLinecap="round"
            style={{ 
              filter: "drop-shadow(0px 8px 16px var(--theme-accent-dim))",
              WebkitFilter: "drop-shadow(0px 8px 16px var(--theme-accent-dim))"
            }}
          />
        </svg>
      </div>
    </motion.div>
  );
}
