import { motion, useTransform, type MotionValue } from "framer-motion";

const segments = [
  { label: "Fake installs", value: 47, color: "#e11d48" },
  { label: "Device farms", value: 35, color: "#8b5cf6" },
  { label: "AI layer", value: 10, color: "#1e3a8a" },
  { label: "Bots", value: 8, color: "#0891b2" },
];

export function FraudRadialChart({ progress }: { progress: MotionValue<number> }) {
  const currentYear = new Date().getFullYear().toString();
  const drawProgress = useTransform(progress, [0.2, 0.8], [0, 1]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-12">
      <motion.div 
        className="absolute top-1/2 right-[50%] h-[1px] bg-theme-accent/20 origin-right"
        style={{ width: useTransform(drawProgress, [0, 1], [0, 120]), opacity: useTransform(drawProgress, [0.5, 1], [0, 0.5]) }}
      />
      <svg className="w-full h-full -rotate-90 scale-x-[-1] overflow-visible" viewBox="0 0 100 100">
        {segments.map((s, i) => {
          const radius = 45 - i * 8;
          const circumference = 2 * Math.PI * radius;
          const pathLength = useTransform(drawProgress, [0, 1], [0, s.value / 100]);
          return (
            <motion.circle
              key={s.label}
              cx="50" cy="50" r={radius}
              fill="transparent"
              stroke={s.color}
              strokeWidth="4"
              strokeDasharray={circumference}
              style={{ pathLength, filter: "drop-shadow(0 0 8px rgba(0,0,0,0.3))" }}
              className="opacity-90"
            />
          );
        })}
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-bold text-fg tracking-tighter">{currentYear}</span>
      </div>
    </div>
  );
}
