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

    // Optimized particle count for 3D projection
    const count = window.innerWidth < 768 ? 800 : 2500;
    const particles = new Float32Array(count * 5); // x, y, z, speed, phase

    // Initialize 3D space
    for (let i = 0; i < count; i++) {
      particles[i * 5 + 0] = (Math.random() - 0.5) * 3000; // x spread
      particles[i * 5 + 1] = (Math.random() - 0.5) * 3000; // y spread
      particles[i * 5 + 2] = Math.random() * 1000 + 10;    // z depth
      particles[i * 5 + 3] = Math.random() * 0.8 + 0.4;    // speed
      particles[i * 5 + 4] = Math.random() * Math.PI * 2;  // phase
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
      
      const baseColor = isLight ? "180, 200, 220" : "255, 255, 255";
      const baseOpacity = isLight ? 0.85 : 0.6;
      ctx.fillStyle = `rgba(${baseColor}, ${baseOpacity})`;
      
      scrollVelocity.current *= 0.92;
      const scrollOffset = scrollVelocity.current * 0.5;
      
      const cx = width / 2;
      const cy = height / 2;

      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const pIdx = i * 5;
        let x = particles[pIdx + 0];
        let y = particles[pIdx + 1];
        let z = particles[pIdx + 2];
        const speed = particles[pIdx + 3];
        const phase = particles[pIdx + 4];

        // 3D backward flight: particles fly TOWARDS the camera (Z decreases)
        // Scroll speed pushes them faster. 
        // Also simulate gravity in Y.
        z -= (speed * 400 * delta) + (scrollOffset * 0.5); 
        y += (speed * 100 * delta); // natural falling gravity
        x += Math.sin(time * 0.002 + phase) * 0.5; // slight wind drift

        // If particle passes the camera (Z < 1) or goes too far out of bounds, reset deep in the distance
        if (z < 1 || z > 1500) {
          z = 1000 + Math.random() * 200;
          x = (Math.random() - 0.5) * 3000;
          y = (Math.random() - 0.5) * 3000 - 500; // spawn slightly higher
        }

        particles[pIdx + 0] = x;
        particles[pIdx + 1] = y;
        particles[pIdx + 2] = z;

        // 3D Projection
        const fov = 400; // perspective intensity
        const scale = fov / z;
        const screenX = cx + x * scale;
        const screenY = cy + y * scale;
        
        // Culling: don't draw if WAY off screen
        if (screenX < -50 || screenX > width + 50 || screenY < -50 || screenY > height + 50) {
           continue;
        }

        const size = Math.max(0.5, (isLight ? 2.5 : 1.5) * scale);
        
        // Depth-based opacity fading (further away = more transparent)
        const depthAlpha = Math.min(1, Math.max(0.1, 1 - (z / 1000)));
        ctx.globalAlpha = baseOpacity * depthAlpha;

        ctx.rect(screenX, screenY, size, size);
      }
      ctx.fill();
      ctx.globalAlpha = 1.0; // reset

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [isLight, reducedMotion, isVisible]);

  if (!isLight) return null;

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
