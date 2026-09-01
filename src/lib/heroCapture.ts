/** Dev-only: lock Everest cameras to a uniform 0→1 for PNG dump. Production never sets this. */
export const CAPTURE_WIDTH = 1920;
export const CAPTURE_HEIGHT = 1080;

export const heroCapture = {
  enabled: false,
  snap: false,
  progress: 0,
};

export function isHeroCapture() {
  return heroCapture.enabled;
}
