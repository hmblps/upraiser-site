import { useEffect, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

type ParsedStat = {
  end: number;
  prefix: string;
  suffix: string;
  decimals: number;
  animate: boolean;
};

function parseStatValue(raw: string): ParsedStat {
  if (!/\d/.test(raw)) {
    return { end: 0, prefix: "", suffix: raw, decimals: 0, animate: false };
  }

  const match = raw.match(/^([^0-9]*)([\d,.]+)(.*)$/);
  if (!match) {
    return { end: 0, prefix: "", suffix: raw, decimals: 0, animate: false };
  }

  const [, prefix, numberPart, suffix] = match;
  const normalized = numberPart.replace(/,/g, "");
  const decimals = normalized.includes(".") ? normalized.split(".")[1].length : 0;

  return {
    end: Number(normalized),
    prefix,
    suffix,
    decimals,
    animate: true,
  };
}

function formatValue(value: number, decimals: number, fallback = 0) {
  const safe = Number.isFinite(value) ? value : fallback;
  return decimals > 0 ? safe.toFixed(decimals) : String(Math.round(safe));
}

export function useCountUp(raw: string, active: boolean, duration = 1400) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLParagraphElement | HTMLSpanElement | HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const parsed = parseStatValue(raw);

    if (
      !active ||
      !parsed.animate ||
      reduced ||
      !Number.isFinite(duration) ||
      duration <= 0 ||
      !Number.isFinite(parsed.end) ||
      parsed.end === 0
    ) {
      el.textContent = raw;
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = Math.max(0, now - start);
      const rawProgress = duration > 0 ? elapsed / duration : 1;
      const progress = Number.isFinite(rawProgress) ? Math.min(Math.max(rawProgress, 0), 1) : 1;
      const eased = 1 - (1 - progress) ** 3;
      const current = parsed.end * eased;
      el.textContent = `${parsed.prefix}${formatValue(current, parsed.decimals, parsed.end)}${parsed.suffix}`;

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [active, duration, raw, reduced]);

  return ref;
}
