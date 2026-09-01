export const SITE_ORIGIN = "https://upraiser.co.uk";
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.png`;

export type PageMetaRecord = {
  title: string;
  description: string;
  robots?: string;
};

const HOME_DESCRIPTION =
  "UPRAISER — London-based mobile performance since 2017. Pre-bid fraud filtration, Lenovo OEM distribution, and verified outcomes for iGaming and fintech.";

export const defaultPageMeta: PageMetaRecord = {
  title: "UPRAISER — Charting the Ascent",
  description: HOME_DESCRIPTION,
};

export const pageMetaByPath: Record<string, PageMetaRecord> = {
  "/": defaultPageMeta,
  "/craft": {
    title: "The Craft | UPRAISER",
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
  description: "This route is not on the UPRAISER map. Return to The Basecamp or jump to The Routes.",
  robots: "noindex, follow",
};

export function casePageMeta(client: string, headline: string): PageMetaRecord {
  return {
    title: `${client} — Peak | UPRAISER`,
    description: headline,
  };
}
