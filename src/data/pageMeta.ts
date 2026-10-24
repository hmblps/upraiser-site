export const SITE_ORIGIN = "https://upraiser.co.uk";
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.png`;

export type PageMetaRecord = {
  title: string;
  description: string;
  keywords?: string;
  robots?: string;
};

const HOME_DESCRIPTION =
  "UPRAISER — London-based mobile performance since 2017. Pre-bid fraud filtration, Lenovo OEM distribution, and verified outcomes for iGaming and fintech.";

const HOME_KEYWORDS =
  "Upraiser, Lenovo, Lenovo OEM, OEM, OEM traffic, In-App Traffic Infrastructure, In-App, Traffic Infrastructure, Media Deck, Mobile Performance, Programmatic DSP, iGaming, Fintech, Fraud Filtration, London, User Acquisition, Alex Ostroukhov";

export const defaultPageMeta: PageMetaRecord = {
  title: "UPRAISER — Lenovo OEM & In-App Traffic Infrastructure",
  description: HOME_DESCRIPTION,
  keywords: HOME_KEYWORDS,
};

export const pageMetaByPath: Record<string, PageMetaRecord> = {
  "/": defaultPageMeta,
  "/connect": {
    title: "Upraiser — Lenovo OEM & In-App Traffic Infrastructure | Connect Hub",
    description:
      "Upraiser Summit Hub. Direct connection with Oleksii Ostroukhov & Vladyslav Samoilenko. Lenovo OEM distribution, programmatic media buying, pre-bid fraud filtration, and verified in-app traffic infrastructure.",
    keywords:
      "Upraiser, Lenovo, Lenovo OEM, OEM, OEM traffic, In-App Traffic Infrastructure, In-App, Traffic Infrastructure, Oleksii Ostroukhov, Alex Ostroukhov, Vladyslav Samoilenko, Media Deck, Programmatic, DSP, iGaming, Fintech, Mobile Performance, Connect Hub, Summit, London, Performance Marketing",
  },
  "/deck": {
    title: "Upraiser — Lenovo OEM & In-App Traffic Infrastructure | Media Deck",
    description:
      "Upraiser Media Deck — proprietary Lenovo OEM distribution, pre-bid fraud filtration, and verified performance outcomes for mobile apps, iGaming, and fintech.",
    keywords:
      "Upraiser, Lenovo, Lenovo OEM, OEM, OEM Advertising, Media Deck, Deck, Presentation, In-App Traffic Infrastructure, In-App, Traffic, Mobile App Growth, User Acquisition, Programmatic DSP, Pre-Bid Fraud Filtration, iGaming Performance, Fintech UA, London, Traffic Infrastructure",
  },
  "/channels": {
    title: "The Routes | UPRAISER",
    description:
      "App Growth and OEM & CTV formats on one supply path — programmatic, social, Lenovo OEM, and connected TV.",
  },
  "/craft": {
    title: "Creative Studio | UPRAISER",
    description: "Creative lab and proprietary pipelines for UPRAISER traffic infrastructure. Workshop opening soon.",
    robots: "noindex, follow",
  },
  "/contact": {
    title: "Request Pilot | UPRAISER",
    description:
      "Brief Your vertical, GEO, and KPI event. UPRAISER operators reply with a scoped path — not a deck. 128 City Road, London.",
  },
  "/contact/sent": {
    title: "Brief received | UPRAISER",
    description: "Your pilot brief reached the UPRAISER desk. Operators reply within 24 hours.",
    robots: "noindex, nofollow",
  },
  "/privacy": {
    title: "Privacy Policy | UPRAISER",
    description:
      "Privacy Policy for UPRAISER Agency LLP — how we collect, use, and protect personal data on upraiser.co.uk.",
  },
  "/terms": {
    title: "Terms & Conditions | UPRAISER",
    description: "Terms and Conditions for use of the UPRAISER website at upraiser.co.uk.",
  },
};

export const notFoundMeta: PageMetaRecord = {
  title: "Page not on the map | UPRAISER",
  description: "This route is not on the UPRAISER map. Return to The Agency or jump to The Routes.",
  robots: "noindex, follow",
};

export function casePageMeta(client: string, headline: string): PageMetaRecord {
  return {
    title: `${client} — Peak | UPRAISER`,
    description: headline,
  };
}
