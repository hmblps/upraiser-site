/**
 * Inner pages viewport shells (no document scroll). Home keeps cinematic scroll.
 *
 * IA (expedition Basecamp):
 *  /solutions   The Routes (format lanes + glass)
 *  /studio      The Gear (Fixed Line · Oxygen · Map)
 *  /craft       The Craft (Creative Lab · Proprietary Layer)
 *  /cases       The Peaks
 *  /clients     brand proof board
 *  /company     The Expedition
 *  /contact     Request Pilot
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
  /** Saatchi-style planning measure scale */
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

  /** @deprecated use primaryTabs + inventoryTabs kept for redirects */
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
      problem: "Installs climb. Revenue and finance need to match the ascent.",
      outcome: "Spend scales precisely while CPA and the MMP stay on one unified file.",
      primaryChannel: "performance",
      channelIds: ["performance", "retargeting"],
      contactIntent: "app-growth",
      deliverables: [
        "CPI / CPA / CPL wired to first_deposit_complete and subscription_started",
        "Pre-bid check executed before every impression clears",
        "Same-day MMP export prepared for Ad Ops and finance",
      ],
      process: [
        { title: "Plan", body: "Vertical, GEO, and KPI events aligned on one sheet for the buyer." },
        { title: "Measure", body: "Wire first_deposit_complete and subscription_started into Your MMP before launch." },
        { title: "Scale", body: "Raise caps confidently while unit economics hold steady." },
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
      problem: "Exchange buying requires total alignment between the bill and the MMP.",
      outcome: "Exchange buys generate a definitive log trail Ad Ops can defend.",
      primaryChannel: "programmatic",
      channelIds: ["programmatic", "native"],
      contactIntent: "app-growth",
      deliverables: [
        "Supply paths illuminated with precise device-level logs",
        "Caps triggered exclusively by downstream SDK events",
        "Fraud screen finalized before auction close",
      ],
      process: [
        { title: "Plan", body: "Select premium supply paths built on transparent device logs." },
        { title: "Measure", body: "Implement pre-bid screens and strict caps on KPI events." },
        { title: "Scale", body: "Widen inventory exclusively where the receipt clears." },
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
      problem: "Social scale demands precise revenue reconciliation.",
      outcome: "Meta and TikTok flights mapped precisely to verified MMP events.",
      primaryChannel: "social",
      channelIds: ["social"],
      contactIntent: "app-growth",
      deliverables: [
        "Meta and TikTok capped to SDK events You already track",
        "Creative and bid strategies unified in one brief with Studio",
        "GEO and age rules Ad Ops can present confidently in review",
      ],
      process: [
        { title: "Plan", body: "Segments mapped clearly to specific funnel stages." },
        { title: "Measure", body: "Conversion events delivered to the MMP the same day." },
        { title: "Scale", body: "Optimize creatives strictly against first_deposit_complete and subscription_started." },
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
      problem: "Creator spend requires a clear link between social posts and verified installs.",
      outcome: "Tracked path from initial post to install to downstream KPI event.",
      primaryChannel: "influencer",
      channelIds: ["influencer"],
      contactIntent: "app-growth",
      deliverables: [
        "UGC and creator flights equipped with tracked links straight into Your MMP",
        "Briefs optimized for deep KPI events and registrations",
        "Disclosure and GEO rules fully aligned with procurement standards",
      ],
      process: [
        { title: "Plan", body: "Build the brief entirely around the deep KPI event." },
        { title: "Measure", body: "Ensure tracked links are fully live before the first post." },
        { title: "Scale", body: "Expand creator partnerships that clear GEO and disclosure metrics." },
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
      problem: "Premium TV demands a concrete household trail for exact measurement.",
      outcome: "Brand-safe CTV delivers a verified trail finance can audit easily.",
      primaryChannel: "ctv",
      channelIds: ["ctv"],
      contactIntent: "app-growth",
      deliverables: [
        "Connected TV enhanced with pre-bid household scoring",
        "Brand-safe supply mapped with an auditable data path",
        "Caps follow verified outcomes and actual device registrations",
      ],
      process: [
        { title: "Plan", body: "Execute brand-safe CTV with verified household scoring." },
        { title: "Measure", body: "Align caps directly to first_deposit_complete and registrations." },
        { title: "Scale", body: "Expand GEOs explicitly where the receipt holds." },
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
      problem: "OEM scale requires a definitive install trail for procurement verification.",
      outcome: "Factory ROM and PAI deliver an SDK trail procurement accepts instantly.",
      primaryChannel: "oem",
      channelIds: ["oem"],
      contactIntent: "oem",
      deliverables: [
        "Lenovo factory ROM and Google PAI executed via official agency lanes",
        "SDK trail tracked from device to postback",
        "Pre-bid fraud screen deployed on every single OEM impression",
      ],
      process: [
        { title: "Plan", body: "Route Lenovo ROM and Google PAI via official lanes." },
        { title: "Measure", body: "Route SDK postbacks directly into Your MMP." },
        { title: "Scale", body: "Add GEOs confidently where device logs stay perfectly clean." },
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
  aboutExpedition: {
    hero: {
      label: "The Expedition",
      title: "We mapped the mobile advertising terrain.",
      text: "Basecamp London, since 2017. Systems, software, finance, and creative operators work at one desk. You speak directly to the crew who wires Your pipes and trades Your budgets.",
    },
    /** Inverted fold: inline CREW lifts out of the column and docks as Operators. */
    crewFold: {
      label: "The Expedition",
      lead: "Basecamp London, since 2017.",
      before: "Systems, software, finance, and creative operators work at one desk. You speak directly to the ",
      word: "CREW",
      after: " who wires Your pipes and trades Your budgets.",
      operatorsLabel: "The Operators",
      operatorsLead: "No account-manager layer. You work with the operators who built the gear and trade the budgets.",
    },
    /** Visual anchor — mountain ascent with camp stops (привалы). */
    camps: [
      {
        id: "basecamp",
        altitude: "Basecamp",
        title: "Four disciplines. One crew.",
        text: "Systems, software, economists, creatives. No account-manager layer between You and the operators.",
      },
      {
        id: "fixed-line",
        altitude: "Camp I · Fixed Line",
        title: "Direct pipe. Not resale.",
        text: "Verified pathways over crowded auctions. Pre-bid scoring and SDK trails built in-house.",
      },
      {
        id: "oxygen",
        altitude: "Camp II · Oxygen",
        title: "Raw logs. Zero drift.",
        text: "Device logs on demand. UA and finance sign the same numbers before the invoice lands.",
      },
      {
        id: "summit",
        altitude: "Summit",
        title: "Receipts attached.",
        text: "Brief vertical, GEOs, and KPI events. We rig the line — You climb with clean oxygen.",
      },
    ],
    blocks: [
      {
        id: "convergence",
        label: "The Convergence",
        title: "Expertise from four disciplines working as one crew.",
        text: "We exclude account managers and client-service layers to keep Your path direct. When You partner with Upraiser, You work with the operators who built Your tracking gear and trade Your media budgets.\n\nOur systems engineers write the pre-bid scoring engines. Our software developers maintain the SDK log tracing. Our economists balance Your unit economics. Our creatives design the visual hooks. This synergy allows us to see the data terrain with clarity. Your UA and finance teams sign off on the same numbers before the invoice is issued.",
      },
      {
        id: "terrain",
        label: "Mapping the Terrain",
        title: "We helped shape the rules of this industry from its early days.",
        text: "We choose direct, verified pathways over public exchanges and crowded bidding auctions. Our early work in AdTech allowed us to build custom data verification methods from the ground up. Because we understand how fraud vectors and attribution systems operate, we designed our own pre-bid scoring engine.\n\nWe built the pipelines that connect raw log files to Your measurement endpoints. We did not wait for the industry to offer transparency. We built our own verification tools to guarantee it.",
      },
      {
        id: "code",
        label: "The Code of the Ascent",
        title: "Data transparency and voluntary compliance by design.",
        text: "Technical precision requires trust. Upraiser follows the European Digital Advertising Alliance guidelines. We exclude summarized PDF charts that hide discrepancies.\n\nWe provide raw, unedited device logs on demand so Your team can verify every install back to a physical device. Your accounting ledger matches Your media invoice to the penny.",
      },
    ],
    cta: {
      title: "Ready to be Upraised?",
      text: "Brief Your route to our operators: vertical, GEOs, and KPI events.",
      button: "Request Pilot",
    },
  },

  archive: [
    {
      mark: "2017",
      year: 2017,
      title: "We mapped the industry",
      body: "Since 2017, UPRAISER merges deep operator roots with strict UK entity governance to build a transparent buying desk.",
    },
    {
      mark: "2019",
      year: 2019,
      title: "Outcome buying hardens",
      body: "We wire CPI, CPA, and CPL models directly to first_deposit_complete and subscription_started events that finance relies on.",
    },
    {
      mark: "2022",
      year: 2022,
      title: "OEM lane opens",
      body: "We launch the official Lenovo agency path offering factory ROM and Google PAI inventory with device-level trails procurement can audit.",
    },
    {
      mark: "Now",
      year: 2026,
      title: "One desk, receipts attached",
      body: "App Growth unified on one desk integrating Programmatic, Social, Creators, CTV, and OEM. You talk straight to the team building the tools.",
    },
  ],

  facts: [
    { label: "Founded", value: "2017" },
    { label: "Base", value: "London" },
    { label: "ICO", value: "ZC000436" },
    { label: "Entity", value: "LLP" },
  ] as const,

  /** London HQ + markets where traffic actually runs */
  footprint: {
    label: "Footprint",
    title: "London HQ. Traffic where the flights run.",
    lead: "One registered entity in London buying efficiently across all verified GEOs in our case file.",
    hq: {
      code: "LND",
      name: "London",
      role: "HQ",
      detail: "UPRAISER Agency LLP 128 City Road, EC1V 2NX settlement & governance",
    },
    stats: [
      { value: "35+", label: "Active GEOs" },
      { value: "24/7", label: "Buying coverage" },
      { value: "1", label: "Legal entity" },
    ],
    trafficPoints: [
      { code: "US", name: "United States", detail: "Legal-state iGaming Fanatics-type flights" },
      { code: "UK", name: "United Kingdom", detail: "Fintech & premium Snoop / EU lanes" },
      { code: "EU", name: "Europe", detail: "DE FR ES PL Autodoc / Azar markets" },
      { code: "GCC", name: "Gulf", detail: "KW SA AE Fiverr-scale app growth" },
      { code: "LATAM", name: "LatAm", detail: "MX BR PH corridors Banco Azteca / Shopee" },
      { code: "WW", name: "OEM global", detail: "Lenovo PAI Block Blast 15+ GEOs" },
    ],
  },

  faqHeading: "FAQ",
  faq: [
    {
      question: "Why does Our MMP disagree with the media bill?",
      answer:
        "Usually the supply path lacks wiring to deep device events before the bid. We fix this architecture at auction time so bid-time and bill-time agree perfectly before month-end.",
    },
    {
      question: "Do you replace Our MMP?",
      answer:
        "We connect directly into AppsFlyer, Adjust, Singular, or Kochava and keep all raw events secure inside Your system of record.",
    },
    {
      question: "How fast can a pilot go live?",
      answer:
        "Typical brief-to-live takes about 48 hours once Your MMP events and GEO caps are verified.",
    },
    {
      question: "Where does Lenovo / OEM live?",
      answer: "Find it under Solutions OEM featuring factory ROM and Google PAI with exportable SDK trails.",
    },
    {
      question: "Do you run Paid Social and Creators too?",
      answer:
        "Yes, Social and Creators live on The Routes. Both cap directly to Your MMP events. The Gear wires the tracking trails, and The Craft equips the flight with tailored creatives and proprietary pipelines.",
    },
  ],

  close: {
    title: "Ready to be Upraised?",
    description: "Brief the route: vertical, GEO, KPI event and we reply with a fully scoped path.",
    ctaLabel: "Request Pilot",
  },
} as const;

/* The Gear (/studio) tech stack as expedition equipment */

export type GearTabId = "fixed-line" | "oxygen" | "map";

export const GEAR_CONTENT = {
  hero: {
    badge: "The Gear",
    h1: "Precision Gear for the Death Zone.",
  },
  byMode: {
    growth: {
      lead: "Reliability at altitude requires equipment that scales with You. We build the exact proprietary hardware Your ascent depends on.",
    },
    infrastructure: {
      lead: "Reliability at altitude requires equipment that never fails. We build the precise data hardware Your compliance audit relies on.",
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
        body: "Trace every install back to the raw device log and scale that exact transparent path. We deliver supply that matches Your attribution as volume climbs.",
        spec: "Factory to postback trails built specifically for exponential ramp.",
      },
      infrastructure: {
        body: "Trace every install back to the raw device log. We provide a fully transparent supply path that matches Your attribution data to the exact penny.",
        spec: "Device-level SDK trails Ad Ops can export instantly into the MMP.",
      },
    },
    oxygen: {
      mark: "02",
      title: "The Oxygen",
      kicker: "0.4ms Bid Scoring",
      growth: {
        body: "Performance requires absolute speed at scale. Our p99 scoring filters fraud in 0.4ms before the bid so velocity breathes only pure verified air.",
        spec: "Maintains clean inventory capacity even when spend doubles.",
      },
      infrastructure: {
        body: "Performance requires speed and precision. Our p99 scoring filters fraud in 0.4ms before the bid is placed to guarantee clean air.",
        spec: "0.4ms p99 fraud screened securely pre-auction.",
      },
    },
    map: {
      mark: "03",
      title: "The Map",
      kicker: "180+ Device Signals",
      growth: {
        body: "High-resolution visibility across all markets. We analyze 180+ signals to verify human intent so You scale precise routes and real users.",
        spec: "Unmatched signal density supports GEO expansion without blind spend.",
      },
      infrastructure: {
        body: "High-resolution visibility anchors our approach. We analyze 180+ signals to verify human intent and ensure You only pay for verified actions.",
        spec: "180+ signals scored definitively before clear.",
      },
    },
  },
  close: {
    ctaLabel: "Request Pilot",
    contactIntent: "brand",
    footnote: "Gear ships directly into The Routes using the same control plane as the buy.",
  },
} as const;

/** @deprecated Use GEAR_CONTENT Studio IA is now The Gear */
export const STUDIO_CONTENT = {
  hero: {
    badge: GEAR_CONTENT.hero.badge,
    h1: GEAR_CONTENT.hero.h1,
  },
  tabs: GEAR_CONTENT.tabs,
  close: GEAR_CONTENT.close,
} as const;

export type StudioTabId = GearTabId;

/* The Craft (/craft) full-spectrum creative + proprietary */

export type CraftTabId = "creative-lab" | "proprietary";

export const CRAFT_CONTENT = {
  hero: {
    badge: "Creative & Tech",
    h1: "Creative & Tech: Where CGC Meets Engineering.",
  },
  byMode: {
    growth: {
      lead: "We write code and construct visual meaning. Our craft builds the precise tools for inventory buying. Proprietary SDK trails protect Your budget while our creative studio turns reach into measurable revenue.",
    },
    infrastructure: {
      lead: "We write code and construct visual meaning. Our craft builds the precise tools for inventory verification. Proprietary SDK trails defend Your invoice while our creative studio ensures reach generates a trail Ad Ops can audit.",
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
        lead: "Visual triggers designed for aggressive iGaming and fintech verticals where attention must be secured in 0.2 seconds. We build creatives that hit psychology and scale efficiently with the buy.",
      },
      infrastructure: {
        lead: "Visual triggers engineered for aggressive iGaming and fintech verticals where attention must be secured in 0.2 seconds. We build creatives that leave a verified, measurable trail directly into Your MMP.",
      },
    },
    items: [
      {
        title: "Performance creatives",
        description: "UGC, static, and motion assets cut explicitly for first_deposit_complete and subscription_started conversions.",
      },
      {
        title: "Landing & store assets",
        description: "Store screens, LPs, and end-cards match the exact bid thesis before the flight launches.",
      },
      {
        title: "Channel packs",
        description: "Meta, TikTok, CTV, and OEM assets sized for each surface so the marker stays visible at high altitude.",
      },
    ],
  },
  proprietary: {
    metaphor: "Belay lines on the pitch.",
    byMode: {
      growth: {
        lead: "We build homegrown data pipelines that reconcile MMP and device logs in real time. We deploy invoice defense that scales naturally inside Your traffic.",
      },
      infrastructure: {
        lead: "We build homegrown data pipelines that reconcile MMP and device logs in real time. We embed invoice defense deep inside Your traffic architecture.",
      },
    },
    points: [
      {
        title: "SDK trails",
        text: "Factory to postback paths You can export easily. We wire the same Fixed Line story from The Gear directly into creative flights.",
      },
      {
        title: "Pre-bid filtration",
        text: "We score definitively before the bid. Clean air flows into the auction so creatives engage exclusively with real users.",
      },
      {
        title: "MMP parity",
        text: "Device logs and the media bill match before month-end — one file Ad Ops and finance both pull.",
      },
    ],
  },
  close: {
    ctaLabel: "Request Pilot",
    contactIntent: "studio",
    footnote: "Craft dresses The Routes directly, putting creatives and code on one ascent line.",
  },
} as const;

/** @deprecated Use CRAFT_CONTENT The Rigging renamed to The Craft */
export const RIGGING_CONTENT = CRAFT_CONTENT;
export type RiggingTabId = CraftTabId;

/* Clients (Saatchi-style proof board) */

export const CLIENTS_CONTENT = {
  hero: {
    badge: "Clients",
    h1: "Brands that need receipts.",
  },
  lead: "iGaming, fintech, gaming, and marketplace verticals where install-to-revenue tracking is an absolute requirement.",
  ctaLabel: "Request Pilot",
  verticals: ["All", "iGaming", "Gaming", "Fintech", "Marketplace", "E-commerce", "Social"] as const,
} as const;

export interface AscentProtocolItem {
  protocolNumber: string; // "PROT-01", "PROT-02" etc.
  question: string;
  answer: string;
  ogilvyProof: string; // Compact fact label
}

export const ASCENT_PROTOCOLS: AscentProtocolItem[] = [
  {
    protocolNumber: "PROT-01",
    question: "Is UPRAISER built to support in-house media teams?",
    answer:
      "Yes. We empower Your in-house team. We wire the SDK trails and clear the data pipelines so Your operators can execute campaigns on clean, audit-ready logs. Think of us as Your rigging crew on the mountain. We secure the lines and ensure the oxygen supply while Your traders execute the climb.",
    ogilvyProof: "Operator Control Direct SDK Integration",
  },
  {
    protocolNumber: "PROT-02",
    question: "How does UPRAISER ensure zero-drift data transparency?",
    answer:
      "We map Your stack and align log pipelines before going live. Every campaign matches Your MMP data to the exact penny. By verifying attribution at bid-time, we guarantee 0% post-flight log drift. Your finance directors and UA traders always review the identical invoice.",
    ogilvyProof: "0% Post-Flight Log Drift Match to the Penny",
  },
  {
    protocolNumber: "PROT-03",
    question: "How do You block mobile fraud before the bid happens?",
    answer:
      "We deploy The Gear. Our pre-bid engine scores every incoming opportunity in 0.4ms by analyzing over 180 raw device signals. We filter out the noise at the source, ensuring You exclusively buy verified human intent.",
    ogilvyProof: "0.4ms p99 Latency 180+ Device Signals",
  },
  {
    protocolNumber: "PROT-04",
    question: "What is CGC and how does it fit into Your routes?",
    answer:
      "Creator-Generated Content (CGC) is the visual oxygen for Your funnel. We source high-performing creator media and amplify it across programmatic, social, and OEM routes. We trace every creative asset down to the raw install log, optimizing entirely for user LTV and subscription_started events.",
    ogilvyProof: "Visual Oxygen LTV Event Tracing",
  },
  {
    protocolNumber: "PROT-05",
    question: "Are You a SaaS tool or a full-spectrum performance desk?",
    answer:
      "We operate as a full-spectrum boutique agency. We write the code, wire the pipelines, and buy the media. You work directly with the dedicated operators who build Your gear and trade Your budgets.",
    ogilvyProof: "Boutique Agency Direct Execution",
  },
];
