import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { solutionsHub } from "../data/liveContent";
import { cn } from "../lib/cn";
import { SPRING_SOFT } from "../lib/motion";
import { Stagger, StaggerItem } from "./motion/Stagger";

const rowSpawn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

type SolutionsHubProps = {
  activeId: string;
  onSelect: (pillarId: string, primaryChannel: string) => void;
};

/**
 * Solutions visual language: route spine.
 * Vertical rail + nodes; Saatchi-style path list for content.
 */
export function SolutionsHub({ activeId, onSelect }: SolutionsHubProps) {
  const count = solutionsHub.categories.length;
  const activeIndex = Math.max(
    0,
    solutionsHub.categories.findIndex((c) => c.id === activeId),
  );
  const fillPct = count <= 1 ? 100 : (activeIndex / (count - 1)) * 100;

  return (
    <section id="help-with" className="section-band section-band--dense border-b border-border/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="section-label">{solutionsHub.label}</p>
        <p className="copy mt-3 max-w-2xl text-sm text-muted">{solutionsHub.description}</p>

        <div className="solutions-route mt-10">
          <div className="solutions-route__spine" aria-hidden>
            <div className="solutions-route__rail" />
            <div className="solutions-route__fill" style={{ height: `${fillPct}%` } as CSSProperties} />
          </div>

          <Stagger stagger={0.05} className="solutions-path-list">
            {solutionsHub.categories.map((pillar, index) => {
              const active = pillar.id === activeId;
              return (
                <StaggerItem key={pillar.id} variants={rowSpawn} transition={SPRING_SOFT}>
                  <motion.button
                    type="button"
                    data-cursor="link"
                    aria-pressed={active}
                    onClick={() => onSelect(pillar.id, pillar.primaryChannel)}
                    className={cn("solutions-path-row", active && "solutions-path-row--active")}
                    whileHover={{ x: 4 }}
                    transition={SPRING_SOFT}
                  >
                    <span
                      className={cn(
                        "solutions-route__node",
                        active && "solutions-route__node--active",
                        index <= activeIndex && "solutions-route__node--passed",
                      )}
                      aria-hidden
                    />
                    <span className="solutions-path-row__index" aria-hidden>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="solutions-path-row__body">
                      <span className="solutions-path-row__title">{pillar.title}</span>
                      <span className="solutions-path-row__problem">{pillar.problem}</span>
                    </span>
                    <span className="solutions-path-row__cue" aria-hidden>
                      {active ? "Open" : "Select"} →
                    </span>
                  </motion.button>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
