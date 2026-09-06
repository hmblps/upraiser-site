import { useEffect, useRef, useState } from "react";
import { useScroll } from "../../context/ScrollContext";
import { useTheme } from "../../context/ThemeContext";

type ImageCache = Record<number, HTMLImageElement>;

export function HeroVideoFallback({ variant = "home" }: { variant?: "home" | "expedition" }) {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { registerScrollListener } = useScroll();
  const stageRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number>(0);

  const [debugInfo, setDebugInfo] = useState({ scrollY: 0, top: 0, runway: 0, progress: 0, targetFrame: 0, loaded: 0, errors: 0 });

  const [isMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 899 : false
  );

  const shotFolder = isMobile ? `${variant}-mobile-${theme}` : `${variant}-${theme}`;
  
  const imageCache = useRef<ImageCache>({});
  const loading = useRef<Set<number>>(new Set());
  const errorCount = useRef(0);

  const updateDebug = (targetFrame: number, progress: number, scrollY: number, top: number, runway: number) => {
    setDebugInfo({
      scrollY: Math.round(scrollY),
      top: Math.round(top),
      runway: Math.round(runway),
      progress: Number(progress.toFixed(3)),
      targetFrame,
      loaded: Object.keys(imageCache.current).length,
      errors: errorCount.current
    });
  };

  const getFrame = (index: number): HTMLImageElement | null => {
    if (imageCache.current[index]) return imageCache.current[index];
    
    if (!loading.current.has(index)) {
      loading.current.add(index);
      const img = new Image();
      const padded = (index + 1).toString().padStart(4, "0");
      img.src = `/hero/frames/${shotFolder}/frame_${padded}.jpg`;
      img.onload = () => {
        imageCache.current[index] = img;
        loading.current.delete(index);
      };
      img.onerror = () => {
        loading.current.delete(index);
        errorCount.current++;
      }
    }
    return null;
  };

  const preloadFrames = (currentIndex: number) => {
    for (let i = Math.max(0, currentIndex - 5); i <= Math.min(149, currentIndex + 20); i++) {
      getFrame(i);
    }
  };

  const drawFrame = (targetIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let imgToDraw = imageCache.current[targetIndex];
    
    if (!imgToDraw) {
      let offset = 1;
      while (offset < 150) {
        if (targetIndex - offset >= 0 && imageCache.current[targetIndex - offset]) {
          imgToDraw = imageCache.current[targetIndex - offset];
          break;
        }
        if (targetIndex + offset < 150 && imageCache.current[targetIndex + offset]) {
          imgToDraw = imageCache.current[targetIndex + offset];
          break;
        }
        offset++;
      }
    }

    if (imgToDraw) {
      ctx.drawImage(imgToDraw, 0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    imageCache.current = {};
    loading.current.clear();
    errorCount.current = 0;
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = isMobile ? 540 : 960;
      canvas.height = isMobile ? 960 : 540;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (ctx) {
        ctx.fillStyle = theme === "light" ? "#ffffff" : "#050504";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    const first = new Image();
    first.src = `/hero/frames/${shotFolder}/frame_0001.jpg`;
    first.onload = () => {
      imageCache.current[0] = first;
      drawFrame(0);
      preloadFrames(0);
    };
    first.onerror = () => {
      errorCount.current++;
      // Even if first frame fails, try loading others!
      preloadFrames(0);
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
      
      const targetFrame = Math.min(149, Math.floor(progress * 150));
      
      updateDebug(targetFrame, progress, scrollY, top, runway);
      
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        drawFrame(targetFrame);
        preloadFrames(targetFrame);
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
        className="w-full h-full object-cover"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "cover",
          transform: "translateZ(0)", 
        }}
      />
      {/* TEMP DEBUG VISUALIZER */}
      <div className="absolute top-1/2 left-4 z-50 bg-black/80 text-white p-4 font-mono text-xs rounded-xl shadow-2xl pointer-events-auto border border-red-500">
        <p className="font-bold text-red-400 mb-2">DEBUG INFO (V2)</p>
        <p>Folder: {shotFolder}</p>
        <hr className="my-2 border-white/20" />
        <p>Target: {debugInfo.targetFrame}/149</p>
        <p className="text-green-400">Loaded: {debugInfo.loaded}</p>
        <p className="text-red-400">Errors (404s): {debugInfo.errors}</p>
      </div>
    </div>
  );
}
