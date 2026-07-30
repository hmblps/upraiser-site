/**
 * Inner pages — viewport shells (no document scroll). Home keeps cinematic scroll.
 *
 * IA (expedition Basecamp):
 *  /solutions  — The Routes (format lanes + glass)
 *  /studio     — The Gear (Fixed Line · Oxygen · Map)
 *  /craft      — The Craft (Creative Lab · Proprietary Layer)
 *  /cases      — The Peaks
 *  /clients    — brand proof board
 *  /company    — The Expedition
 *  /contact    — Request Pilot
 */

export type ExpertiseClusterId =
  | "media"
  | "programmatic"
  | "social"
  | "creators"
  | "ctv"
  | "oem";

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
  /** Beam nodes for buying lanes */
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

  /** Top-level desks */
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
      related: ["programmatic", "social"],
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
      related: ["media", "ctv"],
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
      related: ["creators", "media"],
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
      related: ["social", "media"],
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
      related: ["programmatic", "media"],
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
      related: ["media"],
      casePreview: "/cases/block-blast-pai",
      caseLabel: "OEM / PAI case",
      beam: [
        { id: "rom", label: "Factory ROM", mark: "ROM" },
        { id: "pai", label: "Google PAI", mark: "PAI" },
        { id: "sdk", label: "SDK trail", mark: "SDK" },
        { id: "len", label: "Lenovo", mark: "LN" },
      ],
    },
  ] as const satisfies readonly ExpertiseCluster[],

  close: {
    ctaLabel: "Request Pilot",
  },

} as const;


export const COMPANY_CONTENT = {
  hero: {
    badge: "The Expedition",
    h1: "The Expedition Leaders.",
    description:
      "We didn't just join the AdTech industry; we mapped it. Since 2017, UPRAISER has been a convergence of different worlds.",
  },

  positioningLead: "We don't sell the view from the top.",
  positioningAccent: "We build the path that gets You there.",

  expedition: {
    synergy:
      "Our squad is a synergy of operators: Engineers who wire the pipes, Developers who build the gear, Economists who balance the P&L, and Creatives who understand human intent.",
    uniqueness:
      "We don't have account managers to hide behind. You work directly with the people who built the tools. This synergy is why we see the terrain differently — and why the numbers never disagree.",
    proofLine: "Run on PROOF.",
  },

  whyUs: {
    label: "Why Us",
    title: "Direct Pipe. Not Resale.",
    lead: "We are operators, not account managers. We don't sell the view; we build the path.",
    points: [
      {
        title: "Direct source access",
        text: "You work with the traders who optimize Your spend — contracts on the publisher path, fewer hops from bid to device event.",
      },
      {
        title: "Pre-bid verification",
        text: "Engineers who wire Your logs. Bots scored before auction close. Clean S2S into Your MMP — not after invoice.",
      },
      {
        title: "Buying pipe that holds",
        text: "Account and supply continuity so volume ramps without the mid-flight cliff.",
      },
      {
        title: "Clarity over smoke",
        text: "In an industry of smoke and mirrors, we bring CLARITY — bids follow ROAS / payback You already track.",
      },
    ],
  },

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
        "Server-to-server postbacks into AppsFlyer, Adjust, Singular, or Kochava. We wire the pipe — Your MMP stays the system of record.",
    },
  ],

  archive: [
    {
      mark: "2017",
      year: 2017,
      title: "We mapped the industry",
      body: "We didn't just join AdTech; we mapped it. Since 2017, UPRAISER has been a convergence of different worlds — UK entity, operator roots.",
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
      body: "App Growth on one desk — Programmatic, Social, Creators, CTV, OEM included. You talk to the people who built the tools.",
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
    text: "We don't sell the view from the top. We build the path that gets You there.",
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
      answer: "Under Solutions · OEM — factory ROM and Google PAI with SDK trails.",
    },
    {
      question: "Do you run Paid Social and Creators too?",
      answer:
        "Yes — Social and Creators live on The Routes. Both cap to the same MMP events. The Gear wires trails and scoring; The Craft dresses the flight with creatives and proprietary pipelines.",
    },
  ],

  close: {
    title: "Ready to be Upraised?",
    description: "Brief the route: vertical, GEO, KPI event — we reply with a scoped path.",
    ctaLabel: "Request Pilot",
  },
} as const;

/* ——— The Gear (/studio) — tech stack as expedition equipment ——— */

export type GearTabId = "fixed-line" | "oxygen" | "map";

