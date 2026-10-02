import { useEffect, useRef, useState } from "react";
import { flyProgressForStage, useHeroFlyOptional } from "../../context/HeroFlyContext";
import { useScroll } from "../../context/ScrollContext";
import { useTheme } from "../../context/ThemeContext";

type FrameSource = CanvasImageSource & { width?: number; height?: number };

// Set true to show the idle video ping-pong only (no scroll-driven frame sequence).
// Set false to re-enable the scroll-driven canvas animation.
const VIDEO_ONLY_MODE = true;

const FRAME_COUNT = 60;
const LOOKAHEAD = 8;
const IDLE_CONCURRENCY = 4;
const CACHE_BUST = "v=15";

function frameUrl(folder: string, index: number) {
  // ffmpeg %03d padding starts at 1
  const padded = (index + 1).toString().padStart(3, "0");
  return `/hero/${folder}-60/frame_${padded}.jpg?${CACHE_BUST}`;
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
    const currentFrameRef = { current: 0 };
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

    const drawBlendedFrame = (exactFrame: number) => {
      if (!live()) return;
      const canvasEl = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvasEl || !ctx) return;

      const frame1 = Math.round(exactFrame);
      const f1 = pickFrame(frame1);

      if (!f1) return;

      if (lastIndexRef.current === frame1 && lastDrawnRef.current === f1.src) return;
      lastDrawnRef.current = f1.src;
      lastIndexRef.current = frame1;
      paintedIndexRef.current = f1.index;
      
      ctx.globalAlpha = 1;
      drawCoverFrame(ctx, f1.src, canvasEl, folder);
    };

    const store = (index: number, img: HTMLImageElement) => {
      if (!live()) return;
      cache[index] = tagSource(img, folder);
      // We must draw the currently displayed lerped frame, not the raw target, 
      // otherwise it flickers violently between lerped and raw positions during scroll.
      const currentLerpFrame = currentFrameRef.current;
      const painted = paintedIndexRef.current;
      if (painted < 0 || Math.abs(index - currentLerpFrame) < Math.abs(painted - currentLerpFrame)) {
        drawBlendedFrame(currentLerpFrame);
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
    if (!VIDEO_ONLY_MODE) {
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
    } else {
      // VIDEO_ONLY_MODE: just load frame 0 so canvas has a poster, no further preloading
      whenReady(first, () => { if (live()) store(0, first); }, () => {});
    }

    let frameLoopId = 0;

    if (!VIDEO_ONLY_MODE) {
      const renderLoop = () => {
        if (!live()) return;
        const target = targetRef.current;
        currentFrameRef.current += (target - currentFrameRef.current) * 0.08;
        const exactFrame = currentFrameRef.current;
        if (Math.abs(exactFrame - target) > 0.01 || Math.abs(exactFrame - lastIndexRef.current) > 0.01) {
          drawBlendedFrame(exactFrame);
          preloadWindow(Math.round(exactFrame));
        }
        frameLoopId = requestAnimationFrame(renderLoop);
      };
      frameLoopId = requestAnimationFrame(renderLoop);
    }

    function applyProgress(progress: number) {
      const targetFrame = Math.min(FRAME_COUNT - 1, Math.max(0, progress * (FRAME_COUNT - 1)));
      targetRef.current = targetFrame;
      
      const idleVideo = document.getElementById("hero-idle-video");
      const canvasEl = canvasRef.current;
      
      // Invisible cut on motion (Speed Ramp / Blur)
      const threshold = 0.015; // first 1.5% of scroll triggers the full ramp
      const t = Math.min(1, Math.max(0, progress / threshold));
      
      // PHASE 1 (t: 0→0.5): idle video blurs out and vanishes
      // PHASE 2 (t: 0.5→1): canvas unblurs and appears
      // They are NEVER both visible simultaneously — hides the position mismatch completely
      
      if (idleVideo) {
        const phase1 = Math.min(1, t / 0.5); // 0→1 over first half
        const ease1 = phase1 * phase1; // ease-in
        const idleOpacity = 1 - ease1;
        const idleScale = 1 + (0.1 * ease1);
        const idleBlur = 18 * ease1;
        idleVideo.style.opacity = idleOpacity.toString();
        idleVideo.style.transform = `scale(${idleScale})`;
        idleVideo.style.filter = `blur(${idleBlur}px)`;
      }
      
      if (canvasEl) {
        const phase2 = Math.max(0, (t - 0.4) / 0.6); // 0→1 over second half (with slight overlap at blur peak)
        const ease2 = phase2 < 0.5 ? 2 * phase2 * phase2 : 1 - Math.pow(-2 * phase2 + 2, 2) / 2;
        const canvasOpacity = idleVideo ? ease2 : 1;
        const canvasBlur = idleVideo ? Math.max(0, 18 * (1 - ease2)) : 0;
        canvasEl.style.opacity = canvasOpacity.toString();
        canvasEl.style.transform = `scale(1)`;
        canvasEl.style.filter = `blur(${canvasBlur}px)`;
      }
    }
    applyProgressRef.current = applyProgress;

    function getStage() {
      if (stageRef.current?.isConnected) return stageRef.current;
      return (
        (document.querySelector(".hero-stage--fly") as HTMLElement | null) ??
        (document.getElementById("hero") as HTMLElement | null)
      );
    }

    let unsub = () => {};
    if (!VIDEO_ONLY_MODE) {
      unsub = registerScrollListener(() => {
        if (!live()) return;
        if (scrubRef.current != null) return;
        const stage = getStage();
        stageRef.current = stage;
        if (!stage || !canvasRef.current) return;
        applyProgress(flyProgressRef.current?.current ?? flyProgressForStage(stage));
      });
    }

    if (scrubRef.current != null) {
      applyProgress(scrubRef.current);
    }

    return () => {
      cancelled = true;
      unsub();
      cancelAnimationFrame(frameLoopId);
      pendingImgs.forEach(abortImg);
      pendingImgs.clear();
    };
  }, [shotFolder, isMobile, theme, registerScrollListener]);

  useEffect(() => {
    if (scrub == null) return;
    applyProgressRef.current(scrub);
  }, [scrub]);

  return (
    <div className="absolute inset-0 z-0 bg-bg pointer-events-none overflow-hidden hero-video-canvas">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "cover",
          objectPosition: "center center",
          opacity: 0, // initially hidden — controlled by applyProgress
        }}
      />
      {theme === "dark" && (
        <PingPongVideo
          srcFwd="/hero/home-dark-idle.webm"
          srcRev="/hero/home-dark-idle-rev.webm"
        />
      )}
      {theme === "light" && (
        <PingPongVideo
          srcFwd="/hero/home-light-idle.webm"
          srcRev="/hero/home-light-idle-rev.webm"
          staticFilter="contrast(1.25) saturate(1.5) brightness(0.93)"
        />
      )}
      {theme === "light" && <SnowParticles />}
    </div>
  );
}

