/**
 * Inner pages only — Home / Cases / Contact stay frozen.
 *
 * IA:
 *  /expertise  — buying + OEM + Clarity (was Solutions + Measurement)
 *  /company    — institutional trust (was About)
 *
 * Truth locks:
 *  - Agency, not SaaS antifraud product
 *  - Clarity = measurement name (not OneView / Predictive DMP brand)
 *  - OEM moat = Lenovo official agency
 *  - No bento card grids — typographic lists + route spine
 */

export type ExpertiseClusterId = "media" | "oem" | "clarity";

export type ExpertiseCluster = {
  id: ExpertiseClusterId;
  title: string;
  problem: string;
  summary: string;
  category: string;
  highlight: string;
  deliverables: readonly string[];
  whyItWorks: readonly string[];
  channelIds: readonly string[];
  primaryChannel: string;
  contactIntent: string;
  casePreview: string;
  caseLabel: string;
};

export const EXPERTISE_CONTENT = {
  hero: {
    badge: "Capabilities",
    h1: "We buy the event Your board already tracks.",
    description:
      "Media & UA, Lenovo OEM, and Clarity — one reconciliation file for Ad Ops and finance.",
  },

  hubLabel: "Where we operate",
  hubDescription: "Pick a lane. Story and inventory open below — Clarity proves every flight.",

  tabs: [
    { id: "media", label: "Media & UA" },
    { id: "oem", label: "OEM & Lenovo" },
    { id: "clarity", label: "Clarity" },
  ] as const,

  clusters: [
    {
      id: "media",
      title: "Media & UA",
      category: "Performance",
      problem: "Spend scales, but CPA and finance stop agreeing.",
      summary:
        "Programmatic, paid social, creators, native, and CTV — capped to the revenue event finance already tracks.",
      highlight: "Outcome-tied buying",
      primaryChannel: "performance",
      channelIds: ["performance", "programmatic", "retargeting", "influencer", "social", "native", "ctv"],
      contactIntent: "brand",
      deliverables: [
        "CPI / CPA / CPL wired to FTD, registration, or subscription",
        "Pre-bid filtration on every impression",
        "MMP reconciliation before flight close",
      ],
      whyItWorks: [
        "Unit economics hold when spend doubles",
        "Finance reads one file — no dispute calls",
      ],
      casePreview: "/cases/fanatics",
      caseLabel: "Fanatics-style performance path",
    },
    {
      id: "oem",
      title: "OEM & Lenovo",
      category: "Exclusive supply",
      problem: "OEM inventory looks premium until procurement asks for trails.",
      summary:
        "Factory ROM and Google PAI via official Lenovo agency lanes — direct, not resold exchange.",
      highlight: "Official Agency Partner",
      primaryChannel: "oem",
      channelIds: ["oem"],
      contactIntent: "brand",
      deliverables: [
        "Direct Lenovo ROM and Google PAI with device-level trails",
        "Factory-floor to postback proof for compliance",
        "Pre-bid fraud screen on every OEM impression",
      ],
      whyItWorks: [
        "Inventory authenticity procurement will accept",
        "One auditable log for UA, Ad Ops, and finance",
      ],
      casePreview: "/cases/block-blast-pai",
      caseLabel: "OEM / PAI case",
    },
    {
      id: "clarity",
      title: "Clarity measurement",
      category: "Infrastructure",
      problem: "Bid-time and bill-time disagree until month-end becomes a war room.",
      summary:
        "Pre-bid guard, live caps, and a month-end file — scoring and Your MMP on one path.",
      highlight: "Every bid has a receipt",
      primaryChannel: "performance",
      channelIds: [],
      contactIntent: "brand",
      deliverables: [
        "Fraud and cohort checks before the impression clears",
        "GEO and KPI caps that follow outcomes in flight",
        "Raw logs finance and Ad Ops can pull the same day",
      ],
      whyItWorks: [
        "Month-end is a file pull — not a reconciliation call",
        "Clarity connects to Your MMP — it does not replace it",
      ],
      casePreview: "/cases/snoop",
      caseLabel: "Fintech reconciliation case",
    },
  ] as const satisfies readonly ExpertiseCluster[],

  claritySection: {
    label: "Clarity",
    title: "Bid-time and bill-time agree",
    lead: "Embedded here so Measurement is not a separate brochure — it is how every lane proves spend.",
  },

  integrations: {
    title: "Works with Your stack",
    lead: "Raw events into Your MMP. Clarity connects — it does not replace.",
  },

  close: {
    title: "Brief the lane You need",
    description: "Vertical, GEO, KPI event — we reply with a scoped path, not a capability deck.",
    ctaLabel: "Request Pilot",
  },
} as const;