export const GEAR_CONTENT = {
  hero: {
    badge: "The Gear",
    h1: "Precision Gear for the Death Zone.",
  },
  byMode: {
    growth: {
      lead: "Reliability at altitude requires equipment that scales with You. We don't use off-the-shelf tools; we build the hardware Your ascent depends on.",
    },
    infrastructure: {
      lead: "Reliability at altitude requires equipment that never fails. We don't use off-the-shelf tools; we build the hardware Your audit depends on.",
    },
  },
  tabs: [
    { id: "fixed-line", label: "Fixed Line" },
    { id: "oxygen", label: "Oxygen" },
    { id: "map", label: "The Map" },
  ] as const,
  pieces: {
    "fixed-line": {
      mark: "01",
      title: "The Fixed Line",
      kicker: "SDK Trails",
      growth: {
        body: "Trace every install back to the raw device log — then scale the same transparent path. Supply that matches Your attribution as volume climbs.",
        spec: "Factory → postback trails built for ramp, not one-off demos.",
      },
      infrastructure: {
        body: "Trace every install back to the raw device log. We provide a transparent supply path that matches Your attribution data to the penny.",
        spec: "Device-level SDK trails Ad Ops can export into the MMP.",
      },
    },
    oxygen: {
      mark: "02",
      title: "The Oxygen",
      kicker: "0.4ms Bid Scoring",
      growth: {
        body: "Performance requires speed at scale. Our p99 scoring filters fraud in 0.4ms — before the bid — so velocity never breathes bad air.",
        spec: "Clean inventory capacity when spend doubles.",
      },
      infrastructure: {
        body: "Performance requires speed. Our p99 scoring filters fraud in 0.4ms — before the bid is even placed. Clean air only.",
        spec: "0.4ms p99 · fraud screened pre-auction.",
      },
    },
    map: {
      mark: "03",
      title: "The Map",
      kicker: "180+ Device Signals",
      growth: {
        body: "High-resolution visibility across markets. We analyze 180+ signals to verify human intent so You scale routes — not ghosts.",
        spec: "Signal density for GEO expansion without blind spend.",
      },
      infrastructure: {
        body: "High-resolution visibility. We analyze 180+ signals to verify human intent, ensuring You never pay for ghosts.",
        spec: "180+ signals scored before clear.",
      },
    },
  },
  close: {
    ctaLabel: "Request Pilot",
    contactIntent: "brand",
    footnote: "Gear ships into The Routes — same control plane as the buy.",
  },
} as const;

/** @deprecated Use GEAR_CONTENT — Studio IA is now The Gear */
export const STUDIO_CONTENT = {
  hero: {
    badge: GEAR_CONTENT.hero.badge,
    h1: GEAR_CONTENT.hero.h1,
  },
  tabs: GEAR_CONTENT.tabs,
  close: GEAR_CONTENT.close,
} as const;

export type StudioTabId = GearTabId;

/* ——— The Craft (/craft) — full-spectrum creative + proprietary ——— */

export type CraftTabId = "creative-lab" | "proprietary";

export const CRAFT_CONTENT = {
  hero: {
    badge: "The Craft",
    h1: "The Craft: Where Logic Meets Art.",
  },
  byMode: {
    growth: {
      lead: "We write code and draw meaning. Our craft is not buying inventory — it is building the tools for it. Proprietary SDK trails protect Your budget; our creative studio turns reach into measurable revenue.",
    },
    infrastructure: {
      lead: "We write code and draw meaning. Our craft is not buying inventory — it is building the tools for it. Proprietary SDK trails defend Your invoice; our creative studio turns reach into a trail Ad Ops can audit.",
    },
  },
  tabs: [
    { id: "creative-lab", label: "Creative Lab" },
    { id: "proprietary", label: "Proprietary Layer" },
  ] as const,
  creativeLab: {
    metaphor: "Bright markers on the trail.",
    byMode: {
      growth: {
        lead: "Visual triggers for aggressive verticals — iGaming, fintech — where a miss costs attention in 0.2 seconds. Creatives that hit psychology, then scale with the buy.",
      },
      infrastructure: {
        lead: "Visual triggers for aggressive verticals — iGaming, fintech — where a miss costs attention in 0.2 seconds. Creatives that hit psychology and leave a measurable trail into Your MMP.",
      },
    },
    items: [
      {
        title: "Performance creatives",
        description: "UGC, static, and motion cut for FTD, registration, or subscription — not moodboards.",
      },
      {
        title: "Landing & store assets",
        description: "Store screens, LPs, and end-cards that match the bid thesis before the flight.",
      },
      {
        title: "Channel packs",
        description: "Meta, TikTok, CTV, OEM — sized for each surface so the marker stays visible at altitude.",
      },
    ],
  },
  proprietary: {
    metaphor: "Belay lines on the pitch.",
    byMode: {
      growth: {
        lead: "Not off-the-shelf SaaS. Homegrown data pipelines that reconcile MMP and device logs in real time — so invoice defense scales inside Your traffic.",
      },
      infrastructure: {
        lead: "Not off-the-shelf SaaS. Homegrown data pipelines that reconcile MMP and device logs in real time. We build invoice defense inside Your traffic.",
      },
    },
    points: [
      {
        title: "SDK trails",
        text: "Factory → postback paths You can export — the same Fixed Line story as The Gear, wired into creative flights.",
      },
      {
        title: "Pre-bid filtration",
        text: "Score before the bid. Clean air into the auction so creatives never spend on ghosts.",
      },
      {
        title: "MMP parity",
        text: "Device logs and media bill agree before month-end — one file Ad Ops and finance can both pull.",
      },
    ],
  },
  close: {
    ctaLabel: "Request Pilot",
    contactIntent: "studio",
    footnote: "Craft dresses The Routes — creatives and code on one ascent line.",
  },
} as const;

/** @deprecated Use CRAFT_CONTENT — The Rigging renamed to The Craft */
export const RIGGING_CONTENT = CRAFT_CONTENT;
export type RiggingTabId = CraftTabId;

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
