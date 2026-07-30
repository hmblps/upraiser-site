export type SiteMode = "growth" | "infrastructure";

export type NavLink = {
  label: string;
  href: string;
  contactIntent?: string;
};

export const contactVerticalOptions = [
  { value: "app-growth", label: "App Growth / media" },
  { value: "oem", label: "OEM / Lenovo" },
  { value: "studio", label: "The Craft / creatives" },
  { value: "brand", label: "Brand partnership" },
  { value: "advertising-partner", label: "Advertising Partner" },
  { value: "app-web-owner", label: "App / Web Owner" },
  { value: "direct-publisher", label: "Direct publisher" },
  { value: "careers", label: "Looking for a career at UPRAISER" },
  { value: "other", label: "Other" },
] as const;

export const navLinks: NavLink[] = [
  { label: "The Routes", href: "/solutions" },
  { label: "The Gear", href: "/studio" },
  { label: "The Craft", href: "/craft" },
  { label: "The Peaks", href: "/cases" },
  { label: "The Expedition", href: "/company" },
];

export const primaryCta = {
  label: "Request Pilot",
  href: "/contact",
};

export const heroFounded = "Founded 17 July 2017 · Based in London";

/** Shared poetic H1 stays in Hero.tsx — lede annotates by mode (ascent brand). */
export const heroLedeByMode = {
  growth: "Most agencies talk about the view. We focus on the velocity.",
  infrastructure: "Scaling is the climb. Verification is the oxygen.",
} as const satisfies Record<SiteMode, string>;

/** @deprecated use heroLedeByMode — kept for any stray imports */
export const heroLede = heroLedeByMode.growth;

export const heroHighlightsByMode = {
  growth: [
    { value: "100+", label: "Markets" },
    { value: "100K+", label: "Apps in Network" },
    { value: "48h", label: "Avg. Launch Time" },
    { value: "$250K+", label: "Revenue Attributed" },
  ],
  infrastructure: [
    { value: "97.3%", label: "Fraud Blocked Pre-Bid" },
    { value: "0%", label: "Post-Flight Log Drift" },
    { value: "0.4ms", label: "p99 Bid Scoring" },
    { value: "180+", label: "Device Signals" },
  ],
} satisfies Record<SiteMode, readonly { value: string; label: string }[]>;

export const audienceByMode = {
  growth: {
    label: "The Route to the Peak",
    title: "The cleanest route to the top.",
    line1: "We don't just buy media; we engineer Your ascent.",
    line2Prefix: "Built to",
    inlineWord: "SCALE",
    scrollHeroWord: "SCALE",
    cta: primaryCta.label,
    description:
      "UPRAISER provides a direct supply path across OEM, Programmatic, and Social channels. No middlemen to slow You down, no black boxes to hide the risk. Just pure, measurable momentum for Your unit economics.",
  },
  infrastructure: {
    label: "The Fixed Lines",
    title: "A supply path You can defend in a review.",
    line1: "At high altitude, even a 5% drift in data is fatal.",
    line2Prefix: "Run on",
    inlineWord: "PROOF",
    scrollHeroWord: "PROOF",
    cta: primaryCta.label,
    description:
      "When Your MMP and media bill diverge, You don't need a new dashboard — You need a better pipe. We verify the route before You start the climb, ensuring every bid has a receipt and every install is human.",
  },
} satisfies Record<SiteMode, {
  label: string;
  title: string;
  line1: string;
  line2Prefix: string;
  inlineWord: string;
  scrollHeroWord: string;
  cta: string;
  description: string;
}>;

export const valueByMode = {
  growth: {
    hero: {
      kicker: "Event-weighted buying",
      title: "Buy the event Your board tracks",
      description:
        "Caps wire to revenue events before the first impression clears — not CPI charts that break after the flight.",
    },
    metrics: [
      { value: "97.3%", label: "Fraud killed before auction close", progress: 0.973 },
      { value: "48h", label: "Brief to live bids", progress: 0.72 },
    ],
    features: [
      {
        title: "Spend that scales under scrutiny",
        description:
          "Every bid scored before it clears. Bad traffic never hits Your cap — not because we say so, because the log proves it.",
      },
      {
        title: "CPA that holds at scale",
        description:
          "Unit economics stay flat when budget doubles. Cohort LTV drives the bid, not yesterday's CPI.",
      },
    ],
    brand: {
      badge: "Official partner",
      title: "Lenovo OEM",
      description: "Factory lanes — full inventory story on Solutions.",
    },
  },
  infrastructure: {
    hero: {
      kicker: "Log-native buying",
      title: "Every bid has a receipt",
      description:
        "Server logs reconcile to Adjust and AppsFlyer in real time. Month-end without the attribution war room — because the numbers already agree.",
    },
    metrics: [
      { value: "0%", label: "Post-flight log drift", progress: 0.02 },
      { value: "0.4ms", label: "p99 bid scoring", progress: 0.88 },
    ],
    features: [
      {
        title: "Traffic that passes audit",
        description:
          "Invalid requests drop before auction close. Ad Ops can defend every dollar in a finance review without last-minute reconciliation.",
      },
      {
        title: "Numbers that match",
        description:
          "MMP and media bill tell the same story — raw logs, not estimates. No more reconciling at 2 a.m. before the board deck.",
      },
    ],
    brand: {
      badge: "Official partner",
      title: "Lenovo OEM",
      description: "SDK-audited ROM — inventory depth on Solutions.",
    },
  },
} satisfies Record<SiteMode, unknown>;

