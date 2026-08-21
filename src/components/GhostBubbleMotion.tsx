import { memo, type CSSProperties, type ReactNode } from "react";


type GhostBubbleMotionProps = {
  left: string;
  originY: number;
  drift: number;
  duration: number;
  delay: number;
  rise?: number;
  peakOpacity?: number;
  children: ReactNode;
};

export function ghostRiseDistance(originY: number, scale = 1) {
  return (160 + originY * 0.35) * scale;
}

/**
 * Floating ghost metrics — CSS keyframes (Framer keyframe loops were freezing at opacity 0).
 */
export const GhostBubbleMotion = memo(function GhostBubbleMotion({
  left,
  originY,
  drift,
  duration,
  delay,
  rise,
  peakOpacity = 0.58,
  children,
}: GhostBubbleMotionProps) {
  const travel = rise ?? ghostRiseDistance(originY);

  return (
    <div className="fold-chart-ghost-slot" style={{ left, top: `${originY}%` }}>
      <div
        className="fold-chart-ghost fold-chart-ghost--float"
        style={
          {
            "--ghost-drift": `${drift}px`,
            "--ghost-travel": `${travel}px`,
            "--ghost-peak": String(peakOpacity),
            "--ghost-duration": `${duration}s`,
            "--ghost-delay": `${delay}s`,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
});
