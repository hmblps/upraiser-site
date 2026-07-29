import type { SolutionsChannelId } from "./solutionsChannels";

export type ChannelVideoSources = {
  webm?: string;
  mp4?: string;
};

/** HyperFrames pilot loops — transparent WebM + MP4 fallback. Programmatic uses live CSS carousel. */
export const SOLUTIONS_CHANNEL_VIDEOS: Partial<Record<SolutionsChannelId, ChannelVideoSources>> = {
  performance: {
    mp4: "/channels/performance.mp4",
  },
};

export function getSolutionsChannelVideo(channelId: SolutionsChannelId): ChannelVideoSources | undefined {
  return SOLUTIONS_CHANNEL_VIDEOS[channelId];
}
