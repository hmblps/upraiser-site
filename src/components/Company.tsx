import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { COMPANY_CONTENT, ASCENT_PROTOCOLS } from "../data/innerPagesData";
import { formatEventNames } from "../lib/formatEventNames";
import { SPRING_SOFT } from "../lib/motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { AscentCamps } from "./company/AscentCamps";

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
          <p className="section-label text-accent">{aboutExpedition.hero.label}</p>
          <h1 className="section-title mt-2 text-4xl tracking-tight leading-[1.1] lg:mt-3 lg:text-5xl">
            {aboutExpedition.hero.title}
          </h1>
          <p className="section-description mt-4 max-w-2xl text-lg text-muted-light lg:mt-5">
            {aboutExpedition.hero.text}
          </p>
        </header>

        <AscentCamps camps={aboutExpedition.camps} />

        <section className="ascent-faq mx-auto w-full max-w-3xl" aria-labelledby="ascent-faq-heading">
          <p className="font-mono text-xs font-semibold tracking-wider text-accent">Trail notes</p>
          <h2 id="ascent-faq-heading" className="mt-2 font-sans text-xl font-bold text-fg sm:text-2xl">
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
                    <span className="flex-1 font-sans text-sm font-bold leading-snug text-fg sm:text-base">
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
                        <p className="pb-5 font-sans text-sm leading-relaxed text-muted-light sm:text-base">
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
          <h2 className="font-sans text-xl font-bold text-fg sm:text-2xl">{aboutExpedition.cta.title}</h2>
          <p className="mt-2 max-w-xl font-sans text-sm text-muted-light sm:text-base">
            {aboutExpedition.cta.text}
          </p>
          <button
            type="button"
            data-cursor="pointer"
            className="mt-5 inline-flex min-h-[44px] select-none items-center justify-center rounded bg-accent px-6 py-3 font-sans text-sm font-bold text-accent-fg touch-manipulation transition-colors hover:bg-accent/90 sm:text-base"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            {aboutExpedition.cta.button}
          </button>
        </section>
      </div>
    </div>
  );
}
