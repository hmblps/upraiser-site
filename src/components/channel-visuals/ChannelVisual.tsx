import { motion } from "framer-motion";
import type { SiteMode } from "../../data/liveContent";
import type { SolutionsChannelId } from "../../data/solutionsChannels";
import { getSolutionsChannelVideo } from "../../data/solutionsChannelVideos";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../lib/cn";
import { ProgrammaticCarousel } from "./ProgrammaticCarousel";
import { ChannelVisualScene } from "./scenes";
import { Macbook3D } from "./Macbook3D";

const VISUAL_SPRING = { type: "spring" as const, stiffness: 280, damping: 26, mass: 0.85 };

type ChannelVisualProps = {
  channelId: SolutionsChannelId;
  mode: SiteMode;
  className?: string;
};

function ChannelVisualVideo({
  webm,
  mp4,
  channelId,
}: {
  webm?: string;
  mp4?: string;
  channelId: SolutionsChannelId;
}) {
  return (
    <video
      className="channel-visual__video"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-hidden
      data-channel={channelId}
    >
      {webm ? <source src={webm} type="video/webm" /> : null}
      {mp4 ? <source src={mp4} type="video/mp4" /> : null}
    </video>
  );
}

export function ChannelVisual({ channelId, mode, className }: ChannelVisualProps) {
  const reduced = useReducedMotion();
  const video = getSolutionsChannelVideo(channelId);
  const useVideo = Boolean(video?.mp4 || video?.webm) && !reduced;
  const useLiveProgrammatic = channelId === "programmatic";

  return (
    <motion.div
      key={`${mode}-${channelId}-${useLiveProgrammatic ? "live" : useVideo ? "video" : "css"}`}
      className={cn(
        "channel-visual",
        useVideo && !useLiveProgrammatic && "channel-visual--video",
        useLiveProgrammatic && "channel-visual--live",
        className,
      )}
      data-site-mode={mode}
      data-channel={channelId}
      initial={reduced ? false : { opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={VISUAL_SPRING}
      aria-hidden={useLiveProgrammatic ? undefined : true}
    >
      <div className="channel-visual__stage">
        <motion.div
          className="cv-float"
          animate={reduced ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="cv-float__halo cv-float__halo--brand" aria-hidden />
          <span className="cv-float__shadow" aria-hidden />
          <div className="cv-float__subject">
            {useLiveProgrammatic ? (
              <ProgrammaticCarousel mode={mode} reduced={reduced} />
            ) : channelId === "oem" ? (
              <div className="flex items-center justify-center w-full h-[500px]">
                <div className="flex-1 max-w-[700px] h-full">
                  <Macbook3D mode={mode} />
                </div>
                {/* Space reserved for tablet as requested: вставим его 1 маубук... так же отсавь место для планшета */}
                <div className="w-[300px] h-full pointer-events-none opacity-0 flex-shrink-0">Tablet Space</div>
              </div>
            ) : useVideo && video ? (
              <ChannelVisualVideo webm={video.webm} mp4={video.mp4} channelId={channelId} />
            ) : (
              <ChannelVisualScene channelId={channelId} />
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
