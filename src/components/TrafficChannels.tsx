import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sectionsByMode, trafficChannelsByMode } from "../data/liveContent";
import { SectionHeader, SectionHeaderRow, useMode } from "./SectionHeader";
import { Reveal } from "./motion/Reveal";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { SlideTabs } from "./SlideTabs";

export function TrafficChannels() {
  const { mode } = useMode();
  const reduced = useReducedMotion();
  const trafficChannels = trafficChannelsByMode[mode];
  const section = sectionsByMode.channels[mode];
  const [activeId, setActiveId] = useState(trafficChannels[0].id);
  const scrollRef = useRef<HTMLDivElement>(null);
  const active = trafficChannels.find((c) => c.id === activeId) ?? trafficChannels[0];

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
  };

  useEffect(() => {
    setActiveId(trafficChannels[0].id);
  }, [mode]);

  return (
    <section id="channels" className="section-band section-band--strip">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeaderRow>
          <SectionHeader label={sectionsByMode.channels.label} title={section.title} />
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition hover:border-orange/40"
              aria-label="Scroll channels left"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition hover:border-orange/40"
              aria-label="Scroll channels right"
            >
              →
            </button>
          </div>
        </SectionHeaderRow>

        <Reveal delay={0.1}>
          <div
            ref={scrollRef}
            className="section-stack overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <SlideTabs
              layoutId={`channel-tab-${mode}`}
              activeId={activeId}
              onChange={setActiveId}
              items={trafficChannels.map((channel) => ({ id: channel.id, label: channel.title }))}
            />
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <article className="channel-panel live-panel mt-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${mode}-${active.id}`}
                initial={reduced ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduced ? undefined : { opacity: 0, x: 12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="transition-panel relative"
              >
                <div>
                  <p className="stat-label text-orange">{active.tagline}</p>
                  <h3 className="card-title mt-2">{active.title}</h3>
                  <p className="copy mt-3 max-w-2xl">{active.description}</p>
                  <div className="mt-6 border-t border-border pt-4">
                    <p className="stat-label text-muted">Best for</p>
                    <p className="copy mt-1">{active.bestFor}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
