/** Shared hover animation timing for value-bento lucide icons. */
export const VALUE_ICON_SYNC = {
  duration: 0.55,
  ease: [0.4, 0, 0.2, 1] as const,
} as const;

export const VALUE_ICON_TRANSITION = {
  duration: VALUE_ICON_SYNC.duration,
  ease: VALUE_ICON_SYNC.ease,
} as const;
