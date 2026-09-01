import { useParams, Navigate, useNavigate } from "react-router-dom";
import { AD_FORMATS, OEM_CTV_FORMATS } from "../components/solutions/ProgrammaticFormats";
import { ProgrammaticScrollSection } from "../components/solutions/ProgrammaticScrollSection";
import { useScrollToTop } from "../hooks/useScrollToTop";

export function RouteDetailPage() {
  useScrollToTop();
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // Find which lane this format belongs to
  const isProgrammatic = AD_FORMATS.some(f => f.id === slug);
  const isOem = OEM_CTV_FORMATS.some(f => f.id === slug);
  
  if (!isProgrammatic && !isOem) {
    return <Navigate to="/" replace />;
  }
  
  const lane = isProgrammatic ? "programmatic" : "oem";
  const formats = isProgrammatic ? AD_FORMATS : OEM_CTV_FORMATS;
  
  // Provide header details based on lane
  const headerLabel = lane === "programmatic" ? "Programmatic & Social" : "OEM & CTV";
  const headerTitle = lane === "programmatic" ? "Performance buying across all inventory" : "Hardware-level pathways and TV scale";
  const headerDescription = lane === "programmatic" 
    ? "One dashboard for programmatic, social, and search. Unified caps, deduplicated attribution, and fraud filtering at the bid level."
    : "Direct factory inventory and living room reach. Connected to the same MMP tracking and optimization engine as your mobile channels.";

  return (
    <main className="site-main bg-white dark:bg-[#06090e]">
      {/* A simple back button to go back to homepage formats */}
      <div className="fixed top-24 left-8 z-50">
        <button 
          onClick={() => navigate("/#routes")}
          className="flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 backdrop-blur-md rounded-full text-sm font-bold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Basecamp
        </button>
      </div>

      <ProgrammaticScrollSection 
        sectionId="route-detail"
        lane={lane}
        mode="growth" // Defaulting to growth mode for the visuals
        formats={formats}
        headerLabel={headerLabel}
        headerTitle={headerTitle}
        headerDescription={headerDescription}
        // Force the section to start at the specific slug if possible, or just render the lane
      />
    </main>
  );
}
