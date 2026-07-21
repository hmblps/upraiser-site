import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { differenceByMode, sectionsByMode } from "../data/liveContent";
import { stagedRevealRange } from "../lib/scrollScene";
import { SPRING_SOFT } from "../lib/motion";
import { useScrollRunwayEnabled, useScrollScene } from "../hooks/useScrollScene";
import { SectionAmbience } from "./SectionAmbience";
import { SectionHeader, useMode } from "./SectionHeader";
import { Stagger, StaggerItem } from "./motion/Stagger";

type DifferenceCard = {
  title: string;
  text: string;
};

const cardSpawn = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

function DifferenceCardBody({ card }: { card: DifferenceCard }) {
  return (
    <>
      <h3 className="card-title text-lg font-bold tracking-tight text-fg md:text-xl">{card.title}</h3>
      <p className="copy mt-3 text-sm leading-relaxed text-muted md:text-[0.9375rem]">{card.text}</p>
    </>
  );
}

function ScrollSpawnCard({
  card,
  index,
  total,
  progress,
}: {
  card: DifferenceCard;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const [start, end] = stagedRevealRange(index, total, 0.08, 0.12);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [40, 0]);
  const scale = useTransform(progress, [start, end], [0.94, 1]);

  return (
    <motion.article
      style={{ opacity, y, scale }}
      className="card-lift difference-card card-pad flex h-full flex-col rounded-2xl border border-border/60 bg-bg-card will-change-transform"
    >
      <DifferenceCardBody card={card} />
    </motion.article>
  );
}

function DifferenceScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const { mode } = useMode();
  const section = sectionsByMode.difference[mode];
  const cards = differenceByMode[mode] as DifferenceCard[];

  const progress = useScrollScene(sectionRef, {
    mode: "anchor",
    anchorRef: cardsRef,
    startLine: 0.9,
    endLine: 0.2,
    spring: false,
    resetKey: mode,
  });

  return (
    <section ref={sectionRef} id="difference" className="section-band section-band--quiet">
      <SectionAmbience tone={mode === "growth" ? "warm" : "cool"} />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          label={sectionsByMode.difference.label}
          title={section.title}
          description={section.description}
        />

        <div ref={cardsRef} className="section-stack grid gap-6 md:grid-cols-3">
          {cards.map((card, index) => (
            <ScrollSpawnCard
              key={card.title}
              card={card}
              index={index}
              total={cards.length}
              progress={progress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function DifferenceStatic() {
  const { mode } = useMode();
  const section = sectionsByMode.difference[mode];
  const cards = differenceByMode[mode] as DifferenceCard[];

  return (
    <section id="difference" className="section-band section-band--quiet">
      <SectionAmbience tone={mode === "growth" ? "warm" : "cool"} />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          label={sectionsByMode.difference.label}
          title={section.title}
          description={section.description}
        />

        <Stagger resetKey={mode} stagger={0.12} className="section-stack grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <StaggerItem key={card.title} variants={cardSpawn} transition={SPRING_SOFT}>
              <article className="card-lift difference-card card-pad flex h-full flex-col rounded-2xl border border-border/60 bg-bg-card">
                <DifferenceCardBody card={card} />
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function Difference() {
  const runway = useScrollRunwayEnabled();
  return runway ? <DifferenceScroll /> : <DifferenceStatic />;
}
