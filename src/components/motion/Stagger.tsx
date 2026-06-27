import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeUp, defaultTransition, viewportOnce } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type StaggerProps = HTMLMotionProps<"div"> & {
  stagger?: number;
};

export function Stagger({ children, stagger = 0.1, className, ...props }: StaggerProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
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
      transition={defaultTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
