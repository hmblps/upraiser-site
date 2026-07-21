export type SiteMode = "growth" | "infrastructure";

export const navLinks = [
  { label: "Solutions", href: "#channels" },
  { label: "Case Studies", href: "#cases" },
  { label: "About", href: "#about" },
  { label: "Careers", href: "mailto:info@upraiser.co.uk" },
  { label: "Contact", href: "#contact" },
];

export const primaryCta = {
  label: "Contact",
  href: "#contact",
};

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
    title: "Brands Measuring Success by What Happens After the Install",
    line1: "Your success is a deposit, a subscription, or a funded account  - not a line on a CPI report.",
    line2Prefix: "Built to",
    inlineWord: "SCALE",
    scrollHeroWord: "SCALE",
    cta: primaryCta.label,
  },
  infrastructure: {
    label: "Who We Serve",
    title: "Teams Who Demand That the Numbers Match the Invoice",
    line1: "When the MMP and the media bill tell different stories, the fix is in the pipe  - not in another dashboard.",
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
      title: "Buy the event Your board already tracks",
      description:
        "Deposits, subscriptions, first-time funders  - campaigns follow the metrics on Your deck, not CPI charts that fall apart in the MMP.",
    },
    metrics: [
      { value: "97.3%", label: "Fraud blocked pre-bid", progress: 0.973 },
      { value: "48h", label: "Brief to live bids", progress: 0.72 },
    ],
    features: [
      {
        title: "Spend that survives scrutiny",
        description: "Every bid is scored before it clears. Bad traffic never hits Your cap.",
      },
      {
        title: "CPA that holds at scale",
        description: "Unit economics stay flat when Your budget doubles  - cohort LTV drives the bid.",
      },
    ],
    brand: {
      badge: "Official partner",
      title: "Lenovo OEM",
      description: "ROM and Google PAI  - factory-floor distribution far off the open exchange.",
    },
  },
  infrastructure: {
    hero: {
      kicker: "Log-native buying",
      title: "Every line item has a device event",
      description:
        "Server logs reconcile to Adjust and AppsFlyer in real time. Month-end is a formality for You  - not a three-day attribution war room.",
    },
    metrics: [
      { value: "0%", label: "Post-flight log drift", progress: 0.02 },
      { value: "0.4ms", label: "p99 bid scoring", progress: 0.88 },
    ],
    features: [
      {
        title: "Traffic that passes audit",
        description: "Invalid requests drop before auction close. Your Ad Ops can defend every dollar spent.",
      },
      {
        title: "Numbers that match",
        description: "Your MMP and media bill tell the same story  - raw logs, not estimates.",
      },
    ],
    brand: {
      badge: "Official partner",
      title: "Lenovo OEM",
      description: "SDK-audited ROM and PAI pipes  - factory floor to Your first postback.",
    },
  },
} satisfies Record<SiteMode, unknown>;

export const promiseByMode = {
  growth: {
    label: "Our Commitment",
    scrollHeroWord: "RESULTS",
    titleLead: "We answer in ",
    accentWord: "RESULTS",
    description:
      "If it is not in Your MMP and on Your P&L, We do not call it a win. We structure campaigns entirely around the events Your leadership already tracks.",
  },
  infrastructure: {
    label: "Our Commitment",
    scrollHeroWord: "CLARITY",
    titleLead: "We bring You ",
    accentWord: "CLARITY",
    description:
      "Every line item is traceable to a device event. No black-box reporting, no post-campaign surprises  - just logs Your team can pull and verify whenever You need.",
  },
} satisfies Record<SiteMode, unknown>;

