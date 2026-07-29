import { ProgrammaticCommunityApp } from "./ProgrammaticCommunityApp";
import { ProgrammaticScreenScaler } from "./ProgrammaticScreenScaler";

type ProgrammaticFormatSlideProps = {
  formatId: string;
  src: string;
  interactive?: boolean;
};

export function ProgrammaticFormatSlide({ formatId, src, interactive = false }: ProgrammaticFormatSlideProps) {
  if (formatId === "banner") {
    return (
      <ProgrammaticScreenScaler className={interactive ? "cv-prog-screen-slot--interactive" : undefined}>
        <ProgrammaticCommunityApp />
      </ProgrammaticScreenScaler>
    );
  }

  return <img src={src} alt="" className="cv-prog-stack__screen" loading="lazy" draggable={false} />;
}
