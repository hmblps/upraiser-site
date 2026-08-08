import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { aboutPage } from "../data/liveContent";
import { SPRING_SOFT } from "../lib/motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { cn } from "../lib/cn";

type FaqItem = { question: string; answer: string };

type AboutFaqProps = {
  heading?: string;
  items?: FaqItem[];
  compact?: boolean;
};

/** FAQ accordion — spring open, one panel at a time. */
export function AboutFaq({
  heading = aboutPage.faqHeading,
  items = [...aboutPage.faq],
  compact = false,
}: AboutFaqProps) {
  const reduced = useReducedMotion();
  const visible = compact ? items.slice(0, 4) : items;
  const [openId, setOpenId] = useState<string | null>(visible[0]?.question ?? null);

  return (
    <div className={cn("about-faq h-full min-h-0 overflow-hidden", compact && "about-faq--compact")}>
      <p className="section-label">{heading}</p>
      <ul
        className={cn(
          "divide-y divide-border/50 border-y border-border/50",
          compact ? "mt-3" : "mt-5",
        )}
      >
        {visible.map((item) => {
          const isOpen = openId === item.question;
          return (
            <li key={item.question}>
              <button
                type="button"
                aria-expanded={isOpen}
                data-cursor="link"
                className={cn(
                  "flex w-full items-start justify-between gap-6 text-left",
                  compact ? "py-2.5" : "py-5",
                )}
                onClick={() => setOpenId(isOpen ? null : item.question)}
              >
                <span
                  className={cn(
                    "font-semibold text-fg",
                    compact ? "text-xs sm:text-sm" : "text-sm sm:text-[0.9375rem]",
                  )}
                >
                  {item.question}
                </span>
                <motion.span
                  aria-hidden
                  className="mt-0.5 shrink-0 text-lg leading-none text-muted"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={reduced ? { duration: 0 } : SPRING_SOFT}
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    key="panel"
                    initial={reduced ? false : { gridTemplateRows: "0fr", opacity: 0 }}
                    animate={{ gridTemplateRows: "1fr", opacity: 1 }}
                    exit={reduced ? undefined : { gridTemplateRows: "0fr", opacity: 0 }}
                    transition={reduced ? { duration: 0 } : SPRING_SOFT}
                    className="grid"
                  >
                    <div className="overflow-hidden">
                    <p
                      className={cn(
                        "copy accordion-panel pr-10 text-muted",
                      )}
                    >
                      {item.answer}
                    </p>
                  </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
