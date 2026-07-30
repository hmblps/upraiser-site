export interface IntegrationPartner {
  name: string;
  slug: string;
  logo: string;
  /** Optical size tweak — 1 is default wordmark height */
  scale?: number;
}

const withLogo = (slug: string) => `/partners/${slug}.svg`;

/** Only partners with assets in `public/partners/` */
export const integrationPartners: IntegrationPartner[] = [
  { name: "Google", slug: "google", logo: withLogo("google"), scale: 1 },
  { name: "Apple", slug: "apple", logo: withLogo("apple"), scale: 1.22 },
  { name: "Meta", slug: "meta", logo: withLogo("meta"), scale: 1 },
  { name: "TikTok", slug: "tiktok", logo: withLogo("tiktok"), scale: 1.22 },
  { name: "X", slug: "x", logo: withLogo("x"), scale: 1.18 },
  { name: "Snapchat", slug: "snapchat", logo: withLogo("snapchat"), scale: 1.24 },
  { name: "Discord", slug: "discord", logo: withLogo("discord"), scale: 1 },
  { name: "Reddit", slug: "reddit", logo: withLogo("reddit"), scale: 1 },
  { name: "Microsoft Bing", slug: "bing", logo: withLogo("bing"), scale: 1 },
  { name: "Taboola", slug: "taboola", logo: withLogo("taboola"), scale: 1 },
  { name: "Outbrain", slug: "outbrain", logo: withLogo("outbrain"), scale: 1 },
  { name: "Unity", slug: "unity", logo: withLogo("unity"), scale: 1 },
  { name: "AppLovin", slug: "applovin", logo: withLogo("applovin"), scale: 1 },
  { name: "ironSource", slug: "ironsource", logo: withLogo("ironsource"), scale: 1 },
  { name: "Lenovo", slug: "lenovo", logo: withLogo("lenovo"), scale: 1 },
  { name: "AppsFlyer", slug: "appsflyer", logo: withLogo("appsflyer"), scale: 1.2 },
  { name: "Kochava", slug: "kochava", logo: withLogo("kochava"), scale: 1 },
  { name: "Singular", slug: "singular", logo: withLogo("singular"), scale: 1 },
];

/** Attribution / MMP logos */
export const mmpPartnerSlugs = ["appsflyer", "kochava", "singular"] as const;

/** Supply-side logos emphasized on OEM / supply contexts */
export const supplyPartnerSlugs = [
  "unity",
  "applovin",
  "ironsource",
  "taboola",
  "outbrain",
  "lenovo",
] as const;

export const socialPartnerSlugs = ["meta", "tiktok", "x", "snapchat", "discord", "reddit"] as const;

export const oemPartnerSlugs = ["lenovo", "google", "apple", "appsflyer"] as const;

export const studioPartnerSlugs = ["meta", "tiktok", "snapchat", "discord", "unity", "applovin"] as const;

export type PartnerLogoSetId =
  | "default"
  | "oem"
  | "growth"
  | "social"
  | "programmatic"
  | "studio"
  | "supply";

const LOGO_SETS: Record<PartnerLogoSetId, readonly string[]> = {
  default: integrationPartners.map((p) => p.slug),
  oem: oemPartnerSlugs,
  growth: ["meta", "tiktok", "google", "applovin", "unity", "appsflyer", "lenovo"],
  social: socialPartnerSlugs,
  programmatic: ["taboola", "outbrain", "applovin", "unity", "ironsource", "google"],
  studio: studioPartnerSlugs,
  supply: supplyPartnerSlugs,
};

export function partnersBySlugs(slugs: readonly string[]) {
  return slugs
    .map((slug) => integrationPartners.find((p) => p.slug === slug))
    .filter((p): p is IntegrationPartner => Boolean(p));
}

export function partnersForSet(set: PartnerLogoSetId) {
  return partnersBySlugs(LOGO_SETS[set]);
}

/** Pick logo set from pathname + optional expertise pillar. */
export function partnerSetForRoute(pathname: string, pillar: string | null = null): PartnerLogoSetId {
  if (pathname.startsWith("/studio") || pathname.startsWith("/craft") || pathname.startsWith("/rigging"))
    return "studio";
  if (pathname.startsWith("/solutions") || pathname.startsWith("/expertise")) {
    if (pillar === "oem") return "oem";
    if (pillar === "social" || pillar === "creators") return "social";
    if (pillar === "programmatic" || pillar === "ctv") return "programmatic";
    return "growth";
  }
  if (pathname.startsWith("/company") || pathname.startsWith("/clients")) return "default";
  return "default";
}