// ─── PingPong — canvas blend (zero flash, zero seek stutter) ─────────────────
// Both video elements decode continuously (never paused).
// A canvas RAF loop reads frames via drawImage and blends globalAlpha in JS.
// No CSS opacity transitions → no reliance on CSS timing → frame-perfect.
function PingPongVideo({
  srcFwd,
  srcRev,
  staticFilter = "",
}: {
  srcFwd: string;
  srcRev: string;
  staticFilter?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fwdRef   = useRef<HTMLVideoElement>(null);
  const revRef   = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const fwd    = fwdRef.current;
    const rev    = revRef.current;
    if (!canvas || !fwd || !rev) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // timeupdate fires ~250ms — need >> 250ms lead
    const LEAD_S   = 2.0;
    const FADE_MS  = 1600;

    // Fit canvas pixels to container
    function resize() {
      const p = canvas.parentElement;
      if (!p) return;
      const dpr = devicePixelRatio || 1;
      canvas.width  = Math.round(p.clientWidth  * dpr);
      canvas.height = Math.round(p.clientHeight * dpr);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    // Crossfade state
    let activeA: HTMLVideoElement = fwd; // outgoing (fades 1→0)
    let activeB: HTMLVideoElement = rev; // incoming (fades 0→1)
    let switching = false;
    let fadeStart = -1; // performance.now() when fade began, -1 = idle

    function draw(now: DOMHighResTimeStamp) {
      const W = canvas.width;
      const H = canvas.height;

      // alpha = how visible the OUTGOING video is (1 = fully visible, 0 = gone)
      let alpha = 1;
      if (fadeStart >= 0) {
        const t = Math.min(1, (now - fadeStart) / FADE_MS);
        // smooth step: t²(3−2t)
        const ease = t * t * (3 - 2 * t);
        alpha = 1 - ease;

        if (t >= 1) {
          // Fade done — swap roles, reset state
          [activeA, activeB] = [activeB, activeA];
          alpha      = 1;
          fadeStart  = -1;
          switching  = false;
        }
      }

      // Draw outgoing
      if (activeA.readyState >= 2) {
        ctx.globalAlpha = alpha;
        ctx.drawImage(activeA, 0, 0, W, H);
      }

      // Draw incoming on top
      if (alpha < 1 && activeB.readyState >= 2) {
        ctx.globalAlpha = 1 - alpha;
        ctx.drawImage(activeB, 0, 0, W, H);
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }

    function startCrossfade() {
      if (switching) return;
      switching = true;

      // Seek incoming to its first frame while it's invisible.
      // Decoder is warm (both have been playing since mount) → seek is fast.
      activeB.currentTime = 0;

      // Small settle window, then begin the alpha ramp
      setTimeout(() => { fadeStart = performance.now(); }, 80);
    }

    const onTime = () => {
      if (switching) return;
      const active = activeA; // whichever is currently showing
      if (active.duration > 0 && active.currentTime >= active.duration - LEAD_S) {
        startCrossfade();
      }
    };

    fwd.addEventListener("timeupdate", onTime);
    rev.addEventListener("timeupdate", onTime);

    // Both play from mount — decoders always hot, seek at crossfade is instant
    fwd.play().catch(() => {});
    rev.play().catch(() => {});

    requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      fwd.removeEventListener("timeupdate", onTime);
      rev.removeEventListener("timeupdate", onTime);
      fwd.pause();
      rev.pause();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* Videos decode invisibly — canvas reads them via drawImage */}
      <video
        ref={fwdRef}
        id="hero-idle-video"
        src={srcFwd}
        muted
        playsInline
        preload="auto"
        style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
      />
      <video
        ref={revRef}
        src={srcRev}
        muted
        playsInline
        preload="auto"
        style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          filter: staticFilter || undefined,
        }}
      />
    </div>
  );
}

