import { PERFORMANCE_CONTENT } from "../data/performanceData";
import { Reveal } from "./motion/Reveal";
import { Stagger, StaggerItem } from "./motion/Stagger";
import { SPRING_SOFT } from "../lib/motion";
import { cn } from "../lib/cn";

const spawn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

type PhilosophyBandProps = {
  className?: string;
};

/** Saatchi core pitch — thesis + numbered pillars (hairline, no card chrome). */
export function PhilosophyBand({ className }: PhilosophyBandProps) {
  const { philosophy } = PERFORMANCE_CONTENT;

  return (
    <section className={cn("section-band border-t border-border/40", className)}>
      <div className="section-inner">
        <Reveal>
          <p className="section-label">{philosophy.tagline}</p>
          <h2 className="section-title mt-3 max-w-3xl">{philosophy.title}</h2>
          <p className="section-description mt-4 max-w-2xl">{philosophy.description}</p>
        </Reveal>

        <Stagger stagger={0.06} className="philosophy-pillars mt-12">
          {philosophy.pillars.map((pillar) => (
            <StaggerItem key={pillar.number} variants={spawn} transition={SPRING_SOFT}>
              <article className="philosophy-pillar">
                <span className="philosophy-pillar__num" aria-hidden>
                  {pillar.number}
                </span>
                <div>
                  <h3 className="philosophy-pillar__title">{pillar.title}</h3>
                  <p className="philosophy-pillar__subtitle">{pillar.subtitle}</p>
                  <p className="philosophy-pillar__text">{pillar.description}</p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
