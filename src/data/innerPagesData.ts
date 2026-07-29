/**
 * Inner pages — viewport shells (no document scroll). Home keeps cinematic scroll.
 *
 * IA:
 *  /solutions  — flat channel rail (programmatic, OEM, performance, …)
 *  /clarity    — measurement layer (AnimatedList only)
 *  /studio     — Creative performance (Craft · Formats · Production)
 *  /cases      — horizontal deck
 *  /clients    — brand proof board (also About → Clients)
 *  /company    — About (Story · Clients · Compliance · Footprint · FAQ)
 *  /contact    — form (untouched)
 *
 * Panel recipe: promise → 3 bullets → proof widget → one CTA
 * MagicUI only: Expertise Beam · Studio Bento · Clarity List
 * Skip: SEO / SEM / ASO / retail media / resources hub / Partners mega-page
 */

export type ExpertiseClusterId =
  | "media"
  | "programmatic"
  | "social"
  | "creators"
  | "ctv"
  | "oem"
  | "clarity";

export type ExpertiseCluster = {
  id: ExpertiseClusterId;
  title: string;
  /** Context / job to be done */
  problem: string;
  /** What changes for the client */
  outcome: string;
  deliverables: readonly string[];
  /** Saatchi-style planning → measure → scale */
  process: readonly { title: string; body: string }[];
  related: readonly ExpertiseClusterId[];
  channelIds: readonly string[];
  primaryChannel: string;
  contactIntent: string;
  casePreview: string;
  caseLabel: string;
  /** Beam nodes for non-Clarity lanes */
  beam?: readonly { id: string; label: string; mark: string }[];
};

/** App Growth umbrella + channel inventory (Z2A UA pattern). */
export const EXPERTISE_GROWTH_IDS = [
  "media",
  "programmatic",
  "social",
  "creators",
  "ctv",
] as const satisfies readonly ExpertiseClusterId[];

export type ExpertiseGrowthId = (typeof EXPERTISE_GROWTH_IDS)[number];

export function isExpertiseGrowthId(id: ExpertiseClusterId): id is ExpertiseGrowthId {
  return (EXPERTISE_GROWTH_IDS as readonly string[]).includes(id);
}

