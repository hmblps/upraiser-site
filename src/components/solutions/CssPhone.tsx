import type { SiteMode } from "../../data/liveContent";
import { ProgrammaticFullFeed } from "../channel-visuals/programmatic/ProgrammaticFullFeed";

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
          <ProgrammaticFullFeed activeFormatId={formatId} />
        </div>
        <span className="prog-css-phone__home-glow" aria-hidden />
      </div>
    </div>
  );
}
