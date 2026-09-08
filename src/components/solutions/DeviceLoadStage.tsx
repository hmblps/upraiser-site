import type { ReactNode } from "react";
import { motion } from "framer-motion";

const REVEAL = { type: "spring" as const, stiffness: 160, damping: 26, mass: 0.8 };

/**
 * Instant CSS chassis, 3D fades in on top. Canvas stays layout-visible
 * (opacity never 0) so R3F ResizeObserver gets a real size — opacity:0
 * left the WebGL buffer stuck at 300×150 and the “old” CSS phone forever.
 */
export function DeviceLoadStage({
  ready,
  placeholder,
  children,
}: {
  ready: boolean;
  placeholder: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="prog-device-load">
      <motion.div
        className="prog-device-load__placeholder"
        initial={false}
        animate={{ opacity: ready ? 0 : 1 }}
        transition={REVEAL}
        aria-hidden={ready}
        style={{ zIndex: ready ? 0 : 2 }}
      >
        {placeholder}
      </motion.div>
      <motion.div
        className="prog-device-load__canvas"
        initial={false}
        animate={{ opacity: ready ? 1 : 0.02 }}
        transition={REVEAL}
        style={{ zIndex: 1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
