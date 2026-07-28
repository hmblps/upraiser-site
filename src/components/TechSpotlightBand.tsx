import { Link } from "react-router-dom";
import { PERFORMANCE_CONTENT } from "../data/performanceData";
import { Magnetic } from "./motion-preview/Magnetic";
import { Reveal } from "./motion/Reveal";
import { cn } from "../lib/cn";

type TechSpotlightBandProps = {
  className?: string;
};

/**
 * Saatchi proprietary-tech block → Clarity.
 * Split: product thesis left, feature checklist right. No fake dashboard.
 */
export function TechSpotlightBand({ className }: TechSpotlightBandProps) {
  const tech = PERFORMANCE_CONTENT.techSpotlight;

  return (
    <section className={cn("section-band section-band--ambience border-y border-border/40", className)}>
      <div className="section-inner">
        <Reveal>
          <div className="tech-spotlight">
            <div className="tech-spotlight__copy">
              <p className="section-label">{tech.badge}</p>
              <p className="tech-spotlight__product">{tech.productName}</p>
              <h2 className="tech-spotlight__title">{tech.title}</h2>
              <p className="copy mt-4 max-w-xl text-sm text-muted">{tech.description}</p>
              <Magnetic className="mt-8 inline-block">
                <Link
                  to={tech.ctaHref}
                  data-cursor="link"
                  className="btn-caps btn-primary inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold"
                >
                  {tech.ctaText}
                  <span aria-hidden className="ml-1.5">
                    →
                  </span>
                </Link>
              </Magnetic>
            </div>
            <ul className="tech-spotlight__features">
              {tech.features.map((feature, index) => (
                <li key={feature} className="tech-spotlight__feature">
                  <span className="tech-spotlight__feature-num" aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