export const EXPERTISE_CONTENT = {
  hero: {
    badge: "What we do",
    h1: "Buy the event finance tracks.",
  },

  hubLabel: "Lanes",
  inventoryLabel: "Inventory",

  /** Top-level desks — Clarity lives on /clarity */
  primaryTabs: [
    { id: "media", label: "App Growth" },
    { id: "oem", label: "OEM" },
  ] as const,

  /** Channel strip under App Growth */
  inventoryTabs: [
    { id: "media", label: "Overview" },
    { id: "programmatic", label: "Programmatic" },
    { id: "social", label: "Paid Social" },
    { id: "creators", label: "Creators" },
    { id: "ctv", label: "CTV" },
  ] as const,

  /** @deprecated use primaryTabs + inventoryTabs — kept for redirects */
  tabs: [
    { id: "media", label: "App Growth" },
    { id: "programmatic", label: "Programmatic" },
    { id: "social", label: "Paid Social" },
    { id: "creators", label: "Creators" },
    { id: "ctv", label: "CTV" },
    { id: "oem", label: "OEM" },
    { id: "clarity", label: "Clarity" },
  ] as const,

  clusters: [
    {
      id: "media",
      title: "App Growth",
      problem: "Installs climb. Revenue and finance do not.",
      outcome: "Spend scales while CPA and the MMP stay on one file.",
      primaryChannel: "performance",
      channelIds: ["performance", "retargeting"],
      contactIntent: "app-growth",
      deliverables: [
        "CPI / CPA / CPL on FTD, registration, or subscription",
        "Pre-bid check before every impression clears",
        "Same-day MMP export for Ad Ops and finance",
      ],
      process: [
        { title: "Plan", body: "Vertical, GEO, KPI event — one sheet for the buyer." },
        { title: "Measure", body: "Wire FTD / Reg / Sub into Your MMP before launch." },
        { title: "Scale", body: "Raise caps only while unit economics hold." },
      ],
      related: ["programmatic", "social", "clarity"],
      casePreview: "/cases/fanatics",
      caseLabel: "Fanatics growth path",
      beam: [
        { id: "ua", label: "UA", mark: "UA" },
        { id: "ftd", label: "FTD / CPA", mark: "FTD" },
        { id: "mmp", label: "Your MMP", mark: "MMP" },
        { id: "fin", label: "Finance", mark: "FIN" },
      ],
    },
    {
      id: "programmatic",
      title: "Programmatic",
      problem: "Cheap exchange until the bill and MMP disagree.",
      outcome: "Exchange buys with a trail Ad Ops can defend.",
      primaryChannel: "programmatic",
      channelIds: ["programmatic", "native"],
      contactIntent: "app-growth",
      deliverables: [
        "Supply paths with device-level logs — not opaque resale",
        "Caps on downstream events, not CPM vanity",
        "Fraud screen before auction close",
      ],
      process: [
        { title: "Plan", body: "Pick supply with device logs — skip black-box resale." },
        { title: "Measure", body: "Pre-bid screen + caps on KPI events." },
        { title: "Scale", body: "Widen inventory only where the receipt clears." },
      ],
      related: ["media", "ctv", "clarity"],
      casePreview: "/cases/autodoc",
      caseLabel: "Programmatic case",
      beam: [
        { id: "dsp", label: "DSP", mark: "DSP" },
        { id: "ssp", label: "Supply", mark: "SUP" },
        { id: "bid", label: "Pre-bid", mark: "BID" },
        { id: "log", label: "Logs", mark: "LOG" },
      ],
    },
    {
      id: "social",
      title: "Paid Social",
      problem: "Social scale is easy. Revenue reconcile is not.",
      outcome: "Meta / TikTok flights capped to MMP events — not estimated reach.",
      primaryChannel: "social",
      channelIds: ["social"],
      contactIntent: "app-growth",
      deliverables: [
        "Meta and TikTok capped to events You already track",
        "Creative and bid share one brief with Studio",
        "GEO / age rules Ad Ops can defend in review",
      ],
      process: [
        { title: "Plan", body: "Segments mapped to funnel stages." },
        { title: "Measure", body: "Conversion events in the MMP same day." },
        { title: "Scale", body: "Kill / raise creatives against deposits and subs." },
      ],
      related: ["creators", "media", "clarity"],
      casePreview: "/cases/fiverr",
      caseLabel: "Social scale case",
      beam: [
        { id: "meta", label: "Meta", mark: "MT" },
        { id: "tt", label: "TikTok", mark: "TT" },
        { id: "evt", label: "Event", mark: "EVT" },
        { id: "mmp", label: "MMP", mark: "MMP" },
      ],
    },
    {
      id: "creators",
      title: "Creators",
      problem: "Creator spend looks alive until you ask which installs paid.",
      outcome: "Tracked path: post → install → KPI event.",
      primaryChannel: "influencer",
      channelIds: ["influencer"],
      contactIntent: "app-growth",
      deliverables: [
        "UGC / creator flights with tracked links into Your MMP",
        "Briefs to the KPI event — not vanity views",
        "Disclosure and GEO rules procurement accepts",
      ],
      process: [
        { title: "Plan", body: "Brief to the KPI event." },
        { title: "Measure", body: "Tracked links live before the first post." },
        { title: "Scale", body: "Keep creators who clear GEO and disclosure." },
      ],
      related: ["social", "media", "clarity"],
      casePreview: "/cases/azar",
      caseLabel: "Creator path",
      beam: [
        { id: "ugc", label: "UGC", mark: "UGC" },
        { id: "inf", label: "Creator", mark: "CR" },
        { id: "trk", label: "Track", mark: "TRK" },
        { id: "kpi", label: "KPI", mark: "KPI" },
      ],
    },
    {
      id: "ctv",
      title: "CTV",
      problem: "Premium TV without a household trail is expensive reach.",
      outcome: "Brand-safe CTV with a trail finance can audit.",
      primaryChannel: "ctv",
      channelIds: ["ctv"],
      contactIntent: "app-growth",
      deliverables: [
        "Connected TV with pre-bid household scoring",
        "Brand-safe supply with an auditable path",
        "Caps follow outcomes — not completion rates alone",
      ],
      process: [
        { title: "Plan", body: "Brand-safe CTV with household scoring." },
        { title: "Measure", body: "Caps on outcomes, not only completes." },
        { title: "Scale", body: "Expand GEOs where the receipt holds." },
      ],
      related: ["programmatic", "media", "clarity"],
      casePreview: "/cases",
      caseLabel: "See CTV-ready cases",
      beam: [
        { id: "ctv", label: "CTV", mark: "CTV" },
        { id: "hh", label: "Household", mark: "HH" },
        { id: "safe", label: "Brand-safe", mark: "SAFE" },
        { id: "rec", label: "Receipt", mark: "RCP" },
      ],
    },
    {
      id: "oem",
      title: "OEM",
      problem: "OEM looks premium until procurement asks for the install trail.",
      outcome: "Factory ROM / PAI with an SDK trail procurement accepts.",
      primaryChannel: "oem",
      channelIds: ["oem"],
      contactIntent: "oem",
      deliverables: [
        "Lenovo factory ROM and Google PAI — official agency lanes",
        "SDK trail from device to postback",
        "Pre-bid fraud screen on every OEM impression",
      ],
      process: [
        { title: "Plan", body: "Lenovo ROM / Google PAI — official lanes only." },
        { title: "Measure", body: "SDK postbacks into Your MMP." },
        { title: "Scale", body: "Add GEOs where device logs stay clean." },
      ],
      related: ["media", "clarity"],
      casePreview: "/cases/block-blast-pai",
      caseLabel: "OEM / PAI case",
      beam: [
        { id: "rom", label: "Factory ROM", mark: "ROM" },
        { id: "pai", label: "Google PAI", mark: "PAI" },
        { id: "sdk", label: "SDK trail", mark: "SDK" },
        { id: "len", label: "Lenovo", mark: "LN" },
      ],
    },
    {
      id: "clarity",
      title: "Clarity",
      problem: "Bid-time and bill-time disagree until month-end becomes a war room.",
      outcome: "Month-end is a file pull — not a reconciliation call.",
      primaryChannel: "clarity",
      channelIds: [],
      contactIntent: "clarity",
      deliverables: [
        "Scoring before the auction closes",
        "Caps wired to MMP events in flight",
        "One export for Ad Ops and finance",
      ],
      process: [
        { title: "Plan", body: "Agree KPI event and GEO caps with Ad Ops and finance." },
        { title: "Measure", body: "Score before auction; wire S2S into Your MMP." },
        { title: "Scale", body: "Raise spend only while bid-time and bill-time agree." },
      ],
      related: ["media", "oem", "programmatic"],
      casePreview: "/cases",
      caseLabel: "Cases with receipts",
    },
  ] as const satisfies readonly ExpertiseCluster[],

  close: {
    ctaLabel: "Request Pilot",
  },

  clarityLink: {
    label: "Clarity",
    href: "/clarity",
  },
} as const;

