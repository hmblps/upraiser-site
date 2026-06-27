import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sections, trafficChannels } from "../data/content";
import { accentLink } from "../lib/accent";
import { SectionHeader, SectionHeaderRow } from "./SectionHeader";
import { Reveal } from "./motion/Reveal";
import { useReducedMotion } from "../hooks/useReducedMotion";

export function TrafficChannels() {
  const reduced = useReducedMotion();
  const [activeId, setActiveId] = useState(trafficChannels[0].id);
  const scrollRef = useRef<HTMLDivElement>(null);
  const active = trafficChannels.find((c) => c.id === activeId) ?? trafficChannels[0];

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <section id="channels" className="section-band">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeaderRow>
          <SectionHeader
            label={sections.channels.label}
            title={sections.channels.title}
            description="Omnichannel acquisition — from OEM pre-installs to CTV and retargeting. One team, every high-intent path to Your user."
          />
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
            className="mt-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="relative flex gap-2">
              {trafficChannels.map((channel) => (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => setActiveId(channel.id)}
                  className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    activeId === channel.id
                      ? "text-on-accent"
                      : "border border-border text-muted-light hover:border-fg/20 hover:text-fg"
                  }`}
                >
                  {activeId === channel.id && (
                    <motion.span
                      layoutId="channel-tab"
                      className="absolute inset-0 rounded-full bg-orange"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{channel.title}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <article className="mt-6 grid overflow-hidden rounded-3xl border border-border bg-bg-card lg:grid-cols-[1fr_1.2fr]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={reduced ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduced ? undefined : { opacity: 0, x: 12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="border-b border-border p-6 lg:border-b-0 lg:border-r lg:p-8"
              >
                <p className="card-kicker text-orange">{active.tagline}</p>
                <h3 className="card-title mt-2 text-xl font-bold">{active.title}</h3>
                <p className="copy mt-4 text-base">{active.description}</p>
                <div className="mt-6 rounded-xl border border-orange/20 bg-orange/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange">Best for</p>
                  <p className="copy mt-1">{active.bestFor}</p>
                </div>
                <a href="#contact" className={`link-caps mt-6 inline-flex ${accentLink("gold")}`}>
                  Talk to a Specialist →
                </a>
              </motion.div>
            </AnimatePresence>

            <div className="hidden grid-cols-2 gap-px bg-border lg:grid">
              {trafficChannels.map((channel) => (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => setActiveId(channel.id)}
                  className={`card-lift bg-bg-card p-5 text-left transition hover:bg-[var(--theme-case-panel)] ${
                    activeId === channel.id ? "ring-2 ring-inset ring-orange" : ""
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">Channel</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-orange">{channel.title}</p>
                  <p className="copy mt-2 line-clamp-2">{channel.tagline}</p>
                </button>
              ))}
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
