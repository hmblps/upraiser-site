import { useEffect, useRef, useState } from "react";
import { motion, useInView, type HTMLMotionProps } from "framer-motion";
import { fadeUp, defaultTransition } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type StaggerProps = HTMLMotionProps<"div"> & {
  stagger?: number;
  resetKey?: string;
};

export function Stagger({ children, stagger = 0.1, className, resetKey = "", ...props }: StaggerProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.15, margin: "0px 0px -10% 0px", once: true });
  // Fallback: hash jumps / lazy mount can miss the first intersection
  const [forced, setForced] = useState(false);

  useEffect(() => {
    if (reduced || inView || forced) return;
    const id = window.setTimeout(() => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) setForced(true);
    }, 120);
    return () => window.clearTimeout(id);
  }, [forced, inView, reduced, resetKey]);

  const show = reduced || inView || forced;

  return (
    <motion.div
      key={resetKey}
      ref={ref}
      initial={reduced ? false : "hidden"}
      animate={show ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: 0.04 } },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, ...props }: HTMLMotionProps<"div">) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      variants={reduced ? undefined : fadeUp}
      // Do not set initial here — parent Stagger orchestrates hidden→visible
      transition={defaultTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
