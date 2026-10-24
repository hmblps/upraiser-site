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
  headingX: number;
  headingY: number;
  rosterX: number;
  rosterY: number;
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
    headingX: 0,
    headingY: 0,
    rosterX: 0,
    rosterY: 0,
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
      // gamma: left-to-right tilt in [-90, 90]. Highly responsive threshold: 8 deg = full tilt
      // beta: front-to-back tilt in [-180, 180]. Typical handheld reading angle is ~42 deg
      const normX = Math.max(-1, Math.min(1, e.gamma / 8));
      const normY = Math.max(-1, Math.min(1, (e.beta - 42) / 10));
      targetRef.current = { x: normX, y: normY };
    };

    // 3. Mobile Motion Acceleration / Gravity fallback handler
    const handleDeviceMotion = (e: DeviceMotionEvent) => {
      if (!e.accelerationIncludingGravity) return;
      const { x: ax, y: ay } = e.accelerationIncludingGravity;
      if (ax === null || ay === null) return;
      // ax: lateral gravity component (left/right tilt)
      // ay: longitudinal gravity component (reading angle tilt)
      const normX = Math.max(-1, Math.min(1, -ax / 2.5));
      const normY = Math.max(-1, Math.min(1, (ay - 6.5) / 2.5));
      targetRef.current = { x: normX, y: normY };
    };

    // Auto-request iOS 13+ DeviceOrientation and DeviceMotionEvent permission on first transient user gesture
    // WebKit strictly requires 'click', 'touchend', or 'pointerup' (touchstart is rejected by WebKit).
    let permissionRequested = false;
    const requestSensors = async () => {
      if (permissionRequested) return;
      permissionRequested = true;

      // DeviceOrientationEvent.requestPermission
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

      // DeviceMotionEvent.requestPermission (Chrome iOS / WebKit fallback)
      if (
        typeof DeviceMotionEvent !== "undefined" &&
        typeof (DeviceMotionEvent as any).requestPermission === "function"
      ) {
        try {
          const perm = await (DeviceMotionEvent as any).requestPermission();
          if (perm === "granted") {
            window.addEventListener("devicemotion", handleDeviceMotion, { passive: true });
          }
        } catch {}
      }
    };

    // Always attach direct listeners immediately (works out of the box on Android, macOS, standard browsers)
    window.addEventListener("deviceorientation", handleDeviceOrientation, { passive: true });
    window.addEventListener("devicemotion", handleDeviceMotion, { passive: true });

    // Transient user gesture listeners (compliant with iOS Safari & Chrome WebKit security)
    window.addEventListener("click", requestSensors, { passive: true });
    window.addEventListener("touchend", requestSensors, { passive: true });
    window.addEventListener("pointerup", requestSensors, { passive: true });

    // 4. Mobile Touch Drag Parallax (fluid interactive fallback on touch screens)
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        targetRef.current = {
          x: Math.max(-1, Math.min(1, ((touch.clientX - centerX) / (centerX || 1)) * 1.5)),
          y: Math.max(-1, Math.min(1, ((touch.clientY - centerY) / (centerY || 1)) * 1.5)),
        };
      }
    };
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // 5. 60 FPS Apple Spring Interpolation Loop (snappy lerp damping factor 0.12)
    const LERP_FACTOR = 0.12;
    const loop = () => {
      const target = targetRef.current;
      const current = currentRef.current;

      const nextX = current.x + (target.x - current.x) * LERP_FACTOR;
      const nextY = current.y + (target.y - current.y) * LERP_FACTOR;
      currentRef.current = { x: nextX, y: nextY };

      // High-visibility physical sliding offsets (Apple VisionOS spatial metaphor):
      // Card slides up to ±44px horizontally, ±30px vertically with ±9 deg 3D tilt
      // Form elements slide independently to create obvious physical parallax
      // Background starfield layers slide in opposite direction up to -88px
      setCoords({
        x: nextX,
        y: nextY,
        rotateX: Number((nextY * 9).toFixed(2)),
        rotateY: Number((-nextX * 9).toFixed(2)),
        cardX: Number((nextX * 44).toFixed(1)),
        cardY: Number((nextY * 30).toFixed(1)),
        inputX: Number((nextX * 22).toFixed(1)),
        inputY: Number((nextY * 15).toFixed(1)),
        buttonX: Number((nextX * 42).toFixed(1)),
        buttonY: Number((nextY * 28).toFixed(1)),
        headingX: Number((nextX * 14).toFixed(1)),
        headingY: Number((nextY * 10).toFixed(1)),
        rosterX: Number((nextX * 18).toFixed(1)),
        rosterY: Number((nextY * 12).toFixed(1)),
        deepLayerX: Number((-nextX * 24).toFixed(1)),
        deepLayerY: Number((-nextY * 18).toFixed(1)),
        midLayerX: Number((-nextX * 52).toFixed(1)),
        midLayerY: Number((-nextY * 38).toFixed(1)),
        nearLayerX: Number((-nextX * 88).toFixed(1)),
        nearLayerY: Number((-nextY * 64).toFixed(1)),
        sheenX: Number((50 + nextX * 45).toFixed(1)),
        sheenY: Number((50 + nextY * 45).toFixed(1)),
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
      window.removeEventListener("devicemotion", handleDeviceMotion);
      window.removeEventListener("click", requestSensors);
      window.removeEventListener("touchend", requestSensors);
      window.removeEventListener("pointerup", requestSensors);
      window.removeEventListener("touchmove", handleTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  return coords;
}
