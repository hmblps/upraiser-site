import { useEffect, useMemo, useState } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMode } from "./SectionHeader";
import { LineChart, type LineChartDatum } from "./LineChart";
import { GhostBubbleMotion } from "./GhostBubbleMotion";

const PERIODS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type SeriesKey = "Primary" | "Secondary";

function growthTargets(): LineChartDatum[] {
  const primary = [42, 48, 55, 68, 79, 92, 108, 124, 141, 162, 188, 214];
  const secondary = [28, 31, 36, 40, 44, 49, 53, 58, 64, 71, 78, 86];
  return PERIODS.map((period, i) => ({
    date: period,
    Primary: primary[i]!,
    Secondary: secondary[i]!,
  }));
}

function fraudTargets(): LineChartDatum[] {
  const primary = [11.4, 10.6, 9.8, 8.7, 7.5, 6.4, 5.3, 4.2, 3.3, 2.4, 1.5, 0.8];
  const secondary = [7.1, 6.6, 5.9, 5.2, 4.6, 4.0, 3.4, 2.8, 2.2, 1.7, 1.1, 0.6];
  return PERIODS.map((period, i) => ({
    date: period,
    Primary: primary[i]!,
    Secondary: secondary[i]!,
  }));
}

/** Morph every point from rest → target by scroll t (0→1). */
function morphSeries(targets: LineChartDatum[], t: number, kind: "growth" | "fraud"): LineChartDatum[] {
  const keys: SeriesKey[] = ["Primary", "Secondary"];
  return targets.map((row) => {
    const next: LineChartDatum = { date: row.date };
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
  /** Vertical lane start — bubbles rise from here */
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
      <span className="fold-chart-ghost-value">{metric.format(morph)}</span>
      <span className="fold-chart-ghost-label">{metric.label}</span>
    </GhostBubbleMotion>
  );
}

type FoldChartProps = {
  progress: MotionValue<number>;
};

/**
 * Full-bleed fold chart: values rise/fall with scroll; metric bubbles float & fade.
 */
export function FoldChart({ progress }: FoldChartProps) {
  const { mode } = useMode();
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [morph, setMorph] = useState(0);

  const isGrowth = mode === "growth";
  const targets = useMemo(() => (isGrowth ? growthTargets() : fraudTargets()), [isGrowth]);
  const ghosts = isGrowth ? GROWTH_GHOSTS : FRAUD_GHOSTS;
  const colors = isGrowth
    ? ["var(--theme-accent)", "var(--theme-accent-secondary)"]
    : ["var(--theme-accent-secondary)", "var(--theme-accent)"];
  const names = isGrowth
    ? { Primary: "Revenue index", Secondary: "Unique users" }
    : { Primary: "Fraud rate", Secondary: "Residual risk" };

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setEnabled(mq.matches && !reduced);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const unsub = progress.on("change", (value) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setMorph(clamp((value - 0.02) / 0.78, 0, 1));
      });
    });
    return () => {
      unsub();
      cancelAnimationFrame(raf);
    };
  }, [enabled, progress]);

  const data = useMemo(
    () => morphSeries(targets, morph, isGrowth ? "growth" : "fraud"),
    [targets, morph, isGrowth],
  );

  const labeledData = useMemo(
    () =>
      data.map((row) => ({
        date: row.date,
        [names.Primary]: row.Primary,
        [names.Secondary]: row.Secondary,
      })),
    [data, names.Primary, names.Secondary],
  );

  const labeledCategories = [names.Primary, names.Secondary];
  const opacity = useTransform(progress, [0, 0.06, 0.5, 0.88, 1], [0, 0.85, 1, 1, 1]);

  if (!enabled) return null;

  return (
    <motion.div className={`fold-chart fold-chart--${mode}`} style={{ opacity }} aria-hidden>
      <div className="fold-chart-ghosts">
        {ghosts.map((g) => (
          <GhostBubble key={g.id} metric={g} morph={morph} />
        ))}
      </div>

      <LineChart
        className="fold-chart-plot"
        data={labeledData}
        index="date"
        categories={labeledCategories}
        colors={colors}
        showTooltip={false}
        showYAxis={false}
        showXAxis={false}
        showFill={false}
        animate={false}
        yDomain={isGrowth ? [0, 240] : [0, 14]}
        valueFormatter={isGrowth ? (n) => `${Math.round(n)}` : (n) => `${Number(n).toFixed(1)}%`}
      />
    </motion.div>
  );
}
