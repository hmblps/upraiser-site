/**
 * Shared canvas painters for OEM tablet glass (lite CssTablet + 3D CanvasTexture).
 *
 * OS-like only:
 * - pre-install: live clock
 * - system-ui: live clock (notif settle-in disabled — cut sushi after PNG crop)
 * - oem-store: still only (marquee row windows broke after storefront zoom)
 */

export type GlassAnimId = "oem-store" | "pre-install" | "system-ui";

/** pre-install-oobe.png — ?bake=1 densified 900×1200; partner = Revolut. */
const PRE = {
  clock: { x: 20, y: 15, w: 70, h: 28, size: 18, color: "#e8eaed", bg: "#000000" },
};

/** system-ui.png (900×1200) — content inset on matching black pads (~86% width). */
const SYS = {
  clock: { x: 100, y: 45, w: 110, h: 36, size: 23, color: "#ffffff", bg: "#050505" },
  /** Kept for a future re-tuned settle-in; paintSystemUi is still+clock only. */
  notif: { x: 63, y: 366, w: 774, h: 600 },
};

function ensureSize(canvas: HTMLCanvasElement, w: number, h: number) {
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
}

function pad2(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function nowClock() {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function paintClock(
  ctx: CanvasRenderingContext2D,
  box: { x: number; y: number; w: number; h: number; size: number; color: string; bg: string },
) {
  ctx.fillStyle = box.bg;
  ctx.fillRect(box.x, box.y, box.w, box.h);
  ctx.fillStyle = box.color;
  ctx.font = `500 ${box.size}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(nowClock(), box.x + 4, box.y + box.h / 2 + 1);
}

/** Full static frame (used for reduced-motion / first paint). */
export function paintStill(canvas: HTMLCanvasElement, img: HTMLImageElement) {
  ensureSize(canvas, img.naturalWidth || img.width, img.naturalHeight || img.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(img, 0, 0);
}

/**
 * oem-store: still fill only. Marquee row windows were calibrated to an older
 * crop and painted white seams across featured logos after the zoom pass.
 */
export function paintOemStore(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  _timeSec: number,
) {
  paintStill(canvas, img);
}

/** Live clock only — progress bar over partner subtitle read as a cracked UI. */
export function paintPreInstall(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  _timeSec: number,
) {
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  ensureSize(canvas, w, h);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.drawImage(img, 0, 0);
  paintClock(ctx, PRE.clock);
}

/** Live clock only — notif settle-in cut a black seam across Aurora sushi
 * after the system-ui.png crop changed (old SYS.notif box no longer matched). */
export function paintSystemUi(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  _timeSec: number,
) {
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  ensureSize(canvas, w, h);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.drawImage(img, 0, 0);
  paintClock(ctx, SYS.clock);
}

export function paintGlassAnim(
  id: GlassAnimId,
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  timeSec: number,
  reducedMotion: boolean,
) {
  if (reducedMotion) {
    paintStill(canvas, img);
    if (id === "pre-install" || id === "system-ui") {
      const ctx = canvas.getContext("2d");
      if (ctx) paintClock(ctx, id === "pre-install" ? PRE.clock : SYS.clock);
    }
    return;
  }
  if (id === "oem-store") {
    paintOemStore(canvas, img, timeSec);
    return;
  }
  if (id === "pre-install") {
    paintPreInstall(canvas, img, timeSec);
    return;
  }
  paintSystemUi(canvas, img, timeSec);
}

export function isAnimatedTabletGlass(formatId: string): formatId is GlassAnimId {
  // CanvasTexture path for all OEM tablet formats — same math as Pre-install (no TextureLoader crop).
  return formatId === "pre-install" || formatId === "system-ui" || formatId === "oem-store";
}
