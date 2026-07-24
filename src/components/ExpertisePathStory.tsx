import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { ExpertiseCluster } from "../data/innerPagesData";
import { ScrollLink } from "./ScrollLink";
import { SPRING_SOFT } from "../lib/motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

type ExpertisePathStoryProps = {
  cluster: ExpertiseCluster;
};

/** Active expertise cluster — typographic split, no card chrome. */
export function ExpertisePathStory({ cluster }: ExpertisePathStoryProps) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={cluster.id}
        id="path-story"
        className="solution-path"
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduced ? undefined : { opacity: 0, y: -8 }}
        transition={SPRING_SOFT}
      >
        <div className="solution-path__inner">
          <div className="solution-path__main">
            <p className="section-label">{cluster.category}</p>
            <h2 className="solution-path__title">{cluster.title}</h2>
            <p className="solution-path__problem">{cluster.problem}</p>
            <p className="copy mt-4 max-w-2xl text-sm text-muted">{cluster.summary}</p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-orange">
              {cluster.highlight}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ScrollLink
                href="/contact"
                contactIntent={cluster.contactIntent}
                data-cursor="link"
                className="btn-caps btn-primary inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                Brief this lane
                <span aria-hidden className="ml-1.5">
                  →
                </span>
              </ScrollLink>
              <Link
                to={cluster.casePreview}
                data-cursor="link"
                className="btn-caps btn-secondary inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                {cluster.caseLabel}
              </Link>
            </div>
          </div>

          <div className="solution-path__side">
            <div>
              <p className="section-label">What You get</p>
              <ul className="mt-4 space-y-3">
                {cluster.deliverables.map((item) => (
                  <li key={item} className="solution-path__item">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <p className="section-label">Why it works</p>
              <ul className="mt-4 space-y-3">
                {cluster.whyItWorks.map((item) => (
                  <li key={item} className="solution-path__item">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
