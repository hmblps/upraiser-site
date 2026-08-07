import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";
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

/**
 * Infinite deck renders 3 copies and scrolls to the middle lane (`copy === 1`).
 * Only that lane should be exposed to AT; opening must work on every copy a user can tap.
 */
const LIVE_CAROUSEL_COPY = 1;

/** Preview card — opens the global case modal via plain click/keyboard. */
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
  const isCarousel = variant === "carousel";
  const isReplica = isCarousel && copy !== LIVE_CAROUSEL_COPY;

  const open = () => {
    openCase(item.id);
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    open();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    open();
  };

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty("--mouse-x", `${x}%`);
    event.currentTarget.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <article
      role="button"
      data-cursor="link"
      data-case-card
      data-case-id={item.id}
      data-case-index={caseIndex}
      data-case-copy={copy}
      aria-label={`${item.client} case study. ${ctaLabel}`}
      aria-hidden={isReplica || undefined}
      tabIndex={isReplica ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      className={[
        "case-preview-card card-lift group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-bg-card transition hover:border-orange/30",
        isCarousel ? "case-preview-card--carousel" : "h-full",
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
      <CaseBrandHeader item={item} compact />
      <div className="card-pad flex min-h-0 flex-1 flex-col">
        <p className="case-teaser-metric shrink-0">{primary.value}</p>
        <p className="case-teaser-metric-label case-preview-card__primary-label shrink-0">{primary.label}</p>

        {isCarousel ? (
          <div className="case-preview-metrics case-preview-metrics--secondary mt-3 shrink-0" aria-hidden={secondary.length === 0}>
            {secondary.slice(0, 2).map((metric) => (
              <div key={metric.label} className="case-preview-metrics__cell">
                <p className="case-preview-metrics__value">{metric.value}</p>
                <p className="case-teaser-metric-label" title={metric.label}>
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        <p className="case-preview-card__headline" title={item.headline}>
          {item.headline}
        </p>
        <span className="case-preview-card__cta mt-auto shrink-0">
          {ctaLabel} <span aria-hidden>→</span>
        </span>
      </div>
    </article>
  );
}
