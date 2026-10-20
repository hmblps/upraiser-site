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
    return window.innerWidth >= 1024;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
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

  // Initialize flakes once — fine, delicate alpine snowfall matching Hero particle scale
  useEffect(() => {
    if (!active) return;
    const count = window.innerWidth >= 1440 ? 110 : 80;
    const initialFlakes: Flake[] = Array.from({ length: count }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 0.8 + 0.6,
      speed: Math.random() * 0.55 + 0.25,
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
      // takes stage. As the user scrolls into the Lenovo dock and content, fade in lush, pure white ambient snowfall.
      const heroThreshold = window.innerHeight * 0.55;
      const ambientAlpha = Math.min(1, Math.max(0, (scrollY - heroThreshold * 0.35) / (heroThreshold * 0.65)));

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (ambientAlpha <= 0.01) {
        rAF = requestAnimationFrame(render);
        return;
      }

      const clampedDelta = Math.max(-12, Math.min(12, scrollDelta));

      flakes.forEach((f) => {
        // Fall down naturally
        f.y += f.speed * SNOW_SPEED * dt;
        
        // Add scroll delta influence (parallax effect), smoothly clamped to prevent sudden jerking
        f.y -= clampedDelta * f.speed * 0.06;

        // Wind/Wobble
        f.wobble += f.wobbleSpeed * dt;
        f.x += (Math.sin(f.wobble) * 0.35 + WIND_SPEED) * dt;

        // Wrap around
        if (f.y > canvas.height + 10) f.y = -10;
        if (f.y < -30) f.y = canvas.height + 10;
        if (f.x > canvas.width + 10) f.x = -10;
        if (f.x < -10) f.x = canvas.width + 10;

        // 1. Soft contrast micro-shadow offset by 0.4px: gives physical depth and ensures
        // the fine snowflake is clearly visible on white/light backgrounds
        ctx.fillStyle = `rgba(15, 30, 60, ${(0.18 * ambientAlpha).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(f.x + 0.4, f.y + 0.4, f.size, 0, Math.PI * 2);
        ctx.fill();

        // 2. Pure, brilliant fine white snowflake body drawn at full size
        ctx.fillStyle = `rgba(255, 255, 255, ${(0.96 * ambientAlpha).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();
      });

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
      className="pointer-events-none fixed inset-0 z-20 opacity-80"
      aria-hidden="true"
    />
  );
});
