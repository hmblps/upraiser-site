import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

export interface AppleSpatialParallax {
  // Normalized coordinates from -1 to 1 (with smooth 60 FPS Apple spring dampening)
  x: number;
  y: number;
  // Card 3D tilt angles (degrees) - subtle and calm
  rotateX: number;
  rotateY: number;
  // Unified subtle physical displacement for the card container (px)
  cardX: number;
  cardY: number;
  // Translation offsets for background celestial layers (px)
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
 * Subtle, tasteful spatial tilt and background depth.
 * Zero touch dragging (touching the screen never moves the UI).
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
    deepLayerX: 0,
    deepLayerY: 0,
    midLayerX: 0,
    midLayerY: 0,
    nearLayerX: 0,
    nearLayerY: 0,
    sheenX: 50,
    sheenY: 40,
  });

  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const hasOrientationRef = useRef(false);

  useEffect(() => {
    if (reduced || typeof window === "undefined") return;

    // 1. Desktop Pointer Move handler (soft subtle tilt on mouse hover, touch ignored)
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      targetRef.current = {
        x: Math.max(-1, Math.min(1, (e.clientX - centerX) / (centerX || 1))),
        y: Math.max(-1, Math.min(1, (e.clientY - centerY) / (centerY || 1))),
      };
    };

    // Return to center when mouse leaves the viewport
    const handlePointerLeave = () => {
      if (!hasOrientationRef.current) {
        targetRef.current = { x: 0, y: 0 };
      }
    };

    // 2. Mobile Gyroscope / DeviceOrientation handler (subtle natural wrist tilt)
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      hasOrientationRef.current = true;
      // Normal handheld tilt: ±16 deg gamma, beta around 42 deg
      const normX = Math.max(-1, Math.min(1, e.gamma / 16));
      const normY = Math.max(-1, Math.min(1, (e.beta - 42) / 18));
      targetRef.current = { x: normX, y: normY };
    };

    // 3. Fallback DeviceMotionEvent if DeviceOrientation is not emitting
    const handleDeviceMotion = (e: DeviceMotionEvent) => {
      if (hasOrientationRef.current || !e.accelerationIncludingGravity) return;
      const { x: ax, y: ay } = e.accelerationIncludingGravity;
      if (ax === null || ay === null) return;
      const normX = Math.max(-1, Math.min(1, -ax / 4.0));
      const normY = Math.max(-1, Math.min(1, (ay - 7.0) / 4.0));
      targetRef.current = { x: normX, y: normY };
    };

    // Auto-request iOS 13+ sensor permissions on first user gesture
    let permissionRequested = false;
    const requestSensors = () => {
      if (permissionRequested) return;
      permissionRequested = true;

      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        (DeviceOrientationEvent as any).requestPermission()
          .then((perm: string) => {
            if (perm === "granted") {
              window.addEventListener("deviceorientation", handleDeviceOrientation, { passive: true });
            }
          })
          .catch(() => {});
      }

      if (
        typeof DeviceMotionEvent !== "undefined" &&
        typeof (DeviceMotionEvent as any).requestPermission === "function"
      ) {
        (DeviceMotionEvent as any).requestPermission()
          .then((perm: string) => {
            if (perm === "granted") {
              window.addEventListener("devicemotion", handleDeviceMotion, { passive: true });
            }
          })
          .catch(() => {});
      }
    };

    window.addEventListener("deviceorientation", handleDeviceOrientation, { passive: true });
    window.addEventListener("devicemotion", handleDeviceMotion, { passive: true });
    window.addEventListener("click", requestSensors, { passive: true });
    window.addEventListener("touchend", requestSensors, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave, { passive: true });

    // 4. Subtle, calm 60 FPS Apple spring loop (smooth damping factor 0.06 for buttery glide)
    const LERP_FACTOR = 0.06;
    const loop = () => {
      const target = targetRef.current;
      const current = currentRef.current;

      const nextX = current.x + (target.x - current.x) * LERP_FACTOR;
      const nextY = current.y + (target.y - current.y) * LERP_FACTOR;
      currentRef.current = { x: nextX, y: nextY };

      setCoords({
        x: nextX,
        y: nextY,
        rotateX: Number((nextY * 3.2).toFixed(2)),
        rotateY: Number((-nextX * 3.2).toFixed(2)),
        cardX: Number((nextX * 6).toFixed(1)),
        cardY: Number((nextY * 4.5).toFixed(1)),
        deepLayerX: Number((-nextX * 6).toFixed(1)),
        deepLayerY: Number((-nextY * 4).toFixed(1)),
        midLayerX: Number((-nextX * 12).toFixed(1)),
        midLayerY: Number((-nextY * 8).toFixed(1)),
        nearLayerX: Number((-nextX * 18).toFixed(1)),
        nearLayerY: Number((-nextY * 12).toFixed(1)),
        sheenX: Number((50 + nextX * 25).toFixed(1)),
        sheenY: Number((40 + nextY * 25).toFixed(1)),
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
      window.removeEventListener("devicemotion", handleDeviceMotion);
      window.removeEventListener("click", requestSensors);
      window.removeEventListener("touchend", requestSensors);
      document.removeEventListener("mouseleave", handlePointerLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  return coords;
}
