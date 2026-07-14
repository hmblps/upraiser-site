import { differencePillars, sections } from "../data/content";
import { accentTitle, toneAt } from "../lib/accent";
import { SectionHeader } from "./SectionHeader";
import { Stagger, StaggerItem } from "./motion/Stagger";

const BENTO_SLOTS = ["tech", "team", "tactics", "transparency"] as const;

export function Difference() {
  return (
    <section id="difference" className="section-band scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          label={sections.difference.label}
          title={sections.difference.title}
          description="Tech, Team, Tactics, and Transparency — the foundation of every UPRAISER engagement."
        />

        <Stagger className="difference-bento mt-12" stagger={0.08}>
          {differencePillars.map((item, index) => (
            <StaggerItem
              key={item.title}
              className={`difference-bento-item difference-bento-item--${BENTO_SLOTS[index]}`}
            >
              <article className="card-lift difference-bento-card h-full rounded-2xl border border-border bg-bg-card p-6 lg:p-8">
                <p className="stat-label text-muted">{String(index + 1).padStart(2, "0")}</p>
                <h3 className={`card-title mt-3 text-xl font-bold lg:text-2xl ${accentTitle(toneAt(index))}`}>
                  {item.title}
                </h3>
                <p className="copy mt-4 max-w-prose">{item.description}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
