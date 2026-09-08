/**
 * Glass media for every Routes format — 3D, lite, and CSS fallback
 * all read this file. Do not invent a second feed (HTML mock, WSJ reel, etc.).
 *
 * OEM tablet: pre-install / system-ui OS ticks (clock, progress, notif);
 * oem-store HTML (lite) + padded still with ribbon marquee (3D).
 * CTV Spot = still; CTV Video = loop MP4.
 */
export const FORMAT_VIDEO: Record<string, string> = {
  banner: "/channels/programmatic-feed/formats/banner.mp4",
  native: "/channels/programmatic-feed/formats/native.mp4",
  interstitial: "/channels/programmatic-feed/formats/interstitial.mp4",
  rich: "/channels/programmatic-feed/formats/rich.mp4",
  video: "/channels/programmatic-feed/formats/video.mp4",
  /** CTV Video = living loop; CTV Spot stays still below. */
  "ctv-video": "/channels/oem/screens/ctv-spot.mp4",
};

export const FORMAT_STILL: Record<string, string> = {
  banner: "/channels/programmatic-refs/screens/banner.png",
  native: "/channels/programmatic-refs/screens/native.png",
  interstitial: "/channels/programmatic-refs/screens/interstitial.png",
  rich: "/channels/programmatic-refs/screens/rich-media.png",
  video: "/channels/programmatic-refs/screens/video.png",
  "pre-install": "/channels/oem/screens/pre-install-oobe.png",
  "oem-store": "/channels/oem/screens/oem-store.png",
  "system-ui": "/channels/oem/screens/system-ui.png",
  "ctv-spot": "/channels/oem/screens/ctv-spot.png",
  "ctv-video": "/channels/oem/screens/ctv-spot.png",
};

/** Live HTML on glass (iframe). Tablet oem-store uses HTML on lite; 3D keeps still+canvas. */
export const FORMAT_HTML: Record<string, string> = {
  rich: "/rich-media-ad.html",
  "oem-store": "/channels/oem/oem-store.html",
};

export const RICH_MEDIA_SRC = FORMAT_HTML.rich!;

export function formatVideoSrc(id: string): string | undefined {
  return FORMAT_VIDEO[id];
}

export function formatStillSrc(id: string): string | undefined {
  return FORMAT_STILL[id];
}

export function formatHtmlSrc(id: string): string | undefined {
  return FORMAT_HTML[id];
}
