import { useEffect, useState } from "react";
import { ParityWaterChart } from "./ParityWaterChart";
import { CommitmentChart } from "./CommitmentChart";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useMode } from "./SectionHeader";

type FoldAreaMassProps = {
  progress: MotionValue<number>;
};

/**
 * Promise fold ambient — growth: CommitmentChart · infra dark: ParityWaterChart.
 */
export function FoldAreaMass({ progress }: FoldAreaMassProps) {
  const { mode } = useMode();
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const isGrowth = mode === "growth";
  const isParityDark = !isGrowth && theme === "dark";

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setEnabled(mq.matches && !reduced);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduced]);

  const opacity = useTransform(progress, [0, 0.06, 0.5, 0.88, 1], [0, 0.85, 1, 1, 1]);

  if (!enabled) return null;

  return (
    <motion.div className={`fold-area fold-area--${mode}`} style={reduced ? { opacity: 0.75 } : { opacity }} aria-hidden>
      <div className="fold-area-plot">
        {isParityDark ? <ParityWaterChart progress={progress} /> : <CommitmentChart progress={progress} />}
      </div>
    </motion.div>
  );
}
