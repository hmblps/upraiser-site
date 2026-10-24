import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SiteGrain } from "../components/SiteGrain";
import { useActivityTracker } from "../hooks/useActivityTracker";
import {
  DECK_SLIDES_META,
  TOTAL_SLIDES,
  type SlideVisualMeta,
} from "./mediaDeckData";
import {
  getDeckSlide,
  getDeckUI,
  HUB_LANGS,
  HUB_LANG_NAMES,
  HUB_RTL,
  HUB_PLAIN_SCRIPT,
  type HubLang,
  type DeckSlideContent,
} from "./mediaDeckI18n";
import { detectDeviceLang } from "./conferenceHubI18n";

const PDF_URL = "/Upraiser_Traffic_Infrastructure.pdf";

export default function MediaDeckViewerPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Language state synced with URL ?lang=... and persisted in localStorage
  const [lang, setLang] = useState<HubLang>(() => {
    const p = searchParams.get("lang")?.toLowerCase().trim();
    if (p && (HUB_LANGS as readonly string[]).includes(p)) {
      return p as HubLang;
    }
    if (typeof localStorage !== "undefined") {
      try {
        const stored = localStorage.getItem("upraiser_preferred_lang")?.toLowerCase().trim();
        if (stored && (HUB_LANGS as readonly string[]).includes(stored)) {
          return stored as HubLang;
        }
      } catch {}
    }
    return detectDeviceLang();
  });

  // 2. Slide state (1 to 20) synced with URL ?slide=N
  const [currentSlide, setCurrentSlide] = useState<number>(() => {
    const s = parseInt(searchParams.get("slide") || "1", 10);
    return s >= 1 && s <= TOTAL_SLIDES ? s : 1;
  });

  // 3. View mode: interactive multilingual vs original visual graphics
  const [viewMode, setViewMode] = useState<"interactive" | "visual">("interactive");
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);

  // Synchronize language when URL search param changes
  useEffect(() => {
    const p = searchParams.get("lang")?.toLowerCase().trim();
    if (p && (HUB_LANGS as readonly string[]).includes(p) && p !== lang) {
      setLang(p as HubLang);
    }
  }, [searchParams, lang]);

  const handleSetLang = useCallback(
    (next: HubLang) => {
      setLang(next);
      if (typeof localStorage !== "undefined") {
        try {
          localStorage.setItem("upraiser_preferred_lang", next);
        } catch {}
      }
      setSearchParams(
        (prev) => {
          const updated = new URLSearchParams(prev);
          updated.set("lang", next);
          return updated;
        },
        { replace: true }
      );
      setLangModalOpen(false);
    },
    [setSearchParams]
  );

  const slideContent: DeckSlideContent = getDeckSlide(lang, currentSlide);
  const slideMeta: SlideVisualMeta =
    DECK_SLIDES_META.find((m) => m.slideNumber === currentSlide) || DECK_SLIDES_META[0];
  const ui = getDeckUI(lang);

  // 4. Telemetry Tracker with live slide metadata in periodic heartbeats
  const { trackAction, getActiveSeconds } = useActivityTracker("media_deck_viewer", () => ({
    current_slide: currentSlide,
    total_slides: TOTAL_SLIDES,
    slide_title: slideContent.title,
    lang,
    viewMode,
  }));

  // Dynamic document.title update with high-weight keywords for browser history & Omnibox autocomplete
  useEffect(() => {
    const targetContent = getDeckSlide(lang, currentSlide);
    const dynamicTitle = `Upraiser — Lenovo OEM & In-App Traffic Infrastructure | Media Deck (${currentSlide}/${TOTAL_SLIDES}: ${targetContent.title})`;
    document.title = dynamicTitle;
  }, [lang, currentSlide]);

  // Track initial deck view
  useEffect(() => {
    trackAction("deck_view", 0, {
      current_slide: currentSlide,
      total_slides: TOTAL_SLIDES,
      slide_title: slideContent.title,
      lang,
      viewMode,
      source: "deck_page_mount",
    });
  }, []);

  const goToSlide = useCallback(
    (targetSlide: number) => {
      if (targetSlide < 1 || targetSlide > TOTAL_SLIDES) return;
      setCurrentSlide(targetSlide);
      // Use push (replace: false) so each visited slide registers in browser history with rich titles
      setSearchParams(
        (prev) => {
          const updated = new URLSearchParams(prev);
          updated.set("slide", String(targetSlide));
          return updated;
        },
        { replace: false }
      );

      const targetContent = getDeckSlide(lang, targetSlide);
      const dynamicTitle = `Upraiser — Lenovo OEM & In-App Traffic Infrastructure | Media Deck (${targetSlide}/${TOTAL_SLIDES}: ${targetContent.title})`;
      document.title = dynamicTitle;

      trackAction("deck_view", getActiveSeconds(), {
        current_slide: targetSlide,
        total_slides: TOTAL_SLIDES,
        slide_title: targetContent.title,
        lang,
        viewMode,
      });
    },
    [lang, viewMode, trackAction, getActiveSeconds, setSearchParams]
  );

  const prevSlide = useCallback(() => {
    if (currentSlide > 1) goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  const nextSlide = useCallback(() => {
    if (currentSlide < TOTAL_SLIDES) goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  // Keyboard navigation: Left / Right arrows & Space
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "KeyF" && !e.ctrlKey && !e.metaKey) {
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch Swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Must be predominantly horizontal swipe > 45px
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const isRtl = HUB_RTL.has(lang);
  const isPlainScript = HUB_PLAIN_SCRIPT.has(lang);

  return (
    <div
      ref={containerRef}
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-[100dvh] bg-[#030712] text-white flex flex-col font-sans relative selection:bg-[#ff003b] selection:text-white overflow-x-hidden"
    >
      <SiteGrain />

      {/* Top Header & Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#090d16]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse min-w-0">
          <Link
            to={`/connect?lang=${lang}`}
            className="min-h-[44px] min-w-[44px] px-2.5 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors border border-white/5"
            title={ui.backToHub}
          >
            <span className="text-sm font-semibold">{ui.backToHub}</span>
          </Link>
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#FECF09] flex items-center space-x-1.5 rtl:space-x-reverse">
              <span>{ui.slideOf.replace("{current}", String(currentSlide)).replace("{total}", String(TOTAL_SLIDES))}</span>
              <span className="text-white/30">·</span>
              <span className="text-white/60 hidden xs:inline uppercase">{slideMeta.category}</span>
            </div>
            <h1 className="text-xs sm:text-sm font-semibold text-white tracking-tight truncate max-w-[140px] sm:max-w-xs md:max-w-md">
              {slideContent.title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 rtl:space-x-reverse shrink-0">
          {/* Interactive vs Visual Mode Switcher */}
          <div className="hidden md:flex items-center rounded-xl bg-white/5 p-0.5 border border-white/10">
            <button
              onClick={() => setViewMode("interactive")}
              className={`min-h-[36px] px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                viewMode === "interactive"
                  ? "bg-[#e63558] text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {ui.interactiveMode}
            </button>
            <button
              onClick={() => setViewMode("visual")}
              className={`min-h-[36px] px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                viewMode === "visual"
                  ? "bg-[#e63558] text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {ui.visualMode}
            </button>
          </div>

          {/* Language Selector Trigger */}
          <button
            onClick={() => setLangModalOpen(true)}
            className="min-h-[44px] min-w-[44px] px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-200 flex items-center space-x-1 rtl:space-x-reverse transition-colors"
            title={ui.selectLanguage}
          >
            <span>🌐</span>
            <span className="font-mono uppercase font-bold text-[#FECF09]">{lang}</span>
            <span className="text-[10px] text-neutral-400">▼</span>
          </button>

          {/* Download Original PDF Button */}
          <a
            href={PDF_URL}
            download="Upraiser_Traffic_Infrastructure.pdf"
            onClick={() =>
              trackAction("deck_view", getActiveSeconds(), {
                action: "download_original_pdf",
                current_slide: currentSlide,
                lang,
              })
            }
            className="min-h-[44px] px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-medium text-white flex items-center space-x-1.5 rtl:space-x-reverse transition-colors"
            title="Download PDF"
          >
            <span className="hidden sm:inline">{ui.downloadPdf}</span>
            <span className="sm:hidden">{ui.openPdfViewer}</span>
            <span aria-hidden className="text-[#FECF09]">↗</span>
          </a>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="min-h-[44px] min-w-[44px] hidden sm:flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-neutral-300 hover:text-white transition-colors"
            title={isFullscreen ? ui.exitFullscreen : ui.fullscreen}
          >
            {isFullscreen ? "🗗" : "⛶"}
          </button>
        </div>
      </header>

      {/* Main Slide Presentation Stage */}
      <main
        className="flex-1 w-full max-w-5xl mx-auto p-2 sm:p-4 flex flex-col justify-center relative z-10"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Aspect Ratio Slide Container */}
        <div
          className={`relative w-full rounded-3xl border border-white/[0.08] bg-[#070b16] shadow-2xl overflow-hidden flex flex-col transition-all duration-300 sm:aspect-[16/9] min-h-[520px] sm:min-h-0 ${
            isFullscreen ? "sm:max-h-[85vh]" : ""
          }`}
          style={{
            backgroundImage: `radial-gradient(circle at 85% 15%, ${slideMeta.accentColor}15 0%, transparent 55%), radial-gradient(circle at 10% 85%, #030612 0%, transparent 70%)`,
          }}
        >
          {viewMode === "visual" ? (
            /* Visual Mode: 1:1 High-Res Slide Graphics */
            <div className="relative w-full h-full flex items-center justify-center bg-black/60 p-2 sm:p-4">
              <img
                src={slideMeta.imageWebp}
                alt={slideContent.title}
                className="w-full h-full object-contain rounded-2xl select-none"
                loading="eager"
              />
            </div>
          ) : (
            /* Interactive Mode: 100% Vector Multilingual Layout — Airy Minimalist Swiss Typography */
            <div className="relative w-full h-full p-6 sm:p-10 md:p-12 flex flex-col justify-between overflow-y-auto sm:overflow-hidden">
              {/* Slide Header Zone */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center space-x-2 rtl:space-x-reverse text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                    <span
                      className="w-2 h-2 rounded-full shadow-sm"
                      style={{ backgroundColor: slideMeta.accentColor }}
                    />
                    <span>{slideContent.kicker}</span>
                  </div>
                  <span className="text-xs font-mono text-neutral-400 font-medium">
                    #{String(currentSlide).padStart(2, "0")} / {TOTAL_SLIDES}
                  </span>
                </div>

                <h2
                  className={`text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-[1.14] ${
                    isPlainScript ? "tracking-normal" : ""
                  }`}
                >
                  {slideContent.title}
                </h2>

                {slideContent.subtitle && (
                  <p className="text-sm sm:text-base text-neutral-300/90 leading-relaxed max-w-3xl font-normal mt-1.5 sm:mt-2.5">
                    {slideContent.subtitle}
                  </p>
                )}
              </div>

              {/* Slide Core Content Body — Borderless Generous Whitespace */}
              <div className="my-auto py-4 sm:py-6 md:py-8">
                {/* Variant A: Prominent Numerical Metrics (No Box Cards, Floating Typography) */}
                {slideContent.metrics && (
                  <div
                    className={`grid gap-6 sm:gap-10 md:gap-14 ${
                      slideContent.metrics.length === 3
                        ? "grid-cols-1 sm:grid-cols-3"
                        : "grid-cols-1 sm:grid-cols-2"
                    }`}
                  >
                    {slideContent.metrics.map((metric, i) => (
                      <div key={i} className="flex flex-col justify-start">
                        <div
                          className="text-4xl sm:text-5xl md:text-6xl font-black font-mono tracking-tight leading-none"
                          style={{ color: slideMeta.accentColor }}
                        >
                          {metric.value}
                        </div>
                        <div className="text-sm sm:text-base font-bold text-white mt-2.5 tracking-tight">
                          {metric.label}
                        </div>
                        {metric.sub && (
                          <div className="text-xs text-neutral-400 mt-1 leading-relaxed font-normal max-w-xs">
                            {metric.sub}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Variant B: Structured Feature Bullets / Pillars (Airy Columns, Zero Box Borders) */}
                {slideContent.bullets && (
                  <div
                    className={`grid gap-6 sm:gap-8 md:gap-12 mt-4 sm:mt-6 ${
                      slideContent.bullets.length === 4
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                        : slideContent.bullets.length === 3
                        ? "grid-cols-1 sm:grid-cols-3"
                        : "grid-cols-1 sm:grid-cols-2"
                    }`}
                  >
                    {slideContent.bullets.map((b, i) => (
                      <div
                        key={i}
                        className="flex flex-col justify-start space-y-1.5 sm:space-y-2"
                      >
                        {b.badge && (
                          <div className="text-[10px] font-mono uppercase tracking-widest text-[#FECF09] font-bold">
                            {b.badge}
                          </div>
                        )}
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-tight leading-snug">
                          {b.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-300/85 leading-relaxed font-normal">
                          {b.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Variant C: Final Slide 20 Onboarding Call To Action */}
                {currentSlide === 20 && (
                  <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#e63558]/15 via-[#ff003b]/05 to-transparent border border-[#e63558]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left rtl:sm:text-right">
                      <div className="text-xs font-bold text-white uppercase tracking-wider">
                        {ui.contactAlex}
                      </div>
                      <div className="text-xs text-neutral-300 leading-normal">
                        {slideContent.tagline}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse w-full sm:w-auto">
                      <Link
                        to={`/connect?lang=${lang}#clip-in`}
                        className="flex-1 sm:flex-initial min-h-[44px] px-5 py-2.5 rounded-xl bg-[#e63558] hover:bg-[#ff003b] text-white text-xs font-bold text-center flex items-center justify-center space-x-1.5 transition-colors shadow-lg shadow-[#e63558]/30"
                      >
                        <span>{ui.clipInCta}</span>
                        <span>→</span>
                      </Link>
                      <a
                        href="/contact.vcf"
                        download="Alex_Upraiser.vcf"
                        onClick={() =>
                          trackAction("vcf_download", getActiveSeconds(), {
                            source: "deck_slide_20",
                            lang,
                          })
                        }
                        className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-semibold flex items-center justify-center transition-colors"
                        title={ui.saveVcf}
                      >
                        📇 {ui.saveVcf}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Slide Bottom Tagline & Brand Footnote */}
              <div className="pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-400 font-mono tracking-wide">
                <div className="truncate max-w-full">
                  {slideContent.tagline || "UPRAISER Agency · Traffic Infrastructure"}
                </div>
                <div className="text-neutral-400 hidden sm:block">
                  {ui.swipeHint}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tactile Navigation Slider Controls */}
        <div className="mt-3 sm:mt-4 flex items-center justify-between gap-2">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            disabled={currentSlide <= 1}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 rtl:space-x-reverse transition-all ${
              currentSlide <= 1
                ? "bg-white/5 text-neutral-600 border border-white/5 cursor-not-allowed"
                : "bg-white/10 hover:bg-white/15 text-white border border-white/10 active:scale-95"
            }`}
          >
            <span>←</span>
            <span>{ui.prev}</span>
          </button>

          {/* Interactive Slide Scrubber Track */}
          <div className="flex-1 max-w-md mx-2 flex items-center space-x-1 sm:space-x-1.5 rtl:space-x-reverse justify-center">
            {Array.from({ length: TOTAL_SLIDES }).map((_, idx) => {
              const slideNum = idx + 1;
              const isActive = slideNum === currentSlide;
              return (
                <button
                  key={slideNum}
                  onClick={() => goToSlide(slideNum)}
                  className={`min-h-[36px] min-w-[12px] sm:min-w-[16px] h-3 rounded-full transition-all duration-200 flex items-center justify-center ${
                    isActive
                      ? "w-6 sm:w-8 bg-[#FECF09] shadow-md shadow-[#FECF09]/40"
                      : "w-2 sm:w-3 bg-white/20 hover:bg-white/40"
                  }`}
                  title={`Slide ${slideNum}`}
                  aria-label={`Go to slide ${slideNum}`}
                />
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            disabled={currentSlide >= TOTAL_SLIDES}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 rtl:space-x-reverse transition-all ${
              currentSlide >= TOTAL_SLIDES
                ? "bg-white/5 text-neutral-600 border border-white/5 cursor-not-allowed"
                : "bg-[#e63558] hover:bg-[#ff003b] text-white shadow-lg shadow-[#e63558]/20 active:scale-95"
            }`}
          >
            <span>{ui.next}</span>
            <span>→</span>
          </button>
        </div>
      </main>

      {/* Language Selector Modal Popup */}
      {langModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0f19] border border-white/15 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>🌐</span>
                <span>{ui.selectLanguage} (22 Languages)</span>
              </h3>
              <button
                onClick={() => setLangModalOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto flex-1">
              {HUB_LANGS.map((code) => {
                const isSelected = code === lang;
                const name = HUB_LANG_NAMES[code] || code;
                return (
                  <button
                    key={code}
                    onClick={() => handleSetLang(code)}
                    className={`min-h-[44px] p-2.5 rounded-xl border text-left rtl:text-right flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-[#e63558]/20 border-[#e63558] text-white font-bold"
                        : "bg-white/5 border-white/5 hover:bg-white/10 text-neutral-300"
                    }`}
                  >
                    <span className="text-xs truncate">{name}</span>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase ml-1">
                      {code}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-white/10 bg-white/[0.02] text-center">
              <button
                onClick={() => setLangModalOpen(false)}
                className="w-full min-h-[44px] py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
