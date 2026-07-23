import type { Variants } from "framer-motion";
import { motion, useAnimation } from "framer-motion";
import type { HTMLAttributes } from "react";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { cn } from "../../lib/cn";
import { VALUE_ICON_TRANSITION } from "../../lib/valueIconSync";

export interface ChartColumnIncreasingIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ChartColumnIncreasingIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const LINE_VARIANTS: Variants = {
  normal: { pathLength: 1, opacity: 1, transition: VALUE_ICON_TRANSITION },
  animate: {
    pathLength: [1, 0, 1],
    opacity: [1, 0, 1],
    transition: VALUE_ICON_TRANSITION,
  },
};

const ChartColumnIncreasingIcon = forwardRef<
  ChartColumnIncreasingIconHandle,
  ChartColumnIncreasingIconProps
>(({ className, size = 28, ...props }, ref) => {
  const controls = useAnimation();
  const isControlledRef = useRef(false);

  useImperativeHandle(ref, () => {
    isControlledRef.current = true;

    return {
      startAnimation: () => controls.start("animate"),
      stopAnimation: () => controls.start("normal"),
    };
  });

  return (
    <div className={cn(className)} {...props}>
      <svg
        fill="none"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path animate={controls} d="M13 17V9" initial="normal" variants={LINE_VARIANTS} />
        <motion.path animate={controls} d="M18 17V5" initial="normal" variants={LINE_VARIANTS} />
        <path d="M3 3v16a2 2 0 0 0 2 2h16" />
        <motion.path animate={controls} d="M8 17v-3" initial="normal" variants={LINE_VARIANTS} />
      </svg>
    </div>
  );
});

ChartColumnIncreasingIcon.displayName = "ChartColumnIncreasingIcon";

export { ChartColumnIncreasingIcon };
