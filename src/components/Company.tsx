import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { primaryCta } from "../data/liveContent";
import { COMPANY_CONTENT } from "../data/innerPagesData";
import { clientBrands } from "../data/clients";
import { AboutFaq } from "./AboutFaq";
import { CompanyFootprint } from "./CompanyFootprint";
import { CompanyStoryTimeline } from "./CompanyStoryTimeline";
import { LenovoProofStrip } from "./LenovoProofStrip";
import { ScrollLink } from "./ScrollLink";
import { SlideTabs } from "./SlideTabs";
import { useReducedMotion } from "../hooks/useReducedMotion";

const PANEL_SPRING = { type: "spring" as const, stiffness: 340, damping: 30, mass: 0.7 };

const TABS = [
  { id: "story", label: "Story" },
  { id: "clients", label: "Clients" },
  { id: "compliance", label: "Compliance" },
  { id: "footprint", label: "Footprint" },
  { id: "faq", label: "FAQ" },
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
          <h1 className="section-title max-w-3xl">{COMPANY_CONTENT.hero.h1}</h1>
        </header>

        <div className="viewport-page__tabs shrink-0 border-b border-border/50 py-2">
          <SlideTabs
            items={[...TABS]}
            activeId={activeId}
            onChange={(id) => setActiveId(id as TabId)}
            layoutId="company-tab-pill"
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
              className="h-full min-h-0 overflow-hidden"
            >
              {activeId === "story" ? (
                <div className="grid h-full min-h-0 gap-5 overflow-hidden lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                  <CompanyStoryTimeline />
                  <div className="flex min-h-0 flex-col justify-between gap-4 overflow-hidden">
                    <LenovoProofStrip variant="inline" />
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <ScrollLink
                        href={primaryCta.href}
                        data-cursor="cta"
                        className="btn-caps inline-block self-start rounded-full bg-orange px-5 py-2.5 text-xs font-semibold text-on-accent"
                      >
                        {COMPANY_CONTENT.close.ctaLabel}
                      </ScrollLink>
                      <Link
                        to="/clients"
                        className="text-xs font-semibold text-muted underline-offset-4 transition hover:text-orange hover:underline"
                      >
                        See clients →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null}

              {activeId === "clients" ? (
                <div className="flex h-full min-h-0 flex-col overflow-hidden">
                  <div className="flex shrink-0 flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="stat-label text-orange">Who we buy for</p>
                      <p className="copy mt-1.5 max-w-xl text-sm text-muted">
                        iGaming, fintech, gaming, marketplace — brands that need receipts, not decks.
                      </p>
                    </div>
                    <p className="text-[0.65rem] uppercase tracking-[0.08em] text-muted">
                      {CLIENT_PREVIEW.length} marks
                    </p>
                  </div>
                  <ul className="mt-3 grid min-h-0 flex-1 auto-rows-fr grid-cols-3 gap-2 overflow-hidden sm:grid-cols-4 md:grid-cols-6">
                    {CLIENT_PREVIEW.map((brand) => (
                      <li
                        key={brand.slug}
                        className="flex min-h-0 items-center justify-center rounded-xl border border-border/50 bg-bg-card/60 px-2 py-2 sm:px-3"
                      >
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="max-h-8 max-w-[85%] object-contain opacity-90"
                          style={{ transform: `scale(${brand.scale ?? 1})` }}
                          loading="lazy"
                          decoding="async"
                        />
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2">
                    <Link
                      to="/clients"
                      data-cursor="cta"
                      className="btn-caps inline-block rounded-full bg-orange px-5 py-2.5 text-xs font-semibold text-on-accent"
                    >
                      Open clients board
                    </Link>
                  </div>
                </div>
              ) : null}

              {activeId === "compliance" ? (
                <div className="grid h-full min-h-0 gap-5 overflow-hidden lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                  <ul className="depth-feature-list min-h-0 overflow-hidden">
                    {COMPANY_CONTENT.compliance.map((item, index) => (
                      <li key={item.title} className="depth-feature-row">
                        <span className="depth-feature-row__index" aria-hidden>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="depth-feature-row__body">
                          <h3 className="depth-feature-row__title">{item.title}</h3>
                          <p className="depth-feature-row__text line-clamp-2">{item.value}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="about-registry min-h-0 overflow-hidden">
                    {COMPANY_CONTENT.facts.map((fact) => (
                      <div key={fact.label} className="about-registry__field">
                        <p className="about-registry__label">{fact.label}</p>
                        <p className="about-registry__value">{fact.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeId === "footprint" ? <CompanyFootprint embedded /> : null}

              {activeId === "faq" ? (
                <div className="h-full min-h-0 overflow-hidden">
                  <AboutFaq
                    heading={COMPANY_CONTENT.faqHeading}
                    items={[...COMPANY_CONTENT.faq]}
                    compact
                  />
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
