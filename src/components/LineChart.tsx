import { useId, useMemo, useState } from "react";
import {
  Area,
  CartesianGrid,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { NameType, Payload, ValueType } from "recharts/types/component/DefaultTooltipContent";

export type LineChartDatum = Record<string, string | number>;

export type LineChartValueChange = {
  eventType: "dot" | "category";
  categoryClicked: string;
  [key: string]: string | number;
} | null;

type LineChartProps = {
  data: LineChartDatum[];
  index: string;
  categories: string[];
  colors?: string[];
  className?: string;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showTooltip?: boolean;
  /** Under-line wash — off for SCALE “flow” so RESULTS can own the filled mass look */
  showFill?: boolean;
  /** Recharts enter animation — off when scroll-driving values */
  animate?: boolean;
  /** Fixed Y domain keeps scroll morph from jumping the scale */
  yDomain?: [number | "auto" | "dataMin" | "dataMax", number | "auto" | "dataMin" | "dataMax"];
  valueFormatter?: (value: number) => string;
  onValueChange?: (value: LineChartValueChange) => void;
};

const DEFAULT_COLORS = ["var(--theme-accent)", "var(--theme-accent-secondary)"];

function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter,
}: {
  active?: boolean;
  payload?: Payload<ValueType, NameType>[];
  label?: string | number;
  valueFormatter: (value: number) => string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="mode-line-tooltip">
      <p className="mode-line-tooltip-label">{label}</p>
      <ul>
        {payload.map((item) => {
          const value = typeof item.value === "number" ? item.value : Number(item.value);
          return (
            <li key={String(item.dataKey)}>
              <span className="mode-line-tooltip-swatch" style={{ background: String(item.color) }} />
              <span className="mode-line-tooltip-name">{item.name}</span>
              <span className="mode-line-tooltip-value">
                {Number.isFinite(value) ? valueFormatter(value) : "-"}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Tremor-style composed line chart (Recharts).
 * Ambient-friendly: soft grid, dual series, hover tooltip.
 */
export function LineChart({
  data,
  index,
  categories,
  colors = DEFAULT_COLORS,
  className = "",
  showGrid = true,
  showXAxis = true,
  showYAxis = true,
  showTooltip = true,
  showFill = true,
  animate = true,
  yDomain,
  valueFormatter = (n) => `${n}`,
  onValueChange,
}: LineChartProps) {
  const reactId = useId().replace(/:/g, "");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const series = useMemo(
    () =>
      categories.map((category, i) => ({
        key: category,
        color: colors[i % colors.length] ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]!,
        fillId: `mode-line-fill-${reactId}-${i}`,
      })),
    [categories, colors, reactId],
  );

  return (
    <div className={`mode-line-chart ${className}`.trim()}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 28, right: 24, left: 8, bottom: 8 }}
          onMouseLeave={() => {
            setActiveCategory(null);
            onValueChange?.(null);
          }}
        >
          <defs>
            {series.map((s) => (
              <linearGradient key={s.fillId} id={s.fillId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>

          {showGrid ? (
            <CartesianGrid
              stroke="var(--theme-border)"
              strokeOpacity={0.55}
              vertical={false}
              strokeDasharray="3 6"
            />
          ) : null}

          {showXAxis ? (
            <XAxis
              dataKey={index}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={28}
              tick={{ fill: "var(--theme-muted)", fontSize: 11, fontWeight: 500 }}
            />
          ) : null}

          {showYAxis ? (
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={44}
              domain={yDomain}
              tick={{ fill: "var(--theme-muted)", fontSize: 11, fontWeight: 500 }}
              tickFormatter={(v) => valueFormatter(Number(v))}
            />
          ) : (
            <YAxis hide domain={yDomain} />
          )}

          {showTooltip ? (
            <Tooltip
              cursor={{ stroke: "var(--theme-muted)", strokeOpacity: 0.35, strokeDasharray: "4 4" }}
              content={<ChartTooltip valueFormatter={valueFormatter} />}
              isAnimationActive={false}
            />
          ) : null}

          {showFill
            ? series.map((s) => (
                <Area
                  key={`area-${s.key}`}
                  type="monotone"
                  dataKey={s.key}
                  stroke="none"
                  fill={`url(#${s.fillId})`}
                  fillOpacity={activeCategory && activeCategory !== s.key ? 0.35 : 1}
                  isAnimationActive={animate}
                  animationDuration={700}
                  animationEasing="ease-out"
                />
              ))
            : null}

          {series.map((s, i) => (
            <Line
              key={`line-${s.key}`}
              type="monotone"
              dataKey={s.key}
              name={s.key}
              stroke={s.color}
              strokeWidth={activeCategory && activeCategory !== s.key ? 1.5 : i === 0 ? 2.75 : 1.75}
              strokeOpacity={activeCategory && activeCategory !== s.key ? 0.35 : i === 0 ? 0.92 : 0.55}
              strokeDasharray={i === 0 ? undefined : "5 7"}
              dot={false}
              activeDot={{
                r: 5,
                strokeWidth: 2,
                stroke: "var(--theme-bg)",
                fill: s.color,
              }}
              isAnimationActive={animate}
              animationDuration={700}
              animationEasing="ease-out"
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
