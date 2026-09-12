import { useEffect, useRef, useState } from "react";
import { flyProgressForStage, useHeroFlyOptional } from "../../context/HeroFlyContext";
import { useScroll } from "../../context/ScrollContext";
import { useTheme } from "../../context/ThemeContext";

type FrameSource = CanvasImageSource & { width?: number; height?: number };

const FRAME_COUNT = 150;
const LOOKAHEAD = 72;
const IDLE_CONCURRENCY = 8;
const CACHE_BUST = "v=10";

function frameUrl(folder: string, index: number) {
  const padded = (index + 1).toString().padStart(4, "0");
  return `/hero/frames/${folder}/frame_${padded}.jpg?${CACHE_BUST}`;
}

function whenReady(img: HTMLImageElement, ok: () => void, fail: () => void) {
  let settled = false;
  const succeed = () => {
    if (settled) return;
    settled = true;
    if (typeof img.decode === "function") {
      void img.decode().then(ok).catch(ok);
    } else {
      ok();
    }
  };
  img.onload = succeed;
  img.onerror = () => {
    if (settled) return;
    settled = true;
    fail();
  };
  if (img.complete && img.naturalWidth > 0) succeed();
}

function tagSource(src: FrameSource, folder: string) {
  (src as FrameSource & { __folder?: string }).__folder = folder;
  return src;
}

/** Cover-fit a frame into the canvas. Light captures keep a paper fade at the foot. */
function drawCoverFrame(
  ctx: CanvasRenderingContext2D,
  src: FrameSource,
  canvas: HTMLCanvasElement,
  folder: string,
) {
  const srcW = src.width || canvas.width;
  const srcH = src.height || canvas.height;
  if (srcW <= 0 || srcH <= 0) {
    ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
    return;
  }

  const cropBottom = folder.includes("light")
    ? folder.includes("mobile")
      ? 0.18
      : 0.22
    : 0;
  const usableH = srcH * (1 - cropBottom);
  const scale = Math.max(canvas.width / srcW, canvas.height / usableH);
  const dw = srcW * scale;
  const dh = usableH * scale;
  const dx = (canvas.width - dw) / 2;
  const focusY = folder.includes("light") ? 0.42 : 0.5;
  let dy = canvas.height / 2 - dh * focusY;
  dy = Math.min(0, Math.max(canvas.height - dh, dy));
  ctx.drawImage(src, 0, 0, srcW, usableH, dx, dy, dw, dh);
}

