import type { CSSProperties } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getCaseById } from "../data/cases";
import { primaryCta } from "../data/liveContent";
import { CaseBrandHeader } from "../components/CaseBrandHeader";
import { EditorialItem, EditorialStack } from "../components/Editorial";
import { LazySection } from "../layouts/SiteLayout";
import { Magnetic } from "../components/motion-preview/Magnetic";
import { ScrollLink } from "../components/ScrollLink";
import { useMode } from "../components/SectionHeader";
import { useCountUp } from "../hooks/useCountUp";
import { useInViewOnce } from "../hooks/useInViewOnce";

const FOCUS_LABELS = {
  growth: { challenge: "Challenge", approach: "Approach", result: "Result" },
  infrastructure: { challenge: "Risk", approach: "Controls", result: "Proof" },
} as const;

function ResultMetric({ value, label, active }: { value: string; label: string; active: boolean }) {
  const display = useCountUp(value, active, 1600);
  return (
    <div className="case-detail-result">
      <p className="case-detail-result__value">{active ? display : value}</p>
      <p className="case-detail-result__label">{label}</p>
    </div>
  );
}

export function CaseDetailPage() {
  const { slug = "" } = useParams();
  const item = getCaseById(slug);
  const { mode } = useMode();
  const { ref: resultsRef, active: resultsActive } = useInViewOnce({ threshold: 0.35 });

  if (!item) return <Navigate to="/cases" replace />;

  const focus = mode === "growth" ? item.growthFocus : item.optimizationFocus;
  const labels = FOCUS_LABELS[mode];
  const story = [
    { title: labels.challenge, body: focus.challenge },
    { title: labels.approach, body: focus.approach },
    { title: labels.result, body: focus.result },
  ];

  return (
    <main className="site-main pt-[var(--site-header-height)]">
      <LazySection minHeight="56vh">
        <section className="section-band">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <p className="mb-6">
              <Link to="/cases" className="text-sm font-semibold text-muted transition hover:text-orange">
                ← All case studies
              </Link>
            </p>

            <article
              style={
                {
                  "--case-accent": item.brand.accent,
                  "--case-surface": item.brand.surface,
                } as CSSProperties
              }
            >
              <div className="overflow-hidden rounded-2xl border border-border/50">
                <CaseBrandHeader item={item} />
              </div>

              <div className="mt-10">
                <div ref={resultsRef} className="case-detail-results">
                  <p className="section-label">The Results</p>
                  <div className="case-detail-results__grid">
                    {item.metrics.map((metric) => (
                      <ResultMetric
                        key={metric.label}
                        value={metric.value}
                        label={metric.label}
                        active={resultsActive}
                      />
                    ))}
                  </div>
                </div>

                <EditorialStack className="mt-10">
                  {story.map((block) => (
                    <EditorialItem key={block.title}>
                      <p className="section-label">{block.title}</p>
                      <p className="copy mt-3 text-sm text-muted md:text-[0.9375rem]">{block.body}</p>
                    </EditorialItem>
                  ))}
                </EditorialStack>

                <div className="mt-10">
                  <Magnetic>
                    <ScrollLink
                      href={primaryCta.href}
                      data-cursor="cta"
                      className="btn-caps inline-block rounded-full bg-orange px-7 py-3.5 text-sm font-semibold text-on-accent hover:bg-orange-light"
                    >
                      {primaryCta.label}
                    </ScrollLink>
                  </Magnetic>
                </div>
              </div>
            </article>
          </div>
        </section>
      </LazySection>
    </main>
  );
}
