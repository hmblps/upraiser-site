import { ChartGhostValue } from "./ChartGhostValue";
import { useEffect, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { GhostBubbleMotion } from "./GhostBubbleMotion";
import { useReducedMotion } from "../hooks/useReducedMotion";

type ParityWaterChartProps = {
  progress: MotionValue<number>;
};

const CHANNELS = [
  { id: "oem", spend: 31 },
  { id: "programmatic", spend: 88 },
  { id: "ctv", spend: 23 },
  { id: "native", spend: 13 },
  { id: "video", spend: 54 },
  { id: "banner", spend: 41 },
  { id: "social", spend: 67 },
  { id: "inapp", spend: 19 },
  { id: "dsp", spend: 46 },
  { id: "rewarded", spend: 35 },
] as const;

const MAX_SPEND = Math.max(...CHANNELS.map((c) => c.spend));
const MAX_BAR_PCT = 92;

/**
 * Ghosts live on the full fold overlay (not the clipped chart plot).
 * originY is in the lower chart band; short rise so they dissolve under the body copy mask.
 */
const GHOSTS = [
  {
    id: "verified",
    label: "Verified",
    left: "14%",
    mobileLeft: "10%",
    originY: 68,
    mobileOriginY: 72,
    drift: 10,
    duration: 8.2,
    delay: 0.2,
    rise: 110,
    value: (t: number) => `${(88 + t * 11.4).toFixed(1)}%`,
  },
  {
    id: "parity",
    label: "Log parity",
    left: "38%",
    mobileLeft: "35%",
    originY: 76,
    mobileOriginY: 82,
    drift: -12,
    duration: 9,
    delay: 1.1,
    rise: 120,
    value: (t: number) => `${(0.8 * (1 - t)).toFixed(1)}% drift`,
  },
  {
    id: "mmp",
    label: "MMP match",
    left: "62%",
    mobileLeft: "60%",
    originY: 66,
    mobileOriginY: 70,
    drift: 11,
    duration: 7.6,
    delay: 0.6,
    rise: 115,
    value: (t: number) => `${Math.round(92 + t * 8)}%`,
  },
  {
    id: "clean",
    label: "Clean spend",
    left: "82%",
    mobileLeft: "85%",
    originY: 74,
    mobileOriginY: 78,
    drift: -9,
    duration: 8.5,
    delay: 1.8,
    rise: 120,
    value: (t: number) => `${Math.round(84 + t * 14)}%`,
  },
] as const;

function GhostBubble({ g, morph }: { g: typeof GHOSTS[number]; morph: number }) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const finalLeft = isMobile && g.mobileLeft ? g.mobileLeft : g.left;
  const finalOriginY = isMobile && g.mobileOriginY ? g.mobileOriginY : g.originY;

  return (
    <GhostBubbleMotion
      left={finalLeft}
      originY={finalOriginY}
      drift={g.drift}
      duration={g.duration}
      delay={g.delay}
      rise={g.rise}
      peakOpacity={0.78}
    >
      <ChartGhostValue value={g.value(morph)} />
      <span className="fold-chart-ghost-label">{g.label}</span>
    </GhostBubbleMotion>
  );
}

function barPct(spend: number) {
  return Math.max((spend / MAX_SPEND) * MAX_BAR_PCT, 0.35);
}

/**
 * Promise dark ambient — gold invoice / red log mirror + procedural OGL caustics.
 * Bars: scaleY bound directly to fold progress (rise / reverse on scroll back).
 * Ghosts: full-fold layer; vertical mask dissolves them before Promise body copy.
 */
export function ParityWaterChart({ progress }: ParityWaterChartProps) {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [morph, setMorph] = useState(0);

  // Promise uses anchor progress: when chart+copy are on screen, progress is already mid/late.
  // Grow across that visible window so scroll down raises bars and scroll up shrinks them.
  const barScale = useTransform(progress, [0.4, 0.55, 0.72, 0.9], [0.05, 0.35, 0.7, 1]);
  const opacity = useTransform(progress, [0.28, 0.4, 0.58, 0.92, 1], [0, 0.7, 1, 1, 0.9]);

  useMotionValueEvent(barScale, "change", (v) => {
    setMorph(Math.round(v * 200) / 200);
  });

  useEffect(() => {
    setMorph(Math.round(barScale.get() * 200) / 200);
  }, [barScale, enabled]);

  useEffect(() => {
    const sync = () => setEnabled(!reduced);
    sync();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduced]);



  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 767 : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const activeChannels = isMobile ? CHANNELS.slice(0, 6) : CHANNELS;

  return (
    <motion.div
      className="parity-water"
      style={
        reduced
          ? { opacity: 0.75, ["--parity-cols" as string]: activeChannels.length }
          : { opacity, ["--parity-cols" as string]: activeChannels.length }
      }
      aria-hidden
    >
      <div className="parity-water__stage">
        <div className="parity-water__rail">
          <div className="parity-water__plot">
            <div className="parity-water__air">
              <div className="parity-water__cols">
                {activeChannels.map((ch) => (
                  <div key={ch.id} className="parity-water__col parity-water__col--air">
                    <motion.div
                      className="parity-water__bar parity-water__bar--invoice"
                      style={{
                        height: `${barPct(ch.spend)}%`,
                        scaleY: reduced ? 1 : barScale,
                        transformOrigin: "bottom center",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="parity-water__meniscus" />

            <div className="parity-water__lake">
              <div className="parity-water__lake-scan">
                <div className="parity-water__lake-tint" />
                <div className="parity-water__cols parity-water__cols--logs">
                  {activeChannels.map((ch) => (
                    <div key={ch.id} className="parity-water__col parity-water__col--logs">
                      <motion.div
                        className="parity-water__bar parity-water__bar--logs"
                        style={{
                          height: `${barPct(ch.spend)}%`,
                          scaleY: reduced ? 1 : barScale,
                          transformOrigin: "top center",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-fold overlay: left ghosts stay; dissolve vertically under copy */}
      <div className="parity-water__ghosts fold-chart-ghosts">
        {GHOSTS.map((g) => (
          <GhostBubble key={g.id} g={g} morph={morph} />
        ))}
      </div>
    </motion.div>
  );
}
