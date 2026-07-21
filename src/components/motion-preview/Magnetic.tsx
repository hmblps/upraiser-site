import type { ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { SPRING } from "../../lib/motion";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function Magnetic({ children, className = "", strength = 0.32 }: MagneticProps) {
  const reduced = useReducedMotion();
  const block = /\bw-full\b/.test(className);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);

  if (reduced) {
    return (
      <div className={`magnetic-wrap ${block ? "block" : "inline-block"}${className ? ` ${className}` : ""}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={`magnetic-wrap ${block ? "block" : "inline-block"}${className ? ` ${className}` : ""}`}
      style={{ x: springX, y: springY }}
      onMouseMove={(event) => {
        const node = event.currentTarget;
        const rect = node.getBoundingClientRect();
        x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