export function HeroVideoFallback({
  variant = "home",
  scrub,
  forceMobile,
}: {
  variant?: "home" | "expedition";
  /** 0–1. Dev scrubber: paint this progress, ignore page scroll. */
  scrub?: number;
  forceMobile?: boolean;
}) {
  const { theme } = useTheme();
  const heroFly = useHeroFlyOptional();
  const flyProgressRef = useRef(heroFly?.progressRef);
  flyProgressRef.current = heroFly?.progressRef;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const { registerScrollListener } = useScroll();
  const stageRef = useRef<HTMLElement | null>(null);
  const lastDrawnRef = useRef<FrameSource | null>(null);
  const lastIndexRef = useRef(-1);
  const folderRef = useRef("");
  const applyProgressRef = useRef<(progress: number) => void>(() => {});
  const scrubRef = useRef(scrub);
  scrubRef.current = scrub;

  const [isMobile] = useState(() =>
    forceMobile ?? (typeof window !== "undefined" ? window.innerWidth <= 899 : false),
  );

  const shotFolder = isMobile ? `${variant}-mobile-${theme}` : `${variant}-${theme}`;
  folderRef.current = shotFolder;

  const imageCache = useRef<Record<number, FrameSource>>({});
  const loading = useRef<Set<number>>(new Set());

  const paintPaper = (folder: string) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.fillStyle = folder.includes("light") ? "#ffffff" : "#050504";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    let cancelled = false;
    const folder = shotFolder;
    const cache: Record<number, FrameSource> = {};
    imageCache.current = cache;
    loading.current = new Set();
    lastDrawnRef.current = null;
    lastIndexRef.current = -1;
    const targetRef = { current: 0 };
    const paintedIndexRef = { current: -1 };
    const pendingImgs = new Set<HTMLImageElement>();

    const abortImg = (img: HTMLImageElement) => {
      img.onload = null;
      img.onerror = null;
      img.src = "";
    };

    const loadImg = () => {
      const img = new Image();
      img.decoding = "async";
      pendingImgs.add(img);
      return img;
    };

    const canvas = canvasRef.current;
    if (canvas) {
      const nextW = isMobile ? 720 : 1920;
      const nextH = isMobile ? 1280 : 1080;
      if (canvas.width !== nextW || canvas.height !== nextH) {
        canvas.width = nextW;
        canvas.height = nextH;
      }
      // Opaque 2d — desynchronized:true flickered blank on Windows Intel.
      ctxRef.current = canvas.getContext("2d", { alpha: false }) ?? canvas.getContext("2d");
      paintPaper(folder);
    }

    const live = () => !cancelled && folderRef.current === folder;

    const pickFrame = (targetIndex: number) => {
      if (cache[targetIndex]) return { src: cache[targetIndex], index: targetIndex };
      let bestIndex = -1;
      let bestDist = Infinity;
      for (const key in cache) {
        const i = Number(key);
        const d = Math.abs(i - targetIndex);
        if (d < bestDist) {
          bestDist = d;
          bestIndex = i;
        }
      }
      if (bestIndex >= 0) return { src: cache[bestIndex]!, index: bestIndex };
      if (lastDrawnRef.current) return { src: lastDrawnRef.current, index: paintedIndexRef.current };
      return null;
    };

    const drawFrame = (targetIndex: number) => {
      if (!live()) return;
      const canvasEl = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvasEl || !ctx) return;

      const picked = pickFrame(targetIndex);
      if (!picked) return;

      if (targetIndex === lastIndexRef.current && lastDrawnRef.current === picked.src) return;
      lastDrawnRef.current = picked.src;
      lastIndexRef.current = targetIndex;
      paintedIndexRef.current = picked.index;
      drawCoverFrame(ctx, picked.src, canvasEl, folder);
    };

    const store = (index: number, img: HTMLImageElement) => {
      if (!live()) return;
      cache[index] = tagSource(img, folder);
      const target = targetRef.current;
      const painted = paintedIndexRef.current;
      if (painted < 0 || Math.abs(index - target) < Math.abs(painted - target)) {
        drawFrame(target);
      }
    };

    const getFrame = (index: number) => {
      if (!live() || index < 0 || index >= FRAME_COUNT) return;
      if (cache[index] || loading.current.has(index)) return;
      loading.current.add(index);
      const img = loadImg();
      img.src = frameUrl(folder, index);
      whenReady(
        img,
        () => {
          loading.current.delete(index);
          store(index, img);
        },
        () => loading.current.delete(index),
      );
    };

    const preloadWindow = (currentIndex: number) => {
      getFrame(currentIndex);
      const from = Math.max(0, currentIndex - 6);
      const to = Math.min(FRAME_COUNT - 1, currentIndex + LOOKAHEAD);
      for (let i = from; i <= to; i++) getFrame(i);
    };

    let idleAt = 0;
    let inflight = 0;
    const fillIdle = () => {
      if (cancelled) return;
      while (inflight < IDLE_CONCURRENCY && idleAt < FRAME_COUNT) {
        const i = idleAt;
        idleAt += 1;
        if (cache[i] || loading.current.has(i)) continue;
        inflight += 1;
        loading.current.add(i);
        const img = loadImg();
        img.src = frameUrl(folder, i);
        const done = () => {
          inflight -= 1;
          loading.current.delete(i);
          fillIdle();
        };
        whenReady(
          img,
          () => {
            store(i, img);
            done();
          },
          done,
        );
      }
    };

    const first = loadImg();
    first.src = frameUrl(folder, 0);
    whenReady(
      first,
      () => {
        if (!live()) return;
        store(0, first);
        preloadWindow(0);
        fillIdle();
      },
      () => {
        if (cancelled) return;
        preloadWindow(0);
        fillIdle();
      },
    );

    function applyProgress(progress: number) {
      const targetFrame = Math.min(FRAME_COUNT - 1, Math.floor(progress * (FRAME_COUNT - 1)));
      targetRef.current = targetFrame;
      drawFrame(targetFrame);
      preloadWindow(targetFrame);
    }
    applyProgressRef.current = applyProgress;

    function getStage() {
      if (stageRef.current?.isConnected) return stageRef.current;
      return (
        (document.querySelector(".hero-stage--fly") as HTMLElement | null) ??
        (document.getElementById("hero") as HTMLElement | null)
      );
    }

    const unsub = registerScrollListener(() => {
      if (!live()) return;
      if (scrubRef.current != null) return;
      const stage = getStage();
      stageRef.current = stage;
      if (!stage || !canvasRef.current) return;
      applyProgress(flyProgressRef.current?.current ?? flyProgressForStage(stage));
    });

    if (scrubRef.current != null) {
      applyProgress(scrubRef.current);
    }

    return () => {
      cancelled = true;
      unsub();
      pendingImgs.forEach(abortImg);
      pendingImgs.clear();
    };
  }, [shotFolder, isMobile, theme, registerScrollListener]);

  useEffect(() => {
    if (scrub == null) return;
    applyProgressRef.current(scrub);
  }, [scrub]);

  return (
    <div className="absolute inset-0 z-0 bg-bg pointer-events-none overflow-hidden">
      <canvas
        ref={canvasRef}
        className="h-full w-full object-cover"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "cover",
          objectPosition: theme === "light" ? "center 46%" : "center 62%",
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
}
