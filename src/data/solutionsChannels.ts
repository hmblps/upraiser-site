export const SOLUTIONS_CHANNEL_IDS = [
  "oem",
  "programmatic",
  "performance",
] as const;

export type SolutionsChannelId = (typeof SOLUTIONS_CHANNEL_IDS)[number];

export function sortSolutionsChannels<T extends { id: string }>(channels: readonly T[]): T[] {
  const order = new Map(SOLUTIONS_CHANNEL_IDS.map((id, index) => [id, index]));
  return [...channels]
    .filter((c) => order.has(c.id as SolutionsChannelId))
    .sort((a, b) => (order.get(a.id as SolutionsChannelId) ?? 99) - (order.get(b.id as SolutionsChannelId) ?? 99));
}
