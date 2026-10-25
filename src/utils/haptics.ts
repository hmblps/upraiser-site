/**
 * Web Haptics Utility (Mobile Web Vibration API)
 *
 * Provides tactile hardware feedback for mobile interactions (Android & standard devices).
 * Strictly gated to touch devices (coarse pointers).
 * Never creates synthetic DOM elements or disrupts focus/clicks.
 */

export type HapticFeedbackType = "light" | "selection" | "medium" | "success" | "error";

/**
 * Triggers hardware tactile haptic feedback on mobile devices.
 *
 * @param type "light" (12ms) | "selection" (10ms) | "medium" (22ms) | "success" ([15, 45, 25]) | "error"
 */
export function triggerHaptic(type: HapticFeedbackType = "light"): void {
  if (typeof window === "undefined" || typeof navigator === "undefined") return;

  // 1. Never execute on desktop/mouse environments (prevent any possible event disruption)
  if (!window.matchMedia("(pointer: coarse)").matches) return;

  // 2. Standards-Compliant Web Vibration API
  if (typeof navigator.vibrate === "function") {
    try {
      switch (type) {
        case "light":
          navigator.vibrate(12);
          break;
        case "selection":
          navigator.vibrate(10);
          break;
        case "medium":
          navigator.vibrate(22);
          break;
        case "success":
          // Confident double-pulse: [15ms tap, 45ms pause, 25ms firm tap]
          navigator.vibrate([15, 45, 25]);
          break;
        case "error":
          navigator.vibrate([30, 60, 30]);
          break;
      }
    } catch {
      // Ignore vibration errors gracefully
    }
  }
}