// ─── FPV snow particles ───────────────────────────────────────────────────────
// Snowflakes burst from the horizon center and rush toward the camera,
// matching the forward-flight FPV drone perspective of the mountain video.
function SnowParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface Flake {
      angle: number; // polar angle from vanishing point (radians)
      r: number;     // 0 = centre, 1 = edge of screen
      speed: number; // r increment per frame at r=0
      size: number;  // base radius (CSS px units)
      alpha: number; // max opacity
      wind: number;  // angle drift per frame (subtle turbulence)
    }

    const COUNT = 160;

    function spawn(): Flake {
      return {
        angle: Math.random() * Math.PI * 2,
        // New particles start near centre — spread them out a little
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
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;

    function draw() {
      const W  = canvas.width;
      const H  = canvas.height;
      // Vanishing point slightly above centre — matches mountain drone horizon
      const cx = W * 0.5;
      const cy = H * 0.44;
      const maxR = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy));

      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];

        // Exponential acceleration: the closer to camera the faster it moves
        f.r     += f.speed * (1 + f.r * f.r * 7);
        f.angle += f.wind;

        if (f.r >= 1.1) {
          flakes[i] = spawn();
          continue;
        }

        // Polar → screen coordinates
        const dist = f.r * maxR;
        const x    = cx + Math.cos(f.angle) * dist;
        const y    = cy + Math.sin(f.angle) * dist;

        // Motion streak: tail fades from transparent to opaque at the tip
        const trailPx = 3 + f.r * f.r * 55;
        const prevDist = Math.max(0, dist - trailPx);
        const px = cx + Math.cos(f.angle) * prevDist;
        const py = cy + Math.sin(f.angle) * prevDist;

        // Scale: tiny at horizon, grows as it rushes toward camera
        const scale   = 0.1 + f.r * f.r * 6;
        const radius  = Math.max(0.3, f.size * scale);
        const opacity = Math.min(1, f.alpha * (0.15 + f.r * 1.2));

        // Streak line with gradient tail
        const grad = ctx.createLinearGradient(px, py, x, y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(1, `rgba(255,255,255,${opacity.toFixed(3)})`);

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth   = Math.max(0.4, radius);
        ctx.lineCap     = "round";
        ctx.moveTo(px, py);
        ctx.lineTo(x,  y);
        ctx.stroke();

        // Bright dot at the tip for close-range flakes
        if (radius > 1) {
          ctx.beginPath();
          ctx.arc(x, y, radius * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${opacity.toFixed(3)})`;
          ctx.fill();
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
