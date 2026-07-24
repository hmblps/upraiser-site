import { lazy, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { primaryCta } from "../data/liveContent";
import {
  EXPERTISE_CONTENT,
  type ExpertiseClusterId,
} from "../data/innerPagesData";
import { mmpPartnerSlugs, partnersBySlugs } from "../data/partners";
import type { CSSProperties } from "react";
import { LazySection } from "../layouts/SiteLayout";
import { CaseProofIndex } from "../components/CaseProofIndex";
import { ClarityReconcile } from "../components/ClarityReconcile";
import { DepthCloseCta } from "../components/DepthCloseCta";
import { ExpertiseHub } from "../components/ExpertiseHub";
import { ExpertisePathStory } from "../components/ExpertisePathStory";
import { PageIntro } from "../components/PageIntro";
import { Reveal } from "../components/motion/Reveal";

const TrafficChannels = lazy(() =>
  import("../components/TrafficChannels").then((m) => ({ default: m.TrafficChannels })),
);

const CLUSTER_IDS: ExpertiseClusterId[] = ["media", "oem", "clarity"];

/** Map legacy Solutions / Measurement URLs into expertise clusters. */
function clusterFromParams(pillar: string | null, channel: string | null): ExpertiseClusterId {
  if (pillar && CLUSTER_IDS.includes(pillar as ExpertiseClusterId)) {
    return pillar as ExpertiseClusterId;
  }
  if (pillar === "performance" || pillar === "creators" || pillar === "premium") return "media";
  if (pillar === "oem") return "oem";
  if (pillar === "measurement" || pillar === "clarity") return "clarity";

  if (channel) {
    const match = EXPERTISE_CONTENT.clusters.find((c) =>
      (c.channelIds as readonly string[]).includes(channel),
    );
    if (match) return match.id;
    if (channel === "oem") return "oem";
  }
  return "media";
}

/**
 * Expertise canon:
 * Hero (type-first) → sticky cluster tabs → path story + channels
 * → Clarity receipt + wire + MMP → proof rows → CTA.
 */
export function ExpertisePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeId, setActiveId] = useState<ExpertiseClusterId>(() =>
    clusterFromParams(searchParams.get("pillar"), searchParams.get("channel")),
  );

  const activeCluster =
    EXPERTISE_CONTENT.clusters.find((c) => c.id === activeId) ?? EXPERTISE_CONTENT.clusters[0]!;

  const channelIds = useMemo(
    () => [...activeCluster.channelIds] as string[],
    [activeCluster],
  );

  useEffect(() => {
    setActiveId(clusterFromParams(searchParams.get("pillar"), searchParams.get("channel")));
  }, [searchParams]);

  useEffect(() => {
    if (channelIds.length === 0) return;
    const run = () => {
      void import("../components/TrafficChannels");
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(run, 500);
    return () => window.clearTimeout(t);
  }, [channelIds.length]);

  const selectCluster = useCallback(
    (id: ExpertiseClusterId, primaryChannel: string) => {
      setActiveId(id);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("pillar", id);
          if (id === "clarity") {
            next.delete("channel");
          } else {
            next.set("channel", primaryChannel);
          }
          return next;
        },
        { replace: true },
      );
      requestAnimationFrame(() => {
        const target = id === "clarity" ? "clarity" : "path-story";
        document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [setSearchParams],
  );

  return (
    <main className="site-main depth-page depth-page--expertise pt-[var(--site-header-height)]">
      <PageIntro
        label={EXPERTISE_CONTENT.hero.badge}
        title={EXPERTISE_CONTENT.hero.h1}
        description={EXPERTISE_CONTENT.hero.description}
        ctaLabel={primaryCta.label}
        ctaHref={primaryCta.href}
        secondaryLabel="Company"
        secondaryHref="/company"
        dense={false}
      />

      <ExpertiseHub activeId={activeCluster.id} onSelect={selectCluster} />

      <LazySection minHeight="32vh">
        <section className="section-band border-t border-border/40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ExpertisePathStory cluster={activeCluster} />
          </div>
        </section>
      </LazySection>

      {channelIds.length > 0 ? (
        <LazySection minHeight="36vh">
          <section id="channels" className="section-band border-t border-border/40">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <Reveal>
                <p className="section-label">Channels in this lane</p>
                <p className="copy mt-2 max-w-xl text-sm text-muted">
                  Inventory for {activeCluster.title}.
                </p>
              </Reveal>
              <div className="mt-6">
                <TrafficChannels variant="full" channelIds={channelIds} />
              </div>
            </div>
          </section>
        </LazySection>
      ) : null}

      <LazySection minHeight="44vh">
        <section id="clarity" className="section-band border-t border-border/40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Reveal>
              <p className="section-label">{EXPERTISE_CONTENT.claritySection.label}</p>
              <h2 className="section-title mt-3 max-w-2xl">{EXPERTISE_CONTENT.claritySection.title}</h2>
              <p className="copy mt-3 max-w-2xl text-sm text-muted">
                {EXPERTISE_CONTENT.claritySection.lead}
              </p>
            </Reveal>
            <div className="mt-10">
              <ClarityReconcile />
            </div>

            <Reveal delay={0.1} className="mt-16 border-t border-border/50 pt-12">
              <p className="section-label">{EXPERTISE_CONTENT.integrations.title}</p>
              <p className="copy mt-3 max-w-xl text-sm text-muted">
                {EXPERTISE_CONTENT.integrations.lead}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-8">
                {partnersBySlugs(mmpPartnerSlugs).map((partner) => (
                  <div
                    key={partner.slug}
                    className="partner-logo-slot"
                    style={{ "--logo-scale": partner.scale ?? 1 } as CSSProperties}
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="partner-logo"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      </LazySection>

      <LazySection minHeight="28vh">
        <CaseProofIndex
          label="Proof"
          title="Open a flight that already closed clean"
        />
      </LazySection>

      <DepthCloseCta
        title={EXPERTISE_CONTENT.close.title}
        description={EXPERTISE_CONTENT.close.description}
        ctaLabel={EXPERTISE_CONTENT.close.ctaLabel}
        contactIntent={activeCluster.contactIntent}
      />
    </main>
  );
}
