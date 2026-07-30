import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CRAFT_CONTENT, type CraftTabId } from "../data/innerPagesData";
import { ScrollLink } from "./ScrollLink";
import { SlideTabs } from "./SlideTabs";
import { StudioCraftVisual, studioCraftKind } from "./StudioCraftVisual";
import { BentoGrid, BentoGridItem } from "./magicui/BentoGrid";
import { useMode } from "./SectionHeader";
import { ModeContentTransition } from "./motion/ModeContentTransition";
import { useReducedMotion } from "../hooks/useReducedMotion";

const PANEL_SPRING = { type: "spring" as const, stiffness: 340, damping: 30, mass: 0.7 };

/**
 * The Craft — full-spectrum: Creative Lab + Proprietary Layer.
 * Growth → conversion / closed loop · Infrastructure → audit / invoice defense.
 */
export function Craft() {
  const reduced = useReducedMotion();
  const { mode } = useMode();
  const [activeId, setActiveId] = useState<CraftTabId>("creative-lab");
  const lead = CRAFT_CONTENT.byMode[mode].lead;

  return (
    <div className="depth-page depth-page--craft viewport-page">
      <div className="viewport-page__shell section-inner flex flex-col">
        <header className="viewport-page__intro shrink-0">
          <p className="section-label">{CRAFT_CONTENT.hero.badge}</p>
          <h1 className="section-title">{CRAFT_CONTENT.hero.h1}</h1>
          <ModeContentTransition mode={mode}>
            <p className="section-description">{lead}</p>
          </ModeContentTransition>
        </header>

        <div className="viewport-page__tabs">
          <SlideTabs
            items={[...CRAFT_CONTENT.tabs]}
            activeId={activeId}
            onChange={(id) => setActiveId(id as CraftTabId)}
            layoutId="craft-tab-pill"
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
              {activeId === "creative-lab" ? (
                <>
                  <p className="stat-label shrink-0 text-orange">
                    {CRAFT_CONTENT.creativeLab.metaphor}
                  </p>
                  <p className="panel-lede shrink-0">
                    {CRAFT_CONTENT.creativeLab.byMode[mode].lead}
                  </p>
                  <BentoGrid className="mt-3 min-h-0 flex-1 auto-rows-[minmax(0,1fr)] overflow-hidden md:grid-cols-3 md:gap-3">
                    {CRAFT_CONTENT.creativeLab.items.map((item) => (
                      <BentoGridItem
                        key={item.title}
                        title={item.title}
                        description={item.description}
                        className="min-h-0 overflow-hidden p-3"
                        header={<StudioCraftVisual kind={studioCraftKind(item.title)} />}
                      />
                    ))}
                  </BentoGrid>
                </>
              ) : (
                <>
                  <p className="stat-label shrink-0 text-orange">
                    {CRAFT_CONTENT.proprietary.metaphor}
                  </p>
                  <p className="panel-lede shrink-0">
                    {CRAFT_CONTENT.proprietary.byMode[mode].lead}
                  </p>
                  <ul className="depth-feature-list min-h-0 flex-1 overflow-hidden">
                    {CRAFT_CONTENT.proprietary.points.map((point, index) => (
                      <li key={point.title} className="depth-feature-row">
                        <span className="depth-feature-row__index" aria-hidden>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="depth-feature-row__body">
                          <p className="depth-feature-row__title">{point.title}</p>
                          <p className="depth-feature-row__text">{point.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <ScrollLink
                href={`/contact?intent=${CRAFT_CONTENT.close.contactIntent}`}
                data-cursor="cta"
                className="btn-caps btn-caps--primary viewport-page__cta"
              >
                {CRAFT_CONTENT.close.ctaLabel}
              </ScrollLink>
              <p className="viewport-page__footnote">
                {CRAFT_CONTENT.close.footnote}{" "}
                <ScrollLink href="/solutions">The Routes →</ScrollLink>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
