import { motion, useTransform, type MotionValue } from "framer-motion";
import { GhostBubbleMotion } from "./GhostBubbleMotion";

const START_PATHS = [
  "M 0 350 C 300 50, 600 200, 800 50 S 1100 250, 1440 50",
  "M 0 125 C 300 350, 600 50, 800 200 S 1100 50, 1440 125",
  "M 0 200 C 300 50, 600 350, 800 50 S 1100 350, 1440 200",
  "M 0 50 C 300 200, 600 50, 800 350 S 1100 125, 1440 275",
  "M 0 275 C 300 350, 600 275, 800 50 S 1100 200, 1440 350",
];

const END_PATHS = [
  "M 0 50 C 300 50, 600 50, 800 50 S 1100 50, 1440 50",
  "M 0 125 C 300 125, 600 125, 800 125 S 1100 125, 1440 125",
  "M 0 200 C 300 200, 600 200, 800 200 S 1100 200, 1440 200",
  "M 0 275 C 300 275, 600 275, 800 275 S 1100 275, 1440 275",
  "M 0 350 C 300 350, 600 350, 800 350 S 1100 350, 1440 350",
];

const METRICS = [
  { left: "20%", originY: 35, drift: -10, duration: 6, delay: 0.2, label: "RAW LOGS", value: "85M" },
  { left: "40%", originY: 110, drift: 15, duration: 8, delay: 0.5, label: "CLEANSED", value: "99.8%" },
  { left: "60%", originY: 185, drift: -12, duration: 7, delay: 0.8, label: "ATTRIBUTED", value: "3.2M" },
  { left: "80%", originY: 260, drift: 10, duration: 7.5, delay: 1.1, label: "LATENCY", value: "<15ms" },
  { left: "95%", originY: 335, drift: -15, duration: 6.5, delay: 1.4, label: "VERIFIED", value: "100%" },
];

function GridLine({ progress, start, end, index }: { progress: MotionValue<number>, start: string, end: string, index: number }) {
  const d = useTransform(progress, [0, 0.8], [start, end]);
  
  // Opacity: starts low, ramps up, fades slightly at the end
  const opacity = useTransform(progress, [0, 0.4, 0.8, 1], [0.1, 0.4, 0.8, 0.6]);
  
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="var(--theme-accent)"
      strokeWidth={index === 2 ? 4 : 2}
      strokeLinecap="round"
      style={{ 
        opacity,
        filter: "drop-shadow(0px 8px 16px var(--theme-accent-dim))",
        WebkitFilter: "drop-shadow(0px 8px 16px var(--theme-accent-dim))"
      }}
    />
  );
}

export function InfrastructureGrid({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.4, 0.8, 1], [0, 0.2, 1, 0.8]);

  return (
    <div className="absolute inset-0 z-0 overflow-visible pointer-events-none" aria-hidden>
      {/* Ghost Numbers */}
      <motion.div className="fold-chart-ghosts absolute inset-0 z-10 w-full h-full" style={{ opacity }}>
        {METRICS.map((m, i) => (
          <GhostBubbleMotion 
            key={i} 
            left={m.left} 
            originY={m.originY} 
            drift={m.drift} 
            duration={m.duration} 
            delay={m.delay}
          >
            <span className="fold-chart-ghost-value">{m.value}</span>
            <span className="fold-chart-ghost-label">{m.label}</span>
          </GhostBubbleMotion>
        ))}
      </motion.div>

      {/* SVG Canvas */}
      <svg className="w-full h-full overflow-visible" viewBox="0 0 1440 400" preserveAspectRatio="none">
        {START_PATHS.map((start, i) => (
          <GridLine 
            key={i} 
            index={i}
            progress={progress} 
            start={start} 
            end={END_PATHS[i]!} 
          />
        ))}
      </svg>
    </div>
  );
}