export const promiseByMode = {
  growth: {
    label: "Proven Summits",
    title: "We know these peaks well.",
    scrollHeroWord: "RESULTS",
    line1: "+305% ROAS for subscription leaders — and factory lanes that hold at altitude.",
    line2Prefix: "We answer in",
    inlineWord: "RESULTS",
    titleLead: "We answer in ",
    accentWord: "RESULTS",
    description:
      "Block Blast: scaling to 32K+ daily installs via factory lanes. If it is not on the P&L, we don't call it a win — caps follow events Your CFO already trusts.",
  },
  infrastructure: {
    label: "The Oxygen Level",
    title: "Run on PROOF.",
    scrollHeroWord: "CLARITY",
    line1: "0% post-flight log drift. 0.4ms bid scoring. 180+ device signals.",
    line2Prefix: "We bring",
    inlineWord: "CLARITY",
    titleLead: "We bring ",
    accentWord: "CLARITY",
    description:
      "Fraud filtered before the bid. Verification at the source. Month-end stays uneventful because the numbers never disagree — the ultimate signal of clarity.",
  },
} satisfies Record<
  SiteMode,
  {
    label: string;
    title: string;
    scrollHeroWord: string;
    line1: string;
    line2Prefix: string;
    inlineWord: string;
    titleLead: string;
    accentWord: string;
    description: string;
  }
>;

