export type SiteMode = "growth" | "infrastructure";

export type NavLink = {
  label: string;
  href: string;
  contactIntent?: string;
};

export const contactVerticalOptions = [
  { value: "brand", label: "Brand" },
  { value: "advertising-partner", label: "Advertising Partner" },
  { value: "app-web-owner", label: "App / Web Owner" },
  { value: "direct-publisher", label: "Direct publisher" },
  { value: "careers", label: "Looking for a career at UPRAISER" },
  { value: "other", label: "Other" },
] as const;

export const navLinks: NavLink[] = [
  { label: "Solutions", href: "#value" },
  { label: "Case Studies", href: "#cases" },
  { label: "About", href: "#about" },
  { label: "Careers", href: "#contact", contactIntent: "careers" },
  { label: "Contact", href: "#contact" },
];

export const primaryCta = {
  label: "Contact",
  href: "#contact",
};

export const heroFounded = "Founded 17 July 2017 · London";

export const heroLede = "Pre-bid fraud filtration, OEM distribution, and verified outcomes.";

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
    label: "Who We Serve",
    title: "Brands measured by post-install revenue",
    line1: "Deposits, subscriptions, funded accounts — not CPI line items.",
    line2Prefix: "Built to",
    inlineWord: "SCALE",
    scrollHeroWord: "SCALE",
    cta: primaryCta.label,
  },
  infrastructure: {
    label: "Who We Serve",
    title: "Teams who need numbers to match the invoice",
    line1: "When the MMP and media bill diverge, fix the pipe — not the dashboard.",
    line2Prefix: "Run on",
    inlineWord: "PROOF",
    scrollHeroWord: "PROOF",
    cta: primaryCta.label,
  },
} satisfies Record<SiteMode, {
  label: string;
  title: string;
  line1: string;
  line2Prefix: string;
  inlineWord: string;
  scrollHeroWord: string;
  cta: string;
}>;

export const valueByMode = {
  growth: {
    hero: {
      kicker: "Event-weighted buying",
      title: "Buy the event your board tracks",
      description:
        "Deposits, subscriptions, FTDs — campaigns follow the metrics on your deck, not CPI charts that break in the MMP.",
    },
    metrics: [
      { value: "97.3%", label: "Fraud blocked pre-bid", progress: 0.973 },
      { value: "48h", label: "Brief to live bids", progress: 0.72 },
    ],
    features: [
      {
        title: "Spend that scales under scrutiny",
        description: "Every bid scored before it clears. Bad traffic never hits your cap.",
      },
      {
        title: "CPA that holds at scale",
        description: "Unit economics stay flat when budget doubles — cohort LTV drives the bid.",
      },
    ],
    brand: {
      badge: "Official partner",
      title: "Lenovo OEM",
      description: "ROM and Google PAI — factory-floor distribution off the open exchange.",
    },
  },
  infrastructure: {
    hero: {
      kicker: "Log-native buying",
      title: "Every line item has a device event",
      description:
        "Server logs reconcile to Adjust and AppsFlyer in real time. Month-end without the attribution war room.",
    },
    metrics: [
      { value: "0%", label: "Post-flight log drift", progress: 0.02 },
      { value: "0.4ms", label: "p99 bid scoring", progress: 0.88 },
    ],
    features: [
      {
        title: "Traffic that passes audit",
        description: "Invalid requests drop before auction close. Ad Ops can defend every dollar.",
      },
      {
        title: "Numbers that match",
        description: "MMP and media bill tell the same story — raw logs, not estimates.",
      },
    ],
    brand: {
      badge: "Official partner",
      title: "Lenovo OEM",
      description: "SDK-audited ROM and PAI — factory floor to first postback.",
    },
  },
} satisfies Record<SiteMode, unknown>;

