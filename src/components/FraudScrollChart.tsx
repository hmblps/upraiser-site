import { ChartGhostValue } from "./ChartGhostValue";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { GhostBubbleMotion } from "./GhostBubbleMotion";
import { useReducedMotion } from "../hooks/useReducedMotion";

const VB = 420;
const CX = 128;
const CY = 248;
const CENTER_X = VB - CX;
const START_ANGLE = 128;
const END_ANGLE = 398;
const STROKE = 9;

const segments = [
  { label: "Fake installs", value: 47, color: "var(--fraud-segment-fake)" },
  { label: "Device farms", value: 35, color: "var(--fraud-segment-farms)" },
  { label: "AI layer", value: 10, color: "var(--fraud-segment-ai)" },
  { label: "Bots", value: 8, color: "var(--fraud-segment-bots)" },
] as const;

const radii = [168, 138, 108, 78];

const fraudGhostLayout = [
  { left: "48%", originY: 79, drift: 16, duration: 7.2, delay: 0 },
  { left: "63%", originY: 85, drift: -12, duration: 7.8, delay: 1.1 },
  { left: "78%", originY: 75, drift: 14, duration: 8.1, delay: 2.0 },
  { left: "92%", originY: 81, drift: -10, duration: 6.6, delay: 2.8 },
] as const;

import { clamp } from "../lib/clamp";

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  let sweep = endDeg - startDeg;
  if (sweep < 0) sweep += 360;
  const large = sweep > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

function formatLiveDate(date: Date) {
  const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(date);
  const year = new Intl.DateTimeFormat("en-GB", { year: "numeric" }).format(date);
  return { day, year };
}

function FraudGhost({
  value,
  label,
  color,
  left,
  originY,
  drift,
  duration,
  delay,
}: {
  value: string;
  label: string;
  color: string;
  left: string;
  originY: number;
  drift: number;
  duration: number;
  delay: number;
}) {
  return (
    <div className="fraud-ghost-toned" style={{ "--fraud-ghost-tone": color } as CSSProperties}>
      <GhostBubbleMotion left={left} originY={originY} drift={drift} duration={duration} delay={delay}>
        <ChartGhostValue value={value} />
        <span className="fold-chart-ghost-label">{label}</span>
      </GhostBubbleMotion>
    </div>
  );
}

function FraudArc({
  progress,
  segment,
  index,
  radius,
}: {
  progress: MotionValue<number>;
  segment: (typeof segments)[number];
  index: number;
  radius: number;
}) {
  const track = arcPath(CX, CY, radius, START_ANGLE, END_ANGLE);
  const start = 0.1 + index * 0.08;
  const end = Math.min(start + 0.42, 0.88);
  const pathLength = useTransform(progress, [start, end], [0, segment.value / 100]);

  return (
    <g>
      <path
        d={track}
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinecap="round"
        className="fraud-radial-chart__track"
      />
      <motion.path
        d={track}
        fill="none"
        stroke={segment.color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        className="fraud-radial-chart__arc"
        style={{ 
          pathLength, 
          color: segment.color,
          filter: `drop-shadow(0px 8px 16px ${segment.color})`,
          WebkitFilter: `drop-shadow(0px 8px 16px ${segment.color})`
        }}
      />
    </g>
  );
}

export function FraudScrollChart({ progress }: { progress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [morph, setMorph] = useState(0);
  const liveDate = useMemo(() => formatLiveDate(new Date()), []);

  const chartOpacity = useTransform(progress, [0, 0.06, 0.5, 0.88, 1], [0, 0.85, 1, 1, 1]);
  const dateOpacity = useTransform(progress, [0.18, 0.36], [0, 1]);

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

  if (!enabled) return null;

  return (
    <>
      <p className="sr-only">
        Fraud traffic breakdown: fake installs 47%, device farms 35%, AI layer 10%, bots 8%. Values animate as you
        scroll.
      </p>
      <motion.div className="fraud-radial-chart" style={reduced ? { opacity: 0.75 } : { opacity: chartOpacity }} aria-hidden>
      <div className="fraud-radial-chart__ghosts fold-chart-ghosts">
        {segments.map((segment, index) => {
          const layout = fraudGhostLayout[index]!;
          const pct = Math.round(segment.value * morph);
          return (
            <FraudGhost
              key={segment.label}
              value={`${pct}%`}
              label={segment.label}
              color={segment.color}
              left={layout.left}
              originY={layout.originY}
              drift={layout.drift}
              duration={layout.duration}
              delay={layout.delay}
            />
          );
        })}
      </div>

      <div className="fraud-radial-chart__plot">
        <div className="fraud-radial-chart__frame">
          <svg className="fraud-radial-chart__svg" viewBox={`0 0 ${VB} ${VB}`} preserveAspectRatio="xMidYMid meet">
            <g transform={`translate(${VB} 0) scale(-1 1)`}>
              {segments.map((segment, index) => (
                <FraudArc
                  key={segment.label}
                  progress={progress}
                  segment={segment}
                  index={index}
                  radius={radii[index]!}
                />
              ))}
            </g>

            <motion.g style={{ opacity: dateOpacity }}>
              <circle cx={CENTER_X} cy={CY} r={38} className="fraud-radial-chart__date-ring-svg" />
              <text x={CENTER_X} y={CY - 2} textAnchor="middle" className="fraud-radial-chart__date-day-svg">
                {liveDate.day}
              </text>
              <text x={CENTER_X} y={CY + 14} textAnchor="middle" className="fraud-radial-chart__date-year-svg">
                {liveDate.year}
              </text>
            </motion.g>
          </svg>
        </div>
      </div>
    </motion.div>
    </>
  );
}
