import { useEffect, useRef, useState } from "react";
import { useScroll } from "../../context/ScrollContext";
import { useTheme } from "../../context/ThemeContext";

type ImageCache = Record<number, HTMLImageElement>;

const FRAME_COUNT = 150;
const LOOKAHEAD = 40;
const IDLE_CONCURRENCY = 8;

function frameUrl(folder: string, index: number) {
  const padded = (index + 1).toString().padStart(4, "0");
  return `/hero/frames/${folder}/frame_${padded}.jpg?v=8`;
}

export function HeroVideoFallback({ variant = "home" }: { variant?: "home" | "expedition" }) {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { registerScrollListener } = useScroll();
  const stageRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number>(0);
  const lastDrawnRef = useRef<HTMLImageElement | null>(null);
  const idleQueueRef = useRef(0);

  const [isMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 899 : false,
  );

  const shotFolder = isMobile ? `${variant}-mobile-${theme}` : `${variant}-${theme}`;

  const imageCache = useRef<ImageCache>({});
  const loading = useRef<Set<number>>(new Set());

  const getFrame = (index: number): HTMLImageElement | null => {
    if (imageCache.current[index]) return imageCache.current[index];
    if (index < 0 || index >= FRAME_COUNT) return null;
    if (loading.current.has(index)) return null;

    loading.current.add(index);
    const img = new Image();
    img.decoding = "async";
    img.src = frameUrl(shotFolder, index);
    const commit = () => {
      imageCache.current[index] = img;
      loading.current.delete(index);
    };
    img.onload = () => {
      if (typeof img.decode === "function") {
        void img.decode().then(commit).catch(commit);
      } else {
        commit();
      }
    };
    img.onerror = () => {
      loading.current.delete(index);
    };
    return null;
  };

  const preloadWindow = (currentIndex: number) => {
    const from = Math.max(0, currentIndex - 8);
    const to = Math.min(FRAME_COUNT - 1, currentIndex + LOOKAHEAD);
    for (let i = from; i <= to; i++) getFrame(i);
  };

  const fillRemainingIdle = () => {
    let inflight = 0;
    const kick = () => {
      while (inflight < IDLE_CONCURRENCY && idleQueueRef.current < FRAME_COUNT) {
        const i = idleQueueRef.current;
        idleQueueRef.current += 1;
        if (imageCache.current[i] || loading.current.has(i)) continue;
        inflight += 1;
        loading.current.add(i);
        const img = new Image();
        img.decoding = "async";
        img.src = frameUrl(shotFolder, i);
        const done = () => {
          inflight -= 1;
          loading.current.delete(i);
          kick();
        };
        img.onload = () => {
          const commit = () => {
            imageCache.current[i] = img;
            done();
          };
          if (typeof img.decode === "function") {
            void img.decode().then(commit).catch(commit);
          } else {
            commit();
          }
        };
        img.onerror = done;
      }
    };
    kick();
  };

  const drawFrame = (targetIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const imgToDraw = imageCache.current[targetIndex] ?? lastDrawnRef.current;
    if (!imgToDraw) return;

    lastDrawnRef.current = imgToDraw;
    ctx.drawImage(imgToDraw, 0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    imageCache.current = {};
    loading.current.clear();
    lastDrawnRef.current = null;
    idleQueueRef.current = 0;

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = isMobile ? 540 : 1280;
      canvas.height = isMobile ? 960 : 720;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (ctx) {
        ctx.fillStyle = theme === "light" ? "#ffffff" : "#050504";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    const first = new Image();
    first.decoding = "async";
    first.src = frameUrl(shotFolder, 0);
    first.onload = () => {
      const show = () => {
        imageCache.current[0] = first;
        lastDrawnRef.current = first;
        drawFrame(0);
        preloadWindow(0);
        fillRemainingIdle();
      };
      if (typeof first.decode === "function") {
        void first.decode().then(show).catch(show);
      } else {
        show();
      }
    };
    first.onerror = () => {
      preloadWindow(0);
      fillRemainingIdle();
    };
  }, [shotFolder, isMobile, theme]);

  useEffect(() => {
    function getStage() {
      if (stageRef.current?.isConnected) return stageRef.current;
      return (
        (document.querySelector(".hero-stage--fly") as HTMLElement | null) ??
        (document.getElementById("hero") as HTMLElement | null)
      );
    }

    const unsub = registerScrollListener((scrollY) => {
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
      unsub();
      cancelAnimationFrame(rafRef.current);
    };
  }, [registerScrollListener, shotFolder]);

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
