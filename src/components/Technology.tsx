import { sections, technologyFeatures } from "../data/content";
import { accentTitle } from "../lib/accent";
import { SectionHeader } from "./SectionHeader";
import { ProximitySurface } from "./motion/ProximitySurface";
import { Stagger, StaggerItem } from "./motion/Stagger";

export function Technology() {
  return (
    <section id="technology" className="section-band">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <SectionHeader
            label={sections.technology.label}
            title={sections.technology.title}
            description="Proprietary infrastructure that scores, buys, and verifies — so every impression works toward Your LTV goals."
          />

          <Stagger className="space-y-4" stagger={0.08}>
            {technologyFeatures.map((item) => (
              <StaggerItem key={item.title}>
                <ProximitySurface className="rounded-2xl border border-border bg-bg-card p-5 hover:border-orange/30">
                  <h3 className={`card-title text-base font-semibold ${accentTitle("gold")}`}>
                    {item.title}
                  </h3>
                  <p className="copy mt-2">{item.description}</p>
                </ProximitySurface>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