export const differenceByMode = {
  growth: [
    {
      title: "Uncapped Premium Supply",
      text: "Inventory that others never see at scale. Your blended CPA stays flat even as You increase Your daily caps.",
    },
    {
      title: "48 Hours Brief to Bid",
      text: "Creative, tracking, and MMP events are wired before the first impression  - We are live inside two days so You don't lose momentum.",
    },
    {
      title: "Cohort Value Drives Bids",
      text: "Optimization follows Your LTV and payback  - not yesterday's CPI  - so Your unit economics stay firm when Your spend doubles.",
    },
  ],
  infrastructure: [
    {
      title: "Fraud Stopped Pre-Auction",
      text: "Bot farms, emulators, and click floods never clear the bid. Invalid traffic dies before it ever touches Your cap.",
    },
    {
      title: "MMP Logs Match Server Side",
      text: "Adjust, AppsFlyer, and Kochava are reconciled before the flight closes  - You won't need a post-campaign dispute call.",
    },
    {
      title: "OEM Deploys Fully Audited",
      text: "Lenovo ROM and Google PAI with SDK trails that Your compliance and engineering teams will actually accept.",
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
        "Lenovo ROM and Google PAI through our official partnership. Your app ships factory-side while competitors bid on scraps.",
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
        "CPI, CPA, and CPL tied to downstream events. Bids follow revenue signals - not vanity install counts.",
      bestFor: "iGaming, fintech, subscription apps",
    },
    {
      id: "social",
      title: "Social & Search",
      tagline: "Catch intent in motion",
      description:
        "Meta, TikTok, and Google with segments mapped to Your funnel. Conversion events land in Your dashboard same day.",
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
      id: "mobile",
      title: "Mobile UA",
      tagline: "Always in the pocket",
      description:
        "End-to-end mobile acquisition across display, video, and in-app with real-time fraud filtering on every buy.",
      bestFor: "App store growth, games, utility apps",
    },
    {
      id: "influencer",
      title: "Influencer & Creator",
      tagline: "Trusted voices, tracked outcomes",
      description:
        "Creator placements with MMP-tracked links and event KPIs. Reach looks social - Your report still shows deposits.",
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
      tagline: "Event-verified buying",
      description:
        "Caps and bids wired to MMP events. Every paid action reconciles to a device log before the flight closes.",
      bestFor: "FTD/CPA models, finance-grade reporting",
    },
    {
      id: "social",
      title: "Social & Search",
      tagline: "Logged intent paths",
      description:
        "Meta, TikTok, and Google with conversion events pushed into Your MMP same day - no black-box attribution lag.",
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
        "Audience pools built from Your MMP events. Reactivation bids on real behavior - not approximated segments.",
      bestFor: "Win-back, LTV cohorts, lifecycle UA",
    },
    {
      id: "mobile",
      title: "Mobile UA",
      tagline: "Verified before the bid",
      description:
        "In-app supply filtered pre-auction. Fraud never clears - so Ad Ops never has to explain it later.",
      bestFor: "Games, utilities, fraud-sensitive verticals",
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
        "OEM, programmatic, social - chosen by unit economics for Your vertical, not platform politics.",
    },
    {
      step: "03",
      title: "Go Live and Ramp",
      description: "48 hours to first bid. Real-time optimization. CPAs held inside the target You set.",
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
      description: "180+ signals evaluated per bid at 0.4ms p99. Low-quality inventory never clears.",
    },
    {
      title: "Log Pipeline",
      description: "Server events to Your MMP in under two seconds. Zero post-flight discrepancy.",
    },
    {
      title: "MMP Integration",
      description: "AppsFlyer, Adjust, Kochava, Protect360  - Your stack, fully connected.",
    },
  ],
  infrastructure: [
    {
      title: "Scoring Engine",
      description: "180+ signals evaluated per bid at 0.4ms p99. Low-quality inventory never clears.",
    },
    {
      title: "Log Pipeline",
      description: "Server events to Your MMP in under two seconds. Zero post-flight discrepancy.",
    },
    {
      title: "MMP Integration",
      description: "AppsFlyer, Adjust, Kochava, Protect360  - Your stack, fully connected.",
    },
  ],
} satisfies Record<SiteMode, readonly { title: string; description: string }[]>;

export const bridgeByMode = {
  growth: {
    eyebrow: "Alternate view",
    lead: "See the infrastructure story",
    preview: "Log parity, pre-bid filtration, and audit-ready OEM  - how Ad Ops closes the month without a war room.",
    cta: "Switch to Infrastructure",
  },
  infrastructure: {
    eyebrow: "Alternate view",
    lead: "See the growth story",
    preview: "Event-weighted buying, OEM scale, and verified outcomes  - how brands ramp without breaking unit economics.",
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
    { label: "Careers", href: "mailto:info@upraiser.co.uk" },
    { label: "Contact", href: "#contact" },
  ],
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
    "Combining decades of digital advertising expertise and inventory from an industry-leading PC and mobile manufacturer,",
  descriptionLead: "We offer exclusive access to factory-floor ROM and Google PAI distribution.",
};

export const sectionsByMode = {
  value: {
    label: "What We Do",
    growth: {
      title: "Growth for Apps That Need More Than Installs",
      description:
        "Pre-bid protection, event-weighted buying, and OEM distribution - the stack between Your budget and verified revenue.",
    },
    infrastructure: {
      title: "Infrastructure Ad Ops Can Stand Behind",
      description:
        "Filtration, log parity, and auditable OEM - the stack between Your exchange spend and numbers that close clean.",
    },
  },
  channels: {
    label: "Channels",
    growth: { title: "Where We Find Your High-Value Users" },
    infrastructure: { title: "How Supply Reaches Your Stack" },
  },
  cases: {
    label: "Case Studies",
    growth: { title: "Work That Survived Your Spreadsheet" },
    infrastructure: { title: "Pipelines That Survived Your Audit" },
  },
  difference: {
    label: "Why Us",
    growth: {
      title: "We Scale Without Breaking Unit Economics",
      description:
        "When spend ramps, most teams trade CPA for volume. These three disciplines are how our clients avoid that trade-off.",
    },
    infrastructure: {
      title: "Every Line Item Has a Receipt",
      description:
        "Ad Ops should not need a war room at month-end. These three standards run on every campaign we deploy.",
    },
  },
  technology: {
    label: "Technology",
    growth: { title: "The Stack Behind Your Campaigns" },
    infrastructure: { title: "The Stack Behind Your Logs" },
  },
  about: {
    label: "About",
    growth: {
      title: "We Are UPRAISER",
      description:
        "Official Lenovo agency partner. Pre-bid fraud filtration, OEM distribution, and event-verified buying - all built for the moment after Your install, when revenue either happens for You or it does not.",
    },
    infrastructure: {
      title: "We Are UPRAISER",
      description:
        "Official Lenovo agency partner. Log reconciliation, ROM deploys, and pre-bid guards - all built for the moment before Your close, when every single line item needs to make sense for You.",
    },
  },
  process: {
    label: "How We Work",
    growth: { title: "Brief. Launch. Ramp.", cta: "Talk to Us" },
    infrastructure: { title: "Map. Wire. Verify.", cta: "Talk to Us" },
  },
  contact: {
    label: "Contact",
    title: "Are You Ready to Be Upraised?",
    titleLead: "Are You Ready to Be ",
    accentWord: "Upraised",
  },
} as const;
