import { PERFORMANCE_CONTENT } from "../data/performanceData";
import { cn } from "../lib/cn";

type TrustMarqueeProps = {
  className?: string;
  label?: string;
};

/** Saatchi trust strip — real case / partner logos only. */
export function TrustMarquee({
  className,
  label = "Trusted on live flights",
}: TrustMarqueeProps) {
  const logos = PERFORMANCE_CONTENT.trustLogos;

  return (
    <section className={cn("section-band section-band--strip border-y border-border/40", className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="section-label">{label}</p>
        <div className="trust-marquee mt-6">
          <div className="trust-marquee__track">
            {[...logos, ...logos].map((logo, index) => (
              <div key={`${logo.name}-${index}`} className="trust-marquee__item" aria-hidden={index >= logos.length}>
                <img src={logo.logoUrl} alt={index < logos.length ? logo.name : ""} className="trust-marquee__logo" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
