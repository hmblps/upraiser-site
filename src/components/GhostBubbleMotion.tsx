import { motion } from "framer-motion";
import type { ReactNode } from "react";

type GhostBubbleMotionProps = {
  left: string;
  originY: number;
  drift: number;
  duration: number;
  delay: number;
  rise?: number;
  peakOpacity?: number;
  children: ReactNode;
};

export function ghostRiseDistance(originY: number, scale = 1) {
  return (160 + originY * 0.35) * scale;
}

export function GhostBubbleMotion({
  left,
  originY,
  drift,
  duration,
  delay,
  rise,
  peakOpacity = 0.52,
  children,
}: GhostBubbleMotionProps) {
  const travel = rise ?? ghostRiseDistance(originY);

  return (
    <div className="fold-chart-ghost-slot" style={{ left, top: `${originY}%` }}>
      <motion.div
        className="fold-chart-ghost"
        animate={{
          y: [24, -travel * 0.28, -travel * 0.64, -travel],
          x: [0, drift * 0.28, drift * 0.64, drift],
          opacity: [0, peakOpacity, peakOpacity * 0.88, 0],
        }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          times: [0, 0.22, 0.72, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
