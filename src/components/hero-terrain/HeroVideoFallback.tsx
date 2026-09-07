import { useEffect, useRef, useState } from "react";
import { flyProgressForStage, useHeroFlyOptional } from "../../context/HeroFlyContext";
import { useScroll } from "../../context/ScrollContext";
import { useTheme } from "../../context/ThemeContext";

type FrameSource = CanvasImageSource & { width?: number; height?: number };

const FRAME_COUNT = 150;
const LOOKAHEAD = 72;
const IDLE_CONCURRENCY = 3;
const CACHE_BUST = "v=10";

function frameUrl(folder: string, index: number) {
  const padded = (index + 1).toString().padStart(4, "0");
  return `/hero/frames/${folder}/frame_${padded}.jpg?${CACHE_BUST}`;
}

function belongsToFolder(src: string, folder: string) {
  return src.includes(`/hero/frames/${folder}/`);
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

function toPaintSource(img: HTMLImageElement, folder: string, done: (src: FrameSource | null) => void) {
  if (typeof createImageBitmap === "function") {
    void createImageBitmap(img)
      .then((bmp) => {
        (bmp as FrameSource & { __folder?: string }).__folder = folder;
        done(bmp);
      })
      .catch(() => {
        (img as FrameSource & { __folder?: string }).__folder = folder;
        done(img);
      });
    return;
  }
  (img as FrameSource & { __folder?: string }).__folder = folder;
  done(img);
}

export function HeroVideoFallback({ variant = "home" }: { variant?: "home" | "expedition" }) {
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

  const [isMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 899 : false,
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

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = isMobile ? 540 : 1280;
      canvas.height = isMobile ? 960 : 720;
      ctxRef.current = canvas.getContext("2d", { alpha: false, desynchronized: true });
      paintPaper(folder);
    }

    const live = () => !cancelled && folderRef.current === folder;

    const store = (index: number, img: HTMLImageElement) => {
      toPaintSource(img, folder, (src) => {
        if (!live() || !src) return;
        cache[index] = src;
      });
    };

    const getFrame = (index: number) => {
      if (!live() || index < 0 || index >= FRAME_COUNT) return;
      if (cache[index] || loading.current.has(index)) return;
      loading.current.add(index);
      const img = new Image();
      img.decoding = "async";
      img.src = frameUrl(folder, index);
      whenReady(
        img,
        () => {
          loading.current.delete(index);
          if (!live()) return;
          store(index, img);
        },
        () => loading.current.delete(index),
      );
    };

    const pickFrame = (targetIndex: number) => {
      if (cache[targetIndex]) return cache[targetIndex];
      for (let d = 1; d <= 16; d += 1) {
        if (cache[targetIndex - d]) return cache[targetIndex - d];
        if (cache[targetIndex + d]) return cache[targetIndex + d];
      }
      return lastDrawnRef.current;
    };

    const drawFrame = (targetIndex: number) => {
      if (!live()) return;
      const canvasEl = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvasEl || !ctx) return;

      const candidate = pickFrame(targetIndex);
      const folderTag = candidate ? (candidate as FrameSource & { __folder?: string }).__folder : "";
      if (!candidate || (folderTag && folderTag !== folder)) {
        paintPaper(folder);
        return;
      }
      if (targetIndex === lastIndexRef.current && lastDrawnRef.current === candidate) return;
      lastDrawnRef.current = candidate;
      lastIndexRef.current = targetIndex;
      ctx.drawImage(candidate, 0, 0, canvasEl.width, canvasEl.height);
    };

    const preloadWindow = (currentIndex: number) => {
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
        const img = new Image();
        img.decoding = "async";
        img.src = frameUrl(folder, i);
        const done = () => {
          inflight -= 1;
          loading.current.delete(i);
          fillIdle();
        };
        whenReady(
          img,
          () => {
            if (live()) store(i, img);
            done();
          },
          done,
        );
      }
    };

    const first = new Image();
    first.decoding = "async";
    first.src = frameUrl(folder, 0);
    whenReady(
      first,
      () => {
        if (!live()) return;
        toPaintSource(first, folder, (src) => {
          if (!live() || !src) return;
          cache[0] = src;
          lastDrawnRef.current = src;
          drawFrame(0);
          preloadWindow(0);
          fillIdle();
        });
      },
      () => {
        if (cancelled) return;
        preloadWindow(0);
        fillIdle();
      },
    );

    function getStage() {
      if (stageRef.current?.isConnected) return stageRef.current;
      return (
        (document.querySelector(".hero-stage--fly") as HTMLElement | null) ??
        (document.getElementById("hero") as HTMLElement | null)
      );
    }

    const unsub = registerScrollListener(() => {
      if (!live()) return;
      const stage = getStage();
      stageRef.current = stage;
      if (!stage || !canvasRef.current) return;

      const progress = flyProgressRef.current?.current ?? flyProgressForStage(stage);
      const targetFrame = Math.min(FRAME_COUNT - 1, Math.floor(progress * (FRAME_COUNT - 1)));
      drawFrame(targetFrame);
      preloadWindow(targetFrame);
    });

    return () => {
      cancelled = true;
      unsub();
      for (const src of Object.values(cache)) {
        if (typeof ImageBitmap !== "undefined" && src instanceof ImageBitmap) src.close();
      }
    };
  }, [shotFolder, isMobile, theme, registerScrollListener]);

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
          objectPosition: "center 62%",
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
}
