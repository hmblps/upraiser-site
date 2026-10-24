/**
 * Upraiser Media Deck — Multilingual Registry.
 * Complete 20 Slides across all 22 Global Languages.
 */

import type { HubLang } from "../conferenceHubI18n";
import type { DeckSlideContent, DeckUIStrings } from "./types";
import { DECK_UI_STRINGS } from "./ui";

import { DECK_SLIDES_EN } from "./en";
import { DECK_SLIDES_RU } from "./ru";
import { DECK_SLIDES_RO } from "./ro";
import { DECK_SLIDES_KA } from "./ka";
import { DECK_SLIDES_ES } from "./es";
import { DECK_SLIDES_DE } from "./de";
import { DECK_SLIDES_FR } from "./fr";
import { DECK_SLIDES_PT } from "./pt";
import { DECK_SLIDES_IT } from "./it";
import { DECK_SLIDES_ZH } from "./zh";
import { DECK_SLIDES_JA } from "./ja";
import { DECK_SLIDES_KO } from "./ko";
import { DECK_SLIDES_UK } from "./uk";
import { DECK_SLIDES_PL } from "./pl";
import { DECK_SLIDES_TR } from "./tr";
import { DECK_SLIDES_AR } from "./ar";
import { DECK_SLIDES_HE } from "./he";
import { DECK_SLIDES_HI } from "./hi";
import { DECK_SLIDES_VI } from "./vi";
import { DECK_SLIDES_TH } from "./th";
import { DECK_SLIDES_ID } from "./id";
import { DECK_SLIDES_FIL } from "./fil";

export * from "./types";
export { DECK_UI_STRINGS };

export const DECK_SLIDES_BY_LANG: Record<HubLang, Record<number, DeckSlideContent>> = {
  en: DECK_SLIDES_EN,
  ru: DECK_SLIDES_RU,
  ro: DECK_SLIDES_RO,
  ka: DECK_SLIDES_KA,
  es: DECK_SLIDES_ES,
  de: DECK_SLIDES_DE,
  fr: DECK_SLIDES_FR,
  pt: DECK_SLIDES_PT,
  it: DECK_SLIDES_IT,
  zh: DECK_SLIDES_ZH,
  ja: DECK_SLIDES_JA,
  ko: DECK_SLIDES_KO,
  uk: DECK_SLIDES_UK,
  pl: DECK_SLIDES_PL,
  tr: DECK_SLIDES_TR,
  ar: DECK_SLIDES_AR,
  he: DECK_SLIDES_HE,
  hi: DECK_SLIDES_HI,
  vi: DECK_SLIDES_VI,
  th: DECK_SLIDES_TH,
  id: DECK_SLIDES_ID,
  fil: DECK_SLIDES_FIL,
};

/**
 * Retrieve slide content for any of the 22 languages and slide number 1-20.
 */
export function getDeckSlide(lang: HubLang, slideNumber: number): DeckSlideContent {
  const dict = DECK_SLIDES_BY_LANG[lang] || DECK_SLIDES_BY_LANG.en;
  return dict[slideNumber] || DECK_SLIDES_BY_LANG.en[slideNumber] || DECK_SLIDES_BY_LANG.en[1];
}

/**
 * Retrieve UI controls strings for the media deck.
 */
export function getDeckUI(lang: HubLang): DeckUIStrings {
  return DECK_UI_STRINGS[lang] || DECK_UI_STRINGS.en;
}
