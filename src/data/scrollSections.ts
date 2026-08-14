/** Ordered blocks for section keyboard / mobile nav — must match home sections */
export const scrollSectionIds = [
  "hero",
  "audience",
  "process",
  "routes",
  "cases",
  "promise",
  "pilot",
] as const;

export type ScrollSectionId = (typeof scrollSectionIds)[number];
