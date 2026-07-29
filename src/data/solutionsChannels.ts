/** Flat channel rail on /solutions — matches buying lanes, no App Growth / OEM tier tabs. */
export const SOLUTIONS_CHANNEL_IDS = [
  "programmatic",
  "oem",
  "performance",
  "social",
  "rewarded",
  "ctv",
  "retargeting",
  "native",
  "influencer",
] as const;

export type SolutionsChannelId = (typeof SOLUTIONS_CHANNEL_IDS)[number];

export function sortSolutionsChannels<T extends { id: string }>(channels: readonly T[]): T[] {
  const order = new Map(SOLUTIONS_CHANNEL_IDS.map((id, index) => [id, index]));
  return [...channels]
    .filter((c) => order.has(c.id as SolutionsChannelId))
    .sort((a, b) => (order.get(a.id as SolutionsChannelId) ?? 99) - (order.get(b.id as SolutionsChannelId) ?? 99));
}
