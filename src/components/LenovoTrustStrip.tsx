import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { lenovoPartnership } from "../data/liveContent";
import { useHeroFly } from "../context/HeroFlyContext";
import { useScroll } from "../context/ScrollContext";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { BorderBeam } from "./BorderBeam";
import { LenovoPartnershipCopy } from "./LenovoPartnershipCopy";
import { LenovoPartnershipLogo } from "./LenovoPartnershipLogo";

/** Pop near the end of the mountain fly — summit beat, not mid-ascent. */
const REVEAL_AT = 0.82;

const POP_SPRING = { type: "spring" as const, stiffness: 280, damping: 28, mass: 0.85 };

/**
 * Lenovo partnership — slides up from the bottom of the sticky hero like a popup,
 * not a pre-rendered strip waiting below the fold.
 */
export function LenovoTrustStrip() {
  const reduced = useReducedMotion();
  const { progressRef } = useHeroFly();
  const { registerScrollListener } = useScroll();
  const [revealed, setRevealed] = useState(reduced);
  const wasRevealed = useRef(reduced);

  useEffect(() => {
    if (reduced) {
      setRevealed(true);
      return;
    }

    const update = () => {
      const next = progressRef.current >= REVEAL_AT;
      if (next === wasRevealed.current) return;
      wasRevealed.current = next;
      setRevealed(next);
    };

    const unsubscribe = registerScrollListener(update);
    update();
    return unsubscribe;
  }, [reduced, progressRef, registerScrollListener]);

  return (
    <motion.section
      aria-label="Lenovo partnership"
      aria-hidden={!revealed}
      initial={false}
      animate={{
        y: revealed ? "0%" : "110%",
        opacity: revealed ? 1 : 0,
      }}
      transition={reduced ? { duration: 0 } : POP_SPRING}
      className={`lenovo-trust-strip absolute inset-x-0 bottom-0 z-30 overflow-hidden border-t border-border bg-bg-card/95 backdrop-blur-md ${
        revealed ? "pointer-events-auto lenovo-trust-strip--revealed" : "pointer-events-none"
      }`}
    >
      <div className="strip-beam-wrap relative overflow-hidden">
        <BorderBeam duration={10} colorFrom="var(--theme-accent-light)" colorTo="var(--color-magenta)" />
        <div className="relative z-[1] rail-strip__inner flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <motion.div
            className="flex items-center gap-4"
            initial={false}
            animate={revealed ? { y: 0, opacity: 1, scale: 1 } : { y: 16, opacity: 0, scale: 0.96 }}
            transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 26, mass: 0.8, delay: revealed ? 0.04 : 0 }}
          >
            <LenovoPartnershipLogo className="h-9 w-auto shrink-0 sm:h-10" />
            <div>
              <p className="stat-label text-orange">{lenovoPartnership.badge}</p>
              <p className="mt-0.5 text-sm font-semibold text-fg">{lenovoPartnership.title}</p>
            </div>
          </motion.div>
          <LenovoPartnershipCopy
            className="w-full max-w-xl sm:ml-auto sm:w-auto sm:pl-8 lg:max-w-md xl:max-w-xl"
          />
        </div>
      </div>
    </motion.section>
  );
}
