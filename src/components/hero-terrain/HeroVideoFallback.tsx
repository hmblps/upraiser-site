import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

export const VIDEO_ONLY_MODE = true;

interface HeroVideoFallbackProps {
  variant?: "home" | "expedition" | string;
  forceMobile?: boolean;
}

export function HeroVideoFallback(props: HeroVideoFallbackProps) {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(props.forceMobile) || window.innerWidth < 1024;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 1023px)");
    const sync = () => setIsMobile(Boolean(props.forceMobile) || mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [props.forceMobile]);

  const darkSrc = isMobile ? "/hero/home-dark-idle-mobile.mp4" : "/hero/home-dark-idle.mp4";
  const lightSrc = isMobile ? "/hero/home-light-idle-mobile.mp4" : "/hero/home-light-idle.mp4";

  return (
    <div className="absolute inset-0 z-0 bg-bg pointer-events-none overflow-hidden hero-video-canvas">
      {theme === "dark" && (
        <SimpleVideo src={darkSrc} poster="/hero/home-dark-poster.jpg" />
      )}
      {theme === "light" && (
        <SimpleVideo
          src={lightSrc}
          poster="/hero/home-light-poster.jpg"
        />
      )}
      {theme === "light" && <SnowParticles />}
    </div>
  );
}

// ─── Simple Forward Loop Video ────────────────────────────────────────────────
// Renders poster via <img> to guarantee iOS Safari NEVER displays a native play icon.
// When video begins playback, it cross-fades seamlessly over the poster.
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
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.defaultMuted = true;
    v.muted = true;
    v.loop = false;
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    v.setAttribute("muted", "");
    v.setAttribute("autoplay", "");

    let isHolding = false;
    let holdTimeout: number | undefined;

    const restartLoop = () => {
      v.currentTime = 0;
      isHolding = false;
      playVideo();
    };

    const triggerEndHold = () => {
      if (isHolding) return;
      isHolding = true;
      v.pause();
      // Keep triumph stats fully revealed throughout the 3.5s summit pause
      window.dispatchEvent(new CustomEvent('hero-video-stats-progress', { detail: 1 }));
      window.dispatchEvent(new CustomEvent('hero-video-ended'));

      if (holdTimeout) window.clearTimeout(holdTimeout);
      holdTimeout = window.setTimeout(restartLoop, 3500);
    };

    const playVideo = () => {
      const p = v.play();
      if (p !== undefined) {
        p.then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // iOS Safari Low Power Mode: unlock on first user gesture
          const unlock = () => {
            v.play().then(() => setIsPlaying(true)).catch(() => {});
            window.removeEventListener("touchstart", unlock);
            window.removeEventListener("touchend", unlock);
            window.removeEventListener("pointerdown", unlock);
            window.removeEventListener("scroll", unlock);
          };
          window.addEventListener("touchstart", unlock, { passive: true, once: true });
          window.addEventListener("touchend", unlock, { passive: true, once: true });
          window.addEventListener("pointerdown", unlock, { passive: true, once: true });
          window.addEventListener("scroll", unlock, { passive: true, once: true });
        });
      }
    };

    const onCanPlay = () => {
      if (v.paused && !isHolding) {
        playVideo();
      }
    };
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("loadeddata", onCanPlay);

    playVideo();

    // Listen for native HTML5 video ended event as backup
    const handleEnded = () => {
      triggerEndHold();
    };
    v.addEventListener("ended", handleEnded);

    // Pause only when user scrolls far away down the page (> 1.3 screen heights)
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 1.3) {
        if (!v.paused) v.pause();
        if (holdTimeout) {
          window.clearTimeout(holdTimeout);
          holdTimeout = undefined;
        }
      } else {
        if (isHolding) {
          if (!holdTimeout) holdTimeout = window.setTimeout(restartLoop, 1500);
        } else if (v.paused) {
          playVideo();
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Resume after tab switch / iOS unlock
    const onVis = () => {
      if (!document.hidden && window.scrollY <= window.innerHeight * 1.3) {
        if (isHolding) {
          if (!holdTimeout) holdTimeout = window.setTimeout(restartLoop, 1500);
        } else if (v.paused) {
          playVideo();
        }
      }
    };
    document.addEventListener("visibilitychange", onVis);

    let raf = 0;
    const loop = () => {
      if (v.duration && !v.paused && !isHolding) {
        // Fade in only once frames have physically started advancing
        if (v.currentTime > 0.05) {
          setIsPlaying(true);
        }

        // Reveal stats over the last 14 seconds of the video cycle
        const timeLeft = v.duration - v.currentTime;
        let progress = 0;
        if (timeLeft <= 14) {
          progress = 0.18 + (14 - Math.max(2, timeLeft)) * 0.05;
          if (progress > 1) progress = 1;
          if (progress < 0) progress = 0;
        }
        window.dispatchEvent(new CustomEvent('hero-video-stats-progress', { detail: progress }));

        // Hold last frame for 3.5s before restarting loop
        if (timeLeft <= 0.08) {
          triggerEndHold();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      if (holdTimeout) window.clearTimeout(holdTimeout);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("loadeddata", onCanPlay);
      v.removeEventListener("ended", handleEnded);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      cancelAnimationFrame(raf);
    };
  }, [src]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {poster && (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ filter: staticFilter || undefined }}
        />
      )}
      <video
        ref={videoRef}
        id="hero-idle-video"
        src={src}
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        onPlaying={() => setIsPlaying(true)}
        onTimeUpdate={() => {
          const v = videoRef.current;
          if (v && v.currentTime > 0.05) {
            setIsPlaying(true);
          }
        }}
        className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-700 ${
          isPlaying ? "opacity-100" : "opacity-0"
        }`}
        style={{ filter: staticFilter || undefined }}
      />
    </div>
  );
}

// ─── FPV snow particles (Desktop Only) ─────────────────────────────────────────
// ─── Camera-Correlated Alpine Flight Snow ────────────────────────────────────
// Snowflakes inhabit a true 3D frustum matching the forward FPV drone ascent along
// the mountain ridge. Particles react to flight velocity (rushing forward during ascent,
// settling into a gentle alpine breeze during the summit hold) and pointer parallax sway.
function SnowParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 768 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const c: HTMLCanvasElement = canvas;
    const ct: CanvasRenderingContext2D = ctx;

    interface Flake3D {
      x: number;
      y: number;
      z: number;
      prevX: number;
      prevY: number;
      prevZ: number;
      size: number;
      speedFactor: number;
      flutterPhase: number;
      flutterSpeed: number;
      glintPhase: number;
      baseAlpha: number;
    }

    const COUNT = window.innerWidth < 1024 ? 80 : 180;

    function spawnFlake(atFar = false): Flake3D {
      const z = atFar ? 0.90 + Math.random() * 0.10 : 0.05 + Math.random() * 0.95;
      const aspect = (window.innerWidth || 1440) / (window.innerHeight || 900);
      const x = (Math.random() - 0.5) * (aspect * z * 1.35);
      const y = (Math.random() - 0.5) * (1.1 * z * 1.35);
      return {
        x,
        y,
        z,
        prevX: x,
        prevY: y,
        prevZ: z,
        size: 1.2 + Math.random() * 2.4,
        speedFactor: 0.8 + Math.random() * 0.5,
        flutterPhase: Math.random() * Math.PI * 2,
        flutterSpeed: 0.03 + Math.random() * 0.04,
        glintPhase: Math.random() * Math.PI * 2,
        baseAlpha: 0.55 + Math.random() * 0.45,
      };
    }

    const flakes: Flake3D[] = Array.from({ length: COUNT }, () => spawnFlake(false));

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(c.offsetWidth * dpr);
      c.height = Math.round(c.offsetHeight * dpr);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    // Mouse / Pointer Parallax
    let targetSwayX = 0;
    let targetSwayY = 0;
    let swayX = 0;
    let swayY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      targetSwayX = (e.clientX / w - 0.5) * 0.18;
      targetSwayY = (e.clientY / h - 0.5) * 0.10;
    };
    window.addEventListener("mousemove", onPointerMove, { passive: true });

    let raf = 0;
    let inView = true;
    let lastTime = performance.now();

    function draw(now: number) {
      if (!inView) {
        raf = 0;
        return;
      }
      const dt = Math.min(Math.max((now - lastTime) / 16.667, 0.25), 3);
      lastTime = now;

      const W = c.width;
      const H = c.height;
      if (W === 0 || H === 0) {
        raf = requestAnimationFrame(draw);
        return;
      }

      // Smooth pointer sway damping
      swayX += (targetSwayX - swayX) * 0.06 * dt;
      swayY += (targetSwayY - swayY) * 0.06 * dt;

      // Correlate with video flight velocity
      const video = document.getElementById("hero-idle-video") as HTMLVideoElement | null;
      let forwardFlight = 1.0;
      if (video) {
        const cur = video.currentTime || 0;
        const dur = video.duration || 22.8;
        // Summit hold / deceleration
        if (video.paused || cur >= dur - 4.2) {
          const rem = Math.max(0, (dur - cur) / 4.2);
          forwardFlight = 0.06 + 0.94 * (rem * rem);
        }
      }

      // Vanishing point aligned with the mountain ridge summit in the video
      const cx = W * (0.50 + swayX * 0.4);
      const cy = H * (0.42 + swayY * 0.4);
      const focal = Math.min(W, H) * 1.08;

      ct.clearRect(0, 0, W, H);

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];

        f.prevX = f.x;
        f.prevY = f.y;
        f.prevZ = f.z;

        // Forward motion along camera Z axis (camera rushes forward through snow)
        const forwardStep = (0.0075 * forwardFlight + 0.0012) * f.speedFactor * dt;
        f.z -= forwardStep;

        // Mountain ridge crosswind (slight drift to left along ridge slope) + natural gravity
        const crosswind = (-0.0014 * forwardFlight - 0.0004) * dt;
        const gravity = (0.0009 + 0.0012 * (1 - forwardFlight)) * dt;
        const flutter = Math.sin(f.flutterPhase) * 0.0005 * dt;

        f.x += crosswind + flutter;
        f.y += gravity;
        f.flutterPhase += f.flutterSpeed * dt;
        f.glintPhase += 0.05 * dt;

        // Perspective 3D Projection
        const invZ = 1 / f.z;
        const invPrevZ = 1 / f.prevZ;

        // Parallax offset: close flakes sway much more with the camera than far flakes
        const parallaxFactor = (1 - f.z);
        const prevParallaxFactor = (1 - f.prevZ);

        const screenX = cx + ((f.x - swayX * parallaxFactor) * invZ) * focal;
        const screenY = cy + ((f.y - swayY * parallaxFactor) * invZ) * focal;

        const prevScreenX = cx + ((f.prevX - swayX * prevParallaxFactor) * invPrevZ) * focal;
        const prevScreenY = cy + ((f.prevY - swayY * prevParallaxFactor) * invPrevZ) * focal;

        // Respawn when passing behind the camera lens or rushed off-screen
        if (
          f.z <= 0.04 ||
          screenX < -80 ||
          screenX > W + 80 ||
          screenY < -80 ||
          screenY > H + 80
        ) {
          flakes[i] = spawnFlake(true);
          continue;
        }

        // Motion displacement on screen
        const dx = screenX - prevScreenX;
        const dy = screenY - prevScreenY;
        const streakDist = Math.hypot(dx, dy);

        // Flake scale based on inverse depth (natural perspective scaling)
        const radius = Math.min(Math.max(0.8, (f.size * 0.42) * invZ * (W / 1440)), 5.5);

        // Alpha: fade in smoothly from far horizon; fade out gently right at the lens
        const horizonFade = Math.min(1, (1.0 - f.z) * 3.5);
        const nearFade = f.z < 0.08 ? f.z / 0.08 : 1.0;
        const glint = 0.85 + Math.sin(f.glintPhase) * 0.15;
        const alpha = Math.min(1, Math.max(0, f.baseAlpha * horizonFade * nearFade * glint));

        if (alpha <= 0.02) continue;

        // 1. Motion blur streak when rushing past camera
        if (streakDist > 1.2 && forwardFlight > 0.12) {
          const grad = ct.createLinearGradient(prevScreenX, prevScreenY, screenX, screenY);
          grad.addColorStop(0, `rgba(220, 235, 255, 0)`);
          grad.addColorStop(0.5, `rgba(240, 248, 255, ${(alpha * 0.45).toFixed(3)})`);
          grad.addColorStop(1, `rgba(255, 255, 255, ${(alpha * 0.95).toFixed(3)})`);

          ct.beginPath();
          ct.strokeStyle = grad;
          ct.lineWidth = Math.max(0.6, radius * 0.85);
          ct.lineCap = "round";
          ct.moveTo(prevScreenX, prevScreenY);
          ct.lineTo(screenX, screenY);
          ct.stroke();
        }

        // 2. Crystalline snowflake head (sunlit core with subtle cool alpine shadow halo for contrast)
        if (radius > 1.5) {
          ct.beginPath();
          ct.arc(screenX, screenY, radius * 1.6, 0, Math.PI * 2);
          ct.fillStyle = `rgba(160, 195, 230, ${(alpha * 0.32).toFixed(3)})`;
          ct.fill();
        }

        ct.beginPath();
        ct.arc(screenX, screenY, radius, 0, Math.PI * 2);
        ct.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
        ct.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        if (inView && !raf) {
          lastTime = performance.now();
          raf = requestAnimationFrame(draw);
        } else if (!inView && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "150px 0px", threshold: 0 },
    );
    io.observe(c);

    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 20,
      }}
    />
  );
}
