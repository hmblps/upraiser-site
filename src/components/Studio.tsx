import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GEAR_CONTENT, type GearTabId } from "../data/innerPagesData";
import { ScrollLink } from "./ScrollLink";
import { SlideTabs } from "./SlideTabs";
import { useMode } from "./SectionHeader";
import { ModeContentTransition } from "./motion/ModeContentTransition";
import { useReducedMotion } from "../hooks/useReducedMotion";

const PANEL_SPRING = { type: "spring" as const, stiffness: 340, damping: 30, mass: 0.7 };
const HOVER_SPRING = { type: "spring" as const, stiffness: 420, damping: 28, mass: 0.55 };

/**
 * The Gear (/studio) — tech stack as expedition equipment.
 * Growth → scalability · Infrastructure → audit / precision.
 */
export function Studio() {
  const reduced = useReducedMotion();
  const { mode } = useMode();
  const [activeId, setActiveId] = useState<GearTabId>("fixed-line");
  const piece = GEAR_CONTENT.pieces[activeId];
  const copy = piece[mode];
  const lead = GEAR_CONTENT.byMode[mode].lead;

  return (
    <div className="depth-page depth-page--studio depth-page--gear viewport-page">
      <div className="viewport-page__shell section-inner flex flex-col">
        <header className="viewport-page__intro shrink-0">
          <p className="section-label">{GEAR_CONTENT.hero.badge}</p>
          <h1 className="section-title">{GEAR_CONTENT.hero.h1}</h1>
          <ModeContentTransition mode={mode}>
            <p className="section-description">{lead}</p>
          </ModeContentTransition>
        </header>

        <div className="viewport-page__tabs">
          <SlideTabs
            items={[...GEAR_CONTENT.tabs]}
            activeId={activeId}
            onChange={(id) => setActiveId(id as GearTabId)}
            layoutId="gear-tab-pill"
            className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          />
        </div>

        <div className="viewport-page__panel relative min-h-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeId}-${mode}`}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={PANEL_SPRING}
              className="flex h-full min-h-0 flex-col overflow-hidden"
            >
              <motion.article
                className="gear-spec flex min-h-0 flex-1 flex-col overflow-hidden"
                whileHover={reduced ? undefined : { y: -2 }}
                transition={HOVER_SPRING}
              >
                <div className="gear-spec__blueprint" aria-hidden>
                  <span className="gear-spec__grid" />
                  <span className="gear-spec__crosshair gear-spec__crosshair--tl" />
                  <span className="gear-spec__crosshair gear-spec__crosshair--br" />
                </div>

                <div className="gear-spec__body">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="stat-label text-orange">{piece.mark}</span>
                    <span className="text-micro text-muted">{piece.kicker}</span>
                  </div>
                  <h2 className="card-title mt-2">{piece.title}</h2>
                  <p className="copy mt-3 max-w-2xl">{copy.body}</p>

                  <div className="gear-spec__sheet">
                    <p className="text-micro text-orange">
                      {mode === "growth" ? "Scale spec" : "Audit spec"}
                    </p>
                    <p className="spec-mono">{copy.spec}</p>
                  </div>
                </div>
              </motion.article>

              <ScrollLink
                href={`/contact?intent=${GEAR_CONTENT.close.contactIntent}`}
                data-cursor="cta"
                className="btn-caps btn-caps--primary viewport-page__cta"
              >
                {GEAR_CONTENT.close.ctaLabel}
              </ScrollLink>
              <p className="viewport-page__footnote">
                {GEAR_CONTENT.close.footnote}{" "}
                <ScrollLink href="/solutions">The Routes →</ScrollLink>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
