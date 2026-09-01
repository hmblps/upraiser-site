import { useState } from "react";
import type { SiteMode } from "../../data/liveContent";
import { ProgrammaticFullFeed } from "../channel-visuals/programmatic/ProgrammaticFullFeed";
import { InterstitialVideo } from "./InterstitialVideo";

type CssPhoneProps = {
  mode: SiteMode;
  formatId: string;
  className?: string;
};

/**
 * CSS phone chassis with live HTML format feed (Solutions glass).
 */
export function CssPhone({ mode, formatId, className = "" }: CssPhoneProps) {
  const finish = mode === "growth" ? "deepblue" : "orange";

  return (
    <div className={`prog-css-phone prog-css-phone--${finish} ${className}`.trim()}>
      <span className="prog-css-phone__btn prog-css-phone__btn--silent" aria-hidden />
      <span className="prog-css-phone__btn prog-css-phone__btn--vol-up" aria-hidden />
      <span className="prog-css-phone__btn prog-css-phone__btn--vol-down" aria-hidden />
      <span className="prog-css-phone__btn prog-css-phone__btn--power" aria-hidden />
      <div className="prog-css-phone__bezel">
        <div className="prog-css-phone__notch" aria-hidden>
          <span className="prog-css-phone__speaker" />
          <span className="prog-css-phone__lens" />
        </div>
        <div className="prog-css-phone__screen">
          {formatId === "rich" ? (
            <iframe
              src="/rich-media-ad.html"
              title="Rich Media Ad"
              allow="autoplay; encrypted-media"
              className="prog-css-phone__live-ad"
            />
          ) : formatId === "video" ? (
            <VideoInterstitialScreen />
          ) : formatId === "ctv-spot" || formatId === "ctv-video" ? (
            <video
              src="/channels/oem/screens/ctv-spot.mp4"
              muted
              loop
              playsInline
              autoPlay
              poster="/channels/oem/screens/ctv-spot.png"
              className="prog-css-phone__live-ad"
            />
          ) : (
            <ProgrammaticFullFeed activeFormatId={formatId} />
          )}
        </div>
        <span className="prog-css-phone__home-glow" aria-hidden />
      </div>
    </div>
  );
}

function VideoInterstitialScreen() {
  const [closed, setClosed] = useState(false);

  if (closed) {
    return <div className="prog-css-phone__ad-closed">Ad closed</div>;
  }

  return (
    <>
      <InterstitialVideo className="prog-css-phone__live-video" />
      <button
        type="button"
        className="prog-css-phone__ad-close"
        aria-label="Close ad"
        onClick={() => setClosed(true)}
      >
        <span aria-hidden>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M1.2 1.2l9.6 9.6M10.8 1.2L1.2 10.8" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
      </button>
    </>
  );
}
