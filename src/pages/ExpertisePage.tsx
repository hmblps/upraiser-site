import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate, useSearchParams } from "react-router-dom";
import {
  EXPERTISE_CONTENT,
  isExpertiseGrowthId,
  type ExpertiseClusterId,
} from "../data/innerPagesData";
import { ChannelBeam } from "../components/ChannelBeam";
import { ExpertiseHub } from "../components/ExpertiseHub";
import { ProofFrame } from "../components/ProofFrame";
import { ScrollLink } from "../components/ScrollLink";
import { useReducedMotion } from "../hooks/useReducedMotion";

const BUYING_IDS = EXPERTISE_CONTENT.tabs.map((t) => t.id) as ExpertiseClusterId[];

const PANEL_SPRING = { type: "spring" as const, stiffness: 340, damping: 30, mass: 0.7 };

function clusterFromParams(pillar: string | null, channel: string | null): ExpertiseClusterId {
  if (pillar === "clarity" || pillar === "measurement" || pillar === "oneview" || pillar === "data") {
    return "media";
  }
  if (pillar && BUYING_IDS.includes(pillar as ExpertiseClusterId)) {
    return pillar as ExpertiseClusterId;
  }
  if (pillar === "performance" || pillar === "app" || pillar === "app-growth") return "media";
  if (pillar === "premium") return "ctv";
  if (pillar === "influencer") return "creators";
  if (pillar === "paid-social") return "social";

  if (channel) {
    const match = EXPERTISE_CONTENT.clusters.find((c) =>
      (c.channelIds as readonly string[]).includes(channel),
    );
    if (match) return match.id;
  }
  return "media";
}

/** Legacy Expertise shell — App Growth inventory + OEM (routed via /expertise → /solutions). */
export function ExpertisePage() {
  const reduced = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();
  const resolved = clusterFromParams(searchParams.get("pillar"), searchParams.get("channel"));
  const [activeId, setActiveId] = useState<ExpertiseClusterId>(() => resolved);

  useEffect(() => {
    setActiveId(clusterFromParams(searchParams.get("pillar"), searchParams.get("channel")));
  }, [searchParams]);

  const selectCluster = useCallback(
    (id: ExpertiseClusterId, primaryChannel: string) => {
      setActiveId(id);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("pillar", id);
          next.set("channel", primaryChannel);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Prefer Solutions rail — keep this page only if something still deep-links here.
  if (searchParams.get("pillar") === "clarity") {
    return <Navigate to="/solutions" replace />;
  }

  const activeCluster =
    EXPERTISE_CONTENT.clusters.find((c) => c.id === activeId) ?? EXPERTISE_CONTENT.clusters[0]!;

  const related = activeCluster.related
    .map((id) => EXPERTISE_CONTENT.clusters.find((c) => c.id === id))
    .filter((lane): lane is NonNullable<typeof lane> => Boolean(lane));

  return (
    <main className="site-main depth-page depth-page--expertise viewport-page pt-[var(--site-header-height)]">
      <div className="viewport-page__shell section-inner flex flex-col">
        <header className="viewport-page__intro shrink-0">
          <p className="section-label">{EXPERTISE_CONTENT.hero.badge}</p>
          <h1 className="section-title max-w-3xl">{EXPERTISE_CONTENT.hero.h1}</h1>
        </header>

        <ExpertiseHub activeId={activeCluster.id} onSelect={selectCluster} />

        <div className="viewport-page__panel relative min-h-0 flex-1 pt-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCluster.id}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={PANEL_SPRING}
              className="grid h-full min-h-0 gap-5 overflow-hidden lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8"
            >
              <div className="flex min-h-0 flex-col overflow-hidden">
                <h2 className="card-title text-base sm:text-lg">{activeCluster.title}</h2>
                <p className="copy mt-2 max-w-xl text-sm text-muted">{activeCluster.problem}</p>
                <p className="copy mt-1.5 max-w-xl text-sm font-medium text-fg">{activeCluster.outcome}</p>

                <ul className="depth-feature-list mt-3 min-h-0 overflow-hidden">
                  {activeCluster.deliverables.slice(0, 3).map((item, index) => (
                    <li key={item} className="depth-feature-row">
                      <span className="depth-feature-row__index" aria-hidden>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="depth-feature-row__body">
                        <p className="depth-feature-row__text line-clamp-2">{item}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <ol className="mt-3 grid shrink-0 grid-cols-3 gap-2 border-t border-border/45 pt-3">
                  {activeCluster.process.map((step, index) => (
                    <li key={step.title} className="min-w-0">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-orange">
                        {String(index + 1).padStart(2, "0")} · {step.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-[0.7rem] leading-snug text-muted">{step.body}</p>
                    </li>
                  ))}
                </ol>

                <div className="mt-auto flex shrink-0 flex-col gap-2 pt-3">
                  <ScrollLink
                    href={`/contact?intent=${activeCluster.contactIntent}`}
                    data-cursor="cta"
                    className="btn-caps inline-block self-start rounded-full bg-orange px-5 py-2.5 text-xs font-semibold text-on-accent"
                  >
                    {EXPERTISE_CONTENT.close.ctaLabel}
                  </ScrollLink>
                  {related.length > 0 ? (
                    <p className="text-[0.7rem] text-muted">
                      Related:{" "}
                      {related.map((lane, index) => (
                        <span key={lane.id}>
                          {index > 0 ? " · " : null}
                          <button
                            type="button"
                            className="font-semibold text-fg/80 transition hover:text-orange"
                            onClick={() => selectCluster(lane.id, lane.primaryChannel)}
                          >
                            {lane.title}
                          </button>
                        </span>
                      ))}
                    </p>
                  ) : null}
                  {isExpertiseGrowthId(activeId) ? (
                    <p className="text-[0.65rem] text-muted/80">Same desk. Different supply path.</p>
                  ) : null}
                </div>
              </div>

              <div className="flex min-h-0 flex-col overflow-hidden">
                <ProofFrame label={activeCluster.title} meta="Live path" className="h-full min-h-0">
                  <ChannelBeam
                    className="h-full min-h-0 border-0 bg-transparent shadow-none"
                    nodes={"beam" in activeCluster ? [...(activeCluster.beam ?? [])] : []}
                    hubLabel={activeCluster.title}
                  />
                </ProofFrame>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
