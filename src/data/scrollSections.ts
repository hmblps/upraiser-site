/** Ordered blocks for section keyboard / mobile nav — must match App.tsx */
export const scrollSectionIds = [
  "hero",
  "audience",
  "value",
  "promise",
  "difference",
  "channels",
  "cases",
  "about",
  "process",
  "contact",
] as const;

export type ScrollSectionId = (typeof scrollSectionIds)[number];
