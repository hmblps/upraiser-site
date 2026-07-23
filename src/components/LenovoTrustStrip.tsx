import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { lenovoPartnership } from "../data/liveContent";
import { useScroll } from "../context/ScrollContext";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { EASE_OUT } from "../lib/motion";
import { BorderBeam } from "./BorderBeam";
import { LenovoPartnershipCopy } from "./LenovoPartnershipCopy";
import { LenovoPartnershipLogo } from "./LenovoPartnershipLogo";

/** Reveal early in the hero scroll — before Audience enters the viewport. */
const SCROLL_REVEAL_RATIO = 0.08;
const SCROLL_REVEAL_MIN_PX = 64;

function revealThreshold() {
  return Math.max(SCROLL_REVEAL_MIN_PX, Math.round(window.innerHeight * SCROLL_REVEAL_RATIO));
}

export function LenovoTrustStrip() {
  const reduced = useReducedMotion();
  const { registerScrollListener } = useScroll();
  const [revealed, setRevealed] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setRevealed(true);
      return;
    }

    const update = (scrollY: number) => {
      setRevealed(scrollY > revealThreshold());
    };

    const unsubscribe = registerScrollListener(update);
    const onResize = () => update(window.scrollY);
    window.addEventListener("resize", onResize);
    return () => {
      unsubscribe();
      window.removeEventListener("resize", onResize);
    };
  }, [reduced, registerScrollListener]);

  return (
    /* z-40 + isolate: sit above SiteGrain (z-30, mix-blend overlay) so logo/copy stay crisp */
    <motion.div
      className={`lenovo-trust-strip relative z-40 isolate overflow-hidden bg-bg-card ${revealed ? "lenovo-trust-strip--revealed" : "lenovo-trust-strip--hidden"}`}
      initial={false}
      animate={{ height: revealed ? "auto" : 0, opacity: revealed ? 1 : 0 }}
      transition={{ duration: reduced ? 0 : 0.52, ease: EASE_OUT }}
    >
      {revealed ? (
        <div className="strip-beam-wrap relative overflow-hidden">
          <BorderBeam duration={10} colorFrom="var(--theme-accent-light)" colorTo="var(--color-magenta)" />
          <motion.section
            aria-label="Lenovo partnership"
            initial={false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.85 }}
            className="relative z-[1] rail-strip__inner flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
          >
            <div className="flex items-center gap-4">
              <LenovoPartnershipLogo className="h-9 w-auto shrink-0 sm:h-10" />
              <div>
                <p className="stat-label text-orange">{lenovoPartnership.badge}</p>
                <p className="mt-0.5 text-sm font-semibold text-fg">{lenovoPartnership.title}</p>
              </div>
            </div>
            <LenovoPartnershipCopy
              variant="strip"
              className="w-full max-w-xl sm:ml-auto sm:w-auto sm:pl-8 lg:max-w-md xl:max-w-xl"
            />
          </motion.section>
        </div>
      ) : null}
    </motion.div>
  );
}