export const trafficChannelsByMode = {
  growth: [
    {
      id: "oem",
      title: "OEM",
      tagline: "On device before day one",
      teaser:
        "Lenovo ROM and Google PAI — factory-side presence before the open-exchange auction even opens.",
      description:
        "OEM traffic reaches users where trust already lives — on the device itself. Through our official Lenovo agency partnership we place Your app via factory ROM and Google PAI: system recommendations and pre-installs, not another open-exchange interstitial dressed up as OEM. In an ad-saturated feed, that authenticity compounds into higher CR and LTV than auction leftovers. Competitors still bid the exchange; You ship from the factory floor — with SDK trails from install to postback Your finance team can pull anytime.",
      bestFor: "Launches, emerging markets, ROM-first scale",
      points: [
        "Direct Lenovo ROM and Google PAI lanes — not resold exchange supply",
        "SDK trail from factory floor to MMP postback",
        "Pre-bid filtration on every OEM impression before the cap clears",
        "Operator-grade authenticity vs open-exchange bleed",
        "Retention and unit economics built for day-zero presence",
      ],
    },
    {
      id: "programmatic",
      title: "In-App Programmatic",
      tagline: "Scale inside 100K+ apps",
      teaser: "SDK inventory across 100K+ apps — bids fire on intent signals, not leftover impressions.",
      description:
        "In-app programmatic is how You reach users already inside high-engagement environments — games, utilities, content apps — without guessing on open exchange leftovers. We buy SDK inventory with behavioral signals: session depth, engagement peaks, reward completion. Every impression still clears pre-bid filtration before it hits Your cap. Formats span rewarded video, interstitials, native, and rich media — chosen by unit economics for the vertical, not by what a network wants to push this quarter.",
      bestFor: "Volume scaling, rewarded video, high-intent units",
      points: [
        "100K+ app graph with behavioral bid signals",
        "Pre-bid fraud screen on every in-app impression",
        "Rewarded, interstitial, native, and rich media in one accountable mix",
        "Caps wired to downstream events — not CPM vanity",
        "Supply path clear enough for Ad Ops to defend in review",
      ],
    },
    {
      id: "performance",
      title: "App Growth",
      tagline: "Pay for what converts",
      teaser: "CPI, CPA, CPL tied to deposits and subs — not install charts that break after the flight.",
      description:
        "App Growth is end-to-end mobile acquisition across display, video, and in-app — priced on outcomes finance already tracks. We run CPI, CPA, and CPL models where the bid follows revenue signals: first deposit, funded account, paid subscription. Real-time fraud filtering sits on every buy. iGaming, fintech, gaming, and subscription apps are the core — verticals where a cheap install that never converts is worse than no install at all.",
      bestFor: "iGaming, fintech, games, subscription apps",
      points: [
        "Event-priced buying: FTD, registration, subscription — not vanity CPI",
        "Fraud filtration before the impression clears the cap",
        "Display, video, and in-app under one optimization loop",
        "Unit economics held flat when budget scales",
        "MMP reconciliation before the flight closes",
      ],
    },
    {
      id: "social",
      title: "Social & Search",
      tagline: "Catch intent in motion",
      teaser: "Meta, TikTok, and Google — funnel segments with same-day MMP events, no black-box lag.",
      description:
        "Social and search catch intent while it is still in motion — someone searching, scrolling, comparing. We build Meta, TikTok, and Google campaigns with segments mapped to Your funnel stages, then wire conversion events into the MMP the same day. No black-box lag. No last-month reconciliation theater. Creatives and bids iterate against deposits and subscriptions, not estimated reach.",
      bestFor: "Intent capture, paid social, search CPA",
      points: [
        "Meta, TikTok, and Google under one event schema",
        "Same-day MMP conversion wiring — no estimated reach theater",
        "Funnel-stage segments, not broad spray",
        "Creative and bid loops tied to revenue KPIs",
        "Spend You can defend in a weekly performance review",
      ],
    },
    {
      id: "rewarded",
      title: "Rewarded Traffic",
      tagline: "Opt-in completion, not accidental taps",
      teaser: "Rewarded video and offerwalls — bids on engaged completions inside games and utilities.",
      description:
        "Rewarded traffic is inventory users opt into — watch, play, or complete an action for in-app value. We buy rewarded video and offerwall units where completion signals predict downstream LTV. Every impression still clears pre-bid filtration. Caps tie to installs and deep events in the MMP, not raw volume.",
      bestFor: "Games, utilities, high-engagement CPI",
      points: [
        "Rewarded video and offerwalls in high-engagement apps",
        "Completion-based optimization — not click-chasing",
        "Pre-bid fraud screen on every rewarded impression",
        "Caps wired to MMP install and deep events",
        "Supply path visible for Ad Ops review",
        "Engagement quality scored before bids clear",
      ],
    },
    {
      id: "native",
      title: "Native & Editorial",
      tagline: "Trust-driven conversions",
      teaser: "Finance and tech publishers — editorial context that converts deposits, not clickbait inventory.",
      description:
        "Native and editorial placements sit inside high-authority finance and tech publishers — context that already earns trust before the click. We run brand-safe inventory with pre-flight compliance checks so regulated verticals (fintech, iGaming, premium subscriptions) can scale without legal fire drills. The goal is deposits and subscriptions from readers who were already evaluating a category, not drive-by clickbait.",
      bestFor: "Fintech, iGaming, premium subscriptions",
      points: [
        "Curated finance and tech publisher whitelist",
        "Pre-flight brand and compliance checks",
        "Editorial context that supports conversion, not clickbait",
        "Placements legal and brand teams can accept",
        "Event tracking aligned to deposit and subscription KPIs",
      ],
    },
    {
      id: "ctv",
      title: "CTV & Connected TV",
      tagline: "Reach that activates",
      teaser: "Roku and streaming — household reach scored pre-bid, activation matched post-flight.",
      description:
        "CTV is household reach with a performance mandate. We run Roku and streaming campaigns built for installs and deep events — account link, first deposit, paid subscription — not brand lift slides. Household and device signals are scored pre-bid; activation is matched post-flight to the delivery log so You are not left with view-through black holes when finance asks what the spend bought.",
      bestFor: "Brand + performance, UK/US fintech, awareness",
      points: [
        "Roku and premium streaming inventory",
        "Pre-bid household and device scoring",
        "Activation events matched to delivery logs",
        "Built for deep events — not view-through vanity",
        "Clean measurement paths for UK/US performance teams",
      ],
    },
    {
      id: "retargeting",
      title: "Retargeting",
      tagline: "MMP feed, not pixels",
      teaser: "Audience pools from MMP events — reactivation bids on real behavior, device-level proof.",
      description:
        "Retargeting should bring back users who already showed intent — trial starts, cart views, deposit abandoners — not everyone who glanced at an ad. We build cross-channel reactivation from MMP event pools, not brittle pixels. Bids weight LTV and likelihood to convert. Every win-back flight traces to a device-level event Your team can pull when the month closes.",
      bestFor: "Trial users, cart abandoners, reactivation",
      points: [
        "MMP event pools — not fragile pixel segments",
        "LTV-weighted bids on real intent cohorts",
        "Cross-channel reactivation under one reconciliation file",
        "Device-level proof for every win-back dollar",
        "Lifecycle UA that finance can read without a translator",
      ],
    },
    {
      id: "influencer",
      title: "Influencer & Creator",
      tagline: "Trusted voices, tracked outcomes",
      teaser: "Creator placements with MMP links — social reach that closes into deposits, not brand-lift slides.",
      description:
        "Creator marketing only works when the voice is trusted and the outcome is tracked. We place influencers and UGC creators with MMP-tracked links and event KPIs — installs, deposits, subscriptions — not 'brand lift' metrics that cannot tie to a revenue event. Social reach shows up in the same reconciliation file as paid media, so creator spend lives next to performance spend without a separate story for the board.",
      bestFor: "Consumer apps, fintech onboarding, brand lift",
      points: [
        "MMP-tracked creator and UGC placements",
        "Event KPIs: deposits and subs — not vanity views",
        "Creator spend reconciled with paid media",
        "Voices matched to vertical trust, not follower counts alone",
        "Clear path from impression to revenue event",
      ],
    },
  ],
  infrastructure: [
    {
      id: "oem",
      title: "OEM",
      tagline: "Auditable factory supply",
      teaser: "Lenovo ROM and PAI with SDK trails — one log for compliance, UA, and finance.",
      description:
        "Lenovo ROM and Google PAI with SDK trails from factory floor to postback — the inventory path Ad Ops can defend in a finance review. This is not open-exchange supply marketed as OEM. Compliance and buying share one log: who installed, which device, which lane, which revenue event. Pre-bid filtration still runs on every impression; bad cohorts never clear the cap just because the placement sat on-device.",
      bestFor: "Regulated launches, OEM scale, SDK audit",
      points: [
        "Factory-side ROM and PAI with device-level SDK trails",
        "One shared log for compliance, UA, and finance",
        "Pre-bid fraud screen on OEM lanes — not a free pass",
        "No open-exchange ambiguity labeled as pre-install",
        "Exportable proof for regulated and enterprise reviews",
      ],
    },
    {
      id: "programmatic",
      title: "In-App Programmatic",
      tagline: "100K+ apps, full path visibility",
      teaser: "SDK inventory with 180+ pre-bid signals — every impression defendable in a finance review.",
      description:
        "In-app programmatic at infrastructure grade means the supply path is visible enough for Ad Ops to defend every dollar. We buy across 100K+ apps with 180+ signals scored pre-bid — bots, emulators, and hijacked installs drop before auction close. Rewarded video and high-telemetry units stay on the whitelist Your compliance team already accepted. Month-end is a file pull, not a war room.",
      bestFor: "Volume, rewarded video, rich telemetry",
      points: [
        "180+ signals scored before the bid clears",
        "Full path visibility from impression to postback",
        "Whitelist-ready supply for regulated buyers",
        "Raw logs exportable to Your MMP anytime",
        "Volume without open-ended fraud exposure",
      ],
    },
    {
      id: "performance",
      title: "App Growth",
      tagline: "Event-verified mobile buying",
      teaser: "FTD/CPA models with pre-auction filtration — every paid action reconciles to a device log.",
      description:
        "App Growth for Ad Ops means FTD and CPA models where every paid action reconciles to a device log before the flight closes. In-app, display, and video supply is filtered pre-auction. Caps and bids wire to MMP events — not CPI vanity. When finance asks why the bill matches the MMP, the answer is already in the raw export.",
      bestFor: "FTD/CPA models, games, finance-grade reporting",
      points: [
        "Pre-auction filtration on every performance buy",
        "Caps and bids wired to MMP events",
        "Device-log reconciliation before flight close",
        "FTD/CPA models — not install vanity",
        "One story for UA, Ad Ops, and finance",
      ],
    },
    {
      id: "social",
      title: "Social & Search",
      tagline: "Logged intent paths",
      teaser: "Meta, TikTok, Google with same-day MMP events — spend justified by logs, not estimated reach.",
      description:
        "Social and search paths are logged the same day they convert. Meta, TikTok, and Google fire into Your MMP without black-box lag. Spend is justified by events — deposits, registrations, subscriptions — not estimated reach. When a platform report disagrees with the MMP, You have the event trail to close the gap before the invoice cycle.",
      bestFor: "Search CPA, paid social, intent cohorts",
      points: [
        "Same-day MMP conversion wiring",
        "Event-justified spend — not estimated reach",
        "Intent cohorts with a clear log path",
        "Platform vs MMP gaps closed before invoice",
        "Search and social under one reconciliation schema",
      ],
    },
    {
      id: "rewarded",
      title: "Rewarded Traffic",
      tagline: "Completion telemetry",
      teaser: "Rewarded video and offerwalls — completion scored pre-bid, caps tied to MMP events.",
      description:
        "Rewarded inventory with completion telemetry scored pre-bid. High-engagement units stay on whitelists compliance already accepted. Every completion traces to a device log before month-end.",
      bestFor: "Games, rewarded CPI, offerwall scale",
      points: [
        "Completion signals scored pre-bid",
        "Rewarded video and offerwall supply",
        "Device-level completion trails",
        "Caps tied to MMP events",
        "Whitelist-ready for regulated buyers",
        "Finance-readable completion metrics",
      ],
    },
    {
      id: "native",
      title: "Native & Editorial",
      tagline: "Whitelist-only publishers",
      teaser: "Curated finance and news inventory — every placement on the list legal already accepted.",
      description:
        "Native inventory for regulated buyers means whitelist-only publishers with brand and compliance filters applied before spend clears. Every placement sits on a list Your legal team would accept. Editorial context stays brand-safe; event tracking stays aligned to the same revenue KPIs as the rest of the mix.",
      bestFor: "Premium media, regulated verticals",
      points: [
        "Whitelist-only finance and news publishers",
        "Compliance filters before spend clears",
        "Brand-safe editorial context",
        "Event KPIs aligned to the rest of the mix",
        "Audit-ready placement records",
      ],
    },
    {
      id: "ctv",
      title: "CTV & Connected TV",
      tagline: "Verified CTV paths",
      teaser: "Streaming with pre-bid device signals — activation matched to delivery logs, no view-through holes.",
      description:
        "CTV paths are verified end to end. Streaming inventory carries device and household signals scored pre-bid. Activation events match post-flight to the Roku delivery log — no view-through black holes when Ad Ops and finance compare notes. Household reach still has to earn a line on the P&L.",
      bestFor: "CTV + app, UK/US, clean measurement",
      points: [
        "Pre-bid device and household scoring",
        "Activation matched to delivery logs",
        "No view-through measurement holes",
        "CTV + app paths for UK/US teams",
        "Clean exports for month-end review",
      ],
    },
    {
      id: "retargeting",
      title: "Retargeting",
      tagline: "MMP feed, not pixels",
      teaser: "Audience pools from MMP events — reactivation bids on real behavior, device-level proof.",
      description:
        "Retargeting pools come from MMP events — not approximated pixel segments that rot overnight. Reactivation bids fire on real behavior. Every win-back campaign traces to a device-level event. Lifecycle UA stays readable for finance without a separate attribution story.",
      bestFor: "Win-back, LTV cohorts, lifecycle UA",
      points: [
        "MMP event pools instead of brittle pixels",
        "Behavior-based reactivation bids",
        "Device-level proof for every win-back",
        "LTV cohorts with exportable trails",
        "Lifecycle spend that closes clean at month-end",
      ],
    },
    {
      id: "dsp",
      title: "DSP & Exchange",
      tagline: "Guarded open exchange",
      teaser: "Direct DSP seats with pre-bid filtration — open exchange without open-ended risk.",
      description:
        "Open exchange only works when every bid passes the same fraud screen as private deals. We run direct DSP seats with pre-bid filtration and raw log export. Scale without open-ended risk: PMP and open auction share one control plane, and Ad Ops can pull the same receipt format either way.",
      bestFor: "Scale with controls, private deals, PMP",
      points: [
        "Direct DSP seats — not opaque reseller chains",
        "Pre-bid filtration on open and private deals",
        "Raw log export for every flight",
        "PMP and open auction under one control plane",
        "Scale without open-ended fraud exposure",
      ],
    },
  ],
} satisfies Record<SiteMode, unknown>;

