import { Link } from "react-router-dom";
import { caseStudies } from "../data/cases";
import { casesPage, sectionsByMode } from "../data/liveContent";
import { CasePreviewCard } from "./CasePreviewCard";
import { ModeContentTransition } from "./motion/ModeContentTransition";
import { Reveal } from "./motion/Reveal";
import { SectionHeader, useMode } from "./SectionHeader";
import { Magnetic } from "./motion-preview/Magnetic";
import { Stagger, StaggerItem } from "./motion/Stagger";
import { SPRING_SOFT } from "../lib/motion";

const cardSpawn = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const TEASER_COUNT = 3;

/** Compact cases strip on home — full archive on /cases (header). */
export function CasesTeaser() {
  const { mode } = useMode();
  const section = sectionsByMode.cases[mode];
  const items = caseStudies.slice(0, TEASER_COUNT);

  return (
    <section id="cases" className="section-band section-band--dense">
      <ModeContentTransition mode={mode} className="section-inner">
        <SectionHeader
          animated={false}
          label={casesPage.label}
          title={section.title}
          description={
            mode === "growth"
              ? "Killer outcomes from live flights — Block Blast and more under The Peaks."
              : "Audit-ready pipelines in brief — full stories under The Peaks."
          }
        />

        <Stagger resetKey={mode} stagger={0.08} className="section-stack case-preview-grid">
          {items.map((item) => (
            <StaggerItem key={item.id} variants={cardSpawn} transition={SPRING_SOFT}>
              <CasePreviewCard item={item} />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.12} className="mt-8 flex justify-center">
          <Magnetic strength={0.22}>
            <Link
              to="/cases"
              data-cursor="link"
              className="btn-caps btn-secondary inline-block rounded-full px-7 py-3.5 text-sm font-semibold hover:border-accent/35"
            >
              View all case studies
            </Link>
          </Magnetic>
        </Reveal>
      </ModeContentTransition>
    </section>
  );
}
