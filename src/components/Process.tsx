import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { processByMode, sectionsByMode } from "../data/liveContent";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScroll } from "../context/ScrollContext";
import { SectionAmbience } from "./SectionAmbience";
import { SectionHeader, useMode } from "./SectionHeader";
import { Magnetic } from "./motion-preview/Magnetic";
import { SPRING_SOFT } from "../lib/motion";
import { ScrollLink } from "./ScrollLink";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function useProcessProgress(sectionRef: React.RefObject<HTMLElement | null>, stepCount: number, reduced: boolean) {
  const { registerScrollListener } = useScroll();
  const raw = useMotionValue(0);
  const progress = useSpring(raw, { stiffness: 180, damping: 32, mass: 0.7 });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reduced) {
      raw.set(1);
      setActiveIndex(stepCount - 1);
      return;
    }

    const update = () => {
      const node = sectionRef.current;
      if (!node) return;
      const bounds = node.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * 0.72;
      const end = viewport * 0.28;
      const t = clamp((start - bounds.top) / (start - end + bounds.height * 0.35), 0, 1);
      raw.set(t);
      setActiveIndex(clamp(Math.floor(t * stepCount), 0, stepCount - 1));
    };

    update();
    const unsubscribe = registerScrollListener(update);
    window.addEventListener("resize", update);
    return () => {
      unsubscribe();
      window.removeEventListener("resize", update);
    };
  }, [raw, reduced, registerScrollListener, sectionRef, stepCount]);

  return { progress, activeIndex };
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
              opacity: active ? 1 : 0.42,
              y: active ? 0 : 10,
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
  const { activeIndex } = useProcessProgress(sectionRef, steps.length, reduced);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="section-band section-band--ambience section-band--dense relative scroll-mt-24 overflow-hidden"
    >
      <SectionAmbience tone="soft" />
      <div className="relative z-[1] mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader animated={false} label={sectionsByMode.process.label} title={section.title} />

        <div className="process-rail">
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
              className="btn-caps inline-block rounded-full bg-orange px-7 py-3 text-sm font-semibold text-on-accent transition hover:bg-orange-light hover:shadow-[0_8px_24px_rgba(253,216,53,0.25)]"
            >
              {section.cta}
            </ScrollLink>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
