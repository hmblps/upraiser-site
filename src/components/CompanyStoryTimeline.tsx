import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { COMPANY_CONTENT } from "../data/innerPagesData";
import { useReducedMotion } from "../hooks/useReducedMotion";

const SPRING = { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.65 };

/**
 * Horizontal year scrubber — one beat at a time, no vertical list scroll.
 */
export function CompanyStoryTimeline() {
  const reduced = useReducedMotion();
  const beats = COMPANY_CONTENT.archive;
  const [active, setActive] = useState(beats.length - 1);
  const beat = beats[active] ?? beats[0]!;

  return (
    <div className="company-story-scrub flex h-full min-h-0 flex-col overflow-hidden">
      <p className="about-positioning text-xl font-bold tracking-tight text-fg sm:text-2xl">
        {COMPANY_CONTENT.positioningLead}{" "}
        <span className="text-orange">{COMPANY_CONTENT.positioningAccent}</span>
      </p>

      <div
        className="company-story-scrub__rail mt-5 flex shrink-0 items-center gap-1"
        role="tablist"
        aria-label="Company timeline"
      >
        {beats.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.mark}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(index)}
              className={[
                "company-story-scrub__tick relative flex min-w-0 flex-1 flex-col items-center gap-2 rounded-lg px-1 py-2 transition",
                selected ? "text-orange" : "text-muted hover:text-fg",
              ].join(" ")}
            >
              <span className="text-[0.6875rem] font-bold uppercase tracking-[0.14em]">{item.mark}</span>
              <span
                className={[
                  "h-1.5 w-full max-w-[3.5rem] rounded-full transition",
                  selected ? "bg-orange" : "bg-border",
                ].join(" ")}
                aria-hidden
              />
              {selected && !reduced ? (
                <motion.span
                  layoutId="company-story-tick"
                  className="pointer-events-none absolute inset-x-1 inset-y-0 rounded-lg border border-orange/35 bg-orange/5"
                  transition={SPRING}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="relative mt-4 min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={beat.mark}
            role="tabpanel"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={SPRING}
            className="company-story-scrub__panel"
          >
            <p className="stat-label text-orange">{beat.year}</p>
            <h3 className="mt-1.5 text-lg font-bold tracking-tight text-fg sm:text-xl">{beat.title}</h3>
            <p className="copy mt-2 max-w-xl text-sm text-muted">{beat.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
