import { useEffect, useState } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

const ROWS = 14;

const METRICS = [
  { left: "7%", value: "100%", label: "Log match", tone: "var(--theme-accent)" },
  { left: "26%", value: "0.0%", label: "Drift", tone: "var(--theme-accent-secondary)" },
  { left: "48%", value: "99.4%", label: "Verified", tone: "var(--theme-accent)" },
  { left: "68%", value: "AUDIT", label: "Trail intact", tone: "var(--theme-muted-light)" },
  { left: "88%", value: "0", label: "Surprises", tone: "var(--theme-accent-secondary)" },
] as const;

type ClarityLedgerProps = {
  progress: MotionValue<number>;
};

/**
 * CLARITY ambient — ledger rows snap from noise to order as You scroll.
 * Sits in the lower band only; copy stays untouched above.
 */
export function ClarityLedger({ progress }: ClarityLedgerProps) {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const opacity = useTransform(progress, [0, 0.12, 0.55, 1], [0, 0.45, 0.55, 0.55]);
  const ghostOpacity = useTransform(progress, [0, 0.2, 0.5, 1], [0, 0.5, 1, 1]);
  const spineOpacity = useTransform(progress, [0, 0.4, 1], [0.15, 0.35, 0.4]);
  const washOpacity = useTransform(progress, [0, 0.25, 0.7, 1], [0.15, 0.42, 0.58, 0.62]);
  const panelOpacity = useTransform(progress, [0, 0.18, 0.55, 1], [0, 0.55, 0.78, 0.82]);

  useEffect(() => {
    if (reduced) {
      setEnabled(false);
      return;
    }
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduced]);

  if (!enabled) return null;

  return (
    <motion.div className="clarity-ledger" aria-hidden style={{ opacity }}>
      <motion.div className="clarity-ledger__wash" style={{ opacity: washOpacity }} aria-hidden />
      <motion.div className="clarity-ledger__panel" style={{ opacity: panelOpacity }} aria-hidden />
      <svg className="clarity-ledger__svg" viewBox="0 0 1000 520" preserveAspectRatio="none">
        <g className="clarity-ledger__columns" opacity={0.55}>
          {[22, 42, 62, 82].map((x) => (
            <line
              key={x}
              x1={`${x}%`}
              y1="10%"
              x2={`${x}%`}
              y2="94%"
              stroke="var(--theme-border)"
              strokeWidth={0.5}
              strokeOpacity={0.35}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
        {Array.from({ length: ROWS }, (_, i) => {
          const baseY = 80 + i * 28;
          const chaos = (i % 2 === 0 ? 1 : -1) * (6 + (i % 4) * 2.5);
          return (
            <LedgerRow key={i} progress={progress} baseY={baseY} chaos={chaos} />
          );
        })}
        <motion.line
          x1="4%"
          y1="8%"
          x2="4%"
          y2="92%"
          style={{ opacity: spineOpacity }}
          stroke="var(--theme-accent)"
          strokeWidth={1}
          strokeOpacity={0.35}
        />
      </svg>

      <motion.div className="clarity-ledger__ghosts fold-chart-ghosts" style={{ opacity: ghostOpacity }}>
        {METRICS.map((m, i) => (
          <div
            key={m.label}
            className="fold-chart-ghost-slot clarity-ledger__ghost-slot"
            style={{ left: m.left, top: `${72 + (i % 3) * 8}%`, ["--clarity-ghost-tone" as string]: m.tone }}
          >
            <div className="fold-chart-ghost clarity-ledger__ghost">
              <span className="fold-chart-ghost-value">{m.value}</span>
              <span className="fold-chart-ghost-label">{m.label}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function LedgerRow({
  progress,
  baseY,
  chaos,
}: {
  progress: MotionValue<number>;
  baseY: number;
  chaos: number;
}) {
  const y = useTransform(progress, [0, 1], [chaos, 0]);
  const strokeOpacity = useTransform(progress, [0, 0.5, 1], [0.16, 0.34, 0.4]);

  return (
    <motion.line
      x1="5%"
      y1={baseY}
      x2="97%"
      y2={baseY}
      style={{ y, strokeOpacity }}
      stroke="var(--theme-accent)"
      strokeWidth={0.75}
      strokeDasharray="4 10"
      vectorEffect="non-scaling-stroke"
    />
  );
}
