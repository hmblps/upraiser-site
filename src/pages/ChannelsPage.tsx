import { useScrollToTop } from "../hooks/useScrollToTop";
import { ProgrammaticScrollSection } from "../components/solutions/ProgrammaticScrollSection";
import { RoutesLaneSwitcher } from "../components/RoutesLaneSwitcher";
import { useRoutesLane } from "../hooks/useRoutesLane";
import { Link } from "react-router-dom";

export function ChannelsPage() {
  useScrollToTop();
  const { mode, lane, setLane, formats, headerLabel, headerTitle, headerDescription } = useRoutesLane();

  return (
    <main className="site-main bg-white dark:bg-[#06090e]">
      {/* Floating Header */}
      <div className="fixed top-8 left-8 z-50">
        <Link 
          to="/#routes"
          className="flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 backdrop-blur-md rounded-full text-sm font-bold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Basecamp
        </Link>
      </div>

      <div className="pt-24">
        <ProgrammaticScrollSection 
          sectionId="channels-scroll"
          lane={lane}
          mode={mode}
          laneSwitcher={
            <RoutesLaneSwitcher
              lane={lane}
              onLaneChange={setLane}
              layoutId="channels-solutions-lane-pill"
            />
          }
          formats={formats}
          headerLabel={headerLabel}
          headerTitle={headerTitle}
          headerDescription={headerDescription}
        />
      </div>
    </main>
  );
}
