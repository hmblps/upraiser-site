import { motion, useAnimation } from "framer-motion";
import type { HTMLAttributes } from "react";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { cn } from "../../lib/cn";
import { VALUE_ICON_TRANSITION } from "../../lib/valueIconSync";

export interface FileTextIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface FileTextIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const FILE_TEXT = forwardRef<FileTextIconHandle, FileTextIconProps>(
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
          variants={{
            normal: { scale: 1, transition: VALUE_ICON_TRANSITION },
            animate: {
              scale: 1.05,
              transition: VALUE_ICON_TRANSITION,
            },
          }}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />

          <motion.path
            animate={controls}
            d="M10 9H8"
            initial="normal"
            stroke="currentColor"
            strokeWidth="2"
            variants={{
              normal: { pathLength: 1, x1: 8, x2: 10, transition: VALUE_ICON_TRANSITION },
              animate: {
                pathLength: [1, 0, 1],
                x1: [8, 10, 8],
                x2: [10, 10, 10],
                transition: VALUE_ICON_TRANSITION,
              },
            }}
          />
          <motion.path
            animate={controls}
            d="M16 13H8"
            initial="normal"
            stroke="currentColor"
            strokeWidth="2"
            variants={{
              normal: { pathLength: 1, x1: 8, x2: 16, transition: VALUE_ICON_TRANSITION },
              animate: {
                pathLength: [1, 0, 1],
                x1: [8, 16, 8],
                x2: [16, 16, 16],
                transition: VALUE_ICON_TRANSITION,
              },
            }}
          />
          <motion.path
            animate={controls}
            d="M16 17H8"
            initial="normal"
            stroke="currentColor"
            strokeWidth="2"
            variants={{
              normal: { pathLength: 1, x1: 8, x2: 16, transition: VALUE_ICON_TRANSITION },
              animate: {
                pathLength: [1, 0, 1],
                x1: [8, 16, 8],
                x2: [16, 16, 16],
                transition: VALUE_ICON_TRANSITION,
              },
            }}
          />
        </motion.svg>
      </div>
    );
  },
);

FILE_TEXT.displayName = "FileTextIcon";

export { FILE_TEXT as FileTextIcon };
