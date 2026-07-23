import type { CSSProperties, MouseEvent } from "react";
import { Link } from "react-router-dom";
import type { CaseStudy } from "../data/cases";
import { useCaseModal } from "../context/CaseModalContext";
import { CaseBrandHeader } from "./CaseBrandHeader";

type CasePreviewCardProps = {
  item: CaseStudy;
  ctaLabel?: string;
  className?: string;
  /** Carousel clone metadata */
  caseIndex?: number;
  copy?: number;
  /** `carousel` = /cases deck; default = home grid teaser */
  variant?: "teaser" | "carousel";
};

/** Preview card — opens the global case modal without leaving the current page. */
export function CasePreviewCard({
  item,
  ctaLabel = "Read the case",
  className = "",
  caseIndex,
  copy = 0,
  variant = "teaser",
}: CasePreviewCardProps) {
  const { openCase } = useCaseModal();
  const primary = item.metrics[0];
  const secondary = item.metrics.slice(1);
  const isClone = copy > 0;
  const isCarousel = variant === "carousel";

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Keep cmd/ctrl/middle-click as real navigation to /cases/:slug.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    openCase(item.id);
  };

  return (
    <Link
      to={`/cases/${item.id}`}
      data-cursor="link"
      data-case-card
      data-case-index={caseIndex}
      data-case-copy={copy}
      aria-hidden={isClone || undefined}
      tabIndex={isClone ? -1 : undefined}
      onClick={handleClick}
      className={[
        "case-preview-card card-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-bg-card transition hover:border-orange/30",
        isCarousel ? "case-preview-card--carousel" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          "--case-accent": item.brand.accent,
          "--case-surface": item.brand.surface,
        } as CSSProperties
      }
    >
      <CaseBrandHeader item={item} compact={!isCarousel} />
      <div className="card-pad flex flex-1 flex-col">
        <p className="case-teaser-metric">{primary.value}</p>
        <p className="case-teaser-metric-label">{primary.label}</p>

        {isCarousel ? (
          <div className="case-preview-metrics case-preview-metrics--secondary mt-4">
            {secondary.map((metric) => (
              <div key={metric.label} className="case-preview-metrics__cell">
                <p className="case-preview-metrics__value">{metric.value}</p>
                <p className="case-teaser-metric-label">{metric.label}</p>
              </div>
            ))}
          </div>
        ) : null}

        <p className="case-preview-card__headline">{item.headline}</p>
        <p className="case-preview-card__cta">
          {ctaLabel} <span aria-hidden>→</span>
        </p>
      </div>
    </Link>
  );
}
