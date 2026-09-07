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

export function CssTablet({ mode, formatId, className = "" }: CssPhoneProps) {
  const finish = mode === "growth" ? "deepblue" : "orange";
  
  return (
    <div className={`relative flex-shrink-0 aspect-[3/4] sm:aspect-[4/3] rounded-2xl p-1.5 shadow-[0_28px_56px_rgba(0,0,0,0.28),inset_0_0_0_1px_rgba(255,255,255,0.12)] prog-css-phone--${finish} ${className}`.trim()}>
      <div className="relative w-full h-full rounded-[1rem] overflow-hidden bg-[#050505] border-2 border-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
        <div className="absolute inset-0 overflow-hidden">
          {formatId === "ctv-spot" || formatId === "ctv-video" ? (
            <video
              src="/channels/oem/screens/ctv-spot.mp4"
              muted
              loop
              playsInline
              autoPlay
              poster="/channels/oem/screens/ctv-spot.png"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <img src="/channels/oem/screens/oem-store.jpg" alt="OEM Store" className="absolute inset-0 w-full h-full object-cover" />
          )}
        </div>
      </div>
    </div>
  );
}

export function CssTv({ mode, formatId: _formatId, className = "" }: CssPhoneProps) {
  const finish = mode === "growth" ? "deepblue" : "orange";
  
  return (
    <div className={`relative flex-shrink-0 aspect-[16/9] rounded-lg p-1 shadow-[0_28px_56px_rgba(0,0,0,0.28),inset_0_0_0_1px_rgba(255,255,255,0.12)] prog-css-phone--${finish} ${className}`.trim()}>
      <div className="relative w-full h-full rounded-md overflow-hidden bg-[#050505] border-2 border-black">
        <div className="absolute inset-0 overflow-hidden">
          <video
            src="/channels/oem/screens/ctv-spot.mp4"
            muted
            loop
            playsInline
            autoPlay
            poster="/channels/oem/screens/ctv-spot.png"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-1/3 h-2 bg-[#121c2c] rounded-b-sm border-x border-b border-black" />
    </div>
  );
}
