import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

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
    <div className={`slide-tabs relative flex gap-2 ${className}`.trim()}>
      {items.map((item) => {
        const active = item.id === activeId;
        const classes = `slide-tab relative shrink-0 rounded-full px-3.5 py-1.5 text-micro tracking-wide transition ${
          active ? "text-on-accent" : "border border-border text-muted-light hover:border-fg/20 hover:text-fg"
        }`;

        const highlight = active && !reduced ? (
          <motion.span
            layoutId={layoutId}
            className="absolute inset-0 rounded-full bg-orange"
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
          />
        ) : active ? (
          <span className="absolute inset-0 rounded-full bg-orange" aria-hidden />
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
          <button key={item.id} type="button" onClick={() => onChange(item.id)} className={classes}>
            {highlight}
            <span className="relative z-10">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
