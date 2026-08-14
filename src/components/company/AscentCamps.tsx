import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { SPRING_SOFT } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export type AscentCamp = {
  id: string;
  altitude: string;
  title: string;
  text: string;
};

type AscentCampsProps = {
  camps: readonly AscentCamp[];
  className?: string;
};

/**
 * Visual anchor for /company — How It Works adapted as a mountain ascent:
 * zigzag trail + camp stops (привалы), spring reveal, no SaaS card chrome.
 */
export function AscentCamps({ camps, className }: AscentCampsProps) {
  const reduced = useReducedMotion();
  const count = camps.length;
  const height = count <= 3 ? 520 : count === 4 ? 640 : 760;

  return (
    <div className={cn("ascent-camps relative w-full", className)} aria-label="Expedition ascent">
      <div
        className="ascent-camps__stage relative mx-auto w-full max-w-[920px]"
        style={{ ["--ascent-h" as string]: `${height}px` }}
      >
        {count > 1 ? (
          <svg
            className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full md:block"
            viewBox={`0 0 1000 ${height}`}
            preserveAspectRatio="none"
            aria-hidden
          >
            <motion.path
              d={ascentPath(count, height)}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="10 8"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              className="text-border"
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={reduced ? { duration: 0 } : { ...SPRING_SOFT, duration: 1.1 }}
            />
            {!reduced ? (
              <motion.path
                d={ascentPath(count, height)}
                fill="none"
                stroke="url(#ascent-trail-grad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="48 220"
                animate={{ strokeDashoffset: [0, -268] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
              />
            ) : null}
            <defs>
              <linearGradient id="ascent-trail-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--theme-accent-light)" stopOpacity="0" />
                <stop offset="45%" stopColor="var(--theme-accent)" />
                <stop offset="100%" stopColor="var(--color-magenta)" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        ) : null}

        <ol className="ascent-camps__list relative z-[1] flex flex-col gap-8 md:block md:h-[var(--ascent-h)] md:gap-0">
          {camps.map((camp, index) => {
            const side = index % 2 === 0 ? "left" : "right";
            return (
              <motion.li
                key={camp.id}
                className={cn(
                  "ascent-camps__camp md:absolute md:w-[min(42%,22rem)]",
                  side === "left" ? "md:left-[6%]" : "md:right-[6%] md:left-auto",
                )}
                style={campPosition(index, count)}
                initial={reduced ? false : { opacity: 0, y: 28 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={reduced ? { duration: 0 } : { ...SPRING_SOFT, delay: index * 0.08 }}
              >
                <article className="ascent-camps__card">
                  <p className="text-kicker font-mono text-accent uppercase">
                    {camp.altitude}
                  </p>
                  <h3 className="section-heading--sm mt-2">
                    {camp.title}
                  </h3>
                  <p className="copy mt-2">
                    {camp.text}
                  </p>
                </article>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function ascentPath(count: number, height: number): string {
  // Rising zigzag — left/right camps climbing the page (mountain trail).
  if (count <= 2) {
    return `M 220 120 C 480 120, 520 ${height * 0.55}, 780 ${height * 0.55}`;
  }
  if (count === 3) {
    return [
      `M 220 110 C 480 110, 520 ${height * 0.38}, 780 ${height * 0.38}`,
      `C 920 ${height * 0.38}, 560 ${height * 0.72}, 240 ${height * 0.78}`,
    ].join(" ");
  }
  // 4+ camps
  return [
    `M 240 100 C 480 100, 540 ${height * 0.28}, 760 ${height * 0.3}`,
    `C 900 ${height * 0.32}, 560 ${height * 0.48}, 260 ${height * 0.52}`,
    `C 120 ${height * 0.55}, 480 ${height * 0.7}, 760 ${height * 0.74}`,
    `C 900 ${height * 0.76}, 620 ${height * 0.88}, 320 ${height * 0.9}`,
  ].join(" ");
}

function campPosition(index: number, count: number): { top?: string } {
  const tops =
    count <= 3
      ? ["4%", "34%", "68%"]
      : count === 4
        ? ["2%", "26%", "52%", "76%"]
        : ["2%", "20%", "40%", "60%", "78%"];
  return { top: tops[Math.min(index, tops.length - 1)] };
}
