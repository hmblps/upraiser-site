import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { useFormatScrollSection } from "../../hooks/useFormatScrollSection";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { SiteMode } from "../../data/liveContent";
import { SectionHeader } from "../SectionHeader";
import { BrandAurora } from "../BrandAurora";
import { CanvasErrorBoundary } from "../CanvasErrorBoundary";
import { AD_FORMATS, type AdFormat } from "./ProgrammaticFormats";
import { FormatCopy } from "./FormatCopy";
import { ProgrammaticScrollSectionMobile } from "./ProgrammaticScrollSectionMobile";

import "../../styles/programmatic-scroll-section.css";
import "../../styles/programmatic-full-feed.css";

const phone3DImport = () =>
  import("./Phone3D").then((m) => ({ default: m.Phone3D }));
const macbook3DImport = () =>
  import("../channel-visuals/Macbook3D").then((m) => ({ default: m.Macbook3D }));

const Phone3D = lazy(phone3DImport);
const Macbook3D = lazy(macbook3DImport);

if (typeof window !== "undefined") {
  void phone3DImport();
  void macbook3DImport();
}

const DESKTOP_MIN_WIDTH = 1024;

export type ProgrammaticScrollSectionProps = {
  mode: SiteMode;
  lane?: string;
  laneSwitcher?: ReactNode;
  sectionId?: string;
  formats?: readonly AdFormat[];
  headerLabel?: string;
  headerTitle?: string;
  headerDescription?: string;
};

/**
 * Native sticky scroll drives the active format — no wheel hijack.
 * Desktop: 3D phone. Mobile / reduced: stacked cards + CssPhone dock.
 */
export function ProgrammaticScrollSection({
  mode,
  lane = "app-growth",
  laneSwitcher,
  sectionId,
  formats = AD_FORMATS,
  headerLabel = "Lanes",
  headerTitle = "Every Format. One Supply Path.",
  headerDescription,
}: ProgrammaticScrollSectionProps) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const desktopEnabled = !isMobile && !reduced;

  const { activeIndex, jumpTo, totalVirtual } = useFormatScrollSection(sectionRef, {
    enabled: desktopEnabled,
    formatCount: formats.length,
    reduced,
  });

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${DESKTOP_MIN_WIDTH - 1}px)`);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!desktopEnabled) return;
    void import("./Phone3D").then((m) => {
      m.preloadPhone3DAssets(mode);
    });
  }, [desktopEnabled, mode]);

  const format = formats[activeIndex] ?? formats[0]!;

  if (!desktopEnabled) {
    return (
      <div id={sectionId} className="prog-scroll-outer-mobile">
        <ProgrammaticScrollSectionMobile
          mode={mode}
          laneSwitcher={laneSwitcher}
          formats={formats}
          headerLabel={headerLabel}
          headerTitle={headerTitle}
          headerDescription={headerDescription}
        />
      </div>
    );
  }

  return (
    <div
      id={sectionId}
      ref={sectionRef}
      className="prog-scroll-outer"
      style={{ height: `calc(100dvh + ${totalVirtual}px)` }}
      aria-label="Ad formats"
    >
      <div className="prog-scroll-sticky">
        <div className="prog-scroll-ambience" aria-hidden />
        <BrandAurora tone="routes" className="prog-scroll-stage-aurora" />
        <div className="prog-scroll-sticky-inner">
          <div className="prog-scroll-headline">
            <SectionHeader label={headerLabel} title={headerTitle} description={headerDescription} />
          </div>
          <div className="prog-scroll-layout">
            <div className="prog-scroll-phone-col">
              <Suspense fallback={<div className="prog-scroll-canvas" />}>
                <CanvasErrorBoundary
                  fallback={
                    <div
                      className="prog-scroll-canvas"
                      style={{
                        background: "red",
                        color: "white",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <h1>3D CRASHED! Error caught by boundary.</h1>
                    </div>
                  }
                >
                  {lane === "oem-ctv" ? (
                    <Macbook3D mode={mode} className="prog-scroll-canvas" />
                  ) : (
                    <Phone3D mode={mode} formatId={format.id} className="prog-scroll-canvas" />
                  )}
                </CanvasErrorBoundary>
              </Suspense>
            </div>

            <div className="prog-scroll-copy-col">
              <FormatCopy
                format={format}
                index={activeIndex}
                total={formats.length}
                mode={mode}
                reduced={false}
                laneSwitcher={laneSwitcher}
                formats={formats}
                onJump={jumpTo}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
