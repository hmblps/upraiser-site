/** Ordered blocks for section keyboard / mobile nav — must match App.tsx */
export const scrollSectionIds = [
  "hero",
  "audience",
  "difference",
  "process",
  "value",
  "channels",
  "cases",
  "promise",
  "about",
  "contact",
] as const;

export type ScrollSectionId = (typeof scrollSectionIds)[number];
