export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Hermite smoothstep — same curve as three.js MathUtils.smoothstep. */
export function smoothstep(x: number, min: number, max: number) {
  if (x <= min) return 0;
  if (x >= max) return 1;
  const t = (x - min) / (max - min);
  return t * t * (3 - 2 * t);
}
