import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { sectionsByMode, trafficChannelsByMode } from "../data/liveContent";
import { getSolutionsChannelDetail } from "../data/solutionsChannelDetails";
import { sortSolutionsChannels, SOLUTIONS_CHANNEL_IDS, type SolutionsChannelId } from "../data/solutionsChannels";
import { getSolutionsChannelVideo } from "../data/solutionsChannelVideos";
import { ChannelVisual } from "./channel-visuals/ChannelVisual";
import { SectionHeader, SectionHeaderRow, useMode } from "./SectionHeader";
import { ModeContentTransition } from "./motion/ModeContentTransition";
import { Reveal } from "./motion/Reveal";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { SlideTabs } from "./SlideTabs";
import { cn } from "../lib/cn";

const PANEL_SPRING = { type: "spring" as const, stiffness: 340, damping: 30, mass: 0.7 };

const panelVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.16 } },
};

const panelItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: PANEL_SPRING },
};

type TrafficChannelsProps = {
  /** `home` = teaser + link to Solutions; `solutions` = full flat rail; `full` = legacy pillar filter. */
  variant?: "home" | "full" | "solutions";
  /** When set (legacy pillars), only these channel ids appear as tabs. */
  channelIds?: string[];
  /** Exclude a specific channel id from the tab rail (used on Solutions to hide programmatic). */
  excludeId?: string;
};

export function TrafficChannels({ variant = "full", channelIds, excludeId }: TrafficChannelsProps) {
  const { mode } = useMode();
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const allChannels = trafficChannelsByMode[mode];
  const isHome = variant === "home";
  const isSolutions = variant === "solutions";
  const trafficChannels = isSolutions
    ? sortSolutionsChannels(allChannels).filter((c) => !excludeId || c.id !== excludeId)
    : channelIds && channelIds.length > 0
      ? allChannels.filter((c) => channelIds.includes(c.id))
      : allChannels.filter((c) => !excludeId || c.id !== excludeId);
  const section = sectionsByMode.channels[mode];
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
      const search = new URLSearchParams({ channel: id });
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

  const solutionsDetail = isSolutions ? getSolutionsChannelDetail(mode, active.id) : undefined;

  /** Programmatic panel always shows growth copy; other channels follow theme mode. */
  const growthProgrammatic = trafficChannelsByMode.growth.find((c) => c.id === "programmatic");
  const panelChannel =
    isSolutions && active.id === "programmatic" && growthProgrammatic ? growthProgrammatic : active;

  const body =
    isHome && "teaser" in active && typeof active.teaser === "string"
      ? active.teaser
      : isSolutions && solutionsDetail
        ? solutionsDetail.description
        : active.description;
  const points =
    isSolutions && solutionsDetail
      ? [...solutionsDetail.points]
      : !isHome && "points" in active && Array.isArray(active.points)
        ? (active.points as string[])
        : [];

  const isPilotChannel = SOLUTIONS_CHANNEL_IDS.includes(active.id as SolutionsChannelId);
  const hasPilotVideo = isPilotChannel && Boolean(getSolutionsChannelVideo(active.id as SolutionsChannelId));
  const showChannelVisual = (isSolutions && isPilotChannel) || (isHome && hasPilotVideo);
  const showSplitLayout = isSolutions && isPilotChannel;

  const renderChannelVisual = () =>
    showChannelVisual ? (
      <ChannelVisual channelId={active.id as SolutionsChannelId} mode={mode} />
    ) : null;

  return (
    <section id="channels" ref={sectionRef} className="section-band section-band--strip">
      <ModeContentTransition mode={mode} className="section-inner">
        {isHome || isSolutions || !channelIds ? (
          <SectionHeaderRow>
            <SectionHeader
              label={sectionsByMode.channels.label}
              title={section.title}
              description={
                isHome
                  ? "Switch sources here. Open a channel on Solutions for the full inventory write-up."
                  : isSolutions
                    ? "One tab per buying lane — same control plane, deeper copy than the home teaser."
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
        ) : (
          <div className="mb-4 flex justify-end gap-2">
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
        )}

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
                initial={reduced ? false : "hidden"}
                animate="visible"
                exit={reduced ? undefined : "exit"}
                variants={panelVariants}
                className={cn(
                  "transition-panel relative",
                  showSplitLayout && "channel-panel__layout channel-panel__layout--split",
                  showSplitLayout && active.id === "programmatic" && "channel-panel__layout--programmatic",
                )}
              >
                <div className="channel-panel__copy">
                  <motion.p variants={reduced ? undefined : panelItem} className="stat-label text-orange">
                    {panelChannel.tagline}
                  </motion.p>
                  <motion.h3 variants={reduced ? undefined : panelItem} className="card-title mt-2">
                    {panelChannel.title}
                  </motion.h3>
                {showChannelVisual && isHome ? (
                  <motion.div
                    variants={reduced ? undefined : panelItem}
                    className="channel-panel__visual channel-panel__visual--home mt-4"
                  >
                    {renderChannelVisual()}
                  </motion.div>
                ) : null}
                  {showChannelVisual && showSplitLayout ? (
                    <motion.div
                      variants={reduced ? undefined : panelItem}
                      className="channel-panel__visual channel-panel__visual--mobile"
                    >
                      {renderChannelVisual()}
                    </motion.div>
                  ) : null}
                  <motion.p
                    variants={reduced ? undefined : panelItem}
                    className={cn("copy mt-3", !isSolutions && "max-w-3xl")}
                  >
                    {body}
                  </motion.p>
                  {points.length > 0 ? (
                    <motion.ul
                      variants={reduced ? undefined : panelItem}
                      className="channel-inventory-points mt-5 space-y-2.5"
                    >
                      {points.map((point) => (
                        <li key={point} className="channel-inventory-points__item copy text-sm text-muted">
                          {point}
                        </li>
                      ))}
                    </motion.ul>
                  ) : null}
                  <motion.div
                    variants={reduced ? undefined : panelItem}
                    className="mt-6 border-t border-border pt-4"
                  >
                    <p className="stat-label text-muted">Best for</p>
                    <p className="copy mt-1">{panelChannel.bestFor}</p>
                  </motion.div>
                  {isHome ? (
                    <motion.p variants={reduced ? undefined : panelItem} className="mt-5">
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
                    </motion.p>
                  ) : null}
                </div>
                {showChannelVisual && showSplitLayout ? (
                  <motion.div
                    variants={reduced ? undefined : panelItem}
                    className={cn(
                      "channel-panel__visual channel-panel__visual--desktop",
                      active.id === "programmatic" && "channel-panel__visual--programmatic",
                    )}
                  >
                    {renderChannelVisual()}
                  </motion.div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </article>
        </Reveal>
      </ModeContentTransition>
    </section>
  );
}
