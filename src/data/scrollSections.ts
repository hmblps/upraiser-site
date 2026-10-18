/** Ordered blocks for section keyboard / mobile nav — must match home sections */
export const scrollSectionIds = [
  "hero",
  "audience",
  "process",
  "routes",
  "cases",
  "promise",
  "about-us",
  "pilot",
] as const;

export type ScrollSectionId = (typeof scrollSectionIds)[number];
