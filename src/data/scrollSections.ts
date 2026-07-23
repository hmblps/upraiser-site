/** Ordered blocks for section keyboard nav on the home pitch page */
export const scrollSectionIds = [
  "hero",
  "audience",
  "difference",
  "process",
  "channels",
  "cases",
  "promise",
  "pilot",
] as const;

export type ScrollSectionId = (typeof scrollSectionIds)[number];
