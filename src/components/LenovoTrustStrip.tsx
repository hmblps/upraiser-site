import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { lenovoPartnership } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { EASE_OUT } from "../lib/motion";
import { LenovoPartnershipCopy } from "./LenovoPartnershipCopy";
import { LenovoPartnershipLogo } from "./LenovoPartnershipLogo";

const SCROLL_REVEAL_PX = 88;

export function LenovoTrustStrip() {
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  useEffect(() => {
    if (reduced) return;

    const onScroll = () => {
      setRevealed(window.scrollY > SCROLL_REVEAL_PX);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  return (
    <motion.section
      aria-label="Lenovo partnership"
      aria-hidden={!revealed}
      initial={false}
      animate={{
        y: revealed ? "0%" : "100%",
        opacity: revealed ? 1 : 0,
      }}
      transition={{ duration: reduced ? 0 : 0.52, ease: EASE_OUT }}
      className={`absolute inset-x-0 bottom-0 z-20 border-t border-border bg-bg-card/95 backdrop-blur-md ${revealed ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex items-center gap-4">
          <LenovoPartnershipLogo className="h-9 w-auto shrink-0 rounded-sm sm:h-10" />
          <div>
            <p className="stat-label text-orange">{lenovoPartnership.badge}</p>
            <p className="mt-0.5 text-sm font-semibold text-fg">{lenovoPartnership.title}</p>
          </div>
        </div>
        <LenovoPartnershipCopy className="w-full max-w-xl space-y-3 sm:ml-auto sm:w-auto sm:pl-8 lg:max-w-md xl:max-w-xl" />
      </div>
    </motion.section>
  );
}
