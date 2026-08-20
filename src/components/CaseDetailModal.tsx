import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { CaseStudy } from "../data/cases";
import { CaseDetailArticle } from "./CaseDetailArticle";
import { AmbientModalBackground } from "./AmbientModalBackground";
import { useReducedMotion } from "../hooks/useReducedMotion";

type CaseDetailModalProps = {
  item: CaseStudy | null;
  open: boolean;
  onClose: () => void;
  onExitComplete?: () => void;
};

/** Full case story in a spring modal — not inline on the archive page. */
export function CaseDetailModal({ item, open, onClose, onExitComplete }: CaseDetailModalProps) {
  const reduced = useReducedMotion();
  const visible = open && Boolean(item);
  const coarse =
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  const simpleMotion = reduced || coarse;

  useEffect(() => {
    if (!visible) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("case-modal-open");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.classList.remove("case-modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [visible, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence onExitComplete={onExitComplete}>
      {visible && item ? (
        <motion.div
          key={item.id}
          className="case-detail-modal"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
        >
          <button
            type="button"
            className="case-detail-modal__backdrop"
            aria-label="Close case study"
            onClick={onClose}
          />
          <AmbientModalBackground />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`case-modal-title-${item.id}`}
            data-lenis-prevent
            className="case-detail-modal__panel"
            initial={simpleMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={simpleMotion ? undefined : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
            onAnimationComplete={(definition) => {
              // Fix for Windows: When animation finishes, clear the inline transform
              // so the browser drops the GPU layer and restores ClearType text rendering.
              if (definition && typeof definition === "object" && "opacity" in definition && definition.opacity === 1) {
                const el = document.querySelector(".case-detail-modal__panel") as HTMLElement;
                if (el) {
                  el.style.transform = "none";
                }
              }
            }}
          >
            <div className="case-detail-modal__toolbar">
              <p id={`case-modal-title-${item.id}`} className="sr-only">
                {item.client} case study
              </p>
              <button
                type="button"
                onClick={onClose}
                data-cursor="link"
                className="case-detail-modal__close"
              >
                Close <span aria-hidden>✕</span>
              </button>
            </div>

            <div className="case-detail-modal__body">
              <CaseDetailArticle item={item} showCta={false} />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
