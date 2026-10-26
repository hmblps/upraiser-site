import type { ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { SPRING } from "../../lib/motion";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  maxOffsetX?: number;
  maxOffsetY?: number;
}

export function Magnetic({
  children,
  className = "",
  strength = 0.32,
  maxOffsetX,
  maxOffsetY,
}: MagneticProps) {
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
        let targetX = (event.clientX - (rect.left + rect.width / 2)) * strength;
        let targetY = (event.clientY - (rect.top + rect.height / 2)) * strength;
        const limitX = maxOffsetX ?? (block ? 8 : 24);
        const limitY = maxOffsetY ?? 16;
        targetX = Math.max(-limitX, Math.min(limitX, targetX));
        targetY = Math.max(-limitY, Math.min(limitY, targetY));
        x.set(targetX);
        y.set(targetY);
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
