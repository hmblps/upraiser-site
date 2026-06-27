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

export const valueProps = [
  {
    title: "Zero-Tolerance Fraud Layer",
    subtitle: "97.3% bots filtered · 2.7% hijacking blocked",
    description:
      "Every install passes real-time verification before it hits Your dashboard. We maintain a 0% fraud rate on verified buys — bots, click floods, and install hijacking are blocked at the infrastructure level, not in a post-campaign report.",
  },
  {
    title: "Predictive LTV Scoring",
    subtitle: "Proprietary DMP · pre-impression signals",
    description:
      "Our DMP scores device-level intent before the bid fires. You allocate budget against predicted deposit, subscription, and registration value — not CPI alone.",
  },
  {
    title: "Hardware-Level OEM Access",
    subtitle: "Official Lenovo agency partner",
    description:
      "ROM-level pre-installs and Google PAI via Tier-1 OEM partners. Your app ships on-device from day one — live in 1–2 days with geo and model targeting across 100+ territories.",
  },
];

export const objectives = [
  {
    title: "Deploy Across 100+ Territories",
    description:
      "One integration point. Your campaigns go live in Tier-1 and emerging markets through a single API — 100K+ apps in network, 24/7 execution, no fragmented vendor stack.",
  },
  {
    title: "Buy Verified Events, Not Impressions",
    description:
      "CPI, CPA, and CPL contracts tied to deposits, purchases, and registrations You can reconcile in AppsFlyer, Adjust, or Kochava. Every dollar maps to a measurable outcome.",
  },
  {
    title: "Pre-Install at the Hardware Layer",
    description:
      "Factory and cloud pre-installs via Lenovo Ad Exchange and Tier-1 OEM inventory. Zero-fraud installs with ROM-level integration — not display retargeting dressed as acquisition.",
  },
  {
    title: "Score Intent Before the Bid",
    description:
      "Proprietary DMP predictive scoring using session depth, device signals, and engagement peaks. We bid when LTV probability is highest — and pause when it isn't.",
  },
];

export interface TrafficChannel {
  id: string;
  title: string;
  tagline: string;
  description: string;
  bestFor: string;
}

export const trafficChannels: TrafficChannel[] = [
  {
    id: "oem",
    title: "OEM & Pre-installs",
    tagline: "Your app from day one",
    description:
      "Factory and cloud pre-install access via Lenovo and Tier-1 OEM partners. ROM-level integration or Google PAI — live in 1–2 days with geo and device targeting.",
    bestFor: "App launches, scale in emerging markets, zero-fraud installs",
  },
  {
    id: "programmatic",
    title: "In-App Programmatic",
    tagline: "Scale inside 100K+ apps",
    description:
      "SDK-integrated inventory with behavioral signals — session depth, usage frequency, and engagement peaks — so we bid when intent is highest.",
    bestFor: "Volume scaling, rewarded video, high-intent ad units",
  },
  {
    id: "social",
    title: "Social & Search",
    tagline: "Capture active demand",
    description:
      "High-intent keywords on Google, Bing, and Yahoo plus granular segmentation on Meta and TikTok for personalized acquisition at scale.",
    bestFor: "Search arbitrage, paid social, intent-driven CPA",
  },
  {
    id: "native",
    title: "Native & Editorial",
    tagline: "Trust-driven conversions",
    description:
      "Placements on high-authority financial and tech publishers. Leverage editorial trust to drive high-CPA subscriptions and deposits.",
    bestFor: "Fintech, iGaming, premium subscriptions",
  },
  {
    id: "ctv",
    title: "CTV & Connected TV",
    tagline: "Reach that activates",
    description:
      "Roku, streaming, and connected-TV campaigns that drive installs and deep-funnel events like account linking and first deposit.",
    bestFor: "Brand + performance, UK/US fintech, app awareness",
  },
  {
    id: "retargeting",
    title: "Retargeting",
    tagline: "Re-engage high-intent users",
    description:
      "Bring back users who showed intent but didn't convert. Cross-channel retargeting aligned to LTV and event-based bidding.",
    bestFor: "Cart abandoners, trial users, reactivation",
  },
  {
    id: "mobile",
    title: "Mobile UA",
    tagline: "Always in Your audience's pocket",
    description:
      "End-to-end mobile user acquisition — CPI, CPA, and CPL models across display, video, and in-app with real-time fraud filtering.",
    bestFor: "App store ranking, mobile games, utility apps",
  },
  {
    id: "performance",
    title: "Performance & Growth",
    tagline: "Outcome-based buying",
    description:
      "CPI, CPA, and CPL deals aligned to Your LTV model. We buy against deposits, purchases, and registrations — not impressions alone.",
    bestFor: "iGaming FTDs, fintech deposits, subscription apps",
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Diagnose & Define Goals",
    description: "Map Your funnel gaps, LTV targets, and the KPIs that actually matter for Your vertical.",
  },
  {
    step: "02",
    title: "Pick the Right Channels",
    description: "Mix OEM, programmatic, social, native, and CTV based on where Your high-value users live.",
  },
  {
    step: "03",
    title: "Launch & Optimize",
    description: "Go live in days, not months. Real-time data feeds continuous creative and bid optimization.",
  },
  {
    step: "04",
    title: "Scale What Works",
    description: "Double down on winning geos, placements, and events — with full transparency on every dollar spent.",
  },
];

export const promise = {
  label: "Why UPRAISER",
  title: "We Don't Sell Impressions. We Buy Verified Outcomes.",
  titleLead: "We Don't Sell Impressions. We Buy Verified ",
  accentWord: "Outcomes",
  scrollHeroWord: "OUTCOMES",
  description:
    "Most partners optimize for reports. We operate as traffic infrastructure — one integration, proprietary DMP scoring, and event-verified buying so every dollar ties to deposits, purchases, or registrations You can actually measure.",
};

