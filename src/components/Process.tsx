import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, type MotionValue } from "framer-motion";
import { processByMode, sectionsByMode } from "../data/liveContent";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScrollScene } from "../hooks/useScrollScene";
import { clamp } from "../lib/clamp";
import { ModeContentTransition } from "./motion/ModeContentTransition";
import { SectionAmbience } from "./SectionAmbience";
import { SectionHeader, useMode } from "./SectionHeader";
import { Magnetic } from "./motion-preview/Magnetic";
import { SPRING_SOFT } from "../lib/motion";
import { ScrollLink } from "./ScrollLink";

function useProcessScroll(
  sectionRef: React.RefObject<HTMLElement | null>,
  stepCount: number,
  reduced: boolean,
  resetKey: string,
) {
  const progress = useScrollScene(sectionRef, {
    mode: "viewportBand",
    spring: true,
    resetKey,
    bandStart: 0.78,
    bandEnd: 0.22,
    heightBias: 0.55,
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

  return { activeIndex, progress };
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
          ? { opacity: 1, y: 0, scale: 1 }
          : {
              opacity: active ? 1 : 0.38,
              y: active ? 0 : 12,
              scale: current ? 1 : active ? 0.985 : 0.97,
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

function ProcessProgressTrack({
  progress,
  stepCount,
  activeIndex,
  reduced,
}: {
  progress: MotionValue<number>;
  stepCount: number;
  activeIndex: number;
  reduced: boolean;
}) {
  const [fill, setFill] = useState(reduced ? 1 : 0);

  useMotionValueEvent(progress, "change", (t) => {
    setFill(t);
  });

  useEffect(() => {
    if (reduced) setFill(1);
  }, [reduced]);

  return (
    <div className="process-progress" aria-hidden>
      <div className="process-progress__track">
        <motion.div
          className="process-progress__fill"
          initial={false}
          animate={{ scaleX: reduced ? 1 : fill }}
          transition={SPRING_SOFT}
          style={{ transformOrigin: "left center" }}
        />
      </div>
      <div className="process-progress__dots">
        {Array.from({ length: stepCount }, (_, index) => (
          <span
            key={index}
            className={`process-progress__dot${index <= activeIndex ? " is-active" : ""}${
              index === activeIndex ? " is-current" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function Process() {
  const { mode } = useMode();
  const section = sectionsByMode.process[mode];
  const steps = processByMode[mode];
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { activeIndex, progress } = useProcessScroll(sectionRef, steps.length, reduced, mode);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="section-band section-band--ambience section-band--dense relative overflow-hidden"
    >
      <SectionAmbience tone="soft" />
      <ModeContentTransition mode={mode} className="relative z-[1] mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader animated={false} label={sectionsByMode.process.label} title={section.title} />

        <ProcessProgressTrack
          progress={progress}
          stepCount={steps.length}
          activeIndex={activeIndex}
          reduced={reduced}
        />

        <div className="process-rail section-stack">
          {steps.map((item, index) => (
            <ProcessStep
              key={`${mode}-${item.step}`}
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
              href="/contact"
              data-cursor="cta"
              className="btn-caps inline-block rounded-full bg-orange px-7 py-3 text-sm font-semibold text-on-accent transition hover:bg-orange-light hover:shadow-[0_8px_24px_color-mix(in_srgb,var(--theme-accent-light)_25%,transparent)]"
            >
              {section.cta}
            </ScrollLink>
          </Magnetic>
        </div>
      </ModeContentTransition>
    </section>
  );
}
