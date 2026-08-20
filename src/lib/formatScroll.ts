/** Virtual scroll runway per format card (desktop sticky section). */
export const FORMAT_SCROLL_ITEM_HEIGHT = 1000;

/** Map sticky progress 0→1 to active format index. */
export function progressToFormatIndex(progress: number, count: number): number {
  const raw = progress * count;
  return Math.min(Math.max(0, Math.floor(raw)), count - 1);
}

/** Scroll offset inside section for format index (center of slot). */
export function formatScrollTargetY(
  sectionTop: number,
  sectionHeight: number,
  index: number,
  count: number,
): number {
  const scrollable = Math.max(1, sectionHeight - window.innerHeight);
  const center = (index + 0.5) / count;
  return sectionTop + scrollable * center;
}
