import type { SiteMode } from "../../data/liveContent";
import { cn } from "../../lib/cn";

type PhoneSilhouetteProps = {
  mode: SiteMode;
  className?: string;
};

/**
 * Neutral dark chassis stand-in while GLB / textures boot.
 * Same footprint as the desktop 3D stage — not a flat live-feed mock.
 */
export function PhoneSilhouette({ mode, className = "" }: PhoneSilhouetteProps) {
  const finish = mode === "growth" ? "deepblue" : "orange";

  return (
    <div
      className={cn("phone-silhouette", `phone-silhouette--${finish}`, className)}
      aria-hidden
    >
      <div className="phone-silhouette__body">
        <span className="phone-silhouette__island" />
        <span className="phone-silhouette__glass" />
      </div>
    </div>
  );
}
