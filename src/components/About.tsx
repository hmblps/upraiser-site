import { aboutHighlights, sections } from "../data/content";
import { SectionHeader } from "./SectionHeader";
import { Stagger, StaggerItem } from "./motion/Stagger";

export function About() {
  return (
    <section id="about" className="section-band">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <SectionHeader
            label={sections.about.label}
            title={sections.about.title}
            description="We operate as technical infrastructure, not just an agency. As the official Lenovo agency partner, we transform product potential into market reality through exclusive hardware access and proprietary tech. Our focus goes beyond vanity metrics — deposit rates, subscription growth, and LTV drive every campaign decision we make."
          />

          <Stagger className="grid gap-4 sm:grid-cols-2" stagger={0.08}>
            {aboutHighlights.map((item) => (
              <StaggerItem key={item.title}>
                <div className="card-lift h-full rounded-2xl border border-border bg-bg-card p-5 hover:border-orange/30">
                  <h3 className="card-title text-base font-semibold text-orange">{item.title}</h3>
                  <p className="copy mt-2">{item.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
