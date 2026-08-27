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

export function SlideTabs({ items, activeId, onChange, layoutId, className = "" }: SlideTabsProps) {
  const reduced = useReducedMotion();

  return (
    <div className={cn("slide-tabs relative inline-flex items-center p-1 bg-bg-elevated/30 backdrop-blur-md rounded-full border border-border/40", className)}>
      {items.map((item) => {
        const active = item.id === activeId;
        const classes = cn(
          "slide-tab relative inline-flex h-8 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-5 text-xs font-medium tracking-wide transition-colors z-10",
          active
            ? "slide-tab--active text-on-accent"
            : "text-fg-muted [@media(hover:hover)_and_(pointer:fine)]:hover:text-fg",
        );

        const highlight =
          active && !reduced ? (
            <motion.span
              layoutId={layoutId}
              className="slide-tab__pill absolute inset-0 rounded-full bg-accent shadow-sm"
              transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
            />
          ) : active ? (
            <span className="slide-tab__pill absolute inset-0 rounded-full bg-accent shadow-sm" aria-hidden />
          ) : null;

        if (item.href) {
          return (
            <motion.a 
              key={item.id} 
              href={item.href} 
              className={classes}
              whileTap={reduced ? undefined : { scale: 0.95 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            >
              {highlight}
              <span className="relative z-20">{item.label}</span>
            </motion.a>
          );
        }

        return (
          <motion.button
            key={item.id}
            type="button"
            data-tab-id={item.id}
            onClick={() => onChange(item.id)}
            className={classes}
            whileTap={reduced ? undefined : { scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
          >
            {highlight}
            <span className="relative z-20">{item.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