export const differencePillars = [
  {
    title: "Tech",
    description:
      "Proprietary DMP with pre-impression LTV scoring. 97.3% bot filtering, 2.7% hijack blocking — built for execution, not slide decks.",
  },
  {
    title: "Team",
    description:
      "One global team across 100+ territories. Single integration point, 24/7 execution, zero vendor fragmentation.",
  },
  {
    title: "Tactics",
    description:
      "Channel mix follows the user — OEM, programmatic, social, native, and CTV — selected by event economics, not platform preference.",
  },
  {
    title: "Transparency",
    description:
      "No black boxes. You see the campaign data we see — with zero-tolerance fraud filtering on every verified buy.",
  },
];

export const technologyFeatures = [
  {
    title: "Proprietary DMP",
    description: "Predictive scoring using device signals to estimate LTV before the impression is served.",
  },
  {
    title: "Fraud Shield",
    description:
      "97.3% of bot traffic filtered. 2.7% install hijacking blocked. If we can't verify it, we don't buy it.",
  },
  {
    title: "Attribution Stack",
    description: "Integrated with AppsFlyer, Adjust, Kochava, Protect360, and the platforms You already run.",
  },
];


export const footerLinks = {
  explore: [
    { label: "Objectives", href: "#objectives" },
    { label: "Traffic Channels", href: "#channels" },
    { label: "Case Studies", href: "#cases" },
    { label: "Technology", href: "#technology" },
  ],
  company: [
    { label: "About", href: "#about" },
    { label: "Careers", href: "mailto:info@upraiser.co.uk" },
    { label: "Contact", href: "#contact" },
  ],
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/upraiser/" },
  ],
};

export const highlights = [
  { value: "100+", label: "Territories" },
  { value: "100K+", label: "Apps in Network" },
  { value: "0%", label: "Fraud Rate" },
  { value: "97.3%", label: "Bots Filtered" },
];

export const audience = {
  label: "Core of Our Work",
  title: "Built for Clients Who Care About Quality &",
  line1: "We deliver results beyond client expectations.",
  line2Prefix: "And we open up space for Your",
  growthWord: "GROWTH",
  scrollHeroWord: "GROWTH",
  cta: primaryCta.label,
};

export const sections = {
  valueLead: {
    main: "If it doesn't drive a verified event, it's not user acquisition.",
    aside: "It's unallocated spend.",
  },
  channels: {
    label: "Traffic Channels",
    title: "Paths Beyond the Obvious",
  },
  cases: {
    label: "Case Studies",
    title: "Verified Campaign Results",
    description:
      "Selected client work — event-level metrics and methodology from managed campaigns across iGaming, Fintech, and premium media.",
  },
  difference: {
    label: "The Difference",
    title: "Four Pillars Behind Every Campaign",
  },
  objectives: {
    label: "Objectives",
    title: "What the Infrastructure Delivers",
  },
  process: {
    label: "How We Work",
    title: "Find the Gaps, Pick the Path, Scale the Results",
  },
  technology: {
    label: "Technology",
    title: "Built for Performance, Not Presentations",
  },
  about: {
    label: "About UPRAISER",
    title: "Performance-First Traffic Infrastructure",
  },
  testimonials: {
    label: "Client Voice",
    title: "What Partners Say",
  },
  contact: {
    label: "Get in Touch",
    title: "Are You Ready to Be Upraised?",
    titleLead: "Are You Ready to Be ",
    accentWord: "Upraised",
  },
};

export const aboutHighlights = [
  {
    title: "100+ Territories",
    text: "Active traffic across Tier-1 and emerging markets — one integration point, 24/7 execution.",
  },
  {
    title: "100K+ App Network",
    text: "SDK-integrated programmatic inventory with behavioral bid signals — OEM, social, native, and CTV layered by event economics.",
  },
  {
    title: "Proprietary DMP",
    text: "Predictive LTV scoring before the impression is served. Device-level intent, not demographic guesswork.",
  },
  {
    title: "0% Verified Fraud",
    text: "97.3% bot filtering. 2.7% install hijacking blocked. If we can't verify it, we don't buy it.",
  },
];

export const lenovoPartnership = {
  badge: "Official Agency Partner",
  logo: "/partners/lenovo-logo.png",
  logoAlt: "Lenovo",
  title: "Lenovo PC HK LTD",
  descriptionIntro:
    "Combining decades of digital advertising expertise and inventory from an industry-leading PC and mobile manufacturer,",
  descriptionLead: "We offer exclusive access to…",
};

export const testimonials = [
  {
    id: "fintech-cmo",
    quote:
      "We needed FTDs, not install reports. Their OEM pipeline went live in 48 hours and every event reconciled in Adjust — zero disputed traffic.",
    role: "CMO",
    company: "European Fintech App",
    vertical: "Fintech",
  },
  {
    id: "igaming-head",
    quote:
      "Regulated US states, 18+ compliance, and a 0% fraud requirement. They whitelisted inventory before we spent a dollar — deposits tracked cleanly from week one.",
    role: "Head of Acquisition",
    company: "US iGaming Operator",
    vertical: "iGaming",
  },
  {
    id: "media-director",
    quote:
      "Subscription CPA held on target for four consecutive months. We saw the same placement data they did — no black box, no vanity metrics.",
    role: "Director of Growth",
    company: "Premium Media Publisher",
    vertical: "Media",
  },
];
