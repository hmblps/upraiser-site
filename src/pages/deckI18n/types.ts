/**
 * Upraiser Media Deck — Type Definitions.
 */

export interface DeckSlideBullet {
  title: string;
  desc: string;
  badge?: string;
}

export interface DeckSlideMetric {
  value: string;
  label: string;
  sub?: string;
}

export interface DeckSlideContent {
  slideNumber: number;
  kicker: string;
  title: string;
  subtitle?: string;
  bullets?: DeckSlideBullet[];
  metrics?: DeckSlideMetric[];
  tagline?: string;
}

export interface DeckUIStrings {
  backToHub: string;
  downloadPdf: string;
  openPdfViewer: string;
  slideOf: string;
  prev: string;
  next: string;
  interactiveMode: string;
  visualMode: string;
  fullscreen: string;
  exitFullscreen: string;
  selectLanguage: string;
  swipeHint: string;
  clipInCta: string;
  saveVcf: string;
  contactAlex: string;
  deckTitle: string;
}
