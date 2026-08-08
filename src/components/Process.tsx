import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { processByMode, sectionsByMode } from "../data/liveContent";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScrollScene } from "../hooks/useScrollScene";
import { clamp } from "../lib/clamp";
import { SectionAmbience } from "./SectionAmbience";
import { SectionHeader, useMode } from "./SectionHeader";
import { Magnetic } from "./motion-preview/Magnetic";
import { SPRING_SOFT } from "../lib/motion";
import { ScrollLink } from "./ScrollLink";

function useProcessActiveIndex(
  sectionRef: React.RefObject<HTMLElement | null>,
  stepCount: number,
  reduced: boolean,
  resetKey: string,
) {
  const progress = useScrollScene(sectionRef, {
    mode: "viewportBand",
    spring: false,
    resetKey,
  });
  const [activeIndex, setActiveIndex] = useState(reduced ? stepCount - 1 : 0);

  useEffect(() => {
    if (reduced) {
      setActiveIndex(stepCount - 1);
      return;
    }
    const unsub = progress.on("change", (t) => {
      setActiveIndex(clamp(Math.floor(t * stepCount), 0, stepCount - 1));
    });
    return unsub;
  }, [progress, reduced, stepCount]);

  return activeIndex;
}

function ProcessStep({
  step,
  title,
  description,
  index,
  activeIndex,
  reduced,
}: {
  step: string;
  title: string;
  description: string;
  index: number;
  activeIndex: number;
  reduced: boolean;
}) {
  const active = index <= activeIndex;
  const current = index === activeIndex;

  return (
    <motion.article
      className={`process-step${active ? " is-active" : ""}${current ? " is-current" : ""}`}
      initial={false}
      animate={
        reduced
          ? { opacity: 1, y: 0 }
          : {
              opacity: active ? 1 : 0.58,
              y: active ? 0 : 6,
            }
      }
      transition={SPRING_SOFT}
    >
      <span className="process-step-num live-num" aria-hidden>
        {step}
      </span>
      <h3 className="card-title">{title}</h3>
      <p className="copy">{description}</p>
    </motion.article>
  );
}

export function Process() {
  const { mode } = useMode();
  const section = sectionsByMode.process[mode];
  const steps = processByMode[mode];
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const activeIndex = useProcessActiveIndex(sectionRef, steps.length, reduced, mode);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="section-band section-band--ambience section-band--dense relative overflow-hidden"
    >
      <SectionAmbience tone="soft" />
      <div className="relative z-[1] mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader animated={false} label={sectionsByMode.process.label} title={section.title} />

        <div className="process-rail section-stack">
          {steps.map((item, index) => (
            <ProcessStep
              key={item.step}
              {...item}
              index={index}
              activeIndex={activeIndex}
              reduced={reduced}
            />
          ))}
        </div>

        <div className="mt-8">
          <Magnetic>
            <ScrollLink
              href="#contact"
              data-cursor="cta"
              className="btn-caps inline-block rounded-full bg-accent px-7 py-3 text-sm font-semibold text-on-accent transition hover:bg-accent-light hover:shadow-[0_8px_24px_color-mix(in_srgb,var(--theme-accent-light)_25%,transparent)]"
            >
              {section.cta}
            </ScrollLink>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
