import type { MutableRefObject } from "react";
import { MathUtils, Vector3 } from "three";

export const POINTER_FOLLOW = 3.2;
export const TRACK_FOLLOW = 5.4;
export const CAM_SETTLE = 6.2;
export const LOOK_SETTLE = 5.0;
/** Shared ~7s atmospheric idle cycle (halo + beams + wire breathe). */
export const IDLE_BREATHE = (Math.PI * 2) / 7;

/**
 * Fog arc: hazy establish → opens mid-flight → summit finale mist.
 * Light uses clean white so type contrast holds against the horizon.
 */
export const FOG = {
  light: {
    color: "#d0ddec",
    nearStart: 130,
    farStart: 420,
    nearEnd: 160,
    farEnd: 520,
    nearFinale: 90,
    farFinale: 320,
  },
  dark: {
    color: "#050504",
    nearStart: 88,
    farStart: 240,
    nearEnd: 140,
    farEnd: 410,
    nearFinale: 62,
    farFinale: 235,
  },
} as const;

/**
 * Path C — Low approach:
 * 1) Below the ridge, left offset — mountain looms, headline keeps sky
 * 2) Climb with nose half-down / half into the distance
 * 3) Lock focus onto the far ridgeline (gentle punch-in)
 */
export const HERO_ASCENT_DEFAULTS = {
  startPos: [-4, 12, 188] as [number, number, number],
  midPos: [-2, 38, 140] as [number, number, number],
  endPos: [-10, 72, 122] as [number, number, number],
  startLook: [18, 28, -28] as [number, number, number],
  midLook: [14, 10, -40] as [number, number, number],
  endLook: [12, 16, -68] as [number, number, number],
  startFov: 46,
  midFov: 40,
  endFov: 34,
  bankMax: -0.08,
} as const;


export type AscentPath = {
  startPos: [number, number, number];
  midPos: [number, number, number];
  endPos: [number, number, number];
  startLook: [number, number, number];
  midLook: [number, number, number];
  endLook: [number, number, number];
  startFov: number;
  midFov: number;
  endFov: number;
  bankMax: number;
};

export type ThemeMode = "light" | "dark";
export type ScrollState = { pointerX: number; pointerY: number };

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInCubic(t: number) {
  return t * t * t;
}

/** Sample a quadratic Bezier through start / mid / end into `out`. */
export function sampleArc(
  t: number,
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  c: readonly [number, number, number],
  out: Vector3,
) {
  const u = 1 - t;
  out.set(
    u * u * a[0] + 2 * u * t * b[0] + t * t * c[0],
    u * u * a[1] + 2 * u * t * b[1] + t * t * c[1],
    u * u * a[2] + 2 * u * t * b[2] + t * t * c[2],
  );
  return out;
}

export function readProgress(heroFly: { progressRef: MutableRefObject<number> } | null | undefined) {
  return MathUtils.clamp(heroFly?.progressRef.current ?? 0, 0, 1);
}

export function idle01(t: number, phase = 0) {
  return 0.5 + 0.5 * Math.sin(t * IDLE_BREATHE + phase);
}

export const EXPEDITION_FOG = {
  light: {
    color: "#7e90a8", // Darker, moodier blue-grey to prevent "blowout"
    nearStart: 80, farStart: 500, // Keep 3D volume visible! Do not flatten to 2D cutout.
    nearEnd: 150, farEnd: 600,    // Keeps map edges hidden during ascent
    nearFinale: 200, farFinale: 750, // Clears up just enough for the peak
  },
  dark: {
    color: "#050504",
    nearStart: 88, farStart: 240,
    nearEnd: 140, farEnd: 410,
    nearFinale: 80, farFinale: 320,
  },
};

export const EXPEDITION_CLIMB = {
  poses: [
    { pos: [-4, 12, 188], look: [18, 28, -28], fov: 46 },
    { pos: [-2, 38, 140], look: [14, 10, -40], fov: 40 },
    { pos: [-10, 72, 122], look: [12, 16, -68], fov: 34 }
  ],
  bankMax: -0.08,
};

export const EXPEDITION_ASCENT: AscentPath = {
  // 1. Start safely inside the map (z=280 instead of 380)
  startPos: [60, 25, 280],
  startLook: [0, 60, 40],
  startFov: 55,

  // 2. Skim the ridge but stay lower to keep the horizon masked by mountains
  midPos: [-50, 100, 110],
  midLook: [10, 120, -20],
  midFov: 45,

  // 3. Orbit the peak but don't fly into the stratosphere (y=160 instead of 320)
  endPos: [15, 175, -50],
  endLook: [-20, 140, -180],
  endFov: 35,

  bankMax: 0.28, // Still aggressive, but slightly smoother
};

export function climbProgress(t: number) {
  return easeInOutCubic(t);
}
