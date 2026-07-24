import { Link } from "react-router-dom";
import { PERFORMANCE_CONTENT } from "../data/performanceData";
import { Magnetic } from "./motion-preview/Magnetic";
import { Reveal } from "./motion/Reveal";
import { cn } from "../lib/cn";

type CaseProofIndexProps = {
  className?: string;
  label?: string;
  title?: string;
};

/**
 * Editorial dossier index — logos + one line, not metric-card grids.
 */
export function CaseProofIndex({
  className,
  label = "Proof",
  title = "Open a flight that already closed clean",
}: CaseProofIndexProps) {
  const cases = PERFORMANCE_CONTENT.caseStudies;

  return (
    <section className={cn("section-band border-t border-border/40", className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <p className="section-label">{label}</p>
          <h2 className="section-title mt-3 max-w-2xl">{title}</h2>
        </Reveal>

        <ul className="case-dossier mt-10">
          {cases.map((item, index) => (
            <li key={item.id}>
              <Link to={item.link} data-cursor="link" className="case-dossier__row">
                <span className="case-dossier__index" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="case-dossier__mark">
                  <img src={item.logoUrl} alt="" className="case-dossier__logo" />
                </span>
                <span className="case-dossier__body">
                  <span className="case-dossier__client">{item.client}</span>
                  <span className="case-dossier__meta">
                    {item.vertical} · {item.metricLabel}
                  </span>
                  <span className="case-dossier__desc">{item.description}</span>
                </span>
                <span className="case-dossier__cue" aria-hidden>
                  Open →
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
              Full case deck
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
