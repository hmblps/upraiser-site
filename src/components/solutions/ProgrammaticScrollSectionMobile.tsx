import { useRef, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform } from "framer-motion";

import type { SiteMode } from "../../data/liveContent";
import { SectionHeader } from "../SectionHeader";
import type { AdFormat } from "./ProgrammaticFormats";
import { CssPhone, CssTablet, CssTv } from "./CssPhone";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export type ProgrammaticScrollSectionMobileProps = {
  mode: SiteMode;
  lane?: string;
  laneSwitcher?: ReactNode;
  formats: readonly AdFormat[];
  headerLabel: string;
  headerTitle: ReactNode;
  headerDescription?: string;
};

/**
 * Single editorial card in the continuous vertical feed:
 * Rhythm: [Full-size Device] → [Editorial Text & Value Points]
 */
function EditorialFeedItem({
  format,
  index,
  total,
  mode,
}: {
  format: AdFormat;
  index: number;
  total: number;
  mode: SiteMode;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Scroll parallax for continuous vertical rhythm
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "end start"],
  });

  // Smooth scale up as the device enters the center of viewport (0.93 -> 1.0)
  const scale = useTransform(scrollYProgress, [0.12, 0.48, 0.84], [0.93, 1, 0.95]);

  return (
    <article
      ref={itemRef}
      className="prog-editorial-item flex flex-col items-center w-full relative mb-16 sm:mb-20 last:mb-2 px-4"
    >
      {/* 1. ПОЛНОРАЗМЕРНЫЙ ДЕВАЙС (СНАЧАЛА) */}
      <motion.div
        className="w-full flex justify-center items-center py-2 relative z-10"
        style={reduced ? {} : { scale }}
      >
        <div
          className={`relative flex items-center justify-center ${
            format.scene === "tv"
              ? "w-full max-w-[420px] aspect-[16/9]"
              : format.scene === "tablet"
              ? "h-[min(46dvh,370px)] max-w-full aspect-[3/4]"
              : "h-[min(55dvh,450px)] max-w-full aspect-[9/19.5]"
          }`}
        >
          {/* Ambient stage glow behind device */}
          <div
            className="absolute -inset-4 sm:-inset-6 rounded-full pointer-events-none opacity-60 blur-2xl z-0"
            style={{
              background: "radial-gradient(circle, color-mix(in srgb, var(--theme-accent) 24%, transparent) 0%, transparent 72%)",
            }}
            aria-hidden
          />

          {format.scene === "tv" ? (
            <CssTv mode={mode} formatId={format.id} className="h-full w-full pointer-events-auto" />
          ) : format.scene === "tablet" ? (
            <CssTablet mode={mode} formatId={format.id} className="h-full w-full pointer-events-auto" />
          ) : (
            <CssPhone
              mode={mode}
              formatId={format.id}
              className="h-full w-full pointer-events-auto"
            />
          )}
        </div>
      </motion.div>

      {/* 2. ТЕКСТ ПОД ДЕВАЙСОМ (ЗАТЕМ) */}
      <div className="w-full max-w-[480px] mt-4 sm:mt-6 relative z-20">
        <div className="w-full bg-bg-elevated/90 backdrop-blur-2xl border border-border/50 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col">
          {/* Meta Header: Index & Tagline pill */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="font-mono text-[11px] font-semibold tracking-widest text-accent uppercase">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <span className="prog-mobile-card__tag text-[10px] tracking-wider">
              {format.tagline}
            </span>
          </div>

          {/* Heading */}
          <h3 className="card-title text-xl sm:text-2xl font-bold tracking-tight">
            {format.label}
          </h3>

          {/* Full description - unclipped */}
          <p className="copy mt-2 text-sm leading-relaxed text-theme-muted">
            {format.description}
          </p>

          {/* All 3 Points - full comfortable text */}
          <ul className="prog-mobile-card__points mt-4 p-3.5 sm:p-4 bg-background/50 rounded-xl space-y-2">
            {format.points.map((point) => (
              <li
                key={point}
                className="prog-mobile-card__point text-xs sm:text-sm leading-relaxed"
              >
                <span className="text-foreground/90">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

/**
 * Editorial Feed (Вариант 2):
 * Continuous vertical stream with full-size devices followed by complete format copy.
 * Flawless 60 FPS performance across Safari and in-app webviews (Telegram, LinkedIn, Slack).
 */
export function ProgrammaticScrollSectionMobile({
  mode,
  laneSwitcher,
  formats,
  headerLabel,
  headerTitle,
  headerDescription,
}: ProgrammaticScrollSectionMobileProps) {
  const { t } = useTranslation();
  const tLabel = t("formats.label", headerLabel);
  const tTitle = t("formats.title", typeof headerTitle === "string" ? headerTitle : "Every Format. One Supply Path.");

  return (
    <div
      className="prog-scroll-section--mobile relative flex flex-col w-full bg-background pt-4 pb-12 overflow-x-hidden"
      aria-label="Ad formats"
    >
      {/* Background Ambience */}
      <div className="prog-mobile-ambience absolute inset-0 !top-0" style={{ position: "absolute", height: "100%" }} aria-hidden />

      {/* Header */}
      <div className="prog-mobile-headline section-inner relative z-30 mb-2">
        <SectionHeader label={tLabel} title={tTitle} description={headerDescription} />
      </div>

      {/* Lane Switcher */}
      {laneSwitcher ? (
        <div className="prog-mobile-switcher section-inner mb-8 sm:mb-10 z-30 relative pointer-events-auto">
          {laneSwitcher}
        </div>
      ) : null}

      {/* Editorial Vertical Feed: [Device] → [Text] */}
      <div className="w-full flex flex-col items-center relative z-20">
        {formats.map((fmt, idx) => (
          <EditorialFeedItem
            key={fmt.id}
            format={fmt}
            index={idx}
            total={formats.length}
            mode={mode}
          />
        ))}
      </div>
    </div>
  );
}
