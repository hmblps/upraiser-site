/** Ordered blocks for section arrow navigation */
export const scrollSectionIds = [
  "hero",
  "audience",
  "value",
  "promise",
  "difference",
  "objectives",
  "channels",
  "testimonials",
  "cases",
  "technology",
  "about",
  "process",
  "contact",
] as const;

export type ScrollSectionId = (typeof scrollSectionIds)[number];
