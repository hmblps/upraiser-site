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

function formatValue(value: number, decimals: number) {
  return decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
}

export function useCountUp(raw: string, active: boolean, duration = 1400) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLParagraphElement | HTMLSpanElement | HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const parsed = parseStatValue(raw);

    if (!active || !parsed.animate || reduced) {
      el.textContent = raw;
      return;
    }

    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const current = parsed.end * eased;
      el.textContent = `${parsed.prefix}${formatValue(current, parsed.decimals)}${parsed.suffix}`;

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
