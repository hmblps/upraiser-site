import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { CaseStudy } from "../data/cases";
import { CaseBrandHeader } from "./CaseBrandHeader";

type CasePreviewCardProps = {
  item: CaseStudy;
  ctaLabel?: string;
  className?: string;
  /** Carousel clone metadata */
  caseIndex?: number;
  copy?: number;
};

/** Unified preview card — home grid and /cases carousel. Full story on /cases/:slug. */
export function CasePreviewCard({
  item,
  ctaLabel = "Read the case",
  className = "",
  caseIndex,
  copy = 0,
}: CasePreviewCardProps) {
  const primary = item.metrics[0];
  const isClone = copy > 0;

  return (
    <Link
      to={`/cases/${item.id}`}
      data-cursor="link"
      data-case-card
      data-case-index={caseIndex}
      data-case-copy={copy}
      aria-hidden={isClone || undefined}
      tabIndex={isClone ? -1 : undefined}
      className={`case-preview-card card-lift group flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-bg-card transition hover:border-orange/35 ${className}`.trim()}
      style={
        {
          "--case-accent": item.brand.accent,
          "--case-surface": item.brand.surface,
        } as CSSProperties
      }
      onClick={(event) => {
        if (isClone) event.preventDefault();
      }}
    >
      <CaseBrandHeader item={item} compact />
      <div className="card-pad flex flex-1 flex-col">
        <p className="case-teaser-metric">{primary.value}</p>
        <p className="case-teaser-metric-label">{primary.label}</p>
        <p className="case-preview-card__headline">{item.headline}</p>
        <p className="case-preview-card__cta">
          {ctaLabel} <span aria-hidden>→</span>
        </p>
      </div>
    </Link>
  );
}
