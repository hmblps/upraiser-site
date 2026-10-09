import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

// The legacy scroll-driven frame sequence was removed to save ~600 lines of dead code.
export const VIDEO_ONLY_MODE = true;

export function HeroVideoFallback() {
  const { theme } = useTheme();

  return (
    <div className="absolute inset-0 z-0 bg-bg pointer-events-none overflow-hidden hero-video-canvas">
      {theme === "dark" && (
        <>
          <SimpleVideo src="/hero/home-dark-idle.mp4" poster="/hero/home-dark-poster.jpg" />
        </>
      )}
      {theme === "light" && (
        <SimpleVideo
          src="/hero/home-light-idle.mp4"
          poster="/hero/home-light-poster.jpg"
          staticFilter="contrast(1.25) saturate(1.5) brightness(0.93)"
        />
      )}
      {theme === "light" && <SnowParticles />}
    </div>
  );
}

// ─── Simple Forward Video ────────────────────────────────────────────────────
// Plays forward once and stops on the last frame.
function SimpleVideo({
  src,
  poster,
  staticFilter = "",
}: {
  src: string;
  poster?: string;
  staticFilter?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(videoRef, { margin: "0px 0px 500px 0px" });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isInView && v.ended) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  }, [isInView]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
    // Resume after tab switch / iOS low-power pause if not ended
    const onVis = () => {
      if (!document.hidden && v.paused && !v.ended) v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);
    
    let raf = 0;
    const loop = () => {
      if (v.duration && !v.paused) {
        // Reveal stats over the last 14 seconds of the video.
        const timeLeft = v.duration - v.currentTime;
        let progress = 0;
        if (timeLeft <= 14) {
          progress = 0.18 + (14 - Math.max(2, timeLeft)) * 0.05;
          if (progress > 1) progress = 1;
          if (progress < 0) progress = 0;
        }
        window.dispatchEvent(new CustomEvent('hero-video-stats-progress', { detail: progress }));
        
        // Dispatch ended event for the triumphant gesture
        if (v.ended || timeLeft <= 0.1) {
          if (v.dataset.endedEmitted !== "true") {
            v.dataset.endedEmitted = "true";
            window.dispatchEvent(new CustomEvent('hero-video-ended'));
          }
        } else {
          v.dataset.endedEmitted = "";
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      cancelAnimationFrame(raf);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      id="hero-idle-video"
      src={src}
      poster={poster}
      autoPlay
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        filter: staticFilter || undefined,
      }}
    />
  );
}

// ─── FPV snow particles ───────────────────────────────────────────────────────
function SnowParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const c: HTMLCanvasElement = canvas;
    const ct: CanvasRenderingContext2D = ctx;

    interface Flake {
      angle: number; 
      r: number;     
      speed: number; 
      size: number;  
      alpha: number; 
      wind: number;  
    }

    const COUNT = 160;

    function spawn(): Flake {
      return {
        angle: Math.random() * Math.PI * 2,
        r:     Math.random() * 0.3,
        speed: 0.003 + Math.random() * 0.006,
        size:  0.3 + Math.random() * 2.0,
        alpha: 0.25 + Math.random() * 0.75,
        wind:  (Math.random() - 0.5) * 0.006,
      };
    }

    const flakes: Flake[] = Array.from({ length: COUNT }, spawn);

    function resize() {
      const dpr = devicePixelRatio || 1;
      c.width  = c.offsetWidth  * dpr;
      c.height = c.offsetHeight * dpr;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    let raf = 0;

    function draw() {
      const W  = c.width;
      const H  = c.height;
      const cx = W * 0.5;
      const cy = H * 0.44;
      const maxR = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy));

      ct.clearRect(0, 0, W, H);

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];

        f.r     += f.speed * (1 + f.r * f.r * 7);
        f.angle += f.wind;

        if (f.r >= 1.1) {
          flakes[i] = spawn();
          continue;
        }

        const dist = f.r * maxR;
        const x    = cx + Math.cos(f.angle) * dist;
        const y    = cy + Math.sin(f.angle) * dist;

        const trailPx = 3 + f.r * f.r * 55;
        const prevDist = Math.max(0, dist - trailPx);
        const px = cx + Math.cos(f.angle) * prevDist;
        const py = cy + Math.sin(f.angle) * prevDist;

        const scale   = 0.1 + f.r * f.r * 6;
        const radius  = Math.max(0.3, f.size * scale);
        const opacity = Math.min(1, f.alpha * (0.15 + f.r * 1.2));

        const grad = ct.createLinearGradient(px, py, x, y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(1, `rgba(255,255,255,${opacity.toFixed(3)})`);

        ct.beginPath();
        ct.strokeStyle = grad;
        ct.lineWidth   = Math.max(0.4, radius);
        ct.lineCap     = "round";
        ct.moveTo(px, py);
        ct.lineTo(x,  y);
        ct.stroke();

        if (radius > 1) {
          ct.beginPath();
          ct.arc(x, y, radius * 0.45, 0, Math.PI * 2);
          ct.fillStyle = `rgba(255,255,255,${opacity.toFixed(3)})`;
          ct.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  );
}
