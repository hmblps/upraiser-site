/**
 * Glass media for every Routes format — 3D, lite, and CSS fallback
 * all read this file. Do not invent a second feed (HTML mock, WSJ reel, etc.).
 *
 * App Growth glass:
 * - banner / native / interstitial = stills
 * - rich = LOCKED still on GLB glass (`rich-media.png`) — same path as Video/Banner.
 *   Never restore a CSS iframe overlay on desktop 3D (misaligns under yaw).
 *   Lite / mobile may still use FORMAT_HTML.rich for live shredder.
 * - video = `video.png` poster + `video.mp4` on glass
 *
 * OEM tablet: pre-install / system-ui OS ticks; oem-store still (marquee off).
 * CTV Spot = still; CTV Video = loop MP4.
 */
export const FORMAT_VIDEO: Record<string, string> = {
  rich: "/channels/programmatic-feed/formats/rich.mp4",
  video: "/channels/programmatic-feed/formats/video.mp4",
  /** CTV Video = living loop; CTV Spot stays still below. */
  "ctv-video": "/channels/oem/screens/ctv-spot.mp4",
};

export const FORMAT_STILL: Record<string, string> = {
  banner: "/channels/programmatic-refs/screens/banner.png",
  native: "/channels/programmatic-refs/screens/native.png",
  interstitial: "/channels/programmatic-refs/screens/interstitial.png",
  /** LOCKED glass bake (HTML → PNG). Bump ?v= only when re-baking the creative. */
  rich: "/channels/programmatic-refs/screens/rich-media.png?v=9",
  video: "/channels/programmatic-refs/screens/video.png",
  "pre-install": "/channels/oem/screens/pre-install-oobe.png?v=4",
  "oem-store": "/channels/oem/screens/oem-store.png?v=7",
  "system-ui": "/channels/oem/screens/system-ui.png?v=3",
  "ctv-spot": "/channels/oem/screens/ctv-spot.png",
  "ctv-video": "/channels/oem/screens/ctv-spot.png",
};

/** Live HTML — lite/mobile Rich + OEM store. Desktop Rich 3D uses FORMAT_STILL.rich. */
export const FORMAT_HTML: Record<string, string> = {
  rich: "/rich-media-ad.html",
  "oem-store": "/channels/oem/oem-store.html",
};

/** Open ING destination — 3D glass tap + live HTML CTA. */
export const RICH_MEDIA_CTA_HREF = "https://zerofee.ing";

/** Rich Media glass poster (ING). Desktop 3D = still on GLB; lite may use HTML. */
export const RICH_MEDIA_SRC = FORMAT_STILL.rich;

export function formatVideoSrc(id: string): string | undefined {
  return FORMAT_VIDEO[id];
}

export function formatStillSrc(id: string): string | undefined {
  return FORMAT_STILL[id];
}

export function formatHtmlSrc(id: string): string | undefined {
  return FORMAT_HTML[id];
}
