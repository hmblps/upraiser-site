import { useEffect, useId, useMemo, useState } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { GhostBubbleMotion } from "./GhostBubbleMotion";
import { useTheme } from "../context/ThemeContext";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScrollMorph } from "../hooks/useScrollMorph";
import { useMode } from "./SectionHeader";

type FoldAreaMassProps = {
  progress: MotionValue<number>;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Same period spine as SCALE — reads as a chart, not an abstract ribbon */
const PERIODS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"];

/** Stack layers — Secondary sits under Primary so the silhouette = accumulated mass */
function growthTargets() {
  const base = [9, 10, 12, 19, 23, 27, 38, 44, 49, 58, 66, 74];
  const lift = [7, 8, 10, 15, 18, 21, 29, 34, 37, 46, 52, 62];
  return PERIODS.map((period, i) => ({
    period,
    Base: base[i]!,
    Lift: lift[i]!,
  }));
}

function clarityTargets() {
  const base = [22, 24, 26, 32, 36, 38, 44, 48, 52, 56, 58, 60];
  const lift = [16, 18, 18, 26, 28, 30, 35, 36, 36, 38, 40, 40];
  return PERIODS.map((period, i) => ({
    period,
    Base: base[i]!,
    Lift: lift[i]!,
  }));
}

function morphSeries(
  targets: ReturnType<typeof growthTargets>,
  t: number,
) {
  return targets.map((row) => ({
    period: row.period,
    Base: lerp(row.Base * 0.14, row.Base, t),
    Lift: lerp(row.Lift * 0.12, row.Lift, t),
  }));
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

const GROWTH_RESULT_GHOSTS: GhostMetric[] = [
  {
    id: "revenue",
    label: "Revenue",
    left: "14%",
    originY: 76,
    drift: 12,
    duration: 7.4,
    delay: 0.15,
    format: (t) => `$${lerp(22, 94, t).toFixed(0)}k`,
  },
  {
    id: "deposits",
    label: "Deposits",
    left: "34%",
    originY: 70,
    drift: -10,
    duration: 7.8,
    delay: 1.2,
    format: (t) => `${Math.round(lerp(180, 920, t))}`,
  },
  {
    id: "roas",
    label: "ROAS",
    left: "54%",
    originY: 78,
    drift: 14,
    duration: 6.9,
    delay: 2.1,
    format: (t) => `${lerp(1.4, 3.8, t).toFixed(1)}x`,
  },
  {
    id: "cpa",
    label: "CPA held",
    left: "72%",
    originY: 72,
    drift: -12,
    duration: 8,
    delay: 0.7,
    format: (t) => `$${lerp(48, 31, t).toFixed(0)}`,
  },
  {
    id: "ltv",
    label: "Cohort LTV",
    left: "88%",
    originY: 80,
    drift: 9,
    duration: 7.2,
    delay: 2.8,
    format: (t) => `$${lerp(28, 76, t).toFixed(0)}`,
  },
];

const CLARITY_RESULT_GHOSTS: GhostMetric[] = [
  {
    id: "verified",
    label: "Verified",
    left: "16%",
    originY: 74,
    drift: 11,
    duration: 7.3,
    delay: 0.2,
    format: (t) => `${lerp(88, 99.4, t).toFixed(1)}%`,
  },
  {
    id: "parity",
    label: "Log parity",
    left: "36%",
    originY: 70,
    drift: -11,
    duration: 7.9,
    delay: 1.3,
    format: (t) => `${lerp(0.9, 0.0, t).toFixed(1)}% drift`,
  },
  {
    id: "blocked",
    label: "Fraud blocked",
    left: "56%",
    originY: 78,
    drift: 12,
    duration: 7.1,
    delay: 2.2,
    format: (t) => `${lerp(91, 97.3, t).toFixed(1)}%`,
  },
  {
    id: "matched",
    label: "MMP match",
    left: "76%",
    originY: 72,
    drift: -10,
    duration: 7.6,
    delay: 0.8,
    format: (t) => `${Math.round(lerp(92, 100, t))}%`,
  },
  {
    id: "clean",
    label: "Clean spend",
    left: "90%",
    originY: 80,
    drift: 8,
    duration: 6.8,
    delay: 2.6,
    format: (t) => `${Math.round(lerp(84, 98, t))}%`,
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

/**
 * RESULTS ambient chart — same grammar as SCALE (weeks, dual series, fill under line),
 * but Area-led: accumulated mass / outcomes instead of thin flow lines.
 */
export function FoldAreaMass({ progress }: FoldAreaMassProps) {
  const { mode } = useMode();
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const reactId = useId().replace(/:/g, "");

  const isGrowth = mode === "growth";
  const morph = useScrollMorph(progress, enabled, {
    start: 0.02,
    span: theme === "dark" ? 0.88 : 0.78,
    lerp: theme === "dark" ? 0.075 : 0.09,
  });
  const ghosts = isGrowth ? GROWTH_RESULT_GHOSTS : CLARITY_RESULT_GHOSTS;
  const targets = useMemo(() => (isGrowth ? growthTargets() : clarityTargets()), [isGrowth]);
  const primary = "var(--theme-accent)";
  const secondary = "var(--theme-accent-secondary)";
  const colors = isGrowth ? [primary, secondary] : [secondary, primary];
  const names = isGrowth
    ? { Base: "Deposits", Lift: "Revenue" }
    : { Base: "Verified base", Lift: "Audit lift" };

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setEnabled(mq.matches && !reduced);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduced]);

  const data = useMemo(() => {
    const morphed = morphSeries(targets, morph);
    return morphed.map((row) => ({
      period: row.period,
      [names.Base]: row.Base,
      [names.Lift]: row.Lift,
    }));
  }, [targets, morph, names.Base, names.Lift]);

  const opacity = useTransform(progress, [0, 0.06, 0.5, 0.88, 1], [0, 0.85, 1, 1, 1]);

  const gradBase = `fold-area-base-${reactId}`;
  const gradLift = `fold-area-lift-${reactId}`;

  if (!enabled) return null;

  return (
    <motion.div className={`fold-area fold-area--${mode}`} style={reduced ? { opacity: 0.75 } : { opacity }} aria-hidden>
      <div className="fold-area-ghosts fold-chart-ghosts">
        {ghosts.map((g) => (
          <GhostBubble key={g.id} metric={g} morph={morph} />
        ))}
      </div>

      <div className="fold-area-plot">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 28, right: 24, left: 8, bottom: 8 }}>
            <defs>
              <linearGradient id={gradBase} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors[1]} stopOpacity={0.78} />
                <stop offset="100%" stopColor={colors[1]} stopOpacity={0.22} />
              </linearGradient>
              <linearGradient id={gradLift} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors[0]} stopOpacity={0.88} />
                <stop offset="55%" stopColor={colors[0]} stopOpacity={0.45} />
                <stop offset="100%" stopColor={colors[0]} stopOpacity={0.14} />
              </linearGradient>
            </defs>

            <XAxis dataKey="period" hide />
            <YAxis hide domain={[0, 150]} />

            <Area
              type="monotone"
              stackId="mass"
              dataKey={names.Base}
              stroke="none"
              fill={`url(#${gradBase})`}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              stackId="mass"
              dataKey={names.Lift}
              stroke={colors[0]}
              strokeWidth={2.5}
              strokeOpacity={0.95}
              fill={`url(#${gradLift})`}
              dot={{ r: 3.25, fill: colors[0], strokeWidth: 0 }}
              activeDot={false}
              isAnimationActive={false}
            />

            <CartesianGrid
              stroke="var(--theme-border)"
              strokeOpacity={0.55}
              vertical={false}
              strokeDasharray="3 6"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
