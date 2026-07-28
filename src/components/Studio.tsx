import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { STUDIO_CONTENT, type StudioTabId } from "../data/innerPagesData";
import { ScrollLink } from "./ScrollLink";
import { SlideTabs } from "./SlideTabs";
import { StudioCraftVisual, studioCraftKind } from "./StudioCraftVisual";
import { BentoGrid, BentoGridItem } from "./magicui/BentoGrid";
import { useReducedMotion } from "../hooks/useReducedMotion";

const PANEL_SPRING = { type: "spring" as const, stiffness: 340, damping: 30, mass: 0.7 };

/** Three flagship craft surfaces — rest of the catalog lives in Formats. */
const CRAFT_FLAGSHIP = STUDIO_CONTENT.craft.items.slice(0, 3);

/**
 * Studio — productized recipe per tab:
 * promise → 3 items/steps → one CTA.
 */
export function Studio() {
  const reduced = useReducedMotion();
  const [activeId, setActiveId] = useState<StudioTabId>("craft");

  return (
    <div className="depth-page depth-page--studio viewport-page">
      <div className="viewport-page__shell section-inner flex flex-col">
        <header className="viewport-page__intro shrink-0">
          <p className="section-label">{STUDIO_CONTENT.hero.badge}</p>
          <h1 className="section-title max-w-3xl">{STUDIO_CONTENT.hero.h1}</h1>
        </header>

        <div className="viewport-page__tabs shrink-0 border-b border-border/50 py-2">
          <SlideTabs
            items={[...STUDIO_CONTENT.tabs]}
            activeId={activeId}
            onChange={(id) => setActiveId(id as StudioTabId)}
            layoutId="studio-tab-pill"
            className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          />
        </div>

        <div className="viewport-page__panel relative min-h-0 flex-1 pt-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={PANEL_SPRING}
              className="flex h-full min-h-0 flex-col overflow-hidden"
            >
              {activeId === "craft" ? (
                <>
                  <p className="stat-label shrink-0 text-orange">{STUDIO_CONTENT.craft.lead}</p>
                  <BentoGrid className="mt-3 min-h-0 flex-1 auto-rows-[minmax(0,1fr)] overflow-hidden md:grid-cols-3 md:gap-3">
                    {CRAFT_FLAGSHIP.map((item) => (
                      <BentoGridItem
                        key={item.title}
                        title={item.title}
                        description={item.description}
                        className="min-h-0 overflow-hidden p-3"
                        header={<StudioCraftVisual kind={studioCraftKind(item.title)} />}
                      />
                    ))}
                  </BentoGrid>
                  <ScrollLink
                    href={`/contact?intent=${STUDIO_CONTENT.close.contactIntent}`}
                    data-cursor="cta"
                    className="btn-caps mt-4 inline-block shrink-0 self-start rounded-full bg-orange px-5 py-2.5 text-xs font-semibold text-on-accent"
                  >
                    {STUDIO_CONTENT.close.ctaLabel}
                  </ScrollLink>
                  <p className="mt-2 shrink-0 text-[0.7rem] text-muted">
                    Ships into{" "}
                    <ScrollLink href="/expertise" className="font-semibold text-fg/80 hover:text-orange">
                      Expertise lanes
                    </ScrollLink>
                    {" · "}
                    <ScrollLink href="/clarity" className="font-semibold text-fg/80 hover:text-orange">
                      Clarity
                    </ScrollLink>
                  </p>
                </>
              ) : null}

              {activeId === "formats" ? (
                <>
                  <p className="stat-label shrink-0 text-orange">{STUDIO_CONTENT.formats.lead}</p>
                  <ul className="depth-feature-list mt-3 min-h-0 flex-1 overflow-hidden">
                    {STUDIO_CONTENT.formats.rows.map((row, index) => (
                      <li key={row.label} className="depth-feature-row">
                        <span className="depth-feature-row__index" aria-hidden>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="depth-feature-row__body">
                          <p className="depth-feature-row__title">{row.label}</p>
                          <p className="depth-feature-row__text line-clamp-2">{row.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <ScrollLink
                    href={`/contact?intent=${STUDIO_CONTENT.close.contactIntent}`}
                    data-cursor="cta"
                    className="btn-caps mt-4 inline-block shrink-0 self-start rounded-full bg-orange px-5 py-2.5 text-xs font-semibold text-on-accent"
                  >
                    {STUDIO_CONTENT.close.ctaLabel}
                  </ScrollLink>
                  <p className="mt-2 shrink-0 text-[0.7rem] text-muted">
                    Ships into{" "}
                    <ScrollLink href="/expertise" className="font-semibold text-fg/80 hover:text-orange">
                      Expertise lanes
                    </ScrollLink>
                    {" · "}
                    <ScrollLink href="/clarity" className="font-semibold text-fg/80 hover:text-orange">
                      Clarity
                    </ScrollLink>
                  </p>
                </>
              ) : null}

              {activeId === "production" ? (
                <>
                  <p className="stat-label shrink-0 text-orange">{STUDIO_CONTENT.production.lead}</p>
                  <ol className="mt-4 grid min-h-0 flex-1 gap-3 overflow-hidden sm:grid-cols-3">
                    {STUDIO_CONTENT.production.steps.map((step, index) => (
                      <li
                        key={step.title}
                        className="flex min-h-0 flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border/60 bg-bg-card/70 p-3"
                      >
                        <span className="text-xs font-bold tracking-widest text-orange">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="card-title mt-2 text-sm">{step.title}</h3>
                        <p className="copy mt-2 line-clamp-3 text-xs text-muted">{step.body}</p>
                      </li>
                    ))}
                  </ol>
                  <ScrollLink
                    href={`/contact?intent=${STUDIO_CONTENT.close.contactIntent}`}
                    data-cursor="cta"
                    className="btn-caps mt-4 inline-block shrink-0 self-start rounded-full bg-orange px-5 py-2.5 text-xs font-semibold text-on-accent"
                  >
                    {STUDIO_CONTENT.close.ctaLabel}
                  </ScrollLink>
                  <p className="mt-2 shrink-0 text-[0.7rem] text-muted">
                    Ships into{" "}
                    <ScrollLink href="/expertise" className="font-semibold text-fg/80 hover:text-orange">
                      Expertise lanes
                    </ScrollLink>
                    {" · "}
                    <ScrollLink href="/clarity" className="font-semibold text-fg/80 hover:text-orange">
                      Clarity
                    </ScrollLink>
                  </p>
                </>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
