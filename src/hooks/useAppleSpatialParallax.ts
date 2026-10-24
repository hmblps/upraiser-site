import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

export interface AppleSpatialParallax {
  // Normalized coordinates from -1 to 1 (with smooth 60 FPS Apple spring dampening)
  x: number;
  y: number;
  // Card 3D tilt angles (degrees)
  rotateX: number;
  rotateY: number;
  // Translation offsets for depth planes (px)
  deepLayerX: number;
  deepLayerY: number;
  midLayerX: number;
  midLayerY: number;
  nearLayerX: number;
  nearLayerY: number;
  // Dynamic light sheen percentage (for glass highlight)
  sheenX: number;
  sheenY: number;
}

/**
 * 60 FPS Apple OS Spatial Parallax Hook (iOS Lockscreen / visionOS Depth Metaphor)
 * Combines DeviceOrientation (mobile gyroscopic tilt) and PointerMove (desktop mouse tracking)
 * with a tuned linear interpolation (lerp) loop for fluid, weighty physical inertia.
 */
export function useAppleSpatialParallax(): AppleSpatialParallax {
  const reduced = useReducedMotion();
  const [coords, setCoords] = useState<AppleSpatialParallax>({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    deepLayerX: 0,
    deepLayerY: 0,
    midLayerX: 0,
    midLayerY: 0,
    nearLayerX: 0,
    nearLayerY: 0,
    sheenX: 50,
    sheenY: 50,
  });

  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduced || typeof window === "undefined") return;

    // 1. Desktop Pointer Move handler (normalized to -1 .. 1 from screen center)
    const handlePointerMove = (e: PointerEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      targetRef.current = {
        x: Math.max(-1, Math.min(1, (e.clientX - centerX) / (centerX || 1))),
        y: Math.max(-1, Math.min(1, (e.clientY - centerY) / (centerY || 1))),
      };
    };

    // 2. Mobile Gyroscope / DeviceOrientation handler (Apple tilt parallax)
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      // gamma: left-to-right tilt in [-90, 90]. Normal handheld range is [-20, 20]
      // beta: front-to-back tilt in [-180, 180]. Normal handheld portrait angle is ~45 deg
      const normX = Math.max(-1, Math.min(1, e.gamma / 22));
      const normY = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
      targetRef.current = { x: normX, y: normY };
    };

    // 3. 60 FPS Apple Spring Interpolation Loop (lerp with damping factor 0.08)
    const LERP_FACTOR = 0.08;
    const loop = () => {
      const target = targetRef.current;
      const current = currentRef.current;

      const nextX = current.x + (target.x - current.x) * LERP_FACTOR;
      const nextY = current.y + (target.y - current.y) * LERP_FACTOR;
      currentRef.current = { x: nextX, y: nextY };

      // Multi-layer Apple Depth offsets:
      // Deep layer moves subtly (-10px)
      // Mid layer moves moderately (-22px)
      // Near layer moves faster (-42px)
      // Card tilts subtly: rotateX up to 4 deg, rotateY up to -4 deg
      setCoords({
        x: nextX,
        y: nextY,
        rotateX: Number((nextY * 4.2).toFixed(2)),
        rotateY: Number((-nextX * 4.2).toFixed(2)),
        deepLayerX: Number((-nextX * 12).toFixed(1)),
        deepLayerY: Number((-nextY * 12).toFixed(1)),
        midLayerX: Number((-nextX * 24).toFixed(1)),
        midLayerY: Number((-nextY * 24).toFixed(1)),
        nearLayerX: Number((-nextX * 46).toFixed(1)),
        nearLayerY: Number((-nextY * 46).toFixed(1)),
        sheenX: Number((50 + nextX * 35).toFixed(1)),
        sheenY: Number((50 + nextY * 35).toFixed(1)),
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("deviceorientation", handleDeviceOrientation, { passive: true });
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  return coords;
}
