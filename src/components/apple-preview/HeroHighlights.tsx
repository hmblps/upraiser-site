import { motion } from "framer-motion";
import { EASE_OUT } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { ScrollLink } from "../ScrollLink";

/** Section jumpers only — no metrics (hero stats) or header nav duplicates */
const HIGHLIGHT_CHIPS = [
  { label: "Value", href: "#value" },
  { label: "Promise", href: "#promise" },
  { label: "Difference", href: "#difference" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
] as const;

export function HeroHighlights() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.68, ease: EASE_OUT }}
      className="mt-10 border-t border-border/60 pt-8"
    >
      <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
        Explore
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {HIGHLIGHT_CHIPS.map((chip) => (
          <ScrollLink
            key={chip.label}
            href={chip.href}
            className="hero-highlight-chip shrink-0 rounded-full border border-border bg-bg-card/60 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-light transition hover:border-orange/35 hover:bg-bg-card hover:text-fg"
          >
            {chip.label}
          </ScrollLink>
        ))}
      </div>
    </motion.div>
  );
}