/** Clarity — measurement layer (agency pipe, not SaaS). */
export const CLARITY_CONTENT = {
  hero: {
    badge: "Clarity",
    h1: "Bid-time meets bill-time.",
    lead: "Scoring, logs, and Your MMP on one path — Ad Ops and finance close without a war room.",
  },
  promise: "Month-end is a file pull — not a reconciliation call.",
  deliverables: [
    "Pre-bid scoring — bad supply never hits the cap",
    "GEO / KPI caps follow outcomes in flight",
    "One export Ad Ops and finance pull the same day",
  ],
  process: [
    { title: "Map", body: "MMP endpoints, log pipes, pre-bid rules — written before go-live." },
    { title: "Wire", body: "Raw logs into Your MMP. Fix the pipe if bid and bill disagree." },
    { title: "Fly", body: "Lanes live with drift checks. Invoice already matches the log." },
  ],
  mmpHeading: "Connects to Your MMP — does not replace it",
  mmpLead: "AppsFlyer, Adjust, Singular, Kochava stay Your system of record.",
  stats: [
    { value: "0%", label: "Post-flight drift" },
    { value: "<2s", label: "Log to MMP" },
    { value: "48h", label: "Brief to live" },
  ],
  related: [
    { label: "Programmatic", href: "/solutions?channel=programmatic#channels" },
    { label: "OEM", href: "/solutions?channel=oem#channels" },
    { label: "Studio", href: "/studio" },
  ],
  close: {
    ctaLabel: "Request Clarity review",
    contactIntent: "clarity",
  },
} as const;

