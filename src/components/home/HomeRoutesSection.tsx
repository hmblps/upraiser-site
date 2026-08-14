import { ProgrammaticScrollSection } from "../solutions/ProgrammaticScrollSection";
import { RoutesLaneSwitcher } from "../RoutesLaneSwitcher";
import { useRoutesLane } from "../../hooks/useRoutesLane";

/** Home `#routes` — sticky phone + format scroll embedded in the pitch. */
export function HomeRoutesSection() {
  const { mode, lane, setLane, formats, headerLabel, headerTitle, headerDescription } = useRoutesLane();

  return (
    <ProgrammaticScrollSection
      key={lane}
      sectionId="routes"
      mode={mode}
      laneSwitcher={
        <RoutesLaneSwitcher
          lane={lane}
          onLaneChange={setLane}
          layoutId="home-routes-lane-pill"
        />
      }
      formats={formats}
      headerLabel={headerLabel}
      headerTitle={headerTitle}
      headerDescription={headerDescription}
    />
  );
}
