import { Children, useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type AnimatedListProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * MagicUI Animated List — spring stack reveal (framer-motion).
 * @see https://magicui.design/docs/components/animated-list
 */
export function AnimatedList({ children, className, delay = 1100 }: AnimatedListProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const childrenArray = useMemo(() => Children.toArray(children), [children]);

  useEffect(() => {
    if (reduced) {
      setIndex(Math.max(0, childrenArray.length - 1));
      return;
    }
    if (index >= childrenArray.length - 1) return;
    const timeout = window.setTimeout(() => setIndex((prev) => prev + 1), delay);
    return () => window.clearTimeout(timeout);
  }, [index, delay, childrenArray.length, reduced]);

  const itemsToShow = useMemo(() => {
    if (reduced) return [...childrenArray].reverse();
    return childrenArray.slice(0, index + 1).reverse();
  }, [index, childrenArray, reduced]);

  return (
    <div className={cn("flex flex-col items-stretch gap-2", className)}>
      <AnimatePresence initial={!reduced}>
        {itemsToShow.map((item) => {
          const key =
            typeof item === "object" && item !== null && "key" in item && item.key != null
              ? String(item.key)
              : String(item);
          return (
            <motion.div
              key={key}
              layout
              initial={reduced ? false : { scale: 0.92, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={reduced ? undefined : { scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 40 }}
              className="w-full origin-top"
            >
              {item}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