export const COMPANY_CONTENT = {
  hero: {
    badge: "About",
    h1: "UPRAISER Agency LLP",
    description:
      "London-based performance agency. We buy and reconcile mobile growth so Ad Ops and finance read the same file.",
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
      year: 2017,
      title: "Founded in London",
      body: "Ad Ops engineers tired of post-flight fights. Built so bid-time and bill-time agree — UK entity, US-registered roots.",
    },
    {
      mark: "2019",
      year: 2019,
      title: "Outcome buying hardens",
      body: "CPI / CPA / CPL wired to FTD and subscription events finance already tracks — not install vanity charts.",
    },
    {
      mark: "2022",
      year: 2022,
      title: "OEM lane opens",
      body: "Official Lenovo agency path — factory ROM and Google PAI with device-level trails procurement can audit.",
    },
    {
      mark: "Now",
      year: 2026,
      title: "One desk, receipts attached",
      body: "App Growth through Clarity on one desk — Programmatic, Social, Creators, CTV, OEM included. You talk to the buyer on the flight.",
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
        "No. Clarity connects into AppsFlyer, Adjust, Singular, or Kochava and keeps raw events in Your system of record.",
    },
    {
      question: "How fast can a pilot go live?",
      answer:
        "Typical brief-to-live is about 48 hours once MMP events and GEO caps are confirmed.",
    },
    {
      question: "Where does Lenovo / OEM live?",
      answer: "Under Solutions · OEM — factory ROM and Google PAI with SDK trails.",
    },
    {
      question: "Do you run Paid Social and Creators too?",
      answer:
        "Yes — Social and Creators are tabs on Solutions. Both cap to the same MMP events. Studio builds the creatives into that brief.",
    },
    {
      question: "Is Clarity a replacement for Our MMP?",
      answer:
        "No. Clarity connects the pipe. AppsFlyer, Adjust, Singular, or Kochava stays Your system of record. Open /clarity for the measurement layer.",
    },
  ],

  close: {
    title: "Meet the team on a pilot",
    description: "Vertical, GEO, KPI event — we reply with a scoped path.",
    ctaLabel: "Request Pilot",
  },
} as const;

/* ——— Studio (creative services inside the performance machine) ——— */

export type StudioTabId = "craft" | "formats" | "production";

export const STUDIO_CONTENT = {
  hero: {
    badge: "Creative performance",
    h1: "Creatives that survive the auction.",
  },
  tabs: [
    { id: "craft", label: "Craft" },
    { id: "formats", label: "Formats" },
    { id: "production", label: "Production" },
  ] as const,
  craft: {
    lead: "Built for the KPI event — not moodboards.",
    items: [
      {
        title: "Performance creatives",
        description: "UGC, static, and motion cut for FTD, registration, or subscription.",
        span: "",
      },
      {
        title: "Landing & store assets",
        description: "Store screens, LPs, and end-cards that match the bid thesis.",
        span: "",
      },
      {
        title: "Channel packs",
        description: "Meta, TikTok, CTV, OEM — sized for each surface before the flight.",
        span: "",
      },
      {
        title: "Brand systems for UA",
        description: "Lightweight kits so every GEO launch stays on-voice.",
        span: "md:col-span-2",
      },
      {
        title: "Creative testing loops",
        description: "Hypothesis → flight → kill/scale, wired to Clarity receipts.",
        span: "",
      },
      {
        title: "Pitch & sales kits",
        description: "One-pagers Ad Ops and finance can read the same way.",
        span: "",
      },
    ],
  },
  formats: {
    lead: "Formats we ship into the buying lanes.",
    rows: [
      { label: "Social & UGC", detail: "Hook-first cuts, native captions, A/B batches" },
      { label: "Playables & end-cards", detail: "Store conversion after the install event" },
      { label: "CTV & premium", detail: "Brand-safe frames with performance CTAs" },
      { label: "OEM surfaces", detail: "ROM / PAI constraints respected end-to-end" },
    ],
  },
  production: {
    lead: "How studio plugs into Expertise.",
    steps: [
      { title: "Brief from the buyer", body: "GEO, event, cap — same sheet the media team flies." },
      { title: "Build in the lane", body: "Assets land where the desk already buys." },
      { title: "Prove on Clarity", body: "Variants inherit the reconciliation file." },
    ],
  },
  close: {
    ctaLabel: "Brief the studio",
    contactIntent: "studio",
  },
} as const;

/* ——— Clients (Saatchi-style proof board) ——— */

export const CLIENTS_CONTENT = {
  hero: {
    badge: "Clients",
    h1: "Brands that need receipts, not decks.",
  },
  lead: "iGaming, fintech, gaming, marketplace — verticals where install-to-revenue is measurable.",
  ctaLabel: "Request Pilot",
  verticals: ["All", "iGaming", "Gaming", "Fintech", "Marketplace", "E-commerce", "Social"] as const,
} as const;
