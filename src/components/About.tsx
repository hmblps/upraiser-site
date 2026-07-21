import { useEffect, useRef } from "react";
import { sectionsByMode, technologyByMode } from "../data/liveContent";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { SectionAmbience } from "./SectionAmbience";
import { SectionHeader, useMode } from "./SectionHeader";
import { ThemeBridge } from "./ThemeBridge";

function useProximity(ref: React.RefObject<HTMLDivElement | null>, enabled: boolean) {
  useEffect(() => {
    const node = ref.current;
    if (!enabled || !node || !window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (event: MouseEvent) => {
      const bounds = node.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      node.style.setProperty("--proximity-x", `${x.toFixed(1)}%`);
      node.style.setProperty("--proximity-y", `${y.toFixed(1)}%`);
      node.dataset.proximity = "active";
    };

    const onLeave = () => {
      node.style.setProperty("--proximity-x", "50%");
      node.style.setProperty("--proximity-y", "40%");
      delete node.dataset.proximity;
    };

    node.addEventListener("mousemove", onMove, { passive: true });
    node.addEventListener("mouseleave", onLeave);
    return () => {
      node.removeEventListener("mousemove", onMove);
      node.removeEventListener("mouseleave", onLeave);
      node.style.removeProperty("--proximity-x");
      node.style.removeProperty("--proximity-y");
      delete node.dataset.proximity;
    };
  }, [enabled, ref]);
}

function ProximityCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useProximity(ref, !useReducedMotion());

  return (
    <div ref={ref} className={`proximity-surface card-lift ${className}`.trim()}>
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

export function About() {
  const { mode } = useMode();
  const section = sectionsByMode.about[mode];
  const technology = technologyByMode[mode];
  const anchorRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={anchorRef}
      id="about"
      className="section-band section-band--ambience relative overflow-hidden"
    >
      <SectionAmbience tone={mode === "growth" ? "warm" : "cool"} />
      <div className="relative z-[1] mx-auto max-w-7xl px-6 pb-24 lg:px-8 lg:pb-28">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-12">
          <SectionHeader animated={false} label={sectionsByMode.about.label} title={section.title} description={section.description} />

          <ProximityCard className="rounded-2xl">
            <div id="technology" className="spec-panel scroll-mt-section rounded-2xl border border-border bg-bg-card/90 p-5 lg:pt-5">
              <p className="section-label">{sectionsByMode.technology.label}</p>
              <dl className="spec-list">
                {technology.map((item) => (
                  <div key={item.title} className="spec-row">
                    <dt>{item.title}</dt>
                    <dd className="copy">{item.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </ProximityCard>
        </div>
      </div>
      <ThemeBridge anchorRef={anchorRef} />
    </section>
  );
}
