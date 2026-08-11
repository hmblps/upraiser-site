import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";
import { useReducedMotion } from "../hooks/useReducedMotion";

export type CornerRadii = {
  tl: number;
  tr: number;
  br: number;
  bl: number;
};

type GradientTraceBorderProps = {
  className?: string;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  strokeWidth?: number;
  /** Override path radii (px). Default: parent's computed radius, inset for borders. */
  radius?: number | CornerRadii;
};

type Box = {
  w: number;
  h: number;
  radii: CornerRadii;
};

const ZERO: CornerRadii = { tl: 0, tr: 0, br: 0, bl: 0 };

/**
 * Gradient Tracing border — path is measured against the parent's
 * padding box (where `absolute inset-0` lives), not the border box.
 */
export function GradientTraceBorder({
  className = "",
  duration = 2.8,
  colorFrom = "var(--theme-accent-light)",
  colorTo = "var(--color-magenta)",
  strokeWidth = 1.5,
  radius,
}: GradientTraceBorderProps) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState<Box>({ w: 0, h: 0, radii: ZERO });
  const rawId = useId();
  const gradientId = `gtb-${rawId.replace(/:/g, "")}`;

  useEffect(() => {
    const node = wrapRef.current;
    const parent = node?.parentElement;
    if (!node || !parent) return;

    const measure = () => {
      // clientWidth/Height = padding box = the box absolute inset-0 fills.
      // getBoundingClientRect includes borders and made the path overshoot.
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const radii =
        radius !== undefined
          ? normalizeRadii(radius, w, h)
          : readPaddingBoxRadii(parent, w, h);

      setBox((prev) =>
        prev.w === w &&
        prev.h === h &&
        prev.radii.tl === radii.tl &&
        prev.radii.tr === radii.tr &&
        prev.radii.br === radii.br &&
        prev.radii.bl === radii.bl
          ? prev
          : { w, h, radii },
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(parent);
    return () => ro.disconnect();
  }, [radius]);

  if (reduced) {
    return <span ref={wrapRef} className={cn("pointer-events-none absolute inset-0", className)} aria-hidden />;
  }

  // Center the stroke on the padding-box edge (inner face of the CSS border).
  const inset = strokeWidth / 2;
  const path =
    box.w > 1 && box.h > 1
      ? roundedRectPath(
          box.w,
          box.h,
          shrinkRadii(box.radii, inset),
          inset,
        )
      : "";

  return (
    <span
      ref={wrapRef}
      aria-hidden
      className={cn(
        "gradient-trace-border pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]",
        className,
      )}
    >
      {path ? (
        <svg
          width={box.w}
          height={box.h}
          viewBox={`0 0 ${box.w} ${box.h}`}
          className="block max-h-full max-w-full overflow-hidden"
          fill="none"
        >
          <defs>
            <motion.linearGradient
              id={gradientId}
              gradientUnits="userSpaceOnUse"
              animate={{
                x1: [0, box.w * 2],
                x2: [0, box.w],
                y1: [0, box.h * 0.35],
                y2: [0, box.h],
              }}
              transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <stop stopColor={colorFrom} stopOpacity="0" />
              <stop stopColor={colorFrom} />
              <stop offset="1" stopColor={colorTo} stopOpacity="0" />
            </motion.linearGradient>
          </defs>

          <path
            d={path}
            stroke="currentColor"
            strokeOpacity={0.22}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            className="text-accent"
          />
          <path
            d={path}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </span>
  );
}

/** CSS radius is on the border box; absolute children use the padding box. */
function readPaddingBoxRadii(el: HTMLElement, w: number, h: number): CornerRadii {
  const cs = getComputedStyle(el);
  const bt = parseFloat(cs.borderTopWidth) || 0;
  const br = parseFloat(cs.borderRightWidth) || 0;
  const bb = parseFloat(cs.borderBottomWidth) || 0;
  const bl = parseFloat(cs.borderLeftWidth) || 0;

  return normalizeRadii(
    {
      tl: Math.max(0, parseCssRadius(cs.borderTopLeftRadius, w, h) - Math.max(bt, bl)),
      tr: Math.max(0, parseCssRadius(cs.borderTopRightRadius, w, h) - Math.max(bt, br)),
      br: Math.max(0, parseCssRadius(cs.borderBottomRightRadius, w, h) - Math.max(bb, br)),
      bl: Math.max(0, parseCssRadius(cs.borderBottomLeftRadius, w, h) - Math.max(bb, bl)),
    },
    w,
    h,
  );
}

function parseCssRadius(value: string, w: number, h: number): number {
  const raw = value.trim().split(/\s+/)[0] ?? "0";
  if (raw.endsWith("%")) {
    return (parseFloat(raw) / 100) * Math.min(w, h);
  }
  return parseFloat(raw) || 0;
}

function normalizeRadii(
  radius: number | CornerRadii,
  innerW: number,
  innerH: number,
): CornerRadii {
  const raw =
    typeof radius === "number"
      ? { tl: radius, tr: radius, br: radius, bl: radius }
      : radius;

  const maxR = Math.max(0, Math.min(innerW, innerH) / 2);
  const cap = (v: number) => Math.max(0, Math.min(v, maxR));
  return {
    tl: cap(raw.tl),
    tr: cap(raw.tr),
    br: cap(raw.br),
    bl: cap(raw.bl),
  };
}

/** Parallel curve: inset path needs radii reduced by the inset. */
function shrinkRadii(r: CornerRadii, inset: number): CornerRadii {
  return {
    tl: Math.max(0, r.tl - inset),
    tr: Math.max(0, r.tr - inset),
    br: Math.max(0, r.br - inset),
    bl: Math.max(0, r.bl - inset),
  };
}

function roundedRectPath(w: number, h: number, r: CornerRadii, inset: number): string {
  const left = inset;
  const top = inset;
  const right = Math.max(left, w - inset);
  const bottom = Math.max(top, h - inset);

  return [
    `M ${left + r.tl} ${top}`,
    `L ${right - r.tr} ${top}`,
    r.tr > 0 ? `A ${r.tr} ${r.tr} 0 0 1 ${right} ${top + r.tr}` : `L ${right} ${top}`,
    `L ${right} ${bottom - r.br}`,
    r.br > 0 ? `A ${r.br} ${r.br} 0 0 1 ${right - r.br} ${bottom}` : `L ${right} ${bottom}`,
    `L ${left + r.bl} ${bottom}`,
    r.bl > 0 ? `A ${r.bl} ${r.bl} 0 0 1 ${left} ${bottom - r.bl}` : `L ${left} ${bottom}`,
    `L ${left} ${top + r.tl}`,
    r.tl > 0 ? `A ${r.tl} ${r.tl} 0 0 1 ${left + r.tl} ${top}` : `L ${left} ${top}`,
    "Z",
  ].join(" ");
}
