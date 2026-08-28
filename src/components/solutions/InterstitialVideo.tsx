import { useEffect, useRef, type CSSProperties } from "react";

/** WSJ Summer Sale reel — 9:16 interstitial. */
export const INTERSTITIAL_VIDEO_SRC = "/wsj-sale.mp4";

type InterstitialVideoProps = {
  className?: string;
  style?: CSSProperties;
};

export function InterstitialVideo({ className, style }: InterstitialVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;

    const play = () => {
      v.muted = true;
      void v.play().catch(() => {});
    };

    play();
    v.addEventListener("canplay", play);
    v.addEventListener("loadeddata", play);
    const retry = window.setInterval(() => {
      if (v.paused) play();
    }, 400);

    return () => {
      v.removeEventListener("canplay", play);
      v.removeEventListener("loadeddata", play);
      window.clearInterval(retry);
      v.pause();
    };
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      style={style}
      src={INTERSTITIAL_VIDEO_SRC}
      muted
      loop
      autoPlay
      playsInline
      preload="auto"
    />
  );
}
