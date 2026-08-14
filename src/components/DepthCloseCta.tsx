import { primaryCta } from "../data/liveContent";
import { Magnetic } from "./motion-preview/Magnetic";
import { ScrollLink } from "./ScrollLink";
import { Reveal } from "./motion/Reveal";
import { cn } from "../lib/cn";

type DepthCloseCtaProps = {
  label?: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  contactIntent?: string;
  className?: string;
};

/** Shared close band — matches HomePilotCta so depth pages end on the same beat. */
export function DepthCloseCta({
  label = "Next step",
  title,
  description,
  ctaLabel = primaryCta.label,
  ctaHref = primaryCta.href,
  contactIntent,
  className,
}: DepthCloseCtaProps) {
  return (
    <section className={cn("section-band section-band--dense", className)}>
      <div className="section-inner">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 border-t border-border/70 pt-10 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="section-label">{label}</p>
              <h2 className="section-heading">{title}</h2>
              <p className="copy mt-3">{description}</p>
            </div>
            <Magnetic>
              <ScrollLink
                href={ctaHref}
                contactIntent={contactIntent}
                data-cursor="cta"
                className="btn-caps btn-caps--primary inline-block shrink-0 whitespace-nowrap rounded-full px-7 py-3.5"
              >
                {ctaLabel}
              </ScrollLink>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
