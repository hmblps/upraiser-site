import { AnimatePresence, motion } from "framer-motion";
import type { AdFormat } from "./ProgrammaticFormats";
import type { SiteMode } from "../../data/liveContent";

const SPRING = { type: "spring" as const, stiffness: 220, damping: 28, mass: 0.85 };

// Scroll within a lane → vertical (content is a vertical list)
const panelScroll = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: SPRING },
  exit:    { opacity: 0, y: 8, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const } },
};

// Tumbler / lane switch → horizontal (tabs are a horizontal paradigm;
// matches the device carousel sliding direction)
const panelLane = {
  hidden: (dir: number) => ({ opacity: 0, x: dir * 28 }),
  visible:              ({ opacity: 1, x: 0, transition: SPRING }),
  exit:   (dir: number) => ({ opacity: 0, x: dir * -20, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const } }),
};

type FormatCopyProps = {
  format: AdFormat;
  index: number;
  total: number;
  mode: SiteMode;
  reduced: boolean;
  /** "scroll" = vertical slide (default); "lane" = horizontal slide matching the device carousel */
  transitionDir?: "scroll" | "lane";
  /** +1 = switching to a lane on the right, −1 = switching to a lane on the left */
  laneDirection?: number;
  formats: readonly AdFormat[];
  onJump?: (index: number) => void;
};

export function FormatCopy({
  format,
  index,
  total,
  mode,
  reduced,
  transitionDir = "scroll",
  laneDirection = 1,
  formats,
  onJump,
}: FormatCopyProps) {
  const accentClass = mode === "growth" ? "text-accent" : "text-accent";

  return (
    <div className="format-copy-wrap">
      <AnimatePresence mode="popLayout" custom={laneDirection}>
        <motion.div
          key={format.id + format.label}
          className="format-copy"
          custom={laneDirection}
          variants={reduced ? undefined : transitionDir === "lane" ? panelLane : panelScroll}
          initial={reduced ? false : "hidden"}
          animate="visible"
          exit={reduced ? undefined : "exit"}
          style={reduced ? undefined : { willChange: "transform, opacity" }}
        >
          <p className={`stat-label format-copy__tagline whitespace-nowrap shrink-0 ${accentClass}`}>
            {format.tagline}
          </p>

          <h2 className="format-copy__title">{format.label}</h2>

          <p className="format-copy__body copy">{format.description}</p>

          <ul className="channel-inventory-points mt-5 space-y-2.5">
            {format.points.map((point) => (
              <li key={point} className="channel-inventory-points__item copy text-muted">
                  {point}
                </li>
            ))}
          </ul>

          <div className="format-copy__progress">
            <span className="format-copy__progress-label stat-label text-muted whitespace-nowrap shrink-0">
              {index + 1} / {total}
            </span>
            <div className="format-copy__dots" role="tablist" aria-label="Formats">
              {formats.map((fmt, idx) => (
                <motion.button
                  key={fmt.id + fmt.label}
                  type="button"
                  role="tab"
                  whileHover={reduced ? undefined : { scale: 1.2 }}
                  whileTap={reduced ? undefined : { scale: 0.8 }}
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  aria-selected={idx === index}
                  aria-label={`${idx + 1}. ${fmt.label}`}
                  className={`format-copy__dot min-h-11 min-w-11${idx === index ? " format-copy__dot--active" : ""}`}
                  onClick={() => onJump?.(idx)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
