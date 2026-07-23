import type { Variants } from "framer-motion";
import { motion, useAnimation } from "framer-motion";
import type { HTMLAttributes } from "react";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { cn } from "../../lib/cn";
import { VALUE_ICON_TRANSITION } from "../../lib/valueIconSync";

export interface TrendingUpIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface TrendingUpIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const SVG_VARIANTS: Variants = {
  animate: {
    x: 0,
    y: 0,
    translateX: [0, 2, 0],
    translateY: [0, -2, 0],
    transition: VALUE_ICON_TRANSITION,
  },
};

const PATH_VARIANTS: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    transition: VALUE_ICON_TRANSITION,
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [1, 0],
    transition: VALUE_ICON_TRANSITION,
  },
};

const ARROW_VARIANTS: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    transition: VALUE_ICON_TRANSITION,
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [0.5, 0],
    transition: VALUE_ICON_TRANSITION,
  },
};

const TrendingUpIcon = forwardRef<TrendingUpIconHandle, TrendingUpIconProps>(
  ({ className, size = 28, ...props }, ref) => {
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
        <motion.svg
          animate={controls}
          fill="none"
          height={size}
          initial="normal"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          variants={SVG_VARIANTS}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.polyline
            animate={controls}
            initial="normal"
            points="22 7 13.5 15.5 8.5 10.5 2 17"
            variants={PATH_VARIANTS}
          />
          <motion.polyline
            animate={controls}
            initial="normal"
            points="16 7 22 7 22 13"
            variants={ARROW_VARIANTS}
          />
        </motion.svg>
      </div>
    );
  },
);

TrendingUpIcon.displayName = "TrendingUpIcon";

export { TrendingUpIcon };
