import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { cn } from "../lib/cn";

const LINE_SPRING = { type: "spring" as const, stiffness: 120, damping: 22, mass: 0.8 };
const CHAR_SPRING = { type: "spring" as const, stiffness: 280, damping: 26, mass: 0.55 };

type StaggeredTextRevealProps = {
  lines: readonly {
    text: string;
    accent?: boolean;
    suffix?: string;
  }[];
  className?: string;
  as?: "h1" | "h2";
};

/**
 * Line + character stagger for hero titles.
 * Reduced motion → instant full text.
 */
export function StaggeredTextReveal({ lines, className, as: Tag = "h1" }: StaggeredTextRevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line.accent ? <span className="hero-title-accent">{line.text}</span> : line.text}
            {line.suffix}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      {lines.map((line, lineIndex) => (
        <motion.span
          key={`${line.text}-${lineIndex}`}
          className="hero-stagger-line block overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.018,
                delayChildren: 0.08 + lineIndex * 0.12,
              },
            },
          }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0.2 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ ...LINE_SPRING, delay: 0.05 + lineIndex * 0.1 }}
          >
            {Array.from(line.text).map((char, charIndex) => (
              <motion.span
                key={`${lineIndex}-${charIndex}`}
                className={cn("inline-block", line.accent && "hero-title-accent")}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0, transition: CHAR_SPRING },
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
            {line.suffix
              ? Array.from(line.suffix).map((char, charIndex) => (
                  <motion.span
                    key={`${lineIndex}-sfx-${charIndex}`}
                    className="inline-block"
                    variants={{
                      hidden: { opacity: 0, y: 14 },
                      visible: { opacity: 1, y: 0, transition: CHAR_SPRING },
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))
              : null}
          </motion.span>
        </motion.span>
      ))}
    </Tag>
  );
}
