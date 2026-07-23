import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import type { SiteMode } from "../../data/liveContent";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const MODE_SPRING = { type: "spring" as const, stiffness: 128, damping: 26, mass: 0.85 };

type ModeContentTransitionProps = {
  mode: SiteMode;
  children: ReactNode;
  className?: string;
};

/** Cross-fade + slide when growth/infrastructure swaps (theme toggle). */
export function ModeContentTransition({ mode, children, className = "" }: ModeContentTransitionProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={mode}
        className={className}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={MODE_SPRING}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
