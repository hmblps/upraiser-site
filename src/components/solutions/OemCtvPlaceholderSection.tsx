import { Suspense, type ReactNode } from "react";
import type { SiteMode } from "../../data/liveContent";
import { OEM_CTV_FORMATS } from "./ProgrammaticFormats";
import { ProgrammaticScrollSection } from "./ProgrammaticScrollSection";

type OemCtvPlaceholderSectionProps = {
  mode: SiteMode;
  laneSwitcher?: ReactNode;
};

/** OEM & CTV — same sticky phone + format scroll as App Growth. */
export function OemCtvPlaceholderSection({ mode, laneSwitcher }: OemCtvPlaceholderSectionProps) {
  return (
    <Suspense fallback={null}>
      <ProgrammaticScrollSection mode={mode} laneSwitcher={laneSwitcher} formats={OEM_CTV_FORMATS} />
    </Suspense>
  );
}
