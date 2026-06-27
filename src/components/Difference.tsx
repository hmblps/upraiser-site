import { differencePillars, sections } from "../data/content";
import { SectionHeader } from "./SectionHeader";
import { Stagger, StaggerItem } from "./motion/Stagger";

export function Difference() {
  return (
    <section id="difference" className="section-band scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          label={sections.difference.label}
          title={sections.difference.title}
          description="Tech, Team, Tactics, and Transparency — the foundation of every UPRAISER engagement."
        />

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {differencePillars.map((item) => (
            <StaggerItem key={item.title}>
              <article className="card-lift h-full rounded-2xl border border-border bg-bg-card p-6 hover:border-orange/30">
                <h3 className="card-title text-lg font-bold text-orange">{item.title}</h3>
                <p className="copy mt-3">{item.description}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
