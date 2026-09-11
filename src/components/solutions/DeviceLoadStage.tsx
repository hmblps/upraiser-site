import type { ReactNode } from "react";
import { motion } from "framer-motion";

/** Soft crossfade when placeholder and GLB share optical size. */
const REVEAL_SPRING = { type: "spring" as const, stiffness: 120, damping: 28, mass: 1 };
/** Phone: no placeholder — cut straight to settled GLB (avoids big→small snap). */
const REVEAL_INSTANT = { duration: 0 };

/**
 * Instant CSS chassis, 3D fades in on top. Canvas stays layout-visible
 * (opacity never 0) so R3F ResizeObserver gets a real size — opacity:0
 * left the WebGL buffer stuck at 300×150 and the “old” CSS phone forever.
 *
 * Pass `placeholder={null}` + `instant` when CSS/silhouette optical size
 * differs from the GLB (phone load snap on /channels).
 */
export function DeviceLoadStage({
  ready,
  placeholder,
  children,
  instant = false,
}: {
  ready: boolean;
  placeholder?: ReactNode;
  children: ReactNode;
  instant?: boolean;
}) {
  const transition = instant ? REVEAL_INSTANT : REVEAL_SPRING;

  return (
    <div className="prog-device-load">
      {placeholder ? (
        <motion.div
          className="prog-device-load__placeholder"
          initial={false}
          animate={{ opacity: ready ? 0 : 1 }}
          transition={transition}
          aria-hidden={ready}
          style={{ zIndex: ready ? 0 : 2 }}
        >
          {placeholder}
        </motion.div>
      ) : null}
      <motion.div
        className="prog-device-load__canvas"
        initial={false}
        animate={{ opacity: ready ? 1 : 0.02 }}
        transition={transition}
        style={{ zIndex: 1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
