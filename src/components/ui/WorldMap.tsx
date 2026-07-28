import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { useTheme } from "../../context/ThemeContext";

export type WorldMapPoint = {
  lat: number;
  lng: number;
  label?: string;
};

export type WorldMapDot = {
  start: WorldMapPoint;
  end: WorldMapPoint;
};

type WorldMapProps = {
  dots?: WorldMapDot[];
  lineColor?: string;
  /** Pulse / destination dots — defaults to lineColor */
  pulseColor?: string;
  className?: string;
};

/**
 * Aceternity-style world map: static dotted SVG + animated arcs.
 * Runtime `dotted-map` removed — it 504'd Vite dep optimize and blanked /company.
 * SVGs generated via scripts/generate-world-map.mjs → public/maps/
 */
export function WorldMap({
  dots = [],
  lineColor = "#ffcc00",
  pulseColor,
  className,
}: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useTheme();
  const mapSrc =
    theme === "dark" ? "/maps/world-dots-dark.svg" : "/maps/world-dots-light.svg";
  const pointColor = pulseColor ?? lineColor;
  const fadeEdge = theme === "light" ? "#ffffff" : "#050504";

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  return (
    <div className={cn("company-world-map relative aspect-[2/1] w-full font-sans", className)}>
      <img
        src={mapSrc}
        className={cn(
          "pointer-events-none h-full w-full select-none [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]",
          theme === "light" && "company-world-map__dots--light",
        )}
        alt=""
        height={495}
        width={1056}
        draggable={false}
        decoding="async"
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        aria-hidden
      >
        <defs>
          <linearGradient id="upraiser-path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={fadeEdge} stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={pointColor} stopOpacity="1" />
            <stop offset="100%" stopColor={fadeEdge} stopOpacity="0" />
          </linearGradient>
        </defs>

        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#upraiser-path-gradient)"
                strokeWidth={theme === "light" ? 1.35 : 1.1}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 60, damping: 22, delay: 0.12 * i }}
              />
            </g>
          );
        })}

        {dots.map((dot, i) => (
          <g key={`points-group-${i}`}>
            <g>
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r="2.4"
                fill={lineColor}
              />
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r="2.4"
                fill={lineColor}
                opacity="0.5"
              >
                <animate attributeName="r" from="2.4" to="9" dur="1.5s" begin="0s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" begin="0s" repeatCount="indefinite" />
              </circle>
            </g>
            <g>
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r="2.2"
                fill={pointColor}
              />
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r="2.2"
                fill={pointColor}
                opacity="0.5"
              >
                <animate attributeName="r" from="2.2" to="8" dur="1.5s" begin="0s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" begin="0s" repeatCount="indefinite" />
              </circle>
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