export const processByMode = {
  growth: [
    {
      step: "01",
      title: "Chart the Route",
      description:
        "We map where revenue actually happens — deposits, subscriptions, registrations — and set caps around those events. No install-only optimization. No CPM vanity.",
    },
    {
      step: "02",
      title: "Pick the Fixed Lines",
      description:
        "OEM, programmatic, social — chosen by unit economics for Your vertical, not platform politics. We pick the channels that move the P&L, not the ones with the best sales decks.",
    },
    {
      step: "03",
      title: "Push for the Summit",
      description:
        "48 hours to first bid. Real-time optimization. CPAs held inside the target You set — verified in the MMP, not estimated.",
    },
  ],
  infrastructure: [
    {
      step: "01",
      title: "Map the Terrain",
      description:
        "We document Your stack, log pipelines, and fraud vectors before a single impression is bought.",
    },
    {
      step: "02",
      title: "Wire the Fixed Lines",
      description:
        "Raw device logs connect directly to Your attribution. If numbers don't match at bid-time, we fix the pipe, not the report.",
    },
    {
      step: "03",
      title: "Verify the Ascent",
      description:
        "Continuous drift monitoring ensures month-end is uneventful. The numbers never disagree.",
    },
  ],
} satisfies Record<SiteMode, unknown>;

