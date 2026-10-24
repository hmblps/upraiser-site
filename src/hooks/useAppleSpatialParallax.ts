import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

export interface AppleSpatialParallax {
  // Normalized coordinates from -1 to 1 (with smooth 60 FPS Apple spring dampening)
  x: number;
  y: number;
  // Card 3D tilt angles (degrees)
  rotateX: number;
  rotateY: number;
  // Distinct physical sliding offsets for foreground elements (px)
  cardX: number;
  cardY: number;
  inputX: number;
  inputY: number;
  buttonX: number;
  buttonY: number;
  // Translation offsets for background depth planes (px)
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
 * with iOS permission auto-request on first touch and tuned 60 FPS spring inertia.
 */
export function useAppleSpatialParallax(): AppleSpatialParallax {
  const reduced = useReducedMotion();
  const [coords, setCoords] = useState<AppleSpatialParallax>({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    cardX: 0,
    cardY: 0,
    inputX: 0,
    inputY: 0,
    buttonX: 0,
    buttonY: 0,
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
      // gamma: left-to-right tilt in [-90, 90]. Responsive threshold: 14 deg = full tilt
      // beta: front-to-back tilt in [-180, 180]. Typical handheld reading angle is ~42 deg
      const normX = Math.max(-1, Math.min(1, e.gamma / 14));
      const normY = Math.max(-1, Math.min(1, (e.beta - 42) / 18));
      targetRef.current = { x: normX, y: normY };
    };

    // Auto-request iOS 13+ DeviceOrientation permission on first user tap/touch
    const handleFirstInteraction = async () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        try {
          const perm = await (DeviceOrientationEvent as any).requestPermission();
          if (perm === "granted") {
            window.addEventListener("deviceorientation", handleDeviceOrientation, { passive: true });
          }
        } catch {}
      }
    };

    // Always attach deviceorientation directly (works out of the box on Android and standard browsers)
    window.addEventListener("deviceorientation", handleDeviceOrientation, { passive: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true, passive: true });
    window.addEventListener("pointerdown", handleFirstInteraction, { once: true, passive: true });

    // 3. Mobile Touch Drag Parallax (fluid interactive fallback on touch screens)
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        targetRef.current = {
          x: Math.max(-1, Math.min(1, (touch.clientX - centerX) / (centerX || 1))),
          y: Math.max(-1, Math.min(1, (touch.clientY - centerY) / (centerY || 1))),
        };
      }
    };
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // 4. 60 FPS Apple Spring Interpolation Loop (lerp with damping factor 0.09)
    const LERP_FACTOR = 0.09;
    const loop = () => {
      const target = targetRef.current;
      const current = currentRef.current;

      const nextX = current.x + (target.x - current.x) * LERP_FACTOR;
      const nextY = current.y + (target.y - current.y) * LERP_FACTOR;
      currentRef.current = { x: nextX, y: nextY };

      // Distinct physical sliding offsets:
      // Card slides up to ±22px horizontally, ±16px vertically
      // Inputs and button slide with layered relative depth
      // Background layers shift in opposite direction (-48px)
      setCoords({
        x: nextX,
        y: nextY,
        rotateX: Number((nextY * 4.8).toFixed(2)),
        rotateY: Number((-nextX * 4.8).toFixed(2)),
        cardX: Number((nextX * 22).toFixed(1)),
        cardY: Number((nextY * 16).toFixed(1)),
        inputX: Number((nextX * 8).toFixed(1)),
        inputY: Number((nextY * 6).toFixed(1)),
        buttonX: Number((nextX * 14).toFixed(1)),
        buttonY: Number((nextY * 10).toFixed(1)),
        deepLayerX: Number((-nextX * 16).toFixed(1)),
        deepLayerY: Number((-nextY * 14).toFixed(1)),
        midLayerX: Number((-nextX * 32).toFixed(1)),
        midLayerY: Number((-nextY * 26).toFixed(1)),
        nearLayerX: Number((-nextX * 52).toFixed(1)),
        nearLayerY: Number((-nextY * 42).toFixed(1)),
        sheenX: Number((50 + nextX * 40).toFixed(1)),
        sheenY: Number((50 + nextY * 40).toFixed(1)),
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("touchmove", handleTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  return coords;
}
