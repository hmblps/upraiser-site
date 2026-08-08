import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import type { AdFormat } from "./ProgrammaticFormats";
import type { SiteMode } from "../../data/liveContent";

const SPRING = { type: "spring" as const, stiffness: 220, damping: 28, mass: 0.85 };

const panel = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: SPRING },
  exit: { opacity: 0, y: -8, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const } },
};

type FormatCopyProps = {
  format: AdFormat;
  index: number;
  total: number;
  mode: SiteMode;
  reduced: boolean;
  laneSwitcher?: ReactNode;
  formats: readonly AdFormat[];
  onJump?: (index: number) => void;
};

export function FormatCopy({
  format,
  index,
  total,
  mode,
  reduced,
  laneSwitcher,
  formats,
  onJump,
}: FormatCopyProps) {
  const accentClass = mode === "growth" ? "text-accent" : "text-accent";

  return (
    <div className="format-copy-wrap">
      {laneSwitcher ? <div className="format-copy-wrap__switcher">{laneSwitcher}</div> : null}

      <AnimatePresence mode="wait">
          <motion.div
          key={format.id + format.label}
          className="format-copy"
          variants={reduced ? undefined : panel}
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
                <button
                  key={fmt.id + fmt.label}
                  type="button"
                  role="tab"
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
