import { lazy, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { solutionsHub, solutionsPage, primaryCta } from "../data/liveContent";
import { PERFORMANCE_CONTENT } from "../data/performanceData";
import { LazySection } from "../layouts/SiteLayout";
import { CaseMetricMatrix } from "../components/CaseMetricMatrix";
import { DepthCloseCta } from "../components/DepthCloseCta";
import { PageIntro } from "../components/PageIntro";
import { PhilosophyBand } from "../components/PhilosophyBand";
import { SolutionPathStory } from "../components/SolutionPathStory";
import { SolutionsHub } from "../components/SolutionsHub";
import { TechSpotlightBand } from "../components/TechSpotlightBand";
import { TrustMarquee } from "../components/TrustMarquee";
import { Reveal } from "../components/motion/Reveal";

const TrafficChannels = lazy(() =>
  import("../components/TrafficChannels").then((m) => ({ default: m.TrafficChannels })),
);

function pillarFromParams(pillar: string | null, channel: string | null) {
  if (pillar && solutionsHub.categories.some((c) => c.id === pillar)) return pillar;
  if (channel) {
    const match = solutionsHub.categories.find((c) =>
      (c.channelIds as readonly string[]).includes(channel),
    );
    if (match) return match.id;
  }
  return solutionsHub.categories[0]!.id;
}

/**
 * Solutions — Saatchi services IA in UPRAISER style.
 * Hero → trust → philosophy → path spine → tech → proof → CTA.
 * No Home / Cases / Contact edits.
 */
export function SolutionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePillarId, setActivePillarId] = useState(() =>
    pillarFromParams(searchParams.get("pillar"), searchParams.get("channel")),
  );

  const activePillar =
    solutionsHub.categories.find((c) => c.id === activePillarId) ?? solutionsHub.categories[0]!;

  const channelIds = useMemo(() => [...activePillar.channelIds] as string[], [activePillar]);

  useEffect(() => {
    setActivePillarId(pillarFromParams(searchParams.get("pillar"), searchParams.get("channel")));
  }, [searchParams]);

  useEffect(() => {
    const run = () => {
      void import("../components/TrafficChannels");
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(run, 500);
    return () => window.clearTimeout(t);
  }, []);

  const selectPillar = useCallback(
    (pillarId: string, primaryChannel: string) => {
      setActivePillarId(pillarId);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("pillar", pillarId);
          next.set("channel", primaryChannel);
          return next;
        },
        { replace: true },
      );
      requestAnimationFrame(() => {
        document.getElementById("path-story")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [setSearchParams],
  );

  const footer = PERFORMANCE_CONTENT.footerCta;

  return (
    <main className="site-main depth-page depth-page--solutions pt-[var(--site-header-height)]">
      <PageIntro
        label={solutionsPage.label}
        title={solutionsPage.title}
        description={solutionsPage.description}
        ctaLabel={solutionsPage.ctaLabel}
        ctaHref={primaryCta.href}
        secondaryLabel="Clarity"
        secondaryHref="/measurement"
        dense={false}
      />

      <TrustMarquee />
      <PhilosophyBand />

      <SolutionsHub activeId={activePillar.id} onSelect={selectPillar} />

      <LazySection minHeight="36vh">
        <section className="section-band section-band--ambience border-t border-border/40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SolutionPathStory pillar={activePillar} />
          </div>
        </section>
      </LazySection>

      <LazySection minHeight="36vh">
        <section className="section-band border-t border-border/40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Reveal>
              <p className="section-label">Channels in this path</p>
              <p className="copy mt-2 max-w-xl text-sm text-muted">
                Inventory for {activePillar.title}. Open a channel for the full write-up.
              </p>
            </Reveal>
            <div className="mt-6">
              <TrafficChannels variant="full" channelIds={channelIds} />
            </div>
          </div>
        </section>
      </LazySection>

      <TechSpotlightBand />
      <CaseMetricMatrix />

      <DepthCloseCta
        title={footer.title}
        description={footer.subtitle}
        ctaLabel={footer.buttonText}
        ctaHref={footer.buttonHref}
        contactIntent={activePillar.contactIntent}
      />
    </main>
  );
}
