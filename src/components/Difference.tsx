import { differenceCompare, sectionsByMode } from "../data/liveContent";
import { SPRING_SOFT } from "../lib/motion";
import { useScrollRunwayEnabled } from "../hooks/useScrollScene";
import { ModeContentTransition } from "./motion/ModeContentTransition";
import { SectionAmbience } from "./SectionAmbience";
import { SectionHeader, useMode } from "./SectionHeader";
import { Stagger, StaggerItem } from "./motion/Stagger";

const cardSpawn = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

type ComparePoint = { title: string; text: string };

function CompareColumn({
  tone,
  label,
  points,
}: {
  tone: "rest" | "ours";
  label: string;
  points: readonly ComparePoint[];
}) {
  return (
    <article className={`difference-compare__col difference-compare__col--${tone}`}>
      <header className="difference-compare__head">
        <span className="difference-compare__eyebrow" aria-hidden>
          {tone === "rest" ? "×" : "✓"}
        </span>
        <h3 className="difference-compare__label">{label}</h3>
      </header>
      <ul className="difference-compare__list">
        {points.map((point) => (
          <li key={point.title} className="difference-compare__item">
            <span className="difference-compare__mark" aria-hidden>
              {tone === "rest" ? "×" : "✓"}
            </span>
            <div className="difference-compare__body">
              <p className="difference-compare__title">{point.title}</p>
              <p className="difference-compare__text">{point.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

/**
 * Upraiser vs The Rest — institutional pipe vs standard media buying.
 * Micro-rows + soft marks so The Rest text does not collapse into a grey slab.
 */
export function Difference() {
  const runway = useScrollRunwayEnabled();
  const { mode } = useMode();
  const section = sectionsByMode.difference[mode];

  return (
    <section id="difference" className="section-band section-band--quiet">
      <SectionAmbience tone={mode === "growth" ? "warm" : "cool"} />
      <ModeContentTransition mode={mode} className="section-inner relative">
        <SectionHeader
          label={sectionsByMode.difference.label}
          title={section.title}
          description={section.description}
        />

        {runway ? (
          <Stagger resetKey={mode} stagger={0.08} className="difference-compare section-stack">
            <StaggerItem variants={cardSpawn} transition={SPRING_SOFT} className="min-h-0">
              <CompareColumn tone="rest" label={differenceCompare.restLabel} points={differenceCompare.rest} />
            </StaggerItem>
            <StaggerItem variants={cardSpawn} transition={SPRING_SOFT} className="min-h-0">
              <CompareColumn tone="ours" label={differenceCompare.oursLabel} points={differenceCompare.ours} />
            </StaggerItem>
          </Stagger>
        ) : (
          <div className="difference-compare section-stack">
            <CompareColumn tone="rest" label={differenceCompare.restLabel} points={differenceCompare.rest} />
            <CompareColumn tone="ours" label={differenceCompare.oursLabel} points={differenceCompare.ours} />
          </div>
        )}
      </ModeContentTransition>
    </section>
  );
}
