import { lazy, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { solutionsHub, solutionsPage, primaryCta } from "../data/liveContent";
import { LazySection } from "../layouts/SiteLayout";
import { PageIntro } from "../components/PageIntro";
import { SolutionsHub } from "../components/SolutionsHub";

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
 * Solutions — pillar grid → filtered channel inventory.
 * Process / Difference / Audience stay on Home; measurement on /measurement.
 */
export function SolutionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePillarId, setActivePillarId] = useState(() =>
    pillarFromParams(searchParams.get("pillar"), searchParams.get("channel")),
  );

  const activePillar =
    solutionsHub.categories.find((c) => c.id === activePillarId) ?? solutionsHub.categories[0]!;

  const channelIds = useMemo(
    () => [...activePillar.channelIds] as string[],
    [activePillar],
  );

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
        document.getElementById("channels")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [setSearchParams],
  );

  return (
    <main className="site-main pt-[var(--site-header-height)]">
      <PageIntro
        label={solutionsPage.label}
        title={solutionsPage.title}
        description={solutionsPage.description}
        ctaLabel={solutionsPage.ctaLabel}
        ctaHref={primaryCta.href}
        secondaryLabel="Measurement"
        secondaryHref="/measurement"
      />

      <SolutionsHub activeId={activePillar.id} onSelect={selectPillar} />

      <LazySection minHeight="44vh">
        <TrafficChannels variant="full" channelIds={channelIds} />
      </LazySection>
    </main>
  );
}
