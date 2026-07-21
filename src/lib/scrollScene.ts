import { clamp } from "./clamp";

/** Sticky runway: progress 0→1 while section scrolls through viewport. */
export function runwayProgress(
  sectionTop: number,
  sectionHeight: number,
  viewportHeight: number,
  enterOffset = 0,
): number {
  const scrollRange = sectionHeight - viewportHeight;
  if (scrollRange <= 0) return 0;
  const scrolled = -sectionTop - enterOffset;
  return clamp(scrolled / scrollRange, 0, 1);
}

/**
 * Anchor element progress: 0 when anchor top crosses startLine, 1 near endLine.
 * Used when animation should start after header copy is on screen.
 */
export function anchorProgress(
  anchorTop: number,
  anchorHeight: number,
  viewportHeight: number,
  startLine = 0.88,
  endLine = 0.22,
): number {
  const startY = viewportHeight * startLine;
  const endY = viewportHeight * endLine;
  const range = startY - endY + anchorHeight * 0.45;
  if (range <= 0) return anchorTop <= startY ? 1 : 0;
  return clamp((startY - anchorTop) / range, 0, 1);
}

/** Viewport band — section rect vs viewport thresholds (Process rail). */
export function viewportBandProgress(
  sectionTop: number,
  sectionHeight: number,
  viewportHeight: number,
  bandStart = 0.72,
  bandEnd = 0.28,
  heightBias = 0.35,
): number {
  const start = viewportHeight * bandStart;
  const end = viewportHeight * bandEnd;
  return clamp((start - sectionTop) / (start - end + sectionHeight * heightBias), 0, 1);
}

/** Map global 0→1 progress to per-item [start, end] for sequential reveals. */
export function stagedRevealRange(index: number, total: number, lead = 0.06, trail = 0.1) {
  const span = 1 - lead - trail;
  const step = span / Math.max(total, 1);
  const start = lead + index * step;
  const end = start + step * 0.92;
  return [start, end] as const;
}
