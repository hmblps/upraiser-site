import type { SiteMode } from "../../data/liveContent";
import { cn } from "../../lib/cn";
import { FORMAT_STILL } from "../../data/deviceScreens";

type PhoneSilhouetteProps = {
  mode: SiteMode;
  formatId?: string;
  className?: string;
};

/**
 * Chassis stand-in with active format screen image — no pitch-black empty glass.
 */
export function PhoneSilhouette({ mode, formatId = "banner", className = "" }: PhoneSilhouetteProps) {
  const finish = mode === "growth" ? "deepblue" : "orange";
  const stillSrc = FORMAT_STILL[formatId] || FORMAT_STILL.banner;

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
