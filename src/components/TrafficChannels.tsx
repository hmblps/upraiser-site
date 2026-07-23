import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { sectionsByMode, solutionsHub, trafficChannelsByMode } from "../data/liveContent";
import { SectionHeader, SectionHeaderRow, useMode } from "./SectionHeader";
import { ModeContentTransition } from "./motion/ModeContentTransition";
import { Reveal } from "./motion/Reveal";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { SlideTabs } from "./SlideTabs";

type TrafficChannelsProps = {
  /** `home` = switcher + short teaser; tab click opens /solutions with that channel. */
  variant?: "home" | "full";
  /** When set (Solutions pillars), only these channel ids appear as tabs. */
  channelIds?: string[];
};

export function TrafficChannels({ variant = "full", channelIds }: TrafficChannelsProps) {
  const { mode } = useMode();
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const allChannels = trafficChannelsByMode[mode];
  const trafficChannels =
    channelIds && channelIds.length > 0
      ? allChannels.filter((c) => channelIds.includes(c.id))
      : allChannels;
  const section = sectionsByMode.channels[mode];
  const isHome = variant === "home";
  const channels = trafficChannels.length > 0 ? trafficChannels : allChannels;

  const channelFromUrl = searchParams.get("channel");
  const initialId =
    !isHome && channelFromUrl && channels.some((c) => c.id === channelFromUrl)
      ? channelFromUrl
      : channels[0]!.id;

  const [activeId, setActiveId] = useState(initialId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const active = channels.find((c) => c.id === activeId) ?? channels[0]!;
  const activeIndex = channels.findIndex((channel) => channel.id === activeId);

  const scrollTabs = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
  };

  const openOnSolutions = useCallback(
    (id: string) => {
      const pillar = solutionsHub.categories.find((c) =>
        (c.channelIds as readonly string[]).includes(id),
      );
      const search = new URLSearchParams({ channel: id });
      if (pillar) search.set("pillar", pillar.id);
      navigate({ pathname: "/solutions", search: `?${search.toString()}`, hash: "#channels" });
    },
    [navigate],
  );

  const selectChannel = useCallback(
    (id: string) => {
      setActiveId(id);
      if (isHome) return;
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("channel", id);
          return next;
        },
        { replace: true },
      );
    },
    [isHome, setSearchParams],
  );

  const stepChannel = useCallback(
    (direction: -1 | 1) => {
      const nextIndex = activeIndex + direction;
      if (nextIndex < 0 || nextIndex >= channels.length) return;
      selectChannel(channels[nextIndex]!.id);
    },
    [activeIndex, selectChannel, channels],
  );

  useEffect(() => {
    if (isHome) {
      setActiveId(channels[0]!.id);
      return;
    }
    const fromUrl = searchParams.get("channel");
    if (fromUrl && channels.some((c) => c.id === fromUrl)) {
      setActiveId(fromUrl);
      return;
    }
    setActiveId(channels[0]!.id);
  }, [mode, isHome, searchParams, channels]);

  useEffect(() => {
    const tab = scrollRef.current?.querySelector<HTMLElement>(`[data-tab-id="${activeId}"]`);
    tab?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      inline: "nearest",
      block: "nearest",
    });
  }, [activeId, reduced]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;

      const sectionNode = sectionRef.current;
      if (!sectionNode) return;

      const rect = sectionNode.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1;
      if (!inView) return;

      event.preventDefault();
      stepChannel(event.key === "ArrowLeft" ? -1 : 1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [stepChannel]);

  const body =
    isHome && "teaser" in active && typeof active.teaser === "string" ? active.teaser : active.description;
  const points =
    !isHome && "points" in active && Array.isArray(active.points) ? (active.points as string[]) : [];

  return (
    <section id="channels" ref={sectionRef} className="section-band section-band--strip">
      <ModeContentTransition mode={mode} className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeaderRow>
          <SectionHeader
            label={sectionsByMode.channels.label}
            title={section.title}
            description={
              isHome
                ? "Switch sources here. Open a type on Solutions for the full inventory write-up — no separate depth pages."
                : undefined
            }
          />
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scrollTabs("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition hover:border-orange/40"
              aria-label="Scroll channels left"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollTabs("right")}
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
              layoutId={`channel-tab-${variant}-${mode}`}
              activeId={activeId}
              onChange={selectChannel}
              items={channels.map((channel) => ({ id: channel.id, label: channel.title }))}
            />
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <article className="channel-panel live-panel mt-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${mode}-${active.id}-${variant}`}
                initial={reduced ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduced ? undefined : { opacity: 0, x: 12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="transition-panel relative"
              >
                <div>
                  <p className="stat-label text-orange">{active.tagline}</p>
                  <h3 className="card-title mt-2">{active.title}</h3>
                  <p className="copy mt-3 max-w-2xl">{body}</p>
                  {points.length > 0 ? (
                    <ul className="channel-inventory-points mt-5 space-y-2.5">
                      {points.map((point) => (
                        <li key={point} className="channel-inventory-points__item copy text-sm text-muted">
                          {point}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-6 border-t border-border pt-4">
                    <p className="stat-label text-muted">Best for</p>
                    <p className="copy mt-1">{active.bestFor}</p>
                  </div>
                  {isHome ? (
                    <p className="mt-5">
                      <button
                        type="button"
                        data-cursor="link"
                        onClick={() => openOnSolutions(active.id)}
                        className="btn-caps btn-secondary inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold hover:border-orange/35"
                      >
                        Open {active.title} on Solutions
                        <span aria-hidden className="ml-1.5">
                          →
                        </span>
                      </button>
                    </p>
                  ) : null}
                </div>
              </motion.div>
            </AnimatePresence>
          </article>
        </Reveal>
      </ModeContentTransition>
    </section>
  );
}
