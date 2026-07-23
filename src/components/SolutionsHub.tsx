import { motion } from "framer-motion";
import { solutionsHub } from "../data/liveContent";
import { cn } from "../lib/cn";
import { SPRING_SOFT } from "../lib/motion";
import { Stagger, StaggerItem } from "./motion/Stagger";

const cardSpawn = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

type SolutionsHubProps = {
  activeId: string;
  onSelect: (pillarId: string, primaryChannel: string) => void;
};

/** Saatchi/AVOW-style pillars — select a lane, channels open below. */
export function SolutionsHub({ activeId, onSelect }: SolutionsHubProps) {
  return (
    <section id="help-with" className="section-band section-band--dense border-b border-border/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="section-label">{solutionsHub.label}</p>
        <p className="copy mt-3 max-w-2xl text-sm text-muted">{solutionsHub.description}</p>

        <Stagger stagger={0.06} className="solutions-pillar-grid mt-8">
          {solutionsHub.categories.map((pillar) => {
            const active = pillar.id === activeId;
            return (
              <StaggerItem key={pillar.id} variants={cardSpawn} transition={SPRING_SOFT}>
                <motion.button
                  type="button"
                  data-cursor="link"
                  aria-pressed={active}
                  onClick={() => onSelect(pillar.id, pillar.primaryChannel)}
                  className={cn("solutions-pillar", active && "solutions-pillar--active")}
                  whileHover={{ y: -2 }}
                  transition={SPRING_SOFT}
                >
                  <span className="solutions-pillar__title">{pillar.title}</span>
                  <span className="solutions-pillar__summary copy">{pillar.summary}</span>
                  <span className="solutions-pillar__cue" aria-hidden>
                    {active ? "Open below" : "Open lane"} →
                  </span>
                </motion.button>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
