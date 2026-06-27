import { sections, valueProps } from "../data/content";
import { Reveal } from "./motion/Reveal";
import { Stagger, StaggerItem } from "./motion/Stagger";

export function ValueProps() {
  return (
    <section id="value" className="section-band scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <p className="section-lead uppercase tracking-wide">
            {sections.valueLead.main}{" "}
            <span className="text-muted-light">{sections.valueLead.aside}</span>
          </p>
        </Reveal>

        <Stagger className="mt-12 grid gap-6 md:grid-cols-3" stagger={0.1}>
          {valueProps.map((item) => (
            <StaggerItem key={item.title}>
              <article className="card-lift h-full rounded-2xl border border-border bg-bg-card p-6 hover:border-orange/30 lg:p-8">
                <h3 className="card-title text-lg font-bold text-orange">{item.title}</h3>
                <p className="card-kicker mt-2 text-muted-light">{item.subtitle}</p>
                <p className="copy mt-4">{item.description}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
