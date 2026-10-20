import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { GlobalModalTrigger } from "./GlobalModalTrigger";

type PrivacyModalProps = {
  open: boolean;
  onClose: () => void;
  onAccept?: () => void;
};

let cachedHtml: string | null = null;

function extractMain(html: string) {
  const match = html.match(/<main class="legal-main">([\s\S]*?)<\/main>/);
  return match?.[1]?.trim() ?? "";
}

export function PrivacyModal({ open, onClose, onAccept }: PrivacyModalProps) {
  const reduced = useReducedMotion();
  const coarse =
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  const simpleMotion = reduced || coarse;

  const [html, setHtml] = useState<string>(cachedHtml || "");
  const [loading, setLoading] = useState<boolean>(!cachedHtml);

  useEffect(() => {
    if (!open) return;

    if (cachedHtml) {
      setHtml(cachedHtml);
      setLoading(false);
      return;
    }

    let live = true;
    setLoading(true);
    fetch("/privacy/index.html")
      .then((res) => res.text())
      .then((raw) => {
        if (!live) return;
        const main = extractMain(raw);
        cachedHtml = main;
        setHtml(main);
        setLoading(false);
      })
      .catch(() => {
        if (live) {
          setLoading(false);
          setHtml("<p>Unable to load the privacy policy right now. You can review the document directly at <a href=\"/privacy\" target=\"_blank\" rel=\"noopener noreferrer\">upraiser.co.uk/privacy</a>.</p>");
        }
      });

    return () => {
      live = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

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
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="privacy-modal-wrapper"
          className="case-detail-modal"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.25 }}
        >
          <button
            type="button"
            className="case-detail-modal__backdrop"
            aria-label="Close privacy policy"
            onClick={onClose}
          />
          <GlobalModalTrigger />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-modal-title"
            data-lenis-prevent
            className="case-detail-modal__panel flex flex-col"
            initial={simpleMotion ? false : { opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={simpleMotion ? undefined : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
            onAnimationComplete={(definition) => {
              if (
                definition &&
                typeof definition === "object" &&
                "opacity" in definition &&
                definition.opacity === 1
              ) {
                const el = document.querySelector(".case-detail-modal__panel") as HTMLElement;
                if (el) el.style.transform = "none";
              }
            }}
          >
            {/* Header Toolbar */}
            <div className="flex w-full shrink-0 items-center justify-between border-b border-border/40 px-6 py-2.5">
              <div className="flex items-center gap-2">
                <span id="privacy-modal-title" className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
                  Legal · Review date: July 2026
                </span>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center text-[12px] font-medium text-muted underline underline-offset-2 transition hover:text-fg touch-manipulation"
                  data-cursor="link"
                >
                  Open in new tab ↗
                </a>
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={simpleMotion ? undefined : { scale: 1.05 }}
                  whileTap={simpleMotion ? undefined : { scale: 0.92 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                  data-cursor="link"
                  className="case-detail-modal__close flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 touch-manipulation"
                  aria-label="Close"
                >
                  Close <span aria-hidden>✕</span>
                </motion.button>
              </div>
            </div>

            {/* Content Body */}
            <div className="case-detail-modal__body flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
              {loading ? (
                <div className="flex min-h-[30dvh] items-center justify-center text-muted">
                  <span className="text-caption animate-pulse">Loading privacy documentation…</span>
                </div>
              ) : (
                <article
                  className="legal-doc"
                  lang="en"
                  data-no-translate
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              )}
            </div>

            {/* Footer Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/40 bg-elevated/80 px-5 py-3.5 backdrop-blur sm:px-8">
              <span className="text-[11px] text-muted">
                UPRAISER Agency LLP · London EC1V 2NX · ICO ZC000436
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-caps inline-flex min-h-[44px] items-center rounded-full border border-border/70 px-5 py-2 text-[11px] text-muted transition hover:border-border hover:text-fg touch-manipulation"
                >
                  Close
                </button>
                {onAccept ? (
                  <button
                    type="button"
                    onClick={() => {
                      onAccept();
                      onClose();
                    }}
                    className="btn-caps btn-caps--primary inline-flex min-h-[44px] items-center rounded-full px-5 py-2 text-[11px] touch-manipulation"
                  >
                    I Agree & Close
                  </button>
                ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
