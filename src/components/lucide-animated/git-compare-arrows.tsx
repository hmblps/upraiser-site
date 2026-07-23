import { motion, useAnimation } from "framer-motion";
import type { HTMLAttributes } from "react";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { cn } from "../../lib/cn";
import { VALUE_ICON_TRANSITION } from "../../lib/valueIconSync";

export interface GitCompareArrowsIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface GitCompareArrowsIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const GitCompareArrowsIcon = forwardRef<GitCompareArrowsIconHandle, GitCompareArrowsIconProps>(
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
          <motion.circle
            animate={controls}
            cx="5"
            cy="6"
            r="3"
            transition={VALUE_ICON_TRANSITION}
            variants={{
              normal: { pathLength: 1, opacity: 1, transition: VALUE_ICON_TRANSITION },
              animate: {
                pathLength: [0, 1],
                opacity: [0, 1],
                transition: VALUE_ICON_TRANSITION,
              },
            }}
          />

          <motion.path
            animate={controls}
            d="M12 6h5a2 2 0 0 1 2 2v7"
            transition={VALUE_ICON_TRANSITION}
            variants={{
              normal: {
                pathLength: 1,
                pathOffset: 0,
                opacity: 1,
                transition: VALUE_ICON_TRANSITION,
              },
              animate: {
                pathLength: [0, 1],
                opacity: [0, 1],
                pathOffset: [1, 0],
                transition: VALUE_ICON_TRANSITION,
              },
            }}
          />

          <motion.path
            animate={controls}
            d="m15 9-3-3 3-3"
            transition={VALUE_ICON_TRANSITION}
            variants={{
              normal: { opacity: 1, transition: VALUE_ICON_TRANSITION },
              animate: { opacity: [0, 1], transition: VALUE_ICON_TRANSITION },
            }}
          />

          <motion.circle
            animate={controls}
            cx="19"
            cy="18"
            r="3"
            transition={VALUE_ICON_TRANSITION}
            variants={{
              normal: { pathLength: 1, opacity: 1, transition: VALUE_ICON_TRANSITION },
              animate: {
                pathLength: [0, 1],
                opacity: [0, 1],
                transition: VALUE_ICON_TRANSITION,
              },
            }}
          />

          <motion.path
            animate={controls}
            d="M12 18H7a2 2 0 0 1-2-2V9"
            transition={VALUE_ICON_TRANSITION}
            variants={{
              normal: {
                pathLength: 1,
                pathOffset: 0,
                opacity: 1,
                transition: VALUE_ICON_TRANSITION,
              },
              animate: {
                pathLength: [0, 1],
                opacity: [0, 1],
                pathOffset: [1, 0],
                transition: VALUE_ICON_TRANSITION,
              },
            }}
          />

          <motion.path
            animate={controls}
            d="m9 15 3 3-3 3"
            transition={VALUE_ICON_TRANSITION}
            variants={{
              normal: { opacity: 1, transition: VALUE_ICON_TRANSITION },
              animate: { opacity: [0, 1], transition: VALUE_ICON_TRANSITION },
            }}
          />
        </svg>
      </div>
    );
  },
);

GitCompareArrowsIcon.displayName = "GitCompareArrowsIcon";

export { GitCompareArrowsIcon };
