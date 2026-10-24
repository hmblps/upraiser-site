import { useEffect } from "react";
import { Link } from "react-router-dom";
import { SiteGrain } from "../components/SiteGrain";
import { useActivityTracker } from "../hooks/useActivityTracker";
import { trackLeadAction } from "../lib/activityTracker";

const PDF_URL = "/Upraiser_Traffic_Infrastructure.pdf";

export default function MediaDeckViewerPage() {
  const { trackAction } = useActivityTracker("media_deck_viewer");

  useEffect(() => {
    trackAction("deck_view", 0, { source: "deck_page_opened" });
  }, [trackAction]);

  return (
    <div className="min-h-[100dvh] bg-[#030712] text-white flex flex-col font-sans relative selection:bg-[#ff003b] selection:text-white">
      <SiteGrain />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-20 bg-[#090d16]/90 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            to="/connect"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
            title="Back to Conference Hub"
          >
            ←
          </Link>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#FECF09]">
              Expedition Dossier · 20 Slides
            </div>
            <h1 className="text-sm font-semibold text-white tracking-tight truncate max-w-[200px] sm:max-w-none">
              Traffic Infrastructure & OEM Preloads
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href={PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackLeadAction("deck_view", 0, { action: "open_fullscreen" })}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white flex items-center space-x-1.5 transition-colors"
          >
            <span>Open PDF</span>
            <span aria-hidden className="text-[#FECF09]">↗</span>
          </a>
          <a
            href={PDF_URL}
            download="Upraiser_Traffic_Infrastructure.pdf"
            onClick={() => trackLeadAction("deck_view", 0, { action: "download_pdf" })}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#e63558] hover:bg-[#ff003b] text-xs font-medium text-white flex items-center space-x-1.5 transition-colors shadow-sm shadow-[#e63558]/30"
          >
            <span>Download</span>
            <span aria-hidden>⬇</span>
          </a>
        </div>
      </header>

      {/* Main PDF Viewer Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-2 sm:p-4 flex flex-col relative z-10">
        <div className="flex-1 w-full bg-neutral-900/60 border border-white/10 rounded-2xl overflow-hidden min-h-[75vh] flex flex-col relative">
          <object
            data={`${PDF_URL}#toolbar=0&navpanes=0`}
            type="application/pdf"
            className="w-full flex-1 min-h-[75vh] rounded-2xl"
          >
            {/* Fallback for browsers without inline PDF rendering (e.g. mobile Chrome) */}
            <div className="p-8 text-center flex flex-col items-center justify-center flex-1 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                📄
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-white">UPRAISER Expedition Dossier</h2>
                <p className="text-xs text-neutral-400 max-w-sm">
                  Mobile UA & OEM Infrastructure presentation (2.2 MB). Tap below to open directly in Your native document viewer.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full max-w-xs">
                <a
                  href={PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[48px] py-3 px-6 rounded-xl bg-[#e63558] hover:bg-[#ff003b] text-white font-medium text-sm text-center flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>Open in Viewer</span>
                  <span>↗</span>
                </a>
                <Link
                  to="/connect"
                  className="w-full min-h-[48px] py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm text-center flex items-center justify-center transition-colors"
                >
                  Back to Hub
                </Link>
              </div>
            </div>
          </object>
        </div>
      </main>
    </div>
  );
}
