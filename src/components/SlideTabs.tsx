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
    <div className={cn("slide-tabs relative flex gap-2", className)}>
      {items.map((item) => {
        const active = item.id === activeId;
        const classes = cn(
          "slide-tab relative inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-3.5 py-1.5 text-micro tracking-wide transition",
          active
            ? "slide-tab--active text-on-accent"
            : "border border-border text-muted-light [@media(hover:hover)_and_(pointer:fine)]:hover:border-fg/20 [@media(hover:hover)_and_(pointer:fine)]:hover:text-fg",
        );

        const highlight =
          active && !reduced ? (
            <motion.span
              layoutId={layoutId}
              className="slide-tab__pill absolute inset-0 rounded-full bg-accent"
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            />
          ) : active ? (
            <span className="slide-tab__pill absolute inset-0 rounded-full bg-accent" aria-hidden />
          ) : null;

        if (item.href) {
          return (
            <a key={item.id} href={item.href} className={classes}>
              {highlight}
              <span className="relative z-10">{item.label}</span>
            </a>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            data-tab-id={item.id}
            onClick={() => onChange(item.id)}
            className={classes}
          >
            {highlight}
            <span className="relative z-10">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
