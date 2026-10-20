import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { SiteMode } from "../../data/liveContent";
import type { AdFormat } from "./ProgrammaticFormats";
import { FormatGlass } from "./CssPhone";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type RoutesDeviceModalProps = {
  open: boolean;
  onClose: () => void;
  mode: SiteMode;
  format: AdFormat;
  index: number;
  formats?: readonly AdFormat[];
  onSelectIndex?: (index: number) => void;
};

const MODAL_SPRING = {
  type: "spring" as const,
  stiffness: 280,
  damping: 30,
  mass: 0.8,
};

export function RoutesDeviceModal({
  open,
  onClose,
  mode,
  format,
  index,
  formats,
  onSelectIndex,
}: RoutesDeviceModalProps) {
  const reduced = useReducedMotion();
  const scene = format.scene ?? "phone";
  const finish = mode === "growth" ? "deepblue" : "accent";
  const total = formats?.length ?? 1;

  const handleClose = () => {
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add("case-modal-open");

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      } else if (e.key === "ArrowRight" && formats && onSelectIndex && total > 1) {
        e.preventDefault();
        onSelectIndex((index + 1) % total);
      } else if (e.key === "ArrowLeft" && formats && onSelectIndex && total > 1) {
        e.preventDefault();
        onSelectIndex((index - 1 + total) % total);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      root.classList.remove("case-modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, formats, onSelectIndex, index, total]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="routes-device-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${format.label} preview`}
          className="routes-device-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduced ? { duration: 0.12 } : { duration: 0.22 }}
          onClick={handleClose}
        >
          {/* Top bar: format metadata + 44x44 close button */}
          <div
            className="routes-device-modal__topbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="routes-device-modal__meta">
              <span className="routes-device-modal__counter">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <span className="routes-device-modal__title">{format.label}</span>
              <span className="routes-device-modal__tagline">{format.tagline}</span>
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close preview"
              className="routes-device-modal__close"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Center stage: Enlarged device in exact proportions (phone 9:19.5, tablet 3:4, tv 16:9) */}
          <div className="routes-device-modal__stage">
            <motion.div
              key={`${scene}-${format.id}`}
              className={`routes-device-modal__chassis routes-device-modal__chassis--${scene} prog-css-phone--${finish}`}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 12 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 8 }}
              transition={reduced ? { duration: 0.12 } : MODAL_SPRING}
              onClick={(e) => e.stopPropagation()}
            >
              {scene === "phone" && (
                <>
                  <span className="prog-css-phone__btn prog-css-phone__btn--silent" aria-hidden />
                  <span className="prog-css-phone__btn prog-css-phone__btn--vol-up" aria-hidden />
                  <span className="prog-css-phone__btn prog-css-phone__btn--vol-down" aria-hidden />
                  <span className="prog-css-phone__btn prog-css-phone__btn--power" aria-hidden />
                </>
              )}
              <div className={`routes-device-modal__bezel routes-device-modal__bezel--${scene}`}>
                <FormatGlass formatId={format.id} preferVideo />
              </div>
              {scene === "tv" && <div className="prog-css-tv__foot" aria-hidden />}
            </motion.div>
          </div>

          {/* Bottom bar: Prev / Format pills / Next */}
          {formats && formats.length > 1 && onSelectIndex ? (
            <div
              className="routes-device-modal__bottombar"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="routes-device-modal__nav-btn"
                onClick={() => onSelectIndex((index - 1 + total) % total)}
                aria-label="Previous format"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {/* Mobile (<768px): clean single active format indicator with arrows */}
              <div className="routes-device-modal__active-indicator md:hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={format.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    {format.label}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Desktop (>=768px): full pill list */}
              <div className="routes-device-modal__pills hidden md:flex" role="tablist" aria-label="Formats">
                {formats.map((fmt, idx) => {
                  const isActive = idx === index;
                  return (
                    <button
                      key={fmt.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => onSelectIndex(idx)}
                      className={`routes-device-modal__pill${isActive ? " is-active" : ""}`}
                    >
                      <span>{fmt.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="routes-device-modal__nav-btn"
                onClick={() => onSelectIndex((index + 1) % total)}
                aria-label="Next format"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
