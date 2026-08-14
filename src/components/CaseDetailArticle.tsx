import type { CSSProperties } from "react";
import type { CaseStudy } from "../data/cases";
import { primaryCta } from "../data/liveContent";
import { CaseBrandHeader } from "./CaseBrandHeader";
import { EditorialItem, EditorialStack } from "./Editorial";
import { Magnetic } from "./motion-preview/Magnetic";
import { ScrollLink } from "./ScrollLink";
import { useMode } from "./SectionHeader";
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

function CaseMeta({ item }: { item: CaseStudy }) {
  const rows = [
    { label: "Brand", value: item.client },
    { label: "Vertical", value: item.vertical },
    { label: "Market", value: item.geos },
    { label: "KPI", value: item.kpiEvent },
    { label: "Model", value: item.paymentModel },
    { label: "Channels", value: item.channels.join(" · ") },
  ] as const;

  return (
    <dl className="case-detail-meta">
      {rows.map((row) => (
        <div key={row.label} className="case-detail-meta__row">
          <dt className="case-detail-meta__label">{row.label}</dt>
          <dd className="case-detail-meta__value">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

type CaseDetailArticleProps = {
  item: CaseStudy;
  /** Show contact CTA under the story (single-case page). */
  showCta?: boolean;
  className?: string;
};

/** Case story — hero numbers first, then metadata, then narrative. */
export function CaseDetailArticle({ item, showCta = false, className = "" }: CaseDetailArticleProps) {
  const { mode } = useMode();
  const { ref: resultsRef, active: resultsActive } = useInViewOnce({ threshold: 0.2 });
  const focus = mode === "growth" ? item.growthFocus : item.optimizationFocus;
  const labels = FOCUS_LABELS[mode];
  const story = [
    { title: labels.challenge, body: focus.challenge },
    { title: labels.approach, body: focus.approach },
    { title: labels.result, body: focus.result },
  ];

  return (
    <article
      id={`case-${item.id}`}
      className={className.trim()}
      style={
        {
          "--case-accent": item.brand.accent,
          "--case-surface": item.brand.surface,
        } as CSSProperties
      }
    >
      <div className="case-detail-brand overflow-hidden rounded-2xl border border-border/50">
        <CaseBrandHeader item={item} />
      </div>

      <div ref={resultsRef} className="case-detail-results case-detail-results--hero mt-8">
        <p className="section-label">Results</p>
        <h2 className="case-detail-hero-title">{item.headline}</h2>
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

      <CaseMeta item={item} />

      <EditorialStack className="mt-10">
        {story.map((block) => (
          <EditorialItem key={block.title}>
            <p className="section-label">{block.title}</p>
            <p className="copy mt-3">{block.body}</p>
          </EditorialItem>
        ))}
      </EditorialStack>

      {showCta ? (
        <div className="mt-10">
          <Magnetic>
            <ScrollLink
              href={primaryCta.href}
              data-cursor="cta"
              className="btn-caps btn-caps--primary inline-block rounded-full px-7 py-3.5"
            >
              {primaryCta.label}
            </ScrollLink>
          </Magnetic>
        </div>
      ) : null}
    </article>
  );
}
