import type { CSSProperties, ReactElement, ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * Adapted from DavidHDev/react-bits GlassIcons (TS + Tailwind).
 * https://reactbits.dev/components/glass-icons
 * Copy-paste component — reactbits.dev is not the npm package `react-bits`.
 */

export interface GlassIconsItem {
  icon: ReactElement;
  color: string;
  label: string;
  customClass?: string;
}

export interface GlassIconsProps {
  items: GlassIconsItem[];
  className?: string;
}

const gradientMapping: Record<string, string> = {
  blue: "linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))",
  purple: "linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))",
  red: "linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))",
  indigo: "linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))",
  orange: "linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))",
  green: "linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))",
  /** Brand gold — default for UPRAISER */
  gold: "linear-gradient(hsl(45, 92%, 48%), hsl(38, 88%, 42%))",
};

function getBackgroundStyle(color: string): CSSProperties {
  if (gradientMapping[color]) return { background: gradientMapping[color] };
  return { background: color };
}

const SPRING = { type: "spring", stiffness: 420, damping: 28 } as const;

/** Single glass icon — for embedding in cards */
export function GlassIcon({
  icon,
  color = "gold",
  label,
  className = "",
  showLabel = false,
  size = "md",
}: {
  icon: ReactNode;
  color?: string;
  label: string;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}) {
  const sizeClass = size === "sm" ? "w-[2.75em] h-[2.75em] text-[0.95rem]" : "w-[4.5em] h-[4.5em]";

  return (
    <motion.span
      role="img"
      aria-label={label}
      className={`glass-icon relative block bg-transparent outline-none border-none ${sizeClass} [perspective:24em] [transform-style:preserve-3d] group ${className}`}
      whileHover={{ scale: 1.04 }}
      transition={SPRING}
    >
      <span
        className="glass-icon-back absolute top-0 left-0 w-full h-full rounded-[1.15em] block transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[100%_100%] rotate-[15deg] [will-change:transform] group-hover:[transform:rotate(25deg)_translate3d(-0.35em,-0.35em,0.35em)]"
        style={{
          ...getBackgroundStyle(color),
          boxShadow: "0.35em -0.35em 0.55em hsla(223, 10%, 10%, 0.12)",
        }}
      />
      <span
        className="glass-icon-face absolute top-0 left-0 w-full h-full rounded-[1.15em] bg-[hsla(0,0%,100%,0.14)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[80%_50%] flex backdrop-blur-[0.75em] [will-change:transform] transform group-hover:[transform:translate3d(0,0,1.5em)]"
        style={{ boxShadow: "0 0 0 0.08em hsla(0, 0%, 100%, 0.28) inset" }}
      >
        <span className="m-auto flex w-[1.35em] h-[1.35em] items-center justify-center text-white [&_svg]:h-full [&_svg]:w-full" aria-hidden>
          {icon}
        </span>
      </span>
      {showLabel ? (
        <span className="absolute top-full left-0 right-0 text-center whitespace-nowrap leading-[2] text-sm opacity-0 transition-[opacity,transform] duration-300 translate-y-0 group-hover:opacity-100 group-hover:[transform:translateY(20%)]">
          {label}
        </span>
      ) : null}
    </motion.span>
  );
}

export default function GlassIcons({ items, className }: GlassIconsProps) {
  return (
    <div className={`grid gap-[5em] grid-cols-2 md:grid-cols-3 mx-auto py-[3em] overflow-visible ${className || ""}`}>
      {items.map((item, index) => (
        <button
          key={`${item.label}-${index}`}
          type="button"
          aria-label={item.label}
          className={`relative bg-transparent outline-none border-none cursor-pointer w-[4.5em] h-[4.5em] [perspective:24em] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] group ${
            item.customClass || ""
          }`}
        >
          <span
            className="absolute top-0 left-0 w-full h-full rounded-[1.25em] block transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[100%_100%] rotate-[15deg] [will-change:transform] group-hover:[transform:rotate(25deg)_translate3d(-0.5em,-0.5em,0.5em)]"
            style={{
              ...getBackgroundStyle(item.color),
              boxShadow: "0.5em -0.5em 0.75em hsla(223, 10%, 10%, 0.15)",
            }}
          />
          <span
            className="absolute top-0 left-0 w-full h-full rounded-[1.25em] bg-[hsla(0,0%,100%,0.15)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[80%_50%] flex backdrop-blur-[0.75em] [will-change:transform] transform group-hover:[transform:translate3d(0,0,2em)]"
            style={{ boxShadow: "0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset" }}
          >
            <span className="m-auto w-[1.5em] h-[1.5em] flex items-center justify-center text-white [&_svg]:h-full [&_svg]:w-full" aria-hidden>
              {item.icon}
            </span>
          </span>
          <span className="absolute top-full left-0 right-0 text-center whitespace-nowrap leading-[2] text-base opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] translate-y-0 group-hover:opacity-100 group-hover:[transform:translateY(20%)]">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
