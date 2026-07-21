import { sectionsByMode } from "../data/liveContent";
import { SectionHeader, useMode } from "./SectionHeader";

export function Difference() {
  const { mode } = useMode();
  const section = sectionsByMode.difference[mode];

  return (
    <section id="difference" className="section-band section-band--quiet scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          label={sectionsByMode.difference.label}
          title={section.title}
          description={section.description}
        />
      </div>
    </section>
  );
}
