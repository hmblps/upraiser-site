import type { Variants } from "framer-motion";
import { motion, useAnimation } from "framer-motion";
import type { HTMLAttributes } from "react";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { cn } from "../../lib/cn";
import { VALUE_ICON_TRANSITION } from "../../lib/valueIconSync";

export interface LinkIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface LinkIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const PATH_VARIANTS: Variants = {
  normal: { pathLength: 1, pathOffset: 0, rotate: 0 },
  animate: {
    pathLength: [1, 0.97, 1, 0.97, 1],
    pathOffset: [0, 0.05, 0, 0.05, 0],
    rotate: [0, -5, 0],
    transition: VALUE_ICON_TRANSITION,
  },
};

const LinkIcon = forwardRef<LinkIconHandle, LinkIconProps>(
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
      <div
        className={cn(className)}
        {...props}
      >
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
          <motion.path
            animate={controls}
            d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
            initial="normal"
            variants={PATH_VARIANTS}
          />
          <motion.path
            animate={controls}
            d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
            initial="normal"
            variants={PATH_VARIANTS}
          />
        </svg>
      </div>
    );
  }
);

LinkIcon.displayName = "LinkIcon";

export { LinkIcon };
