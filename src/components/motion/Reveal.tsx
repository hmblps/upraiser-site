import { motion, type HTMLMotionProps } from "framer-motion";
import { fadeUp, defaultTransition, viewportOnce } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
};

export function Reveal({ children, delay = 0, className, ...props }: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      transition={
        reduced
          ? { duration: 0 }
          : { ...defaultTransition, delay }
      }
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
