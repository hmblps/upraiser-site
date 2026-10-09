import { useEffect, useRef, useState, memo } from "react";
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

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { registerScrollListener } = useScroll();

  const [flakes, setFlakes] = useState<Flake[]>([]);
  const scrollYRef = useRef(0);
  const lastScrollYRef = useRef(0);

  // Initialize flakes once
  useEffect(() => {
    if (reduced) return;
    const count = window.innerWidth < 768 ? 40 : 120;
    const initialFlakes: Flake[] = Array.from({ length: count }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.8 + 0.2,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
    }));
    setFlakes(initialFlakes);
  }, [reduced]);

  // Track scroll delta
  useEffect(() => {
    if (reduced) return;
    return registerScrollListener(({ y }) => {
      scrollYRef.current = y;
    });
  }, [registerScrollListener, reduced]);

  // Main render loop
  useEffect(() => {
    if (reduced || flakes.length === 0 || !snowEnabled || mode !== "growth") return;

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

    const render = () => {
      const scrollY = scrollYRef.current;
      const scrollDelta = scrollY - lastScrollYRef.current;
      lastScrollYRef.current = scrollY;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.beginPath();

      flakes.forEach((f) => {
        // Fall down naturally
        f.y += f.speed * SNOW_SPEED;
        
        // Add scroll delta influence (parallax effect)
        f.y -= scrollDelta * f.speed * 0.2;

        // Wind/Wobble
        f.wobble += f.wobbleSpeed;
        f.x += Math.sin(f.wobble) * 0.5 + WIND_SPEED;

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
  }, [flakes, reduced, snowEnabled, mode]);

  if (reduced || mode !== "growth" || !snowEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20 mix-blend-screen opacity-70"
      aria-hidden="true"
    />
  );
});
