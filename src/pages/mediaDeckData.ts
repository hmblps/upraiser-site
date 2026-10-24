/**
 * Upraiser Traffic Infrastructure — Slide Metadata and Asset Registry.
 * 20 High-Impact Slides based on the official 2026 Media Kit.
 */

export interface SlideVisualMeta {
  slideNumber: number; // 1 to 20
  id: string;
  imageWebp: string;
  accentColor: string; // '#FECF09', '#e63558', '#3b82f6', '#10b981', etc.
  category: "intro" | "pillars" | "tech" | "cases" | "blueprint";
}

export const DECK_SLIDES_META: SlideVisualMeta[] = [
  { slideNumber: 1, id: "cover", imageWebp: "/deck/slides/slide-01.webp", accentColor: "#e63558", category: "intro" },
  { slideNumber: 2, id: "mission", imageWebp: "/deck/slides/slide-02.webp", accentColor: "#FECF09", category: "intro" },
  { slideNumber: 3, id: "global_reach", imageWebp: "/deck/slides/slide-03.webp", accentColor: "#3b82f6", category: "intro" },
  { slideNumber: 4, id: "omnichannel_matrix", imageWebp: "/deck/slides/slide-04.webp", accentColor: "#8b5cf6", category: "pillars" },
  { slideNumber: 5, id: "pillar_hardware", imageWebp: "/deck/slides/slide-05.webp", accentColor: "#e63558", category: "pillars" },
  { slideNumber: 6, id: "pillar_programmatic", imageWebp: "/deck/slides/slide-06.webp", accentColor: "#06b6d4", category: "pillars" },
  { slideNumber: 7, id: "pillar_social_search", imageWebp: "/deck/slides/slide-07.webp", accentColor: "#3b82f6", category: "pillars" },
  { slideNumber: 8, id: "pillar_native", imageWebp: "/deck/slides/slide-08.webp", accentColor: "#f59e0b", category: "pillars" },
  { slideNumber: 9, id: "engine_dmp", imageWebp: "/deck/slides/slide-09.webp", accentColor: "#8b5cf6", category: "tech" },
  { slideNumber: 10, id: "shield_zero_tolerance", imageWebp: "/deck/slides/slide-10.webp", accentColor: "#10b981", category: "tech" },
  { slideNumber: 11, id: "data_bot_blocking", imageWebp: "/deck/slides/slide-11.webp", accentColor: "#10b981", category: "tech" },
  { slideNumber: 12, id: "clean_install_guarantee", imageWebp: "/deck/slides/slide-12.webp", accentColor: "#06b6d4", category: "tech" },
  { slideNumber: 13, id: "cases_igaming_fintech", imageWebp: "/deck/slides/slide-13.webp", accentColor: "#FECF09", category: "cases" },
  { slideNumber: 14, id: "cases_ecommerce_utility", imageWebp: "/deck/slides/slide-14.webp", accentColor: "#3b82f6", category: "cases" },
  { slideNumber: 15, id: "performance_matrix", imageWebp: "/deck/slides/slide-15.webp", accentColor: "#8b5cf6", category: "cases" },
  { slideNumber: 16, id: "case_study_scale", imageWebp: "/deck/slides/slide-16.webp", accentColor: "#10b981", category: "cases" },
  { slideNumber: 17, id: "case_study_revenue", imageWebp: "/deck/slides/slide-17.webp", accentColor: "#FECF09", category: "cases" },
  { slideNumber: 18, id: "optimization_cycle", imageWebp: "/deck/slides/slide-18.webp", accentColor: "#3b82f6", category: "tech" },
  { slideNumber: 19, id: "compliance_brand_safety", imageWebp: "/deck/slides/slide-19.webp", accentColor: "#10b981", category: "blueprint" },
  { slideNumber: 20, id: "blueprint_onboarding", imageWebp: "/deck/slides/slide-20.webp", accentColor: "#e63558", category: "blueprint" },
];

export const TOTAL_SLIDES = DECK_SLIDES_META.length; // 20