export const bridgeByMode = {
  growth: {
    eyebrow: "Alternate view",
    lead: "See the infrastructure story",
    preview: "Fixed lines, oxygen-level proof, and audit-ready OEM — how Ad Ops closes the month without a war room.",
    cta: "Switch to Infrastructure",
  },
  infrastructure: {
    eyebrow: "Alternate view",
    lead: "See the growth story",
    preview: "Velocity over the view — OEM scale, event-weighted buying, and proven summits without breaking unit economics.",
    cta: "Switch to Growth",
  },
} satisfies Record<
  SiteMode,
  { eyebrow: string; lead: string; preview: string; cta: string }
>;

export const footerLinks = {
  explore: [
    { label: "The Routes", href: "/solutions" },
    { label: "The Gear", href: "/studio" },
    { label: "The Craft", href: "/craft" },
    { label: "The Peaks", href: "/cases" },
    { label: "Request Pilot", href: "/contact" },
  ],
  company: [
    { label: "The Expedition", href: "/company" },
    { label: "Clients", href: "/clients" },
    { label: "Careers inquiry", href: "/contact", contactIntent: "careers" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavLink[],
  social: [{ label: "LinkedIn", href: "https://www.linkedin.com/company/upraiser/" }],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export const lenovoPartnership = {
  badge: "Official Agency Partner",
  logo: "/partners/lenovo-logo.png",
  logoAlt: "Lenovo",
  title: "Lenovo PC HK LTD",
  stripLine: "Factory ROM and Google PAI — direct lanes, not resold exchange supply.",
  descriptionIntro:
    "Official Lenovo agency partner for brands and networks who need procurement-grade OEM access alongside performance buying.",
  descriptionLead:
    "Direct ROM and PAI lanes with SDK trails — inventory and buying models live under Solutions · OEM.",
};

export const aboutPage = {
  label: "About",
  title: "Built to end the attribution call",
  chapter: {
    scrollHeroWord: "LOGS",
    line1: "We started by explaining attribution drift to finance.",
    line2Prefix: "Then we built the agency that",
    inlineWord: "ends that call",
    description:
      "London-based. Buying and reconciling mobile growth so Ad Ops and finance read the same file.",
  },
  positioningLead: "Built from logs.",
  positioningAccent: "Built for trust.",
  description:
    "London-based performance agency. We buy and reconcile mobile growth so Ad Ops and finance read the same file.",
  storySegments: [
    {
      mark: "2017",
      title: "Founded 17 July 2017",
      body: "Ad Ops engineers tired of post-flight fights. UPRAISER exists to make bid-time and bill-time agree — US-registered, London-based.",
    },
    {
      mark: "P&L",
      title: "Built for the P&L",
      body: "Campaigns tie to revenue events finance already tracks — not install vanity, not attribution theatre.",
    },
    {
      mark: "Now",
      title: "Small team, direct access",
      body: "You talk to the buyer optimizing the flight. Buying paths sit under Solutions. Proof sits in the reconciliation file Ad Ops and finance already share.",
    },
  ],
  facts: [
    { label: "Founded", value: "2017" },
    { label: "Base", value: "London" },
    { label: "ICO", value: "ZC000436" },
    { label: "Entity", value: "LLP" },
  ] as const,
  teamLabel: "Legal entity",
  teamLead: "UPRAISER Agency LLP — 128 City Road, London EC1V 2NX, United Kingdom.",
  testimonialsHeading: "What teams tell us",
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
        "Typical brief-to-live is about 48 hours once MMP events and GEO caps are confirmed. A scoped review can start sooner.",
    },
    {
      question: "Where does Lenovo / OEM live?",
      answer:
        "Under Solutions · OEM — factory ROM and Google PAI with SDK trails. Device logs show how those trails reconcile into Your MMP.",
    },
    {
      question: "What does the log actually prove?",
      answer:
        "Device-level install signals, pre-bid fraud checks, and delivery reconciliation — enough for finance and compliance without a supplementary deck.",
    },
  ],
  ctaLabel: "Request Pilot",
  closeTitle: "Meet the team on a pilot",
  closeDescription: "Vertical, GEO, KPI event — we reply with a scoped path, not a capability deck.",
} as const;

export const casesPage = {
  label: "The Peaks",
  title: "We know these peaks well.",
  description:
    "Auditable campaigns for clients who need revenue events — not brand-lift slides. Block Blast: 32K+ daily installs via factory lanes.",
  intro:
    "Open any case: hero numbers first, then Brand / Market / KPI / Channels, then Challenge → Approach → Result.",
  structureLabel: "How to read a case",
  structureSteps: [
    {
      title: "Results",
      description: "Three hero numbers before the story — the only figures finance will ask for twice.",
    },
    {
      title: "Metadata",
      description: "Brand, vertical, GEO, KPI event, payment model, and channels — structured for procurement.",
    },
    {
      title: "Story",
      description: "Challenge, approach, result — short blocks tied to a device-level event You can verify.",
    },
  ],
  filterLabel: "Filter by vertical",
  verticals: ["All", "iGaming", "Gaming", "Fintech", "E-commerce", "Marketplace", "Social"],
  ctaLabel: "Request similar case study",
} as const;

export const solutionsPage = {
  label: "Solutions",
  title: "We can help you with",
  chapter: {
    scrollHeroWord: "PATHS",
    line1: "Four buying paths. One reconciliation file.",
    line2Prefix: "Pick a lane — we open the",
    inlineWord: "story",
    description:
      "App Growth, OEM, Creators, premium. Every path ships with MMP receipts so finance reads the same file as Ad Ops.",
  },
  description:
    "Four buying paths. Every path ships with MMP receipts so finance reads the same file as Ad Ops.",
  ctaLabel: "Request Pilot",
  closeTitle: "Brief the path You need",
  closeDescription: "Tell us the vertical, GEO, and KPI event — we route to the right buying lane.",
} as const;

export const solutionsHub = {
  label: "Buying paths",
  description: "Select a path. Story, deliverables, and channels open below.",
  categories: [
    {
      id: "performance",
      title: "App Growth",
      problem: "Spend scales, but CPA and finance stop agreeing.",
      summary: "CPI, CPA, and FTD models across in-app, programmatic, and reactivation.",
      primaryChannel: "performance",
      channelIds: ["performance", "programmatic", "retargeting"] as const,
      contactIntent: "brand",
      deliverables: [
        "Caps wired to FTD, registration, or subscription — not vanity CPI",
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
      title: "OEM",
      problem: "OEM inventory looks premium until procurement asks for trails.",
      summary: "Factory ROM and Google PAI with SDK trails — direct lanes, not resold exchange.",
      primaryChannel: "oem",
      channelIds: ["oem"] as const,
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
      id: "creators",
      title: "Creators",
      problem: "Creator spend lives outside the same reconciliation as paid media.",
      summary: "Paid social and creator placements with MMP-tracked outcomes — not brand-lift slides.",
      primaryChannel: "social",
      channelIds: ["influencer", "social"] as const,
      contactIntent: "advertising-partner",
      deliverables: [
        "Meta, TikTok, and Google mapped to funnel events",
        "Creator placements tracked to installs and deposits",
        "Same-day MMP conversion wiring",
      ],
      whyItWorks: [
        "Spend justified by events — not estimated reach",
        "Creator spend in the same reconciliation file as paid media",
      ],
      casePreview: "/cases/azar",
      caseLabel: "Creator / social case",
    },
    {
      id: "premium",
      title: "Premium & CTV",
      problem: "Premium and CTV look good in decks and weak in month-end files.",
      summary: "Native editorial and connected TV — household reach scored pre-bid.",
      primaryChannel: "native",
      channelIds: ["native", "ctv"] as const,
      contactIntent: "brand",
      deliverables: [
        "Curated finance and tech publisher whitelist",
        "Pre-flight brand and compliance checks",
        "CTV with pre-bid household and device scoring",
      ],
      whyItWorks: [
        "Placements legal and brand teams can accept",
        "CTV activation matched to delivery logs",
      ],
      casePreview: "/cases/autodoc",
      caseLabel: "Premium / CTV case",
    },
  ],
} as const;

export const contactPage = {
  label: "Let's Talk",
  title: "Ready to be Upraised?",
  titleLead: "Ready to be ",
  accentWord: "Upraised",
  description:
    "Brief the route: vertical, GEO, and the KPI event that matters. We reply with a scoped path — not a deck of awareness line items.",
  subline:
    "1–2 business days. Brand brief, OEM / supply, or careers — pick an intent and we route it.",
  office: "128 City Road, London EC1V 2NX, United Kingdom",
  email: "info@upraiser.co.uk",
  ctaLabel: "Start the conversation",
} as const;

export const caseStudyMeta = {
  structureLabel: "How to read a case",
  structureSteps: [
    {
      title: "Results",
      description:
        "Three hero numbers before the story — the only figures finance will ask for twice.",
    },
    {
      title: "Metadata",
      description:
        "Brand, vertical, GEO, KPI event, payment model, and channels — structured for procurement.",
    },
    {
      title: "Story",
      description:
        "Challenge, approach, result — short blocks tied to a device-level event You can verify.",
    },
  ],
} as const;

export const testimonials = [
  {
    quote:
      "We stopped explaining attribution drift to finance and started sharing one file.",
    name: "UA Director",
    role: "Fintech app · UK",
    company: "Mid-size consumer finance",
    href: "/cases/snoop",
  },
  {
    quote:
      "The Lenovo lane gave us factory-side proof, not resold exchange supply with a OEM sticker.",
    name: "Growth Lead",
    role: "Android trading app · Global",
    company: "High-frequency finance",
    href: "/cases/vantage",
  },
  {
    quote:
      "We went from weekly reconciliation calls to a monthly file pull. That is the outcome we really bought.",
    name: "Ad Ops Lead",
    role: "Media buyer · EU",
    company: "Programmatic accounts",
    href: "/cases/autodoc",
  },
  {
    quote:
      "Pre-bid filtration meant every dollar we raised spend against actually cleared a device check.",
    name: "Growth Lead",
    role: "Marketplace · GCC",
    company: "E-commerce expansion",
    href: "/cases/fiverr",
  },
] as const;



export const sectionsByMode = {
  value: {
    label: "What We Do",
    growth: {
      title: "Growth for apps that need more than installs",
      description:
        "Pre-bid protection, event-weighted buying, and OEM distribution between budget and verified revenue.",
    },
    infrastructure: {
      title: "Infrastructure Ad Ops can stand behind",
      description:
        "Filtration, log parity, and auditable OEM between exchange spend and numbers that close clean.",
    },
  },
  channels: {
    label: "Tools for Altitude",
    growth: {
      title: "Equipment for 30K+ daily installs.",
      description:
        "Direct supply, event-weighted optimization, and proven routes across GCC, US, and emerging markets — open a lane on The Routes for the full write-up.",
    },
    infrastructure: {
      title: "Fixed lines into Your stack.",
      description:
        "OEM, programmatic, and social under one control plane — every lane with a receipt Ad Ops can defend.",
    },
  },
  cases: {
    label: "Proven Summits",
    growth: { title: "We know these peaks well." },
    infrastructure: { title: "Peaks with oxygen — audit-ready." },
  },
  technology: {
    label: "The Gear",
    growth: { title: "Every bid has a receipt" },
    infrastructure: { title: "Every line item has a receipt" },
  },
  about: {
    label: "The Expedition",
    growth: {
      title: "We are UPRAISER",
      description:
        "Based in London. Official Lenovo agency partner. Pre-bid fraud filtration, OEM distribution, and event-verified buying for iGaming, fintech, gaming, and premium apps. No middleware. No black boxes. No post-campaign attribution arguments.",
    },
    infrastructure: {
      title: "We are UPRAISER",
      description:
        "Based in London. Official Lenovo agency partner. Log reconciliation, ROM deploys, and pre-bid guards — built for month-end when every line item has to reconcile. Finance and Ad Ops can pull the same file and agree on the numbers.",
    },
  },
  process: {
    label: "The Map. The Wire. The Verify.",
    growth: { title: "Chart. Line. Summit.", cta: "Request Pilot" },
    infrastructure: { title: "Map. Wire. Verify.", cta: "Request Pilot" },
  },
  contact: {
    label: "Contact",
    title: "Ready to be Upraised?",
    titleLead: "Ready to be ",
    accentWord: "Upraised",
  },
} as const;
