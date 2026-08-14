import React, { useRef } from 'react';
import { motion, type MotionValue, useTransform } from 'framer-motion';

interface MetricPoint {
  x: number;
  y: number;
  label: string;
  value: string;
}

const METRICS: MetricPoint[] = [
  { x: 300, y: 350, label: 'DAY 7 ROAS', value: '112%' },
  { x: 550, y: 290, label: 'DAILY INSTALLS', value: '18.5K' },
  { x: 750, y: 200, label: 'ARPU LIFT', value: '3.8x' },
  { x: 950, y: 130, label: 'CPA HELD', value: '$31' },
  { x: 1100, y: 90, label: 'COHORT LTV', value: '$76' },
];

export const CommitmentChart: React.FC<{ progress: MotionValue<number> }> = ({ progress }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const drawProgress = useTransform(progress, [0.1, 0.9], [0, 1]);

  // Плавная кубическая кривая Безье для восходящего тренда
  const pathD = "M 0 360 C 400 360, 600 260, 800 180 S 1000 100, 1200 80";

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none">
      <svg 
        className="w-full h-full overflow-visible" 
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
        }}
      >
        <defs>
          {/* Премиальный градиент под графиком */}
          <linearGradient id="clarityAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--theme-accent)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--theme-accent)" stopOpacity="0.0" />
          </linearGradient>

          {/* Градиент для самой линии */}
          <linearGradient id="clarityLineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--theme-accent)" />
            <stop offset="100%" stopColor="var(--theme-accent-secondary)" />
          </linearGradient>
        </defs>

        {/* СЛОЙ 1: «Штрих-код» сырых логов (вертикальные тики под графиком) */}
        <g className="opacity-10">
          {Array.from({ length: 40 }).map((_, i) => {
            const x = i * 30;
            return (
              <motion.line
                key={i}
                x1={x}
                y1={350}
                x2={x}
                y2={370}
                stroke="var(--theme-accent)"
                strokeOpacity="0.3"
                strokeWidth="2"
                initial={{ scaleY: 0, opacity: 0 }}
                whileInView={{ scaleY: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.02 }}
              />
            );
          })}
        </g>

        {/* СЛОЙ 2: Убран (была заливка, удалена для визуального баланса с графиком SCALE) */}

        {/* СЛОЙ 3.1: Базовая линия (серый трек) */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--theme-border)"
          strokeWidth="4"
          strokeLinecap="round"
          className="opacity-40"
        />

        {/* СЛОЙ 3.2: Главная гладкая магистраль (Stroke) */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#clarityLineGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          style={{ 
            pathLength: drawProgress,
            filter: "drop-shadow(0px 8px 16px var(--theme-accent-dim))",
            WebkitFilter: "drop-shadow(0px 8px 16px var(--theme-accent-dim))"
          }}
        />

      </svg>

      {/* СЛОЙ 5: Плавающие метрики (HTML поверх SVG для идеальной четкости текста) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Сканирующая/активная точка на графике (HTML для сохранения круглых пропорций) */}
        <motion.div
          className="absolute flex items-center justify-center"
          style={{ 
            left: `${(800 / 1200) * 100}%`,
            top: `${(180 / 400) * 100}%`,
            transform: 'translate(-50%, -50%)',
            opacity: useTransform(drawProgress, [0.4, 0.6], [0, 1]),
            width: '60px',
            height: '60px'
          }}
        >
          {/* Пульсирующий круг */}
          <div 
            className="absolute rounded-full border border-theme-accent opacity-60"
            style={{
              width: '100%',
              height: '100%',
              animation: 'chart-pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite'
            }}
          />
          {/* Центральная точка */}
          <div 
            className="absolute rounded-full border-[3px] border-theme-accent bg-theme-bg shadow-lg"
            style={{ width: '16px', height: '16px' }}
          />
        </motion.div>

        {METRICS.map((metric, index) => {
          // Calculate when this specific metric should appear based on its X position
          const appearanceThreshold = (metric.x / 1200) * 0.9;
          
          return (
            <motion.div
              key={index}
              className="absolute flex flex-col items-start"
              style={{ 
                left: `${(metric.x / 1200) * 100}%`, 
                top: `${(metric.y / 400) * 100}%`,
                transform: 'translate(-20px, -40px)',
                opacity: useTransform(drawProgress, [appearanceThreshold - 0.1, appearanceThreshold + 0.1], [0, 1]),
                y: useTransform(drawProgress, [appearanceThreshold - 0.1, appearanceThreshold + 0.1], [15, 0])
              }}
            >
              <span className="fold-chart-ghost-value">
                {metric.value}
              </span>
              <span className="fold-chart-ghost-label mt-1">
                {metric.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
