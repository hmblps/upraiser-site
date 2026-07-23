import { useEffect, useRef, useState } from "react";
import { CASE_TREND_CAPTION, type CaseMetric } from "../data/cases";
import { useCountUp } from "../hooks/useCountUp";
import { useReducedMotion } from "../hooks/useReducedMotion";

/** Fixed 0–100 scale — avoids min/max normalization that makes every curve look identical */
function buildSparklinePath(
  values: number[],
  width: number,
  height: number,
  yMin = 0,
  yMax = 100,
): string {
  if (values.length < 2) return "";

  const range = yMax - yMin || 1;
  const step = width / (values.length - 1);
  const padY = 4;

  const points = values.map((value, index) => {
    const x = index * step;
    const clamped = Math.min(yMax, Math.max(yMin, value));
    const y = height - padY - ((clamped - yMin) / range) * (height - padY * 2);
    return `${x},${y}`;
  });

  return `M ${points.join(" L ")}`;
}

function CaseMetricCell({ metric, active }: { metric: CaseMetric; active?: boolean }) {
  const display = useCountUp(metric.value, !!active, 1400);

  return (
    <div className="case-metric-cell">
      <p className="case-metric-cell__value">{active ? display : metric.value}</p>
      <p className="case-metric-cell__label">{metric.label}</p>
    </div>
  );
}

type CaseSparklineProps = {
  trend: number[];
  id: string;
  metrics: [CaseMetric, CaseMetric, CaseMetric];
};

export function CaseSparkline({ trend, id, metrics }: CaseSparklineProps) {
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
      <div className="case-metrics-grid">
        {metrics.map((metric) => (
          <CaseMetricCell key={metric.label} metric={metric} active={drawn} />
        ))}
      </div>

      <div className="case-sparkline-panel">
        <div className="case-sparkline-panel__head">
          <p className="stat-label text-muted">{CASE_TREND_CAPTION}</p>
          <p className="case-sparkline-panel__range">W1 – W12 · index 0–100</p>
        </div>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="case-sparkline-chart"
          aria-hidden
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--case-accent, var(--theme-accent))" stopOpacity="0.32" />
              <stop offset="100%" stopColor="var(--case-accent, var(--theme-accent))" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[25, 50, 75].map((tick) => {
            const y = height - 4 - (tick / 100) * (height - 8);
            return (
              <line
                key={tick}
                x1={0}
                x2={width}
                y1={y}
                y2={y}
                stroke="var(--theme-border)"
                strokeOpacity={0.45}
                strokeDasharray="3 6"
              />
            );
          })}
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
              stroke="var(--case-accent, var(--theme-accent))"
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
