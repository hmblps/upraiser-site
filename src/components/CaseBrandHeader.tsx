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
  const previewLimit = 2;
  const visibleChannels = compact ? item.channels.slice(0, previewLimit) : item.channels;
  const hiddenCount = compact ? Math.max(0, item.channels.length - previewLimit) : 0;

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
        <motion.div
          className="case-brand-icon"
          whileHover={{ scale: 1.04, rotate: -2 }}
          transition={SPRING}
        >
          <img
            src={brand.icon}
            alt={`${item.client} app icon`}
            className="case-brand-icon__img"
            loading="lazy"
            decoding="async"
          />
        </motion.div>

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
        {visibleChannels.map((channel) => (
          <span key={channel} className="case-brand-channel">
            {channel}
          </span>
        ))}
        {hiddenCount > 0 ? (
          <span className="case-brand-channel case-brand-channel--more" aria-label={`${hiddenCount} more channels`}>
            +{hiddenCount}
          </span>
        ) : null}
      </div>
    </div>
  );
}
