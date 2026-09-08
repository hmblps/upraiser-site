/**
 * Shared canvas painters for OEM tablet glass (lite CssTablet + 3D CanvasTexture).
 *
 * OS-like only:
 * - oem-store: slow horizontal ribbon (storefront carousel)
 * - pre-install: live clock + partner install progress
 * - system-ui: live clock + one notification settle-in
 */

export type GlassAnimId = "oem-store" | "pre-install" | "system-ui";

/** Padded OEM stills are 1032×1376; content column is 768 wide, x=132. */
const OEM_STORE = {
  contentX: 132,
  contentW: 768,
  rows: [
    { y: 215, h: 64, speed: 14 },
    { y: 303, h: 64, speed: 11 },
  ] as const,
};

/** pre-install-oobe.png is 1200×1600 with side letterbox; content ≈ x250–949. */
const PRE = {
  clock: { x: 268, y: 10, w: 92, h: 36, size: 22, color: "#e8eaed", bg: "#000000" },
  /** Under Apex Pay subtitle, inside gold partner card. */
  progress: { x: 400, y: 848, w: 400, h: 5, track: "#2a2a2a", fill: "#a8c7fa" },
};

/** system-ui.png padded 1032×1376; content ≈ x132–899. */
const SYS = {
  clock: { x: 148, y: 40, w: 100, h: 36, size: 22, color: "#ffffff", bg: "#000000" },
  /** Aurora expanded notification card */
  notif: { x: 160, y: 328, w: 712, h: 312 },
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
 * oem-store: both large rows drift the same way, slightly different speeds —
 * reads as parallax carousel, not a marketing “shimmer”.
 */
export function paintOemStore(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  timeSec: number,
) {
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  ensureSize(canvas, w, h);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.drawImage(img, 0, 0);

  const { contentX, contentW, rows } = OEM_STORE;
  for (const row of rows) {
    const offset = ((timeSec * row.speed) % contentW + contentW) % contentW;
    ctx.save();
    ctx.beginPath();
    ctx.rect(contentX, row.y, contentW, row.h);
    ctx.clip();
    ctx.fillStyle = "#eef1f4";
    ctx.fillRect(contentX, row.y, contentW, row.h);
    ctx.drawImage(
      img,
      contentX, row.y, contentW, row.h,
      contentX - offset, row.y, contentW, row.h,
    );
    ctx.drawImage(
      img,
      contentX, row.y, contentW, row.h,
      contentX - offset + contentW, row.y, contentW, row.h,
    );
    ctx.restore();
  }
}

/** Live clock + soft install bar under Apex Pay partner row. */
export function paintPreInstall(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  timeSec: number,
) {
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  ensureSize(canvas, w, h);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.drawImage(img, 0, 0);
  paintClock(ctx, PRE.clock);

  // Loop 18s install cycle 8% → 92% (reads as real PAI download).
  const cycle = ((timeSec % 18) / 18);
  const pct = 0.08 + cycle * 0.84;
  const { x, y, w: bw, h: bh, track, fill } = PRE.progress;
  const fillW = Math.max(bh, bw * pct);
  ctx.fillStyle = track;
  ctx.fillRect(x, y, bw, bh);
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, fillW, bh);
}

/** Live clock + one notification settles in once, then holds. */
export function paintSystemUi(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  timeSec: number,
) {
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  ensureSize(canvas, w, h);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { x, y, w: nw, h: nh } = SYS.notif;
  const enterT = Math.min(1, timeSec / 0.95);
  const ease = 1 - Math.pow(1 - enterT, 3);
  const dy = (1 - ease) * -56;

  ctx.drawImage(img, 0, 0);

  // Clear card slot, then redraw card with settle offset.
  ctx.fillStyle = "#000000";
  ctx.fillRect(x, y, nw, nh + 8);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x - 2, y - 60, nw + 4, nh + 70);
  ctx.clip();
  ctx.globalAlpha = 0.35 + 0.65 * ease;
  ctx.drawImage(img, x, y, nw, nh, x, y + dy, nw, nh);
  ctx.restore();

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
  return formatId === "oem-store" || formatId === "pre-install" || formatId === "system-ui";
}
