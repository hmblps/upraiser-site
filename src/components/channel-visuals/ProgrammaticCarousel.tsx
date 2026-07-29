import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import type { SiteMode } from "../../data/liveContent";
import { cn } from "../../lib/cn";
import { ProgrammaticFormatSlide } from "./programmatic/ProgrammaticFormatSlide";
import { ProgrammaticPreviewModal } from "./programmatic/ProgrammaticPreviewModal";
import "../../styles/programmatic-banner-screen.css";

const SCREEN_SPRING = { type: "spring" as const, stiffness: 280, damping: 28, mass: 0.85 };
const CAPTION_SPRING = { type: "spring" as const, stiffness: 320, damping: 28 };
const STEP_MS = 2000;

export const PROGRAMMATIC_FORMATS = [
  { id: "banner", label: "Banner", src: "/channels/programmatic-refs/screens/banner.png" },
  { id: "native", label: "Native", src: "/channels/programmatic-refs/screens/native.png" },
  { id: "interstitial", label: "Interstitial", src: "/channels/programmatic-refs/screens/interstitial.png" },
  { id: "rich", label: "Rich Media", src: "/channels/programmatic-refs/screens/rich-media.png" },
  { id: "video", label: "Video", src: "/channels/programmatic-refs/screens/video.png" },
] as const;

type ProgrammaticCarouselProps = {
  mode: SiteMode;
  reduced?: boolean;
};

/** Live CSS + Framer Motion carousel — banner uses Stitch Community UI. */
export function ProgrammaticCarousel({ mode, reduced = false }: ProgrammaticCarouselProps) {
  const [index, setIndex] = useState(0);
  const [autoplayEpoch, setAutoplayEpoch] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const format = PROGRAMMATIC_FORMATS[index]!;

  const goTo = useCallback((next: number) => {
    setIndex(next);
    setAutoplayEpoch((epoch) => epoch + 1);
  }, []);

  useEffect(() => {
    if (reduced || previewOpen) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % PROGRAMMATIC_FORMATS.length);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [reduced, autoplayEpoch, previewOpen]);

  const openPreview = () => setPreviewOpen(true);
  const closePreview = () => setPreviewOpen(false);

  return (
    <>
      <div className="cv-prog-stack">
        <div className="cv-prog-stack__device">
          <button
            type="button"
            className={cn(
              "cv-prog-phone cv-prog-phone--clickable",
              mode === "growth" ? "cv-prog-phone--silver" : "cv-prog-phone--copper",
            )}
            aria-label={`Expand ${format.label} ad preview`}
            onClick={openPreview}
          >
            <span className="cv-prog-phone__btn cv-prog-phone__btn--silent" aria-hidden />
            <span className="cv-prog-phone__btn cv-prog-phone__btn--vol-up" aria-hidden />
            <span className="cv-prog-phone__btn cv-prog-phone__btn--vol-down" aria-hidden />
            <span className="cv-prog-phone__btn cv-prog-phone__btn--power" aria-hidden />
            <div className="cv-prog-phone__screen">
              <span className="cv-prog-phone__env" aria-hidden />
              <span className="cv-prog-phone__island" aria-hidden />
              <AnimatePresence mode="wait">
                <motion.div
                  key={format.id}
                  className="cv-prog-stack__screen-wrap"
                  initial={reduced ? false : { opacity: 0, scale: 0.985 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduced ? undefined : { opacity: 0, scale: 1.01 }}
                  transition={SCREEN_SPRING}
                >
                  <ProgrammaticFormatSlide formatId={format.id} src={format.src} />
                </motion.div>
              </AnimatePresence>
            </div>
          </button>
        </div>
        <div className="cv-prog-stack__caption">
          <AnimatePresence mode="wait">
            <motion.p
              key={format.label}
              className="cv-prog-stack__label"
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={CAPTION_SPRING}
              aria-live="polite"
            >
              {format.label}
            </motion.p>
          </AnimatePresence>
          <div className="cv-prog-stack__dots" role="tablist" aria-label="Ad format">
            {PROGRAMMATIC_FORMATS.map((item, i) => (
              <motion.button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={item.label}
                className={cn(i === index && "is-active")}
                onClick={() => goTo(i)}
                whileTap={reduced ? undefined : { scale: 0.82 }}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
              />
            ))}
          </div>
        </div>
      </div>

      <ProgrammaticPreviewModal
        open={previewOpen}
        index={index}
        mode={mode}
        onClose={closePreview}
        onSelect={goTo}
      />
    </>
  );
}
