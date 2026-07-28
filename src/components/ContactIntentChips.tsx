import { motion } from "framer-motion";
import { contactVerticalOptions } from "../data/liveContent";
import { SPRING_SOFT } from "../lib/motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { cn } from "../lib/cn";

type ContactIntentChipsProps = {
  value: string;
  onChange: (vertical: string) => void;
  disabled?: boolean;
};

/** Primary intents in the chip row — full list stays in the select. */
const CHIP_VALUES = new Set([
  "app-growth",
  "oem",
  "clarity",
  "studio",
  "brand",
  "careers",
]);

/** Let’s-Talk intent chips — syncs with the vertical select. */
export function ContactIntentChips({ value, onChange, disabled }: ContactIntentChipsProps) {
  const reduced = useReducedMotion();
  const options = contactVerticalOptions.filter((option) => CHIP_VALUES.has(option.value));

  return (
    <div>
      <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
        What brings You here
      </p>
      <div className="flex flex-wrap gap-2" role="listbox" aria-label="Contact intent">
        {options.map((option) => {
          const active = value === option.value;
          return (
            <motion.button
              key={option.value}
              type="button"
              role="option"
              aria-selected={active}
              disabled={disabled}
              data-cursor="link"
              className={cn(
                "rounded-full border px-3.5 py-2 text-xs font-semibold tracking-wide transition-colors",
                active
                  ? "border-orange bg-orange text-on-accent"
                  : "border-border bg-bg-card/40 text-muted-light hover:border-orange/35 hover:text-fg",
              )}
              whileTap={reduced || disabled ? undefined : { scale: 0.96 }}
              transition={SPRING_SOFT}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
