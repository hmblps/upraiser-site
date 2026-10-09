import type { CSSProperties } from "react";
import type { CaseStudy } from "../data/cases";
import { useTranslation } from "react-i18next";
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
  const ref = useCountUp(value, active, 1600);
  return (
    <div className="case-detail-result">
      <p className="case-detail-result__value" ref={ref as any}>{value}</p>
      <p className="case-detail-result__label">{label}</p>
    </div>
  );
}

function CaseMeta({ item }: { item: CaseStudy }) {
  const { t } = useTranslation();
  const rows = [
    { label: "Brand", value: t(`casesDetails.${item.id}.client`, item.client) },
    { label: "Vertical", value: t(`casesDetails.${item.id}.vertical`, item.vertical) },
    { label: "Market", value: t(`casesDetails.${item.id}.geos`, item.geos) },
    { label: "KPI", value: t(`casesDetails.${item.id}.kpiEvent`, item.kpiEvent) },
    { label: "Model", value: t(`casesDetails.${item.id}.paymentModel`, item.paymentModel) },
    { label: "Channels", value: (t(`casesDetails.${item.id}.channels`, { returnObjects: true, defaultValue: item.channels }) as string[]).join(" · ") },
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
  
  const { t } = useTranslation();
  const headline = t(`casesDetails.${item.id}.headline`, item.headline);
  const tFocusChallenge = t(`casesDetails.${item.id}.${mode === "infrastructure" ? "optimizationFocus" : "growthFocus"}.challenge`, focus.challenge);
  const tFocusApproach = t(`casesDetails.${item.id}.${mode === "infrastructure" ? "optimizationFocus" : "growthFocus"}.approach`, focus.approach);
  const tFocusResult = t(`casesDetails.${item.id}.${mode === "infrastructure" ? "optimizationFocus" : "growthFocus"}.result`, focus.result);
  
  // metrics
  const tMetric0Val = t(`casesDetails.${item.id}.metrics.0.value`, item.metrics[0].value);
  const tMetric0Lbl = t(`casesDetails.${item.id}.metrics.0.label`, item.metrics[0].label);
  const tMetric1Val = t(`casesDetails.${item.id}.metrics.1.value`, item.metrics[1].value);
  const tMetric1Lbl = t(`casesDetails.${item.id}.metrics.1.label`, item.metrics[1].label);
  const tMetric2Val = t(`casesDetails.${item.id}.metrics.2.value`, item.metrics[2].value);
  const tMetric2Lbl = t(`casesDetails.${item.id}.metrics.2.label`, item.metrics[2].label);

  const story = [
    { title: labels.challenge, body: tFocusChallenge },
    { title: labels.approach, body: tFocusApproach },
    { title: labels.result, body: tFocusResult },
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
        <h2 className="case-detail-hero-title">{headline}</h2>
        <div className="case-detail-results__grid">
          
      <ResultMetric key={item.metrics[0].label} value={tMetric0Val} label={tMetric0Lbl} active={resultsActive} />
      <ResultMetric key={item.metrics[1].label} value={tMetric1Val} label={tMetric1Lbl} active={resultsActive} />
      <ResultMetric key={item.metrics[2].label} value={tMetric2Val} label={tMetric2Lbl} active={resultsActive} />
  
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