export const promiseByMode = {
  growth: {
    label: "Our Commitment",
    title: "If it's not on the P&L, we don't call it a win",
    scrollHeroWord: "RESULTS",
    line1:
      "Campaigns built around events leadership already tracks — deposits, subscriptions, funded accounts. Not vanity metrics that break in the MMP.",
    line2Prefix: "We answer in",
    inlineWord: "RESULTS",
    titleLead: "We answer in ",
    accentWord: "RESULTS",
    description:
      "Campaigns built around events leadership already tracks — deposits, subscriptions, funded accounts. Not vanity metrics that break in the MMP.",
  },
  infrastructure: {
    label: "Our Commitment",
    title: "Logs your team can audit on demand",
    scrollHeroWord: "CLARITY",
    line1:
      "Every line item traces to a device event. No black-box reporting — pull and verify whenever you need.",
    line2Prefix: "We bring",
    inlineWord: "CLARITY",
    titleLead: "We bring ",
    accentWord: "CLARITY",
    description:
      "Every line item traces to a device event. No black-box reporting — pull and verify whenever you need.",
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

export const differenceByMode = {
  growth: [
    {
      title: "Uncapped premium supply",
      text: "Inventory others rarely see at scale. Blended CPA stays flat as daily caps increase.",
    },
    {
      title: "48 hours brief to bid",
      text: "Creative, tracking, and MMP events wired before the first impression — live inside two days.",
    },
    {
      title: "Cohort value drives bids",
      text: "Optimization follows LTV and payback — not yesterday's CPI — so unit economics hold when spend doubles.",
    },
  ],
  infrastructure: [
    {
      title: "Fraud stopped pre-auction",
      text: "Bots, emulators, and click floods never clear the bid. Invalid traffic dies before your cap.",
    },
    {
      title: "MMP logs match server side",
      text: "Adjust, AppsFlyer, and Kochava reconciled before the flight closes — no post-campaign dispute call.",
    },
    {
      title: "OEM deploys fully audited",
      text: "Lenovo ROM and Google PAI with SDK trails compliance and engineering teams accept.",
    },
  ],
} satisfies Record<SiteMode, unknown>;

export const trafficChannelsByMode = {
  growth: [
    {
      id: "oem",
      title: "OEM & Pre-installs",
      tagline: "On device before day one",
      description:
        "Lenovo ROM and Google PAI through our official partnership. Factory-side distribution while competitors bid open exchange.",
      bestFor: "Launches, emerging markets, ROM-first scale",
    },
    {
      id: "programmatic",
      title: "In-App Programmatic",
      tagline: "Scale inside 100K+ apps",
      description:
        "SDK inventory with behavioral signals - session depth, engagement peaks - so bids fire when intent is highest.",
      bestFor: "Volume scaling, rewarded video, high-intent units",
    },
    {
      id: "performance",
      title: "Performance UA",
      tagline: "Pay for what converts",
      description:
        "End-to-end mobile acquisition across display, video, and in-app — CPI, CPA, and CPL tied to downstream events. Real-time fraud filtering on every buy; bids follow revenue signals, not vanity install counts.",
      bestFor: "iGaming, fintech, games, subscription apps",
    },
    {
      id: "social",
      title: "Social & Search",
      tagline: "Catch intent in motion",
      description:
        "Meta, TikTok, and Google with segments mapped to your funnel. Conversion events in the MMP same day.",
      bestFor: "Intent capture, paid social, search CPA",
    },
    {
      id: "native",
      title: "Native & Editorial",
      tagline: "Trust-driven conversions",
      description:
        "Placements on high-authority finance and tech publishers. Editorial context that converts deposits and subscriptions.",
      bestFor: "Fintech, iGaming, premium subscriptions",
    },
    {
      id: "ctv",
      title: "CTV & Connected TV",
      tagline: "Reach that activates",
      description:
        "Roku and streaming campaigns built for installs and deep events - account link, first deposit, paid sub.",
      bestFor: "Brand + performance, UK/US fintech, awareness",
    },
    {
      id: "retargeting",
      title: "Retargeting",
      tagline: "Bring high-intent users back",
      description:
        "Cross-channel reactivation for users who showed intent but did not convert - bid against LTV, not vanity opens.",
      bestFor: "Trial users, cart abandoners, reactivation",
    },
    {
      id: "influencer",
      title: "Influencer & Creator",
      tagline: "Trusted voices, tracked outcomes",
      description:
        "Creator placements with MMP-tracked links and event KPIs. Social reach — deposits in the report.",
      bestFor: "Consumer apps, fintech onboarding, brand lift",
    },
  ],
  infrastructure: [
    {
      id: "oem",
      title: "OEM & Pre-installs",
      tagline: "Auditable factory supply",
      description:
        "Lenovo ROM and Google PAI with SDK trails from factory floor to postback. Compliance and Ad Ops share one log.",
      bestFor: "Regulated launches, OEM scale, SDK audit",
    },
    {
      id: "programmatic",
      title: "In-App Programmatic",
      tagline: "100K+ apps, full path visibility",
      description:
        "SDK inventory with 180+ signals scored pre-bid. Supply path clear enough for Ad Ops to defend in review.",
      bestFor: "Volume, rewarded video, rich telemetry",
    },
    {
      id: "performance",
      title: "Performance UA",
      tagline: "Event-verified mobile buying",
      description:
        "In-app, display, and video supply filtered pre-auction. Caps and bids wired to MMP events; every paid action reconciles to a device log before the flight closes.",
      bestFor: "FTD/CPA models, games, finance-grade reporting",
    },
    {
      id: "social",
      title: "Social & Search",
      tagline: "Logged intent paths",
      description:
        "Meta, TikTok, and Google with conversion events in your MMP same day — no black-box lag.",
      bestFor: "Search CPA, paid social, intent cohorts",
    },
    {
      id: "native",
      title: "Native & Editorial",
      tagline: "Whitelist-only publishers",
      description:
        "Curated finance and news inventory with brand and compliance filters applied before spend clears.",
      bestFor: "Premium media, regulated verticals",
    },
    {
      id: "ctv",
      title: "CTV & Connected TV",
      tagline: "Verified CTV paths",
      description:
        "Streaming inventory with device and household signals scored pre-bid. Activation events matched post-flight.",
      bestFor: "CTV + app, UK/US, clean measurement",
    },
    {
      id: "retargeting",
      title: "Retargeting",
      tagline: "MMP feed, not pixels",
      description:
        "Audience pools from MMP events. Reactivation bids on real behavior — not approximated segments.",
      bestFor: "Win-back, LTV cohorts, lifecycle UA",
    },
    {
      id: "dsp",
      title: "DSP & Exchange",
      tagline: "Guarded open exchange",
      description:
        "Direct DSP seats with pre-bid filtration and raw log export. Open exchange without open-ended risk.",
      bestFor: "Scale with controls, private deals, PMP",
    },
  ],
} satisfies Record<SiteMode, unknown>;

export const processByMode = {
  growth: [
    {
      step: "01",
      title: "Understand the Funnel",
      description:
        "We map where revenue actually happens - deposits, subs, registrations - and set caps around those events.",
    },
    {
      step: "02",
      title: "Pick the Mix",
      description:
        "OEM, programmatic, social — chosen by unit economics for your vertical, not platform politics.",
    },
    {
      step: "03",
      title: "Go Live and Ramp",
      description: "48 hours to first bid. Real-time optimization. CPAs held inside the target you set.",
    },
  ],
  infrastructure: [
    {
      step: "01",
      title: "Map the Stack",
      description:
        "MMP endpoints, log pipelines, and pre-bid requirements documented before anything goes live.",
    },
    {
      step: "02",
      title: "Connect and Test",
      description: "Raw logs wired to Adjust or AppsFlyer. Reconciliation verified before the first impression.",
    },
    {
      step: "03",
      title: "Deploy and Monitor",
      description: "ROM and programmatic lanes live with SDK compliance and continuous drift monitoring.",
    },
  ],
} satisfies Record<SiteMode, unknown>;

export const technologyByMode = {
  growth: [
    {
      title: "Scoring Engine",
      description: "180+ signals per bid at 0.4ms p99. Low-quality inventory never clears.",
    },
    {
      title: "Log Pipeline",
      description: "Server events to your MMP in under two seconds. Zero post-flight drift.",
    },
    {
      title: "MMP Integration",
      description: "AppsFlyer, Adjust, Kochava, Protect360 — your stack, connected.",
    },
  ],
  infrastructure: [
    {
      title: "Scoring Engine",
      description: "180+ signals per bid at 0.4ms p99. Low-quality inventory never clears.",
    },
    {
      title: "Log Pipeline",
      description: "Server events to your MMP in under two seconds. Zero post-flight drift.",
    },
    {
      title: "MMP Integration",
      description: "AppsFlyer, Adjust, Kochava, Protect360 — your stack, connected.",
    },
  ],
} satisfies Record<SiteMode, readonly { title: string; description: string }[]>;

export const bridgeByMode = {
  growth: {
    eyebrow: "Alternate view",
    lead: "See the infrastructure story",
    preview: "Log parity, pre-bid filtration, and audit-ready OEM — how Ad Ops closes the month without a war room.",
    cta: "Switch to Infrastructure",
  },
  infrastructure: {
    eyebrow: "Alternate view",
    lead: "See the growth story",
    preview: "Event-weighted buying, OEM scale, and verified outcomes — how brands ramp without breaking unit economics.",
    cta: "Switch to Growth",
  },
} satisfies Record<
  SiteMode,
  { eyebrow: string; lead: string; preview: string; cta: string }
>;

export const footerLinks = {
  explore: [
    { label: "Traffic Channels", href: "#channels" },
    { label: "Case Studies", href: "#cases" },
    { label: "Technology", href: "#technology" },
  ],
  company: [
    { label: "About", href: "#about" },
    { label: "Careers", href: "#contact", contactIntent: "careers" },
    { label: "Contact", href: "#contact" },
  ] satisfies NavLink[],
  social: [{ label: "LinkedIn", href: "https://www.linkedin.com/company/upraiser/" }],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

export const lenovoPartnership = {
  badge: "Official Agency Partner",
  logo: "/partners/lenovo-logo.png",
  logoAlt: "Lenovo",
  title: "Lenovo PC HK LTD",
  descriptionIntro:
    "Official Lenovo agency partner — factory-floor ROM and Google PAI distribution alongside performance buying.",
  descriptionLead: "Exclusive OEM supply with SDK trails from install to postback.",
};

export const sectionsByMode = {
  value: {
    label: "What We Do",
    growth: {
      title: "Growth for apps that need more than installs",
      description:
        "Pre-bid protection, event-weighted buying, and OEM distribution — between budget and verified revenue.",
    },
    infrastructure: {
      title: "Infrastructure Ad Ops can stand behind",
      description:
        "Filtration, log parity, and auditable OEM — between exchange spend and numbers that close clean.",
    },
  },
  channels: {
    label: "Channels",
    growth: { title: "Where high-value users come from" },
    infrastructure: { title: "How supply reaches your stack" },
  },
  cases: {
    label: "Case Studies",
    growth: { title: "Campaigns that hold up in review" },
    infrastructure: { title: "Pipelines built for audit" },
  },
  difference: {
    label: "Why Us",
    growth: {
      title: "Scale without breaking unit economics",
      description:
        "When spend ramps, most teams trade CPA for volume. Three disciplines our clients use to avoid that trade-off.",
    },
    infrastructure: {
      title: "Every line item has a receipt",
      description:
        "Ad Ops should not need a war room at month-end. Three standards on every campaign we deploy.",
    },
  },
  technology: {
    label: "Technology",
    growth: { title: "The stack behind your campaigns" },
    infrastructure: { title: "The stack behind your logs" },
  },
  about: {
    label: "About",
    growth: {
      title: "We are UPRAISER",
      description:
        "London-based since 2017. Official Lenovo agency partner. Pre-bid fraud filtration, OEM distribution, and event-verified buying for iGaming, fintech, and premium apps.",
    },
    infrastructure: {
      title: "We are UPRAISER",
      description:
        "London-based since 2017. Official Lenovo agency partner. Log reconciliation, ROM deploys, and pre-bid guards — built for month-end when every line item has to reconcile.",
    },
  },
  process: {
    label: "How We Work",
    growth: { title: "Brief. Launch. Ramp.", cta: "Talk to us" },
    infrastructure: { title: "Map. Wire. Verify.", cta: "Talk to us" },
  },
  contact: {
    label: "Contact",
    title: "Ready to be Upraised?",
    titleLead: "Ready to be ",
    accentWord: "Upraised",
  },
} as const;
