import { ProgrammaticScrollSection } from "../components/solutions/ProgrammaticScrollSection";
import { useRoutesLane } from "../hooks/useRoutesLane";
import { ChannelsLoader } from "../components/ChannelsLoader";

export function ChannelsPage() {
  const { mode, lane, formats, headerLabel, headerTitle, headerDescription } = useRoutesLane();

  // Intel / reduced-motion / <1024 handled inside ProgrammaticScrollSection:
  // desktop lite keeps the two-column sticky layout (CSS chassis);
  // only narrow / reduced-motion uses the mobile stacked section.

  return (
    <main className="site-main channels-page">
      <ChannelsLoader />
      <div className="channels-page__stage">
        <ProgrammaticScrollSection 
          sectionId="channels-scroll"
          lane={lane}
          mode={mode}
          formats={formats}
          headerLabel={headerLabel}
          headerTitle={headerTitle}
          headerDescription={headerDescription}
        />
      </div>
    </main>
  );
}
