import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { COMPANY_CONTENT, ASCENT_PROTOCOLS } from "../data/innerPagesData";
import { formatEventNames } from "../lib/formatEventNames";
import { SPRING_SOFT } from "../lib/motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { AscentCamps } from "./company/AscentCamps";
import { ScrollLink } from "./ScrollLink";

/**
 * The Expedition (/company) — short intro + ascent camps visual + lean FAQ.
 */
export function Company() {
  const { aboutExpedition } = COMPANY_CONTENT;
  const reduced = useReducedMotion();
  const [openNumber, setOpenNumber] = useState<string | null>(ASCENT_PROTOCOLS[0]?.protocolNumber ?? null);
  const faq = ASCENT_PROTOCOLS.slice(0, 4);

  return (
    <div className="depth-page depth-page--company viewport-page">
      <div className="viewport-page__shell section-inner flex min-h-0 flex-col gap-10 pt-8 pb-12 lg:gap-14 lg:pt-14">
        <header className="viewport-page__intro max-w-3xl shrink-0">
          <p className="section-label">{aboutExpedition.hero.label}</p>
          <h1 className="section-title section-title--compact mt-2 lg:mt-3">
            {aboutExpedition.hero.title}
          </h1>
          <p className="section-description mt-4 max-w-2xl lg:mt-5">
            {aboutExpedition.hero.text}
          </p>
        </header>

        <AscentCamps camps={aboutExpedition.camps} />

        <section className="ascent-faq mx-auto w-full max-w-3xl" aria-labelledby="ascent-faq-heading">
          <p className="section-label">Trail notes</p>
          <h2 id="ascent-faq-heading" className="section-heading section-heading--sm">
            Before You climb
          </h2>
          <ul className="mt-6 divide-y divide-border/30 border-y border-border/30">
            {faq.map((item) => {
              const isOpen = openNumber === item.protocolNumber;
              return (
                <li key={item.protocolNumber}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    data-cursor="link"
                    className="flex min-h-[44px] w-full select-none items-start justify-between gap-4 py-5 text-left touch-manipulation"
                    onClick={() => setOpenNumber(isOpen ? null : item.protocolNumber)}
                  >
                    <span className="flex-1 copy font-medium text-fg">
                      {item.question}
                    </span>
                    <motion.span
                      aria-hidden
                      className="mt-0.5 w-6 shrink-0 text-center text-xl font-light leading-none text-muted select-none"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={reduced ? { duration: 0 } : SPRING_SOFT}
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        key="answer"
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduced ? undefined : { height: 0, opacity: 0 }}
                        transition={reduced ? { duration: 0 } : SPRING_SOFT}
                        className="overflow-hidden"
                      >
                        <p className="copy pb-5">
                          {formatEventNames(item.answer)}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mx-auto w-full max-w-3xl border-t border-border/40 pt-8 pb-4">
          <h2 className="section-heading section-heading--sm">{aboutExpedition.cta.title}</h2>
          <p className="copy mt-2 max-w-xl">
            {aboutExpedition.cta.text}
          </p>
          <ScrollLink
            href="/contact"
            data-cursor="cta"
            className="btn-caps btn-caps--primary mt-5 inline-flex min-h-[44px] items-center justify-center rounded-full px-7 py-3 touch-manipulation"
          >
            {aboutExpedition.cta.button}
          </ScrollLink>
        </section>
      </div>
    </div>
  );
}
