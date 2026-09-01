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
    color: "#b0c0d8", // gloomier blizzard grey-blue
    nearStart: 15, farStart: 160, // super thick blizzard at start
    nearEnd: 220, farEnd: 700,    // clears up significantly mid-climb
    nearFinale: 350, farFinale: 900, // crystal clear at the summit
  },
  dark: {
    color: "#050504",
    nearStart: 88, farStart: 240,
    nearEnd: 140, farEnd: 410,
    nearFinale: 62, farFinale: 235,
  }
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
  // 1. Deep Trench: Start low in the valley, looking up at the peaks
  startPos: [100, 15, 380],
  startLook: [0, 80, 50],
  startFov: 60, // Wide angle to feel the scale of the valley

  // 2. The Ridge Skim: Fly aggressively close to the left ridge
  midPos: [-80, 130, 100],
  midLook: [20, 150, -50],
  midFov: 45,

  // 3. The Summit Orbit: Break above the clouds, soaring over the main peak
  endPos: [40, 320, -120],
  endLook: [-40, 240, -250],
  endFov: 32, // Strong zoom compression for massive background mountains

  bankMax: 0.35, // Very aggressive drone-like banking during the ridge skim
};

export function climbProgress(t: number) {
  return easeInOutCubic(t);
}
