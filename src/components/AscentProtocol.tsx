import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ASCENT_PROTOCOLS } from "../data/innerPagesData";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { SPRING_SOFT } from "../lib/motion";

export function AscentProtocol() {
  const reduced = useReducedMotion();
  const [openNumber, setOpenNumber] = useState<string | null>("PROT-01");

  return (
    <div className="ascent-protocol h-full min-h-0 overflow-y-auto pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <ul className="divide-y divide-border/30 border-y border-border/30 pb-12">
        {ASCENT_PROTOCOLS.map((item) => {
          const isOpen = openNumber === item.protocolNumber;
          return (
            <li key={item.protocolNumber} className="relative">
              <button
                type="button"
                aria-expanded={isOpen}
                data-cursor="link"
                className="flex w-full items-start justify-between gap-4 py-5 text-left select-none touch-manipulation min-h-[44px]"
                onClick={() => setOpenNumber(isOpen ? null : item.protocolNumber)}
              >
                <div className="flex flex-1 items-start gap-4 sm:gap-6 min-w-0">
                  <span className="font-mono text-xs font-semibold tracking-wider text-orange shrink-0 pt-0.5 select-none w-14 sm:w-16">
                    {item.protocolNumber}
                  </span>
                  <span className="font-sans text-sm sm:text-base font-bold leading-snug text-fg flex-1">
                    {item.question}
                  </span>
                </div>
                
                <motion.span
                  aria-hidden
                  className="mt-0.5 shrink-0 text-xl font-light leading-none text-muted w-6 text-center select-none"
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
                    <div className="pl-14 sm:pl-[5.25rem] pb-5">
                      <p className="font-sans text-xs sm:text-sm leading-relaxed text-muted-light max-w-3xl">
                        {item.answer}
                      </p>
                      
                      <div className="mt-3.5 flex">
                        <span className="inline-flex items-center gap-1.5 rounded border border-orange/20 bg-orange/5 px-2.5 py-1 font-mono text-[0.6875rem] font-semibold text-orange-light">
                          <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" aria-hidden />
                          {item.ogilvyProof}
                        </span>
                      </div>
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
