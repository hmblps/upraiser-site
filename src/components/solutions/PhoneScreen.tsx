import { ProgrammaticFullFeed } from "../channel-visuals/programmatic/ProgrammaticFullFeed";
import { ProgrammaticScreenScaler } from "../channel-visuals/programmatic/ProgrammaticScreenScaler";
import type { AdFormat } from "./ProgrammaticFormats";
import "../../styles/programmatic-banner-screen.css";
import "../../styles/programmatic-full-feed.css";

type PhoneScreenProps = {
  format: AdFormat;
  reduced: boolean;
};

/** Full stitch feed inside the phone — auto-scrolls to active format. */
export function PhoneScreen({ format }: PhoneScreenProps) {
  return (
    <div className="phone-screen-root">
      <ProgrammaticScreenScaler>
        <ProgrammaticFullFeed activeFormatId={format.id} />
      </ProgrammaticScreenScaler>
    </div>
  );
}
