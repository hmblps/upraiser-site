import React from 'react';
import { motion, type MotionValue, useTransform } from 'framer-motion';

interface MetricPoint {
  x: number;
  y: number;
  label: string;
  value: string;
}

const METRICS: MetricPoint[] = [
  { x: 300,  y: 350, label: 'DAY 7 ROAS',     value: '112%'  },
  { x: 550,  y: 290, label: 'DAILY INSTALLS',  value: '18.5K' },
  { x: 750,  y: 200, label: 'ARPU LIFT',       value: '3.8x'  },
  { x: 950,  y: 130, label: 'CPA HELD',        value: '$31'   },
  { x: 1100, y: 90,  label: 'COHORT LTV',      value: '$76'   },
];

const PATH = "M 0 360 C 400 360, 600 260, 800 180 S 1000 100, 1200 80";

// Mirrors AccentScrollFold text timing:
//   line1 fades  [0.36 → 0.52]
//   body  fades  [0.64 → 0.76]
// Chart draws across that same window so everything moves together.
const DRAW_IN  = 0.36;
const DRAW_OUT = 0.88;

import { ChartGhostValue } from './ChartGhostValue';

export const CommitmentChart: React.FC<{ progress: MotionValue<number> }> = ({ progress }) => {
  // Main line — draws exactly as text slides in
  const pathLength = useTransform(progress, [DRAW_IN, DRAW_OUT], [0, 1]);

  // Track & background fade in with first text line
  const trackOpacity = useTransform(progress, [DRAW_IN, DRAW_IN + 0.1], [0, 0.35]);

  // Ticks: fade in with body copy
  const tickOpacity = useTransform(progress, [0.64, 0.76], [0, 1]);

  // Pulse dot: appears mid-way through draw
  const dotOpacity = useTransform(progress, [0.56, 0.68], [0, 1]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <svg
        className="w-full h-full overflow-visible"
        viewBox="0 0 1200 400"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        }}
      >
        <defs>
          <linearGradient id="clarityLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="var(--theme-accent)" />
            <stop offset="100%" stopColor="var(--theme-accent-secondary)" />
          </linearGradient>
        </defs>

        {/* Tick-code — synced to body-copy appearance */}
        <motion.g style={{ opacity: tickOpacity }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const x = (i / 11) * 1200;
            return (
              <line
                key={i}
                x1={x}
                y1={350}
                x2={x}
                y2={370}
                stroke="var(--theme-accent)"
                strokeOpacity="0.3"
                strokeWidth="2"
              />
            );
          })}
        </motion.g>

        {/* Grey track — appears with first text line */}
        <motion.path
          d={PATH}
          fill="none"
          stroke="var(--theme-border)"
          strokeWidth="4"
          strokeLinecap="round"
          style={{ opacity: trackOpacity }}
        />

        {/* Colour line — draws in sync with scroll */}
        <motion.path
          d={PATH}
          fill="none"
          stroke="url(#clarityLineGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          style={{
            pathLength,
            filter:        'drop-shadow(0px 8px 16px var(--theme-accent-dim))',
            WebkitFilter:  'drop-shadow(0px 8px 16px var(--theme-accent-dim))',
          }}
        />
      </svg>

      {/* Metric labels + pulse dot — HTML layer for crisp text */}
      <div className="absolute inset-0 pointer-events-none">

        {/* Pulse dot at mid-point of curve */}
        <motion.div
          className="absolute flex items-center justify-center"
          style={{
            left:      `${(800 / 1200) * 100}%`,
            top:       `${(180 / 400) * 100}%`,
            transform: 'translate(-50%, -50%)',
            opacity:   dotOpacity,
            width:     '60px',
            height:    '60px',
          }}
        >
          <div
            className="absolute rounded-full border border-theme-accent opacity-60"
            style={{ width: '100%', height: '100%', animation: 'chart-pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite' }}
          />
          <div
            className="absolute rounded-full border-[3px] border-theme-accent bg-theme-bg shadow-lg"
            style={{ width: '16px', height: '16px' }}
          />
        </motion.div>

        {/* KPI bubbles — each one appears as the line reaches its X position */}
        {METRICS.map((metric, index) => {
          // Map metric X onto the draw window [DRAW_IN … DRAW_OUT]
          const frac   = metric.x / 1200;
          const centre = DRAW_IN + frac * (DRAW_OUT - DRAW_IN);
          const half   = 0.07;

          return (
            <motion.div
              key={index}
              className="absolute flex flex-col items-start"
              style={{
                left:      `${frac * 100}%`,
                top:       `${(metric.y / 400) * 100}%`,
                transform: 'translate(-20px, -40px)',
                opacity:   useTransform(progress, [centre - half, centre + half], [0, 1]),
                y:         useTransform(progress, [centre - half, centre + half], [12, 0]),
              }}
            >
              <ChartGhostValue value={metric.value} />
              <span className="fold-chart-ghost-label mt-1">{metric.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
