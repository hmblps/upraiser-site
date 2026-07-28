import { Link } from "react-router-dom";
import { primaryCta } from "../data/liveContent";
import { Magnetic } from "./motion-preview/Magnetic";
import { ScrollLink } from "./ScrollLink";
import { SectionHeader } from "./SectionHeader";
import { cn } from "../lib/cn";

type PageIntroProps = {
  label: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  contactIntent?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
  dense?: boolean;
};

/** Shared depth-page intro — one headline, one job, optional CTA pair. */
export function PageIntro({
  label,
  title,
  description,
  ctaLabel = primaryCta.label,
  ctaHref = primaryCta.href,
  contactIntent,
  secondaryLabel,
  secondaryHref,
  className,
  dense = true,
}: PageIntroProps) {
  return (
    <section
      className={cn(
        "section-band",
        dense ? "section-band--dense" : null,
        className,
      )}
    >
      <div className="section-inner">
        <SectionHeader animated={false} label={label} title={title} description={description} />
        {(ctaLabel && ctaHref) || (secondaryLabel && secondaryHref) ? (
          <PageCtaRow
            className="mt-8"
            primaryLabel={ctaLabel}
            primaryHref={ctaHref}
            contactIntent={contactIntent}
            secondaryLabel={secondaryLabel}
            secondaryHref={secondaryHref}
          />
        ) : null}
      </div>
    </section>
  );
}

type PageCtaRowProps = {
  primaryLabel?: string;
  primaryHref?: string;
  contactIntent?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
};

export function PageCtaRow({
  primaryLabel = primaryCta.label,
  primaryHref = primaryCta.href,
  contactIntent,
  secondaryLabel,
  secondaryHref,
  className,
}: PageCtaRowProps) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {primaryLabel && primaryHref ? (
        <Magnetic>
          <ScrollLink
            href={primaryHref}
            contactIntent={contactIntent}
            data-cursor="cta"
            className="btn-caps inline-block rounded-full bg-orange px-7 py-3.5 text-sm font-semibold text-on-accent hover:bg-orange-light"
          >
            {primaryLabel}
          </ScrollLink>
        </Magnetic>
      ) : null}
      {secondaryLabel && secondaryHref ? (
        <Magnetic strength={0.22}>
          {secondaryHref.startsWith("/") ? (
            <Link
              to={secondaryHref}
              className="btn-caps btn-secondary inline-block rounded-full px-7 py-3.5 text-sm font-semibold hover:border-orange/35"
            >
              {secondaryLabel}
            </Link>
          ) : (
            <ScrollLink
              href={secondaryHref}
              className="btn-caps btn-secondary inline-block rounded-full px-7 py-3.5 text-sm font-semibold hover:border-orange/35"
            >
              {secondaryLabel}
            </ScrollLink>
          )}
        </Magnetic>
      ) : null}
    </div>
  );
}
