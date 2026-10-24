/**
 * Web Haptics Utility (iOS Taptic Engine + Android Web Vibration API)
 *
 * Provides tactile hardware feedback for mobile web interactions:
 * - Android (Chrome, Samsung Internet, Opera, Edge): Native navigator.vibrate()
 * - iOS 18+ (Safari & WebKit): Native Taptic Engine trigger via hidden switch element
 */

export type HapticFeedbackType = "light" | "selection" | "medium" | "success" | "error";

let iosHapticLabel: HTMLLabelElement | null = null;

function ensureIosHapticElement(): HTMLLabelElement | null {
  if (typeof document === "undefined") return null;
  if (!iosHapticLabel) {
    try {
      const label = document.createElement("label");
      label.setAttribute("aria-hidden", "true");
      label.style.position = "fixed";
      label.style.left = "-9999px";
      label.style.top = "-9999px";
      label.style.opacity = "0";
      label.style.pointerEvents = "none";
      label.style.width = "1px";
      label.style.height = "1px";
      label.style.overflow = "hidden";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.setAttribute("switch", "");
      input.tabIndex = -1;

      label.appendChild(input);
      document.body.appendChild(label);

      iosHapticLabel = label;
    } catch {
      return null;
    }
  }
  return iosHapticLabel;
}

function triggerIosHaptic(type: HapticFeedbackType): void {
  const el = ensureIosHapticElement();
  if (!el) return;

  try {
    el.click();

    if (type === "success") {
      setTimeout(() => {
        try {
          el.click();
        } catch {}
      }, 70);
    } else if (type === "error") {
      setTimeout(() => {
        try {
          el.click();
        } catch {}
      }, 90);
    }
  } catch {}
}

/**
 * Triggers hardware tactile haptic feedback.
 *
 * @param type "light" (12ms micro-click) | "selection" (10ms select) | "medium" (22ms press) | "success" ([15, 45, 25] confirmation) | "error"
 */
export function triggerHaptic(type: HapticFeedbackType = "light"): void {
  if (typeof window === "undefined") return;

  // 1. Android & Standards-Compliant Web Vibration API
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
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
    } catch {}
  }

  // 2. iOS 18+ Taptic Engine trigger (via native switch element)
  try {
    triggerIosHaptic(type);
  } catch {}
}
