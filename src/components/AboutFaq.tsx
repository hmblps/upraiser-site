import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { aboutPage } from "../data/liveContent";
import { SPRING_SOFT } from "../lib/motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

type FaqItem = { question: string; answer: string };

type AboutFaqProps = {
  heading?: string;
  items?: FaqItem[];
};

/** FAQ accordion — spring open, one panel at a time. */
export function AboutFaq({
  heading = aboutPage.faqHeading,
  items = [...aboutPage.faq],
}: AboutFaqProps) {
  const reduced = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(items[0]?.question ?? null);

  return (
    <div className="about-faq">
      <p className="section-label">{heading}</p>
      <ul className="mt-5 divide-y divide-border/50 border-y border-border/50">
        {items.map((item) => {
          const isOpen = openId === item.question;
          return (
            <li key={item.question}>
              <button
                type="button"
                aria-expanded={isOpen}
                data-cursor="link"
                className="flex w-full items-start justify-between gap-6 py-5 text-left"
                onClick={() => setOpenId(isOpen ? null : item.question)}
              >
                <span className="text-sm font-semibold text-fg sm:text-[0.9375rem]">{item.question}</span>
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
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduced ? undefined : { height: 0, opacity: 0 }}
                    transition={reduced ? { duration: 0 } : SPRING_SOFT}
                    className="overflow-hidden"
                  >
                    <p className="copy accordion-panel pb-5 pr-10 text-sm text-muted">{item.answer}</p>
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
