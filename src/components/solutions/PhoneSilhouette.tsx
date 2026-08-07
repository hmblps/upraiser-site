import type { SiteMode } from "../../data/liveContent";
import { cn } from "../../lib/cn";

type PhoneSilhouetteProps = {
  mode: SiteMode;
  formatId?: string;
  className?: string;
};

const SCREEN_STILL: Record<string, string> = {
  banner: "/channels/programmatic-refs/screens/banner.png",
  native: "/channels/programmatic-refs/screens/native.png",
  interstitial: "/channels/programmatic-refs/screens/interstitial.png",
  rich: "/channels/programmatic-refs/screens/rich-media.png",
  video: "/channels/programmatic-refs/screens/video.png",
};

/**
 * Chassis stand-in with active format screen image — no pitch-black empty glass.
 */
export function PhoneSilhouette({ mode, formatId = "banner", className = "" }: PhoneSilhouetteProps) {
  const finish = mode === "growth" ? "deepblue" : "orange";
  const stillSrc = SCREEN_STILL[formatId] || SCREEN_STILL.banner;

  return (
    <div
      className={cn("phone-silhouette", `phone-silhouette--${finish}`, className)}
      aria-hidden
    >
      <div className="phone-silhouette__body">
        <span className="phone-silhouette__island" />
        <div className="phone-silhouette__glass">
          {stillSrc ? (
            <img
              src={stillSrc}
              alt=""
              className="h-full w-full object-fill object-top"
              loading="eager"
              decoding="sync"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
