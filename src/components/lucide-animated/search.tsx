import { motion, useAnimation } from "framer-motion";
import type { HTMLAttributes } from "react";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { cn } from "../../lib/cn";
import { VALUE_ICON_TRANSITION } from "../../lib/valueIconSync";

export interface SearchIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface SearchIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const SearchIcon = forwardRef<SearchIconHandle, SearchIconProps>(
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
        <motion.svg
          animate={controls}
          fill="none"
          height={size}
          initial="normal"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          transition={VALUE_ICON_TRANSITION}
          variants={{
            normal: { x: 0, y: 0 },
            animate: {
              x: [0, 0, -3, 0],
              y: [0, -4, 0, 0],
            },
          }}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </motion.svg>
      </div>
    );
  }
);

SearchIcon.displayName = "SearchIcon";

export { SearchIcon };
