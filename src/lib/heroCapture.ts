/** Dev-only: lock Everest cameras to a uniform 0→1 for PNG dump. Production never sets this. */

const isMobile = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("mobile") === "1";
export const CAPTURE_WIDTH = isMobile ? 720 : 1920;
export const CAPTURE_HEIGHT = isMobile ? 1280 : 1080;

export const heroCapture = {
  enabled: false,
  snap: false,
  progress: 0,
};

export function isHeroCapture() {
  return heroCapture.enabled;
}
