import { useEffect, useId, useMemo, useState } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { Arc } from "@visx/shape";
import { Group } from "@visx/group";
import { Chord, Ribbon } from "@visx/chord";
import { scaleOrdinal } from "@visx/scale";
import { LinearGradient } from "@visx/gradient";
import { useTheme } from "../context/ThemeContext";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScrollMorph } from "../hooks/useScrollMorph";

/**
 * Parity Chord — quarter-cropped, pinned to the bottom-right corner.
 * The chord centre lives at bottom-right; only the top-left quadrant is visible.
 * Ribbons grow with scroll and the whole ring rotates slowly.
 */

const LABELS = [
  "DSP Spend",
  "OEM Spend",
  "CPC Media",
  "Programmatic",
  "App Installs",
  "Raw Device Events",
  "PAI Logs",
  "SDK Pings",
];

function buildMatrix(t: number) {
  const matchValues = [
    [0, 0, 0, 0, 8400, 4200, 1800, 600],
    [0, 0, 0, 0, 3200, 7600, 2400, 800],
    [0, 0, 0, 0, 2100, 3800, 6200, 1200],
    [0, 0, 0, 0, 1400, 2600, 3600, 5800],
    [8400, 3200, 2100, 1400, 0, 0, 0, 0],
    [4200, 7600, 3800, 2600, 0, 0, 0, 0],
    [1800, 2400, 6200, 3600, 0, 0, 0, 0],
    [600, 800, 1200, 5800, 0, 0, 0, 0],
  ];
  const eased = Math.pow(t, 1.8);
  return matchValues.map((row) =>
    row.map((val) => Math.round(val * Math.max(eased, 0.06)))
  );
}

function descending(a: number, b: number): number {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}

export function ParityMatchGraph({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const reactId = useId().replace(/:/g, "");

  const morph = useScrollMorph(progress, enabled, {
    start: 0.05,
    span: theme === "dark" ? 0.85 : 0.75,
    lerp: theme === "dark" ? 0.08 : 0.1,
  });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setEnabled(mq.matches && !reduced);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduced]);

  const matrix = useMemo(() => buildMatrix(morph), [morph]);

  const opacity = useTransform(
    progress,
    [0, 0.05, 0.5, 0.9, 1],
    [0, 1, 1, 1, 1]
  );

  // Slow rotation driven by scroll — full 360° feels mechanical; 35° is enough presence.
  const rotation = morph * 35;

  const arcColor = scaleOrdinal<number, string>({
    domain: [0, 1, 2, 3, 4, 5, 6, 7],
    range: [
      "#ffcc00",
      "#ffe066",
      "#f3ba00",
      "#d49a00",
      "#ff003b",
      "#ff4d6d",
      "#ff6b8a",
      "#ff8fa3",
    ],
  });

  // Massively oversized: the full ring is ~1200px; we show only the top-left quarter.
  const RING_SIZE = 1200;
  const outerRadius = RING_SIZE * 0.42;
  const innerRadius = outerRadius - 22;

  if (!enabled) return null;

  return (
    <motion.div
      className="parity-chord-container"
      style={{
        opacity,
        position: "absolute",
        bottom: 0,
        right: 0,
        width: RING_SIZE / 2 + 60,
        height: RING_SIZE / 2 + 60,
        overflow: "hidden",
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <svg
        width={RING_SIZE}
        height={RING_SIZE}
        style={{
          position: "absolute",
          /* Push center to bottom-right corner of the clipping container */
          bottom: -(RING_SIZE / 2),
          right: -(RING_SIZE / 2),
          willChange: "transform",
        }}
      >
        <LinearGradient
          id={`g-dsp-${reactId}`}
          from="#ffcc00"
          to="#ff003b"
          vertical={false}
          fromOpacity={0.7}
          toOpacity={0.7}
        />
        <LinearGradient
          id={`g-oem-${reactId}`}
          from="#ffe066"
          to="#ff4d6d"
          vertical={false}
          fromOpacity={0.6}
          toOpacity={0.6}
        />
        <LinearGradient
          id={`g-cpc-${reactId}`}
          from="#f3ba00"
          to="#ff6b8a"
          vertical={false}
          fromOpacity={0.5}
          toOpacity={0.5}
        />
        <LinearGradient
          id={`g-prog-${reactId}`}
          from="#d49a00"
          to="#ff8fa3"
          vertical={false}
          fromOpacity={0.45}
          toOpacity={0.45}
        />

        <Group
          top={RING_SIZE / 2}
          left={RING_SIZE / 2}
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: "0 0",
            transition: reduced ? "none" : "transform 0.3s ease-out",
          }}
        >
          <Chord
            matrix={matrix}
            padAngle={0.04}
            sortSubgroups={descending}
          >
            {({ chords }) => (
              <g>
                {chords.map((chord, i) => {
                  const invoiceIdx = Math.min(
                    chord.source.index,
                    chord.target.index
                  );
                  const gradIds = [
                    `g-dsp-${reactId}`,
                    `g-oem-${reactId}`,
                    `g-cpc-${reactId}`,
                    `g-prog-${reactId}`,
                  ];
                  const fill =
                    invoiceIdx < 4
                      ? `url(#${gradIds[invoiceIdx]})`
                      : "rgba(255,255,255,0.05)";
                  return (
                    <Ribbon
                      key={`ribbon-${i}`}
                      chord={chord}
                      radius={innerRadius}
                      fill={fill}
                      fillOpacity={0.65}
                    />
                  );
                })}

                {chords.groups.map((group, i) => (
                  <Arc
                    key={`arc-${i}`}
                    data={group}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    fill={arcColor(i)}
                    fillOpacity={0.9}
                  />
                ))}

                {chords.groups.map((group, i) => {
                  const angle =
                    (group.startAngle + group.endAngle) / 2;
                  const labelR = outerRadius + 18;
                  const x = labelR * Math.cos(angle - Math.PI / 2);
                  const y = labelR * Math.sin(angle - Math.PI / 2);
                  const isLeft = angle > Math.PI;
                  const textAnchor = isLeft ? "end" : "start";

                  return (
                    <text
                      key={`label-${i}`}
                      x={x}
                      y={y}
                      dy="0.35em"
                      textAnchor={textAnchor}
                      fill="var(--theme-muted)"
                      fontSize={12}
                      fontFamily="var(--theme-font-mono)"
                      style={{
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {LABELS[i]}
                    </text>
                  );
                })}
              </g>
            )}
          </Chord>
        </Group>
      </svg>
    </motion.div>
  );
}
