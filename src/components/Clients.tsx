import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CLIENTS_CONTENT } from "../data/innerPagesData";
import { clientBrands } from "../data/clients";
import { ScrollLink } from "./ScrollLink";
import { cn } from "../lib/cn";
import { useReducedMotion } from "../hooks/useReducedMotion";

type VerticalFilter = (typeof CLIENTS_CONTENT.verticals)[number];

/**
 * Clients — Saatchi-style proof board in one viewport.
 */
export function Clients() {
  const reduced = useReducedMotion();
  const [vertical, setVertical] = useState<VerticalFilter>("All");

  const grid = useMemo(() => {
    if (vertical === "All") return clientBrands;
    return clientBrands.filter((brand) => brand.vertical === vertical);
  }, [vertical]);

  return (
    <div className="depth-page depth-page--clients viewport-page">
      <div className="viewport-page__shell section-inner flex flex-col">
        <header className="viewport-page__intro shrink-0">
          <p className="section-label">{CLIENTS_CONTENT.hero.badge}</p>
          <h1 className="section-title max-w-3xl">{CLIENTS_CONTENT.hero.h1}</h1>
          <p className="copy mt-2 max-w-xl text-sm text-muted">{CLIENTS_CONTENT.lead}</p>
        </header>

        <div className="viewport-page__tabs shrink-0 border-b border-border/50 py-2">
          <div className="flex gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CLIENTS_CONTENT.verticals.map((item) => {
              const active = item === vertical;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setVertical(item)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] transition",
                    active
                      ? "bg-orange text-on-accent"
                      : "border border-border/60 text-muted hover:border-orange/40 hover:text-fg",
                  )}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="viewport-page__panel relative flex min-h-0 flex-1 flex-col overflow-hidden pt-3">
          <ul className="grid min-h-0 flex-1 auto-rows-fr grid-cols-3 gap-2 overflow-hidden sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 lg:gap-3">
            {grid.slice(0, 24).map((brand, index) => (
              <motion.li
                key={brand.slug}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 30,
                  delay: reduced ? 0 : index * 0.015,
                }}
                className="flex min-h-0 items-center justify-center rounded-xl border border-border/50 bg-bg-card/60 px-2 py-2 sm:px-3"
              >
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-h-8 max-w-full object-contain opacity-90"
                    style={{ transform: `scale(${brand.scale ?? 1})` }}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="text-center text-[0.7rem] font-bold tracking-tight text-fg/80">
                    {brand.name}
                  </span>
                )}
              </motion.li>
            ))}
          </ul>

          <div className="mt-3 flex shrink-0 items-center justify-between gap-3">
            <p className="text-xs text-muted">
              {grid.length} brands
              {vertical !== "All" ? ` · ${vertical}` : ""}
              {" · "}
              <ScrollLink href="/expertise" className="font-semibold text-fg/75 hover:text-orange">
                Expertise
              </ScrollLink>
              {" · "}
              <ScrollLink href="/cases" className="font-semibold text-fg/75 hover:text-orange">
                Cases
              </ScrollLink>
            </p>
            <ScrollLink
              href="/contact"
              data-cursor="cta"
              className="btn-caps inline-block rounded-full bg-orange px-5 py-2.5 text-xs font-semibold text-on-accent"
            >
              {CLIENTS_CONTENT.ctaLabel}
            </ScrollLink>
          </div>
        </div>
      </div>
    </div>
  );
}