export const COMPANY_CONTENT = {
  hero: {
    badge: "Company",
    h1: "UPRAISER Agency LLP",
    description:
      "London-based performance agency. We buy and reconcile mobile growth so Ad Ops and finance read the same file. Founded 2017.",
  },

  positioningLead: "Built from logs.",
  positioningAccent: "Built for trust.",

  compliance: [
    {
      title: "UK jurisdiction",
      value:
        "UPRAISER Agency LLP — 128 City Road, London EC1V 2NX. Governed by UK corporate law for transparent B2B contracting.",
    },
    {
      title: "ICO registration",
      value: "Information Commissioner's Office — ZC000436. GDPR-aligned handling of campaign and contact data.",
    },
    {
      title: "S2S measurement",
      value:
        "Server-to-server postbacks into AppsFlyer, Adjust, Singular, or Kochava. Clarity wires the pipe — Your MMP stays the system of record.",
    },
  ],

  archive: [
    {
      mark: "2017",
      title: "Founded 17 July 2017",
      body: "Ad Ops engineers tired of post-flight fights. Built to make bid-time and bill-time agree — US-registered, London-based.",
    },
    {
      mark: "P&L",
      title: "Built for the P&L",
      body: "Campaigns tie to revenue events finance already tracks — not install vanity.",
    },
    {
      mark: "Now",
      title: "Small team, direct access",
      body: "You talk to the buyer optimizing the flight. Lanes live under Expertise.",
    },
  ],

  facts: [
    { label: "Founded", value: "2017" },
    { label: "Base", value: "London" },
    { label: "ICO", value: "ZC000436" },
    { label: "Entity", value: "LLP" },
  ] as const,

  philosophy: {
    title: "Why we built UPRAISER",
    text: "The vendor stack for mobile growth was fragmented — DSPs, social, OEM, and a month-end fight with finance. We built one buying desk with receipts.",
  },

  /** London HQ + markets where traffic actually runs (from live cases — not fake offices). */
  footprint: {
    label: "Footprint",
    title: "London HQ. Traffic where the flights run.",
    lead: "One registered entity in London. Buying across the GEOs in our case file — not a franchise map of empty hubs.",
    hq: {
      code: "LND",
      name: "London",
      role: "HQ",
      detail: "UPRAISER Agency LLP · 128 City Road, EC1V 2NX · settlement & governance",
    },
    stats: [
      { value: "100+", label: "Territories in reach" },
      { value: "24/7", label: "Buying coverage" },
      { value: "1", label: "Legal entity" },
    ],
    trafficPoints: [
      { code: "US", name: "United States", detail: "Legal-state iGaming · Fanatics-type flights" },
      { code: "UK", name: "United Kingdom", detail: "Fintech & premium · Snoop / EU lanes" },
      { code: "EU", name: "Europe", detail: "DE · FR · ES · PL · Autodoc / Azar markets" },
      { code: "GCC", name: "Gulf", detail: "KW · SA · AE · Fiverr-scale app growth" },
      { code: "LATAM", name: "LatAm", detail: "MX · BR · PH corridors · Banco Azteca / Shopee" },
      { code: "WW", name: "OEM global", detail: "Lenovo PAI · Block Blast 15+ GEOs" },
    ],
  },

  faqHeading: "FAQ",
  faq: [
    {
      question: "Why does Our MMP disagree with the media bill?",
      answer:
        "Usually the supply path is not wired to device events before the bid. We fix that at auction time — so bid-time and bill-time agree before month-end.",
    },
    {
      question: "Do you replace Our MMP?",
      answer:
        "No. We connect into AppsFlyer, Adjust, Singular, or Kochava and keep raw events in Your system of record.",
    },
    {
      question: "How fast can a pilot go live?",
      answer:
        "Typical brief-to-live is about 48 hours once MMP events and GEO caps are confirmed.",
    },
    {
      question: "Where does Lenovo / OEM live?",
      answer: "Under Expertise · OEM — factory ROM and Google PAI with SDK trails.",
    },
  ],

  close: {
    title: "Meet the team on a pilot",
    description: "Vertical, GEO, KPI event — we reply with a scoped path.",
    ctaLabel: "Request Pilot",
  },
} as const;
