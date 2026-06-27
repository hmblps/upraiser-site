import { processSteps, sections } from "../data/content";
import { Reveal } from "./motion/Reveal";
import { SectionHeader } from "./SectionHeader";
import { Stagger, StaggerItem } from "./motion/Stagger";
import { Magnetic } from "./motion-preview/Magnetic";

export function Process() {
  return (
    <section id="process" className="section-band scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader label={sections.process.label} title={sections.process.title} />

        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {processSteps.map((item) => (
            <StaggerItem key={item.step}>
              <article className="card-lift h-full rounded-2xl border border-border bg-bg-card p-6 hover:border-orange/30">
                <span className="text-sm font-bold text-orange">{item.step}</span>
                <h3 className="card-title mt-3 text-base font-semibold">{item.title}</h3>
                <p className="copy mt-2">{item.description}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.15} className="mt-10">
          <Magnetic>
            <a
              href="#contact"
              data-cursor="cta"
              className="btn-caps inline-block rounded-full bg-orange px-7 py-3 text-sm font-semibold text-on-accent transition hover:bg-orange-light hover:shadow-[0_8px_24px_rgba(253,216,53,0.25)]"
            >
              Start Scaling
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
