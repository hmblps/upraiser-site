import { useEffect, useMemo, useRef, useState,  } from "react";
import { motion, useTransform, type MotionValue, useMotionValue } from "framer-motion";
import { GhostBubbleMotion } from "./GhostBubbleMotion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { clamp } from "../lib/clamp";

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

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

function formatLiveDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function FraudGhost({ 
  index, 
  morph 
}: { 
  index: number; 
  morph: MotionValue<number>;
}) {
  const seg = segments[index]!;
  const layout = fraudGhostLayout[index]!;
  const containerRef = useRef<HTMLSpanElement>(null);

  // Zero-cost text update matching ModeChart
  useEffect(() => {
    const updateDOM = (v: number) => {
      if (!containerRef.current) return;
      const val = (seg.value * v).toFixed(1) + "%";
      const match = val.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);
      if (!match) {
        containerRef.current.textContent = val;
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
  }, [morph, seg]);

  return (
    <GhostBubbleMotion
      left={layout.left}
      originY={layout.originY}
      drift={layout.drift}
      duration={layout.duration}
      delay={layout.delay}
      peakOpacity={0.9}
      rise={100 + index * 15}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
        <span className="font-sans font-medium text-[0.6em] tracking-wider text-muted-light uppercase">
          {seg.label}
        </span>
      </div>
      <span className="fold-chart-ghost-value text-accent-secondary drop-shadow-md">
        <span ref={containerRef}></span>
      </span>
    </GhostBubbleMotion>
  );
}

export function FraudScrollChart({ progress }: { progress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const liveDate = useMemo(() => formatLiveDate(new Date()), []);
  const morph = useMotionValue(0);

  const chartOpacity = useTransform(progress, [0, 0.06, 0.5, 0.88, 1], [0, 0.85, 1, 1, 1]);
  const dateOpacity = useTransform(progress, [0.18, 0.36], [0, 1]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setEnabled(mq.matches && !reduced);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduced]);

  // Zero-cost interpolator loop
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const unsub = progress.on("change", (value) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const p = clamp((value - 0.02) / 0.74, 0, 1);
        morph.set(Math.round(p * 200) / 200);
      });
    });
    return () => {
      unsub();
      cancelAnimationFrame(raf);
    };
  }, [enabled, progress, morph]);

  if (!enabled) return null;

  return (
    <motion.div className="fold-chart" style={{ opacity: chartOpacity }} aria-hidden>
      
      {/* Live Date Anchor */}
      <motion.div 
        className="absolute top-10 right-[42%] flex flex-col items-end gap-1.5 text-right z-10"
        style={{ opacity: dateOpacity }}
      >
        <span className="font-sans font-medium text-[0.65rem] tracking-widest text-accent-secondary uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
          Live Audit
        </span>
        <span className="font-mono text-[0.8rem] text-muted-light tracking-wide">{liveDate}</span>
      </motion.div>

      {/* Zero-cost Ghost Updates */}
      <div className="fold-chart-ghosts pointer-events-none">
        {segments.map((_, i) => (
          <FraudGhost key={i} index={i} morph={morph} />
        ))}
      </div>

      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <svg 
          className="w-full h-full overflow-visible" 
          viewBox={`0 0 ${VB} ${VB}`}
          preserveAspectRatio="none"
        >
          <g transform={`translate(${CENTER_X}, ${CY})`}>
            {radii.map((r, i) => {
              const seg = segments[i]!;
              const sweep = (seg.value / 100) * (END_ANGLE - START_ANGLE);
              
              // Map morph to dynamic path string
              const dPath = useTransform(morph, (m) => arcPath(0, 0, r, START_ANGLE, START_ANGLE + sweep * m));
              
              return (
                <g key={i}>
                  <path
                    d={arcPath(0, 0, r, START_ANGLE, END_ANGLE)}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={STROKE}
                    strokeOpacity="0.12"
                    strokeLinecap="round"
                  />
                  <motion.path
                    d={dPath}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={STROKE}
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 8px ${seg.color}66)` }}
                  />
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </motion.div>
  );
}
