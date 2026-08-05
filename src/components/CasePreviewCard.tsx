import { useRef, type CSSProperties, type MouseEvent, type PointerEvent as ReactPointerEvent } from "react";
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

/** Movement under this still counts as a tap inside the swipe carousel. */
const TAP_SLOP_PX = 14;

/**
 * Infinite deck renders 3 copies and scrolls to the middle lane (`copy === 1`).
 * Only that lane should be exposed to AT; opening must work on every copy a user can tap.
 */
const LIVE_CAROUSEL_COPY = 1;

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
  const isCarousel = variant === "carousel";
  const isReplica = isCarousel && copy !== LIVE_CAROUSEL_COPY;
  const pointerOrigin = useRef<{ x: number; y: number; id: number } | null>(null);
  const openedByPointerTap = useRef(false);

  const open = () => {
    openCase(item.id);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.button != null && event.button !== 0) return;
    pointerOrigin.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    openedByPointerTap.current = false;
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    const origin = pointerOrigin.current;
    pointerOrigin.current = null;
    if (!origin || origin.id !== event.pointerId) return;
    // Mouse keeps using click (cmd/ctrl-click etc). Touch/pen often lose click inside overflow-x carousels.
    if (event.pointerType !== "touch" && event.pointerType !== "pen") return;

    const dx = Math.abs(event.clientX - origin.x);
    const dy = Math.abs(event.clientY - origin.y);
    if (dx > TAP_SLOP_PX || dy > TAP_SLOP_PX) return;

    openedByPointerTap.current = true;
    event.preventDefault();
    open();
  };

  const handlePointerCancel = () => {
    pointerOrigin.current = null;
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (openedByPointerTap.current) {
      event.preventDefault();
      openedByPointerTap.current = false;
      return;
    }

    // Keep cmd/ctrl/middle-click as real navigation to /cases/:slug.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.button != null && event.button !== 0) return;

    event.preventDefault();
    open();
  };

  return (
    <Link
      to={`/cases/${item.id}`}
      data-cursor="link"
      data-case-card
      data-case-index={caseIndex}
      data-case-copy={copy}
      aria-hidden={isReplica || undefined}
      tabIndex={isReplica ? -1 : undefined}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onClick={handleClick}
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
      {/* Compact header in carousel — full header was clipping CTA under viewport max-height */}
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
        <p className="case-preview-card__cta mt-auto shrink-0">
          {ctaLabel} <span aria-hidden>→</span>
        </p>
      </div>
    </Link>
  );
}
