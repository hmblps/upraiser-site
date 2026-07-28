import { Link } from "react-router-dom";
import { PERFORMANCE_CONTENT } from "../data/performanceData";
import { Magnetic } from "./motion-preview/Magnetic";
import { Reveal } from "./motion/Reveal";
import { cn } from "../lib/cn";

type CaseMetricMatrixProps = {
  className?: string;
  label?: string;
  title?: string;
};

/**
 * Saatchi proof block — metric-led rows, not a card grid.
 * Links into existing /cases stories without editing Cases page.
 */
export function CaseMetricMatrix({
  className,
  label = "Proof",
  title = "Campaigns that hold up in review",
}: CaseMetricMatrixProps) {
  const cases = PERFORMANCE_CONTENT.caseStudies;

  return (
    <section className={cn("section-band border-t border-border/40", className)}>
      <div className="section-inner">
        <Reveal>
          <p className="section-label">{label}</p>
          <h2 className="section-title mt-3 max-w-2xl">{title}</h2>
        </Reveal>

        <ul className="case-metric-list mt-10">
          {cases.map((item) => (
            <li key={item.id}>
              <Link to={item.link} data-cursor="link" className="case-metric-row">
                <span className="case-metric-row__metric">
                  <span className="case-metric-row__value">{item.mainMetric}</span>
                  <span className="case-metric-row__label">{item.metricLabel}</span>
                </span>
                <span className="case-metric-row__body">
                  <span className="case-metric-row__client">{item.client}</span>
                  <span className="case-metric-row__vertical">{item.vertical}</span>
                  <span className="case-metric-row__desc">{item.description}</span>
                </span>
                <span className="case-metric-row__cue" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Reveal delay={0.08} className="mt-8">
          <Magnetic strength={0.22}>
            <Link
              to="/cases"
              data-cursor="link"
              className="btn-caps btn-secondary inline-block rounded-full px-6 py-3 text-sm font-semibold"
            >
              View all cases
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
