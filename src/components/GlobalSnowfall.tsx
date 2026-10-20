import { useEffect, useRef, useState, memo } from "react";
import { useLocation } from "react-router-dom";
import { useScroll } from "../context/ScrollContext";
import { useMode } from "./SectionHeader";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useEnvironment } from "../lib/environmentState";

const SNOW_SPEED = 0.35;
const WIND_SPEED = 0.08;

type Flake = {
  x: number;
  y: number;
  size: number;
  speed: number;
  wobble: number;
  wobbleSpeed: number;
};

export const GlobalSnowfall = memo(function GlobalSnowfall() {
  const { mode } = useMode();
  const reduced = useReducedMotion();
  const snowEnabled = useEnvironment((s) => s.snowEnabled);
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 1024 && !window.matchMedia("(pointer: coarse)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches && !window.matchMedia("(pointer: coarse)").matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { registerScrollListener } = useScroll();

  const [flakes, setFlakes] = useState<Flake[]>([]);
  const scrollYRef = useRef(0);
  const lastScrollYRef = useRef(0);

  const active = !reduced && isDesktop && isHomePage && snowEnabled && mode === "growth";

  // Initialize flakes once
  useEffect(() => {
    if (!active) return;
    const count = 120;
    const initialFlakes: Flake[] = Array.from({ length: count }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.8 + 0.2,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
    }));
    setFlakes(initialFlakes);
  }, [active]);

  // Track scroll delta
  useEffect(() => {
    if (!active) return;
    return registerScrollListener((y) => {
      scrollYRef.current = y;
    });
  }, [registerScrollListener, active]);

  // Main render loop
  useEffect(() => {
    if (!active || flakes.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rAF: number;
    
    // Size canvas properly
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min(Math.max((now - lastTime) / 16.667, 0.25), 3);
      lastTime = now;

      const scrollY = scrollYRef.current;
      const scrollDelta = scrollY - lastScrollYRef.current;
      lastScrollYRef.current = scrollY;

      // In the Hero section (top of page), the dedicated camera-correlated 3D flight snow
      // takes stage. As the user scrolls down into content, fade in gentle ambient snowfall.
      const heroThreshold = window.innerHeight * 0.65;
      const ambientAlpha = Math.min(1, Math.max(0, (scrollY - heroThreshold * 0.4) / (heroThreshold * 0.6)));

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (ambientAlpha <= 0.01) {
        rAF = requestAnimationFrame(render);
        return;
      }

      ctx.fillStyle = `rgba(255, 255, 255, ${(0.42 * ambientAlpha).toFixed(3)})`;
      ctx.beginPath();

      flakes.forEach((f) => {
        // Fall down naturally
        f.y += f.speed * SNOW_SPEED * dt;
        
        // Add scroll delta influence (parallax effect)
        f.y -= scrollDelta * f.speed * 0.2;

        // Wind/Wobble
        f.wobble += f.wobbleSpeed * dt;
        f.x += (Math.sin(f.wobble) * 0.5 + WIND_SPEED) * dt;

        // Wrap around
        if (f.y > canvas.height) f.y = -10;
        if (f.y < -50) f.y = canvas.height + 10;
        if (f.x > canvas.width) f.x = -10;
        if (f.x < -10) f.x = canvas.width;

        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
      });

      ctx.fill();
      rAF = requestAnimationFrame(render);
    };

    rAF = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rAF);
      window.removeEventListener("resize", resize);
    };
  }, [flakes, active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20 mix-blend-screen opacity-70"
      aria-hidden="true"
    />
  );
});
