import { useEffect, useRef, useState} from "react";

import { useScroll } from "../context/ScrollContext";
import { useReducedMotion } from "../hooks/useReducedMotion";

function useIsLightTheme() {
  const [isLight, setIsLight] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.getAttribute("data-theme") === "light";
  });

  useEffect(() => {
    const update = () =>
      setIsLight(document.documentElement.getAttribute("data-theme") === "light");
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    update();
    return () => obs.disconnect();
  }, []);

  return isLight;
}

export function GlobalSnowfall() {
  // const { pathname } = useLocation();
  const isLight = useIsLightTheme();
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Enable globally for all pages as requested, but keep it lightweight 2D
  // If we only wanted it on home: const onHome = pathname === "/";
  // Removing onHome restriction so snow falls everywhere!

  const [isVisible, setIsVisible] = useState(() => {
    if (typeof document === "undefined") return true;
    return !document.hidden;
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    const handleVisibilityChange = () => setIsVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const { registerScrollListener } = useScroll();
  const prevScrollY = useRef(0);
  const scrollVelocity = useRef(0);

  useEffect(() => {
    return registerScrollListener((scrollY) => {
      if (reducedMotion) return;
      const delta = scrollY - prevScrollY.current;
      scrollVelocity.current = delta;
      prevScrollY.current = scrollY;
    });
  }, [registerScrollListener, reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    // Optimized particle count for 2D (looks identical to 5500 in 3D due to screen density)
    const count = window.innerWidth < 768 ? 400 : 1200;
    const particles = new Float32Array(count * 5); // x, y, speed, size, phase

    for (let i = 0; i < count; i++) {
      particles[i * 5 + 0] = Math.random() * width;
      particles[i * 5 + 1] = Math.random() * height;
      particles[i * 5 + 2] = Math.random() * 0.5 + 0.5; // speed
      particles[i * 5 + 3] = Math.random() * 2.5 + 1; // size
      particles[i * 5 + 4] = Math.random() * Math.PI * 2; // phase
    }

    let animationId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      if (reducedMotion || !isVisible) {
        animationId = requestAnimationFrame(render);
        return;
      }
      
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);
      
      const baseColor = isLight ? "122, 143, 168" : "255, 255, 255";
      const baseOpacity = isLight ? 0.5 : 0.6;
      ctx.fillStyle = `rgba(${baseColor}, ${baseOpacity})`;
      
      scrollVelocity.current *= 0.92;
      const scrollOffset = scrollVelocity.current * 0.5;

      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const pIdx = i * 5;
        let x = particles[pIdx + 0];
        let y = particles[pIdx + 1];
        const speed = particles[pIdx + 2];
        const size = particles[pIdx + 3];
        const phase = particles[pIdx + 4];

        y += (speed * 60 * delta) - scrollOffset * speed;
        x += (Math.sin(time * 0.001 * speed + phase) * 0.5) + (speed * 10 * delta);

        if (y > height + 10) y = -10;
        if (y < -10) y = height + 10;
        if (x > width + 10) x = -10;
        if (x < -10) x = width + 10;

        particles[pIdx + 0] = x;
        particles[pIdx + 1] = y;

        ctx.rect(x, y, size, size);
      }
      ctx.fill();

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [isLight, reducedMotion, isVisible]);

  return (
    <div
      className="global-snowfall"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 40,
        pointerEvents: "none",
        opacity: "var(--global-snow-opacity, 1)",
        transition: "opacity 0.25s linear",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%)",
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", pointerEvents: "none", display: "block" }}
      />
    </div>
  );
}
