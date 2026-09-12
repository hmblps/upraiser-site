import { useScrollToTop } from "../hooks/useScrollToTop";
import { ProgrammaticScrollSection } from "../components/solutions/ProgrammaticScrollSection";

import { useRoutesLane } from "../hooks/useRoutesLane";
import { Link } from "react-router-dom";
import { ChannelsLoader } from "../components/ChannelsLoader";

export function ChannelsPage() {
  useScrollToTop();
  const { mode, lane, formats, headerLabel, headerTitle, headerDescription } = useRoutesLane();

  // Intel / reduced-motion / <1024 handled inside ProgrammaticScrollSection:
  // desktop lite keeps the two-column sticky layout (CSS chassis);
  // only narrow / reduced-motion uses the mobile stacked section.

  return (
    <main className="site-main channels-page">
      <ChannelsLoader />
      {/* Floating Header */}
      <div className="fixed top-8 left-8 z-50">
        <Link 
          to="/#routes"
          className="flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 backdrop-blur-md rounded-full text-sm font-bold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to The Routes
        </Link>
      </div>

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
