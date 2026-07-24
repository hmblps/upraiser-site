import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { solutionsHub } from "../data/liveContent";
import { ScrollLink } from "./ScrollLink";
import { SPRING_SOFT } from "../lib/motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

type Pillar = (typeof solutionsHub.categories)[number];

type SolutionPathStoryProps = {
  pillar: Pillar;
};

/** Active path landing — typographic split, no card chrome. */
export function SolutionPathStory({ pillar }: SolutionPathStoryProps) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={pillar.id}
        id="path-story"
        className="solution-path"
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduced ? undefined : { opacity: 0, y: -8 }}
        transition={SPRING_SOFT}
      >
        <div className="solution-path__inner">
          <div className="solution-path__main">
            <p className="section-label">Path</p>
            <h2 className="solution-path__title">{pillar.title}</h2>
            <p className="solution-path__problem">{pillar.problem}</p>
            <p className="copy mt-4 max-w-2xl text-sm text-muted">{pillar.summary}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ScrollLink
                href="/contact"
                contactIntent={pillar.contactIntent}
                data-cursor="link"
                className="btn-caps btn-primary inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                Brief this path
                <span aria-hidden className="ml-1.5">
                  →
                </span>
              </ScrollLink>
              <Link
                to={pillar.casePreview}
                data-cursor="link"
                className="btn-caps btn-secondary inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                {pillar.caseLabel}
              </Link>
            </div>
          </div>

          <div className="solution-path__side">
            <div>
              <p className="section-label">What You get</p>
              <ul className="mt-4 space-y-3">
                {pillar.deliverables.map((item) => (
                  <li key={item} className="solution-path__item">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <p className="section-label">Why it works</p>
              <ul className="mt-4 space-y-3">
                {pillar.whyItWorks.map((item) => (
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
