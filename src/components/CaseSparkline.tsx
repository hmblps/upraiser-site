import { useEffect, useRef, useState } from "react";
import type { CaseStudy } from "../data/cases";
import { useCountUp } from "../hooks/useCountUp";
import { useReducedMotion } from "../hooks/useReducedMotion";

function buildSparklinePath(values: number[], width: number, height: number): string {
  if (values.length < 2) return "";

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);

  const points = values.map((value, index) => {
    const x = index * step;
    const y = height - ((value - min) / range) * (height - 6) - 3;
    return `${x},${y}`;
  });

  return `M ${points.join(" L ")}`;
}

function CaseHeroMetric({ value, label, active }: { value: string; label: string; active: boolean }) {
  const display = useCountUp(value, active, 1600);

  return (
    <div className="case-hero-metric">
      <div className="case-hero-metric-value">{display}</div>
      <div className="case-hero-metric-label">{label}</div>
    </div>
  );
}

type CaseSparklineProps = {
  trend: number[];
  label: string;
  id: string;
  heroMetric: { value: string; label: string };
};

export function CaseSparkline({ trend, label, id, heroMetric }: CaseSparklineProps) {
  const width = 280;
  const height = 52;
  const path = buildSparklinePath(trend, width, height);
  const areaPath = path ? `${path} L ${width},${height} L 0,${height} Z` : "";
  const gradientId = `spark-fill-${id}`;
  const pathRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const drawOn = !reduced;
  const [drawn, setDrawn] = useState(!drawOn);

  useEffect(() => {
    if (!drawOn) {
      setDrawn(true);
      return;
    }

    setDrawn(false);
    const node = wrapRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [drawOn, id]);

  useEffect(() => {
    const line = pathRef.current;
    if (!line || !drawOn) return;

    const length = line.getTotalLength();
    if (!drawn) {
      line.style.strokeDasharray = `${length}`;
      line.style.strokeDashoffset = `${length}`;
      line.style.transition = "none";
      return;
    }

    line.style.strokeDasharray = `${length}`;
    line.style.strokeDashoffset = "0";
    line.style.transition = "stroke-dashoffset 1.35s cubic-bezier(0.22, 1, 0.36, 1)";
  }, [drawn, drawOn, path]);

  return (
    <div ref={wrapRef} className="case-sparkline-block">
      <CaseHeroMetric value={heroMetric.value} label={heroMetric.label} active={drawn} />

      <div className="mt-4">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p className="stat-label text-muted">Performance trend</p>
          <p className="truncate text-xs text-muted-light">{label}</p>
        </div>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="case-sparkline-chart"
          aria-hidden
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--theme-accent)" stopOpacity="0.38" />
              <stop offset="100%" stopColor="var(--theme-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {areaPath && (
            <path
              d={areaPath}
              fill={`url(#${gradientId})`}
              className={drawOn ? `sparkline-area${drawn ? " is-drawn" : ""}` : undefined}
            />
          )}
          {path && (
            <path
              ref={pathRef}
              d={path}
              fill="none"
              stroke="var(--theme-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </div>
    </div>
  );
}

export function getTrendLabel(study: CaseStudy): string {
  return `${study.heroMetric.label} · ${study.heroMetric.value}`;
}
