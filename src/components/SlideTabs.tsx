import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { cn } from "../lib/cn";

type Item = {
  id: string;
  label: string;
  href?: string;
};

type SlideTabsProps = {
  items: Item[];
  activeId: string;
  onChange: (id: string) => void;
  layoutId: string;
  className?: string;
};

const SPRING = { type: "spring" as const, bounce: 0.15, duration: 0.5 };

export function SlideTabs({ items, activeId, onChange, layoutId, className = "" }: SlideTabsProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      layout
      className={cn(
        "slide-tabs relative inline-flex items-center",
        "bg-bg-elevated/70 backdrop-blur-xl",
        "rounded-full border border-border/40 shadow-sm",
        className,
      )}
      style={{ padding: "0.15rem", gap: "1px" }}
      transition={SPRING}
    >
      {items.map((item) => {
        const active = item.id === activeId;

        const labelClasses = cn(
          "relative z-10 inline-flex h-6 shrink-0 items-center justify-center",
          "whitespace-nowrap px-3 text-[11px] font-bold tracking-wide uppercase",
          "touch-action-manipulation select-none transition-colors",
          active ? "text-on-accent" : "text-fg-muted",
        );

        // Pill lives OUTSIDE the button (sibling), mirroring HeaderIsland's <li> pattern.
        // This prevents inline-flex baseline from nudging the pill's layout position.
        const pill =
          active && !reduced ? (
            <motion.span
              layoutId={layoutId}
              className="absolute inset-0 rounded-full bg-accent shadow-sm"
              transition={SPRING}
              style={{ zIndex: 0 }}
            />
          ) : active ? (
            <span className="absolute inset-0 rounded-full bg-accent shadow-sm" aria-hidden style={{ zIndex: 0 }} />
          ) : null;

        if (item.href) {
          return (
            <div key={item.id} className="relative">
              {pill}
              <a href={item.href} className={labelClasses}>
                {item.label}
              </a>
            </div>
          );
        }

        return (
          <div key={item.id} className="relative">
            {pill}
            <motion.button
              type="button"
              data-tab-id={item.id}
              onClick={() => onChange(item.id)}
              className={labelClasses}
              whileTap={reduced ? undefined : { scale: 0.94 }}
              transition={SPRING}
            >
              {item.label}
            </motion.button>
          </div>
        );
      })}
    </motion.div>
  );
}
