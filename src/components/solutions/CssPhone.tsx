import type { SiteMode } from "../../data/liveContent";
import { ProgrammaticFullFeed } from "../channel-visuals/programmatic/ProgrammaticFullFeed";

type CssPhoneProps = {
  mode: SiteMode;
  formatId: string;
  className?: string;
};

/**
 * CSS phone chassis with live HTML feed — used while polishing the feed
 * (and as mobile sticky). 3D GLB maps the same feed later without CSS3D.
 */
export function CssPhone({ mode, formatId, className = "" }: CssPhoneProps) {
  const finish = mode === "growth" ? "deepblue" : "orange";

  return (
    <div className={`prog-css-phone prog-css-phone--${finish} ${className}`.trim()}>
      <div className="prog-css-phone__bezel">
        <div className="prog-css-phone__notch" aria-hidden />
        <div className="prog-css-phone__screen">
          <ProgrammaticFullFeed activeFormatId={formatId} />
        </div>
      </div>
    </div>
  );
}
