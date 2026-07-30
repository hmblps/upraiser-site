import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { SPRING } from "../lib/motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const reduced = useReducedMotion();
  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={reduced ? undefined : { scale: 1.06 }}
      whileTap={reduced ? undefined : { scale: 0.94 }}
      transition={SPRING}
      className="theme-toggle flex h-11 w-11 items-center justify-center rounded-full border border-border/80 text-fg transition-colors [@media(hover:hover)_and_(pointer:fine)]:hover:border-orange/40 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-bg-card/60"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.span
        key={theme}
        initial={reduced ? false : { opacity: 0, rotate: -40, scale: 0.7 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={SPRING}
        className="inline-flex"
      >
        {isDark ? <Sun className="h-4 w-4" strokeWidth={2} /> : <Moon className="h-4 w-4" strokeWidth={2} />}
      </motion.span>
    </motion.button>
  );
}
