import { motion, useTransform, type MotionValue } from "framer-motion";

export function InfrastructureGrid({ progress }: { progress: MotionValue<number> }) {
  // 5 lines that transition from curved (chaos) to flat (order)
  const yOffsets = [
    useTransform(progress, [0, 1], [40, 0]),
    useTransform(progress, [0, 1], [20, 0]),
    useTransform(progress, [0, 1], [0, 0]),
    useTransform(progress, [0, 1], [-20, 0]),
    useTransform(progress, [0, 1], [-40, 0]),
  ];

  const opacity = useTransform(progress, [0.1, 0.5], [0.1, 0.4]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      <svg className="w-full h-full" preserveAspectRatio="none">
        {yOffsets.map((y, i) => (
          <motion.line
            key={i}
            x1="0"
            y1={`20%`}
            x2="100%"
            y2={`20%`}
            style={{ 
              y, 
              opacity,
              stroke: "var(--theme-accent)", 
              strokeWidth: 0.5 
            }}
          />
        ))}
      </svg>
    </div>
  );
}
