export type AccentTone = "gold" | "red";

export function toneAt(index: number): AccentTone {
  return index % 2 === 0 ? "gold" : "red";
}

export function toneAtPattern(index: number, goldIndices: number[]): AccentTone {
  return goldIndices.includes(index) ? "gold" : "red";
}

export function accentTitle(tone: AccentTone): string {
  return tone === "gold" ? "text-orange" : "text-magenta";
}

export function accentLink(tone: AccentTone): string {
  return tone === "gold"
    ? "text-orange transition hover:text-orange-light"
    : "text-magenta transition hover:text-magenta-light";
}

export function accentIconWrap(tone: AccentTone): string {
  return tone === "gold" ? "bg-orange/10 text-orange" : "bg-magenta/10 text-magenta";
}

export function accentBadge(tone: AccentTone): string {
  return tone === "gold"
    ? "rounded-full bg-orange/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-orange"
    : "rounded-full bg-magenta/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-magenta";
}

export function accentCategoryBadge(tone: AccentTone): string {
  return tone === "gold"
    ? "rounded-full bg-orange/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange"
    : "rounded-full bg-magenta/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-magenta";
}

export function accentNumberMuted(tone: AccentTone): string {
  return tone === "gold" ? "text-orange/30" : "text-magenta/30";
}

export function accentNumber(tone: AccentTone): string {
  return accentTitle(tone);
}

export function accentHoverBorder(tone: AccentTone): string {
  return tone === "gold" ? "hover:border-orange/30" : "hover:border-magenta/30";
}

/** Optional tinted card surface (variant 1) — add alongside bg-bg-card to compare with text-only accents. */
export function accentSurface(tone: AccentTone): string {
  return tone === "gold" ? "card-surface-gold" : "card-surface-red";
}

export function accentPanel(tone: AccentTone): string {
  return tone === "gold"
    ? "rounded-xl border border-orange/20 bg-orange/5 p-4"
    : "rounded-xl border border-magenta/20 bg-magenta/5 p-4";
}

export function accentPanelLabel(tone: AccentTone): string {
  return tone === "gold"
    ? "text-xs font-semibold uppercase tracking-wider text-orange"
    : "text-xs font-semibold uppercase tracking-wider text-magenta";
}

export function accentSectionLabel(tone: AccentTone): string {
  return tone === "gold" ? "section-label" : "section-label section-label-red";
}
