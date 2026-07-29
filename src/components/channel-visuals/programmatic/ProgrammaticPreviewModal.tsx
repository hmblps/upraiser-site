import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { SiteMode } from "../../../data/liveContent";
import { cn } from "../../../lib/cn";
import { useReducedMotion } from "../../../hooks/useReducedMotion";
import { PROGRAMMATIC_FORMATS } from "../ProgrammaticCarousel";
import { ProgrammaticFormatSlide } from "./ProgrammaticFormatSlide";

const MODAL_SPRING = { type: "spring" as const, stiffness: 340, damping: 30, mass: 0.75 };

type ProgrammaticPreviewModalProps = {
  open: boolean;
  index: number;
  mode: SiteMode;
  onClose: () => void;
  onSelect: (index: number) => void;
};

export function ProgrammaticPreviewModal({
  open,
  index,
  mode,
  onClose,
  onSelect,
}: ProgrammaticPreviewModalProps) {
  const reduced = useReducedMotion();
  const format = PROGRAMMATIC_FORMATS[index]!;

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="cv-prog-modal"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduced ? { duration: 0.15 } : MODAL_SPRING}
        >
          <button type="button" className="cv-prog-modal__backdrop" aria-label="Close preview" onClick={onClose} />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${format.label} ad format preview`}
            className="cv-prog-modal__panel"
            initial={reduced ? false : { opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 18, scale: 0.96 }}
            transition={reduced ? { duration: 0.15 } : MODAL_SPRING}
            data-lenis-prevent
          >
            <div className="cv-prog-modal__toolbar">
              <p className="cv-prog-modal__title">{format.label}</p>
              <button type="button" className="cv-prog-modal__close" onClick={onClose} aria-label="Close">
                ×
              </button>
            </div>

            <div
              className={cn(
                "cv-prog-phone cv-prog-modal__phone",
                mode === "growth" ? "cv-prog-phone--silver" : "cv-prog-phone--copper",
              )}
            >
              <span className="cv-prog-phone__btn cv-prog-phone__btn--silent" aria-hidden />
              <span className="cv-prog-phone__btn cv-prog-phone__btn--vol-up" aria-hidden />
              <span className="cv-prog-phone__btn cv-prog-phone__btn--vol-down" aria-hidden />
              <span className="cv-prog-phone__btn cv-prog-phone__btn--power" aria-hidden />
              <div className="cv-prog-phone__screen cv-prog-phone__screen--modal">
                <span className="cv-prog-phone__env" aria-hidden />
                <span className="cv-prog-phone__island" aria-hidden />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={format.id}
                    className="cv-prog-modal__slide"
                    initial={reduced ? false : { opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduced ? undefined : { opacity: 0, scale: 1.01 }}
                    transition={MODAL_SPRING}
                  >
                    <ProgrammaticFormatSlide formatId={format.id} src={format.src} interactive />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="cv-prog-modal__dots" role="tablist" aria-label="Ad format">
              {PROGRAMMATIC_FORMATS.map((item, i) => (
                <motion.button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={item.label}
                  className={cn(i === index && "is-active")}
                  onClick={() => onSelect(i)}
                  whileTap={reduced ? undefined : { scale: 0.82 }}
                  transition={{ type: "spring", stiffness: 420, damping: 24 }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
