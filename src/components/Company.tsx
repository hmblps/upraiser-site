import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { primaryCta } from "../data/liveContent";
import { COMPANY_CONTENT } from "../data/innerPagesData";
import { clientBrands } from "../data/clients";
import { AscentProtocol } from "./AscentProtocol";
import { CompanyFootprint } from "./CompanyFootprint";
import { CompanyStoryTimeline } from "./CompanyStoryTimeline";
import { LenovoProofStrip } from "./LenovoProofStrip";
import { ScrollLink } from "./ScrollLink";
import { SlideTabs } from "./SlideTabs";
import { useReducedMotion } from "../hooks/useReducedMotion";

const PANEL_SPRING = { type: "spring" as const, stiffness: 340, damping: 30, mass: 0.7 };

const TABS = [
  { id: "story", label: "Story" },
  { id: "footprint", label: "Footprint" },
  { id: "protocol", label: "Protocol" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const CLIENT_PREVIEW = clientBrands.filter((b) => b.logo).slice(0, 18);

/**
 * About — Saatchi-style tabs in one viewport.
 * Home / Cases carousel untouched elsewhere.
 */
export function Company() {
  const reduced = useReducedMotion();
  const [activeId, setActiveId] = useState<TabId>("story");

  return (
    <div className="depth-page depth-page--company viewport-page">
      <div className="viewport-page__shell section-inner flex flex-col">
        <header className="viewport-page__intro shrink-0">
          <p className="section-label">{COMPANY_CONTENT.hero.badge}</p>
          <h1 className="section-title">{COMPANY_CONTENT.hero.h1}</h1>
          <p className="section-description">{COMPANY_CONTENT.hero.description}</p>
        </header>

        <div className="viewport-page__tabs">
          <SlideTabs
            items={[...TABS]}
            activeId={activeId}
            onChange={(id) => setActiveId(id as TabId)}
            layoutId="company-tab-pill"
            className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          />
        </div>

        <div className="viewport-page__panel relative min-h-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={PANEL_SPRING}
              className="h-full min-h-0 overflow-hidden"
            >
              {activeId === "story" ? (
                <div className="grid h-full min-h-0 gap-5 overflow-hidden lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                  <CompanyStoryTimeline />
                  <div className="flex min-h-0 flex-col justify-between gap-4 overflow-hidden">
                    <div className="min-h-0 space-y-3 overflow-hidden">
                      <p className="panel-lede">{COMPANY_CONTENT.expedition.synergy}</p>
                      <p className="panel-lede">{COMPANY_CONTENT.expedition.uniqueness}</p>
                      <p className="copy font-semibold text-fg">
                        {COMPANY_CONTENT.philosophy.text}{" "}
                        <span className="text-orange">{COMPANY_CONTENT.expedition.proofLine}</span>
                      </p>
                    </div>
                    <div className="shrink-0 space-y-3">
                      <LenovoProofStrip variant="inline" />
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <ScrollLink
                          href={primaryCta.href}
                          data-cursor="cta"
                          className="btn-caps btn-caps--primary"
                        >
                          {COMPANY_CONTENT.close.ctaLabel}
                        </ScrollLink>
                        <Link to="/clients" className="link-quiet">
                          See clients →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}


              {activeId === "footprint" ? <CompanyFootprint embedded /> : null}

              {activeId === "protocol" ? (
                <div className="h-full min-h-0 overflow-hidden">
                  <AscentProtocol />
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
