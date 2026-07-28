/**
 * Saatchi Performance → UPRAISER depth-page data map.
 * Home / Cases / Contact stay owned elsewhere — do not rewire them from this file.
 *
 * Shared depth IA (Solutions · Measurement · About):
 *  1. Hero intro
 *  2. Trust marquee
 *  3. Philosophy (where page needs thesis)
 *  4. Page-owned taxonomy / product surface
 *  5. Tech spotlight → Clarity (Solutions)
 *  6. Proof rows → /cases
 *  7. Footer CTA
 *
 * Visual languages stay page-specific:
 *  Solutions  → route spine
 *  Measurement → receipt reconcile
 *  About      → archive / registry
 */

export type ServiceCategory = "Media Buying" | "Data & Tech" | "Optimization";

export interface ServiceItem {
  id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  iconName: string;
  badge?: string;
  /** Deep-link into Solutions / Measurement when wired */
  href?: string;
}

export interface PerformanceCaseStudy {
  id: string;
  client: string;
  vertical: "Fintech" | "iGaming" | "App Growth" | "E-commerce" | "Gaming" | "Marketplace";
  mainMetric: string;
  metricLabel: string;
  description: string;
  link: string;
  logoUrl: string;
}

export interface Pillar {
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface TrustLogo {
  name: string;
  logoUrl: string;
}

/** Block order for a Saatchi-shaped Home rebuild. */
export const PERFORMANCE_IA = [
  "header",
  "hero",
  "trustMarquee",
  "philosophy",
  "services",
  "techSpotlight",
  "caseStudies",
  "footerCta",
] as const;

export type PerformanceBlock = (typeof PERFORMANCE_IA)[number];

/**
 * Current Home ↔ Saatchi block mapping (as of Jul 2026).
 * Use when rewiring HomePage — do not invent a parallel homepage.
 */
export const PERFORMANCE_TO_HOME: Record<PerformanceBlock, string> = {
  header: "Header + SectionNav",
  hero: "Hero (video + Charting the Ascent)",
  trustMarquee: "LenovoTrustStrip (+ optional Cases logo marquee)",
  philosophy: "Audience + Difference + Promise (fold charts live here only)",
  services: "TrafficChannels variant=home → /solutions",
  techSpotlight: "Clarity teaser → /clarity",
  caseStudies: "CasesTeaser → /cases",
  footerCta: "HomePilotCta + Footer",
};

export const PERFORMANCE_CONTENT = {
  hero: {
    badge: "Performance media with a receipt",
    h1Lead: "We see how stunning",
    h1Mid: "Your rise to the top",
    h1End: "can be.",
    tagline: "Charting the Ascent",
    subheading:
      "Programmatic scale, Lenovo OEM lanes, and pre-bid filtration — bought so Ad Ops and finance close on the same file.",
    ctaPrimary: "Request Pilot",
    ctaPrimaryHref: "/contact",
    ctaSecondary: "Explore Solutions",
    ctaSecondaryHref: "/solutions",
  },

  trustLogos: [
    { name: "Fanatics", logoUrl: "/cases/logos/fanatics.png" },
    { name: "Block Blast", logoUrl: "/cases/logos/block-blast.png" },
    { name: "Fiverr", logoUrl: "/cases/logos/fiverr.png" },
    { name: "Shopee", logoUrl: "/cases/logos/shopee.png" },
    { name: "Vantage", logoUrl: "/cases/logos/vantage.png" },
    { name: "Autodoc", logoUrl: "/cases/logos/autodoc.png" },
    { name: "Lenovo", logoUrl: "/partners/lenovo-logo.png" },
  ] satisfies TrustLogo[],

  philosophy: {
    tagline: "HUMAN BUYING + MACHINE SPEED",
    title: "Why automation alone is not enough",
    description:
      "Algorithms chase the event they are fed. We set the event finance already tracks — then let bid machines run inside that fence.",
    pillars: [
      {
        number: "01",
        title: "Omnichannel precision",
        subtitle: "Full-funnel reach",
        description:
          "Programmatic, OEM / Lenovo, paid social, creators, native, and CTV — one reconciliation file.",
      },
      {
        number: "02",
        title: "Pre-bid fraud shielding",
        subtitle: "Zero wasted budget",
        description:
          "Traffic verification before impression commitment — bad supply never clears the cap.",
      },
      {
        number: "03",
        title: "Receipt-first measurement",
        subtitle: "Clarity on every flight",
        description:
          "Bid-time and bill-time agree. Month-end is a file pull, not a war room.",
      },
    ] as Pillar[],
  },

  services: [
    {
      id: "programmatic",
      title: "Programmatic Advertising",
      category: "Media Buying",
      description: "DSP buying with pre-bid scoring across in-app and open web inventory.",
      iconName: "Cpu",
      badge: "High Scale",
      href: "/solutions?pillar=performance&channel=programmatic",
    },
    {
      id: "in-app",
      title: "App Growth",
      category: "Media Buying",
      description: "UA for apps measured on installs, FTD, and subscription — not vanity CPI.",
      iconName: "Smartphone",
      badge: "Mobile",
      href: "/solutions?pillar=performance",
    },
    {
      id: "paid-search-social",
      title: "Creators",
      category: "Media Buying",
      description: "Meta, TikTok, and creator placements wired to MMP events.",
      iconName: "Search",
      href: "/solutions?pillar=creators",
    },
    {
      id: "oem-inventory",
      title: "OEM",
      category: "Media Buying",
      description: "Factory ROM and Google PAI — official Lenovo agency lanes with SDK trails.",
      iconName: "Layers",
      badge: "Official Partner",
      href: "/solutions?pillar=oem",
    },
    {
      id: "attribution-tech",
      title: "Clarity",
      category: "Data & Tech",
      description: "S2S postbacks, MMP wiring, and bid-time / bill-time reconciliation.",
      iconName: "BarChart3",
      href: "/clarity",
    },
    {
      id: "premium-ctv",
      title: "Premium & CTV",
      category: "Optimization",
      description: "Native editorial and connected TV with pre-bid household scoring.",
      iconName: "Palette",
      href: "/solutions?pillar=premium",
    },
  ] as ServiceItem[],

  techSpotlight: {
    badge: "Measurement stack",
    productName: "Clarity",
    title: "Every bid has a receipt",
    description:
      "Scoring, logs, and Your MMP on one path — so Ad Ops and finance close without a reconciliation call.",
    features: [
      "Pre-bid guard — fraud and cohort checks before the impression clears",
      "Live GEO and KPI caps that follow outcomes in flight",
      "Month-end file finance and Ad Ops can pull the same day",
    ],
    ctaText: "Open Clarity",
    ctaHref: "/clarity",
  },

  caseStudies: [
    {
      id: "fanatics",
      client: "Fanatics",
      vertical: "iGaming",
      mainMetric: "$250K+",
      metricLabel: "Revenue",
      description: "Compliant sportsbook scale — FTD-tied inventory across US legal states.",
      link: "/cases/fanatics",
      logoUrl: "/cases/logos/fanatics.png",
    },
    {
      id: "block-blast-pai",
      client: "Block Blast",
      vertical: "Gaming",
      mainMetric: "32K+",
      metricLabel: "Daily installs",
      description: "Lenovo PAI worldwide with retention floors gating every bid increase.",
      link: "/cases/block-blast-pai",
      logoUrl: "/cases/logos/block-blast.png",
    },
    {
      id: "snoop",
      client: "Snoop",
      vertical: "Fintech",
      mainMetric: "0%",
      metricLabel: "Log drift target",
      description: "Fintech UA where bid-time and bill-time had to agree for finance.",
      link: "/cases/snoop",
      logoUrl: "/cases/logos/snoop.png",
    },
  ] as PerformanceCaseStudy[],

  footerCta: {
    title: "Request a pilot on Your stack",
    subtitle: "Tell us the vertical, GEO, and KPI event — we reply with a scoped path, not a deck.",
    buttonText: "Request Pilot",
    buttonHref: "/contact",
  },
} as const;
