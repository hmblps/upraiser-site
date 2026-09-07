import { useEffect, useRef, useState } from "react";
import { useScroll } from "../../context/ScrollContext";
import { useTheme } from "../../context/ThemeContext";

type ImageCache = Record<number, HTMLImageElement>;

const FRAME_COUNT = 150;
const LOOKAHEAD = 40;
const IDLE_CONCURRENCY = 8;

function frameUrl(folder: string, index: number) {
  const padded = (index + 1).toString().padStart(4, "0");
  return `/hero/frames/${folder}/frame_${padded}.jpg?v=9`;
}

function belongsToFolder(img: HTMLImageElement, folder: string) {
  return img.src.includes(`/hero/frames/${folder}/`);
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
  // Cached hits can complete before onload is attached. Do not treat
  // complete+0px as an error — that is the unloaded/not-yet-decoded state.
  if (img.complete && img.naturalWidth > 0) succeed();
}

export function HeroVideoFallback({ variant = "home" }: { variant?: "home" | "expedition" }) {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { registerScrollListener } = useScroll();
  const stageRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number>(0);
  const lastDrawnRef = useRef<HTMLImageElement | null>(null);
  const folderRef = useRef("");

  const [isMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 899 : false,
  );

  const shotFolder = isMobile ? `${variant}-mobile-${theme}` : `${variant}-${theme}`;
  folderRef.current = shotFolder;

  const imageCache = useRef<ImageCache>({});
  const loading = useRef<Set<number>>(new Set());

  const paintPaper = (folder: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    ctx.fillStyle = folder.includes("light") ? "#ffffff" : "#050504";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    let cancelled = false;
    const folder = shotFolder;
    const cache: ImageCache = {};
    imageCache.current = cache;
    loading.current = new Set();
    lastDrawnRef.current = null;

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = isMobile ? 540 : 1280;
      canvas.height = isMobile ? 960 : 720;
      paintPaper(folder);
    }

    const live = () => !cancelled && folderRef.current === folder;

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
          cache[index] = img;
        },
        () => loading.current.delete(index),
      );
    };

    const drawFrame = (targetIndex: number) => {
      if (!live()) return;
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;
      const ctx = canvasEl.getContext("2d", { alpha: false });
      if (!ctx) return;

      const candidate = cache[targetIndex] ?? lastDrawnRef.current;
      if (!candidate || !belongsToFolder(candidate, folder)) {
        paintPaper(folder);
        return;
      }
      lastDrawnRef.current = candidate;
      ctx.drawImage(candidate, 0, 0, canvasEl.width, canvasEl.height);
    };

    const preloadWindow = (currentIndex: number) => {
      const from = Math.max(0, currentIndex - 8);
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
            if (live()) cache[i] = img;
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
        cache[0] = first;
        lastDrawnRef.current = first;
        drawFrame(0);
        preloadWindow(0);
        fillIdle();
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

    const unsub = registerScrollListener((scrollY) => {
      if (!live()) return;
      const stage = getStage();
      stageRef.current = stage;
      if (!stage || !canvasRef.current) return;

      const top = stage.getBoundingClientRect().top + scrollY;
      const runway = Math.max(stage.offsetHeight - window.innerHeight, 1);
      const progress = Math.max(0, Math.min(1, (scrollY - top) / runway));
      const targetFrame = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        drawFrame(targetFrame);
        preloadWindow(targetFrame);
      });
    });

    return () => {
      cancelled = true;
      unsub();
      cancelAnimationFrame(rafRef.current);
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
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
}
