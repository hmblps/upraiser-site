import { objectives, sections } from "../data/content";
import { SectionHeader } from "./SectionHeader";
import { Stagger, StaggerItem } from "./motion/Stagger";

export function Objectives() {
  return (
    <section id="objectives" className="section-band">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          label={sections.objectives.label}
          title={sections.objectives.title}
          description="UPRAISER helps You find gaps in Your acquisition strategy and discover which channels move users from awareness to revenue."
        />

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {objectives.map((item, index) => (
            <StaggerItem key={item.title}>
              <article className="card-lift relative h-full rounded-2xl border border-border bg-bg-card p-6 hover:border-orange/30">
                <span className="text-3xl font-bold text-orange/30">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="card-title mt-3 text-base font-semibold">{item.title}</h3>
                <p className="copy mt-3">{item.description}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
