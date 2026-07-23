import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { differenceByMode, sectionsByMode } from "../data/liveContent";
import { SPRING_SOFT } from "../lib/motion";
import { useScrollRunwayEnabled, useScrollScene } from "../hooks/useScrollScene";
import { EditorialItem, EditorialStack } from "./Editorial";
import { ModeContentTransition } from "./motion/ModeContentTransition";
import { SectionAmbience } from "./SectionAmbience";
import { SectionHeader, useMode } from "./SectionHeader";
import { Stagger, StaggerItem } from "./motion/Stagger";

type DifferencePoint = {
  title: string;
  text: string;
};

const rowSpawn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/** Stagger tuned so point 3 finishes ~mid-scroll, not at the section tail. */
const ROW_REVEAL: ReadonlyArray<[number, number]> = [
  [0.04, 0.22],
  [0.14, 0.34],
  [0.26, 0.5],
];

function DifferenceRowBody({ point }: { point: DifferencePoint }) {
  return (
    <>
      <h3 className="text-lg font-bold tracking-tight text-fg md:text-xl">{point.title}</h3>
      <p className="copy mt-3 text-sm leading-relaxed text-muted md:text-[0.9375rem]">{point.text}</p>
    </>
  );
}

function ScrollSpawnRow({
  point,
  index,
  progress,
}: {
  point: DifferencePoint;
  index: number;
  progress: MotionValue<number>;
}) {
  const [start, end] = ROW_REVEAL[index] ?? ROW_REVEAL[ROW_REVEAL.length - 1]!;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [28, 0]);

  return (
    <motion.div style={{ opacity, y }} className="will-change-transform">
      <EditorialItem
        as="article"
        variant="step"
        step={String(index + 1).padStart(2, "0")}
      >
        <DifferenceRowBody point={point} />
      </EditorialItem>
    </motion.div>
  );
}

function DifferenceScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { mode } = useMode();
  const section = sectionsByMode.difference[mode];
  const points = differenceByMode[mode] as DifferencePoint[];

  const progress = useScrollScene(sectionRef, {
    mode: "anchor",
    anchorRef: listRef,
    startLine: 0.88,
    endLine: 0.36,
    spring: false,
    resetKey: mode,
  });

  return (
    <section ref={sectionRef} id="difference" className="section-band section-band--quiet">
      <SectionAmbience tone={mode === "growth" ? "warm" : "cool"} />
      <ModeContentTransition mode={mode} className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          label={sectionsByMode.difference.label}
          title={section.title}
          description={section.description}
        />

        <EditorialStack ref={listRef} className="section-stack">
          {points.map((point, index) => (
            <ScrollSpawnRow key={point.title} point={point} index={index} progress={progress} />
          ))}
        </EditorialStack>
      </ModeContentTransition>
    </section>
  );
}

function DifferenceStatic() {
  const { mode } = useMode();
  const section = sectionsByMode.difference[mode];
  const points = differenceByMode[mode] as DifferencePoint[];

  return (
    <section id="difference" className="section-band section-band--quiet">
      <SectionAmbience tone={mode === "growth" ? "warm" : "cool"} />
      <ModeContentTransition mode={mode} className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          label={sectionsByMode.difference.label}
          title={section.title}
          description={section.description}
        />

        <Stagger resetKey={mode} stagger={0.1} className="editorial-stack section-stack">
          {points.map((point, index) => (
            <StaggerItem key={point.title} variants={rowSpawn} transition={SPRING_SOFT}>
              <EditorialItem as="article" variant="step" step={String(index + 1).padStart(2, "0")}>
                <DifferenceRowBody point={point} />
              </EditorialItem>
            </StaggerItem>
          ))}
        </Stagger>
      </ModeContentTransition>
    </section>
  );
}

export function Difference() {
  const runway = useScrollRunwayEnabled();
  return runway ? <DifferenceScroll /> : <DifferenceStatic />;
}
