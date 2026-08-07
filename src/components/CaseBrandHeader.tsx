import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import type { CaseStudy } from "../data/cases";
import { SPRING } from "../lib/motion";

type CaseBrandHeaderProps = {
  item: CaseStudy;
  compact?: boolean;
};

export function CaseBrandHeader({ item, compact = false }: CaseBrandHeaderProps) {
  const { brand } = item;
  const meta = [item.vertical, item.paymentModel, item.geos].join(" · ");

  return (
    <div
      className={`case-brand-header ${compact ? "case-brand-header--compact" : ""}`.trim()}
      style={
        {
          "--case-accent": brand.accent,
          "--case-surface": brand.surface,
        } as CSSProperties
      }
    >
      <div className="case-brand-header__wash" aria-hidden />

      <div className="case-brand-header__content">
        <div className="case-brand-icon">
          <img
            src={brand.icon}
            alt={`${item.client} app icon`}
            className="case-brand-icon__img"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="case-brand-header__copy min-w-0">
          <span className="text-micro case-brand-header__category">{meta}</span>
          <h3 className={`case-brand-header__title ${compact ? "text-base" : "text-xl md:text-2xl"}`}>
            {item.client}
          </h3>
          {!compact ? (
            <p className="case-brand-header__headline">{item.headline}</p>
          ) : null}
          <p className="case-brand-header__event">
            <span className="case-brand-header__event-label">KPI event</span>
            <code className="case-brand-header__event-value">{item.kpiEvent}</code>
          </p>
        </div>
      </div>

      <div className="case-brand-header__channels">
        {item.channels.map((channel) => (
          <span key={channel} className="case-brand-channel">
            {channel}
          </span>
        ))}
      </div>
    </div>
  );
}
