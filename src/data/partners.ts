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
