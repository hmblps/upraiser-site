import { useEffect, useRef, useState, type ReactNode } from "react";
import type { SiteMode } from "../../data/liveContent";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { SectionHeader } from "../SectionHeader";
import type { AdFormat } from "./ProgrammaticFormats";
import { CssPhone } from "./CssPhone";

export type ProgrammaticScrollSectionMobileProps = {
  mode: SiteMode;
  lane?: string;
  laneSwitcher?: ReactNode;
  formats: readonly AdFormat[];
  headerLabel: string;
  headerTitle: ReactNode;
  headerDescription?: string;
};

/** Mobile / reduced-motion Routes — cards with inline phones. */
export function ProgrammaticScrollSectionMobile({
  mode,
  lane = "app-growth",
  laneSwitcher,
  formats,
  headerLabel,
  headerTitle,
  headerDescription,
}: ProgrammaticScrollSectionMobileProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  return (
    <section
      ref={sectionRef}
      className="prog-scroll-section prog-scroll-section--mobile"
      aria-label="Ad formats"
    >
      <div className="prog-mobile-ambience" aria-hidden />

      <div className="prog-mobile-headline section-inner">
        <SectionHeader label={headerLabel} title={headerTitle} description={headerDescription} />
      </div>

      {laneSwitcher ? <div className="prog-mobile-switcher section-inner">{laneSwitcher}</div> : null}

      <div className="prog-scroll-section__mobile-inner">
        {formats.map((fmt, i) => (
          <article
            key={fmt.id + fmt.label}
            className="prog-scroll-section__mobile-card is-active"
          >
            <div className="relative w-full max-w-[200px] mx-auto mb-6 mt-2 flex justify-center items-center aspect-[9/19]">
              <span className="prog-mobile-stage__glow" aria-hidden />
              <CssPhone mode={mode} formatId={fmt.id} className="prog-css-phone--mobile h-full w-full" />
            </div>

            <div className="prog-mobile-card__meta">
              <p className="prog-mobile-card__tag">{fmt.tagline}</p>
              <span className="prog-mobile-card__index" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="card-title prog-mobile-card__title">{fmt.label}</h3>
            <p className="copy prog-mobile-card__body">{fmt.description}</p>
            <ul className="prog-mobile-card__points">
              {fmt.points.map((point) => (
                <li key={point} className="prog-mobile-card__point">
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
