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

export const heroFounded = "Founded 17 July 2017 based in London";

/** Shared poetic H1 stays in Hero.tsx lede annotates by mode (ascent brand). */
export const heroLedeByMode = {
  growth: "Most agencies admire the view. We engineer the velocity.",
  infrastructure: "Scaling is the climb. Verification is the oxygen.",
} as const satisfies Record<SiteMode, string>;

/** @deprecated use heroLedeByMode kept for any stray imports */
export const heroLede = heroLedeByMode.growth;

export const heroHighlightsByMode = {
  growth: [
    { value: "35+", label: "Active GEOs" },
    { value: "800M+", label: "OEM Device Reach" },
    { value: "48h", label: "SLA Setup" },
    { value: "$150M+", label: "Spent Optimized" },
  ],
  infrastructure: [
    { value: "35+", label: "Active GEOs" },
    { value: "800M+", label: "OEM Device Reach" },
    { value: "48h", label: "SLA Setup" },
    { value: "$150M+", label: "Spent Optimized" },
  ],
} satisfies Record<SiteMode, readonly { value: string; label: string }[]>;

export const audienceByMode = {
  growth: {
    label: "Teams who require campaign metrics to match the media invoice",
    title: "Who We Serve",
    line1: "When Your MMP and media bills diverge, we rebuild Your data pipelines.",
    line2Prefix: "Run on",
    inlineWord: "PROOF",
    scrollHeroWord: "PROOF",
    cta: primaryCta.label,
    description:
      "You are the Ad Ops lead, finance controller, or UA director who has explained attribution drift too many times. Your programmatic and OEM campaigns run on Adjust, AppsFlyer, Singular, or Kochava. You require a direct supply path where every KPI event traces back to a raw device log. We leave opaque PDF reporting to traditional vendors. We build clean, verified supply lines so You can defend Your media spend in any financial review.",
  },
  infrastructure: {
    label: "Teams who require campaign metrics to match the media invoice",
    title: "Who We Serve",
    line1: "When Your MMP and media bills diverge, we rebuild Your data pipelines.",
    line2Prefix: "Run on",
    inlineWord: "PROOF",
    scrollHeroWord: "PROOF",
    cta: primaryCta.label,
    description:
      "You are the Ad Ops lead, finance controller, or UA director who has explained attribution drift too many times. Your programmatic and OEM campaigns run on Adjust, AppsFlyer, Singular, or Kochava. You require a direct supply path where every KPI event traces back to a raw device log. We leave opaque PDF reporting to traditional vendors. We build clean, verified supply lines so You can defend Your media spend in any financial review.",
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
        "Caps wire directly to revenue events before the first impression clears, ensuring absolute alignment with Your goals.",
    },
    metrics: [
      { value: "97.3%", label: "Fraud killed before auction close", progress: 0.973 },
      { value: "48h", label: "Brief to live bids", progress: 0.72 },
    ],
    features: [
      {
        title: "Spend that scales under scrutiny",
        description:
          "Every bid is scored before it clears. Bad traffic drops instantly, and the exact device log proves our absolute transparency.",
      },
      {
        title: "CPA that holds at scale",
        description:
          "Unit economics stay flat when budget doubles. Precise cohort LTV entirely drives the bid strategy.",
      },
    ],
    brand: {
      badge: "Official partner",
      title: "Lenovo OEM",
      description: "Factory lanes detailed completely on Solutions.",
    },
  },
  infrastructure: {
    hero: {
      kicker: "Log-native buying",
      title: "Every bid has a receipt",
      description:
        "Server logs reconcile perfectly to Adjust and AppsFlyer in real time. Month-end closes seamlessly because the numbers already agree.",
    },
    metrics: [
      { value: "0%", label: "Post-flight log drift", progress: 0.02 },
      { value: "0.4ms", label: "p99 bid scoring", progress: 0.88 },
    ],
    features: [
      {
        title: "Traffic that passes audit",
        description:
          "Invalid requests drop flawlessly before auction close. Ad Ops confidently defends every dollar in a finance review without last-minute reconciliation.",
      },
      {
        title: "Numbers that match",
        description:
          "The MMP and media bill tell exactly the same story through raw logs. Ad Ops and finance operate in absolute alignment.",
      },
    ],
    brand: {
      badge: "Official partner",
      title: "Lenovo OEM",
      description: "SDK-audited ROM with deep inventory mapped on Solutions.",
    },
  },
} satisfies Record<SiteMode, unknown>;

export const promiseByMode = {
  growth: {
    label: "Raw logs Your team can audit on demand",
    title: "Our Commitment",
    scrollHeroWord: "CLARITY",
    line1: "We trace every media invoice line item back to a raw device event.",
    line2Prefix: "We bring",
    inlineWord: "CLARITY",
    titleLead: "We bring ",
    accentWord: "CLARITY",
    description:
      "Your team can pull and verify Your dataset at any time. Our raw log validation resolves attribution disputes before Your traders open the flight. We provide raw logs, real-time reconciliation, and pre-bid filtration so Your media buyers and finance directors work with the same data. Your reconciliation process remains completely clean.",
  },
  infrastructure: {
    label: "Raw logs Your team can audit on demand",
    title: "Our Commitment",
    scrollHeroWord: "CLARITY",
    line1: "We trace every media invoice line item back to a raw device event.",
    line2Prefix: "We bring",
    inlineWord: "CLARITY",
    titleLead: "We bring ",
    accentWord: "CLARITY",
    description:
      "Your team can pull and verify Your dataset at any time. Our raw log validation resolves attribution disputes before Your traders open the flight. We provide raw logs, real-time reconciliation, and pre-bid filtration so Your media buyers and finance directors work with the same data. Your reconciliation process remains completely clean.",
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
      title: "OEM & On-Device Discovery",
      tagline: "OEM Volume",
      teaser: "Launch campaigns on new Android devices at the moment of first activation.",
      description: "We deliver direct, factory-level placement across premium global devices. As an official Lenovo agency partner, we secure pre-installs and device activation campaigns with certified SDK trails. We bypass traditional resellers and competitive bidding to place Your application directly in front of new users. You scale Your user base with direct device access and verified logs for first_deposit_complete events.",
      bestFor: "Direct Access · Factory ROM · Verified Logs",
      points: [
        "Lenovo agency partner",
        "Pre-installs",
        "SDK trails"
      ]
    },
    {
      id: "programmatic",
      title: "Programmatic Media Buying",
      tagline: "Event-Weighted DSP",
      teaser: "Target high-spending audiences using predictive event optimization.",
      description: "We run programmatic campaigns across curated global exchanges, bypassing the noise of public bidding. Our system optimizes Your spend for downstream events, including registration_success and subscription_started. We buy media based on real player lifetime value rather than cheap clicks. You achieve ROI-focused growth across premium ad networks.",
      bestFor: "Curated Exchanges · ROI Focus · Event Optimization",
      points: [
        "Predictive optimization",
        "Downstream events",
        "Lifetime value bidding"
      ]
    },
    {
      id: "performance",
      title: "In-App, Social & CGC",
      tagline: "CGC Performance",
      teaser: "Convert user attention into measurable revenue using authentic creators.",
      description: "We combine high-performing Creator-Generated Content (CGC) with algorithmic paid distribution. Our creative studio sources creators to design visual hooks tailored for competitive verticals, including iGaming and Fintech. We test hundreds of video variations and scale only the formats that convert. You watch Your average revenue per user climb.",
      bestFor: "Authentic Creators · iGaming & Fintech · Measurable Revenue",
      points: [
        "Algorithmic distribution",
        "High-volume testing",
        "LTV scaling"
      ]
    }
  ],
  infrastructure: [
    {
      id: "oem",
      title: "OEM & On-Device Discovery",
      tagline: "OEM Audit",
      teaser: "Audit every factory pre-install down to the raw hardware log.",
      description: "Opaque attribution models have no place in Your marketing sheets. We secure direct Lenovo ROM and PAI lanes with complete SDK trails for absolute compliance. Our engineers connect device logs directly to Your Adjust or AppsFlyer endpoints for subscription_started tracking. You verify every device activation before You pay the invoice, protecting Your media budget from resale fraud.",
      bestFor: "Absolute Compliance · Raw Hardware Logs · SDK Trails",
      points: [
        "Lenovo ROM & PAI",
        "Adjust/AppsFlyer endpoints",
        "Resale fraud protection"
      ]
    },
    {
      id: "programmatic",
      title: "Programmatic Media Buying",
      tagline: "Pre-Bid Filtration",
      teaser: "Filter out bot traffic in 0.4 milliseconds before the bid occurs.",
      description: "We enforce absolute pipeline cleanliness. Our proprietary engine analyzes 180 device signals in 0.4 milliseconds to block fraud before we spend Your budget, securing clean first_deposit_complete events. We maintain a rigorously vetted safelist of direct exchanges, ensuring a clean supply path. Your media buyers work with transparent data, and Your accounting ledgers match Your media invoices perfectly.",
      bestFor: "Clean Supply Path · 0.4ms Filtration · Transparent Data",
      points: [
        "180 device signals",
        "Direct exchange safelist",
        "Ledger matching"
      ]
    },
    {
      id: "performance",
      title: "In-App, Social & CGC",
      tagline: "Creative Log Trace",
      teaser: "Connect every visual asset to a raw device receipt.",
      description: "Traditional agencies sell beautiful banners but hide performance gaps. We treat creative production as data science. Our traders trace every creative asset directly to Your raw install logs, showing You exactly which video generated real lifetime value. We remove the guesswork from Your creative testing, ensuring every ad dollar works for Your ledger.",
      bestFor: "Data Science · Install Logs · Ad Dollar Tracing",
      points: [
        "Raw device receipts",
        "Performance mapping",
        "Ledger verification"
      ]
    }
  ],
} satisfies Record<SiteMode, unknown>;

export const processByMode = {
  growth: [
    {
      step: "01",
      title: "Map the Route",
      description:
        "Our operators audit Your MMP endpoints, raw log pipelines, and fraud vectors before Your campaigns launch. We document Your entire technical stack to prevent integration errors.",
    },
    {
      step: "02",
      title: "Connect and Wire",
      description:
        "We connect raw device logs directly to Your Adjust or AppsFlyer endpoints. We verify data reconciliation before we buy the first impression. When numbers mismatch at bid-time, we rebuild Your data pipelines immediately.",
    },
    {
      step: "03",
      title: "Deploy and Verify",
      description:
        "We launch Your programmatic and OEM lanes with verified SDK compliance. Our continuous monitoring prevents attribution drift. Your accounting ledger matches Your media invoice perfectly.",
    },
  ],
  infrastructure: [
    {
      step: "01",
      title: "Map the Route",
      description:
        "Our operators audit Your MMP endpoints, raw log pipelines, and fraud vectors before Your campaigns launch. We document Your entire technical stack to prevent integration errors.",
    },
    {
      step: "02",
      title: "Connect and Wire",
      description:
        "We connect raw device logs directly to Your Adjust or AppsFlyer endpoints. We verify data reconciliation before we buy the first impression. When numbers mismatch at bid-time, we rebuild Your data pipelines immediately.",
    },
    {
      step: "03",
      title: "Deploy and Verify",
      description:
        "We launch Your programmatic and OEM lanes with verified SDK compliance. Our continuous monitoring prevents attribution drift. Your accounting ledger matches Your media invoice perfectly.",
    },
  ],
} satisfies Record<SiteMode, unknown>;

export const bridgeByMode = {
  growth: {
    eyebrow: "Alternate view",
    lead: "See the infrastructure story",
    preview: "Fixed lines, oxygen-level proof, and audit-ready OEM driving how Ad Ops closes the month.",
    cta: "Switch to Infrastructure",
  },
  infrastructure: {
    eyebrow: "Alternate view",
    lead: "See the growth story",
    preview: "Velocity securing the view with OEM scale and event-weighted buying without breaking unit economics.",
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
  stripLine: "Factory ROM and Google PAI delivering direct verified lanes.",
  descriptionIntro:
    "Official Lenovo agency partner for brands and networks demanding procurement-grade OEM access securely alongside performance buying.",
  descriptionLead:
    "Direct ROM and PAI lanes equipped with deep SDK trails mapping inventory and buying models strictly under Solutions OEM.",
};

export const aboutPage = {
  label: "The Expedition",
  title: "Your route to the peak",
  chapter: {
    scrollHeroWord: "ASCENT",
    line1: "We started by explaining attribution drift to finance.",
    line2Prefix: "Then we built the agency that",
    inlineWord: "secures the climb",
    description:
      "London-based. We map and reconcile mobile growth so Your Ad Ops and finance teams read the identical file.",
  },
  positioningLead: "Built from logs.",
  positioningAccent: "Built for trust.",
  description:
    "London-based performance boutique. We execute and reconcile mobile growth so Ad Ops and finance share one file.",
  storySegments: [
    {
      mark: "2017",
      title: "Founded 17 July 2017",
      body: "Ad Ops engineers solved post-flight disputes. We exist to guarantee bid-time and bill-time agree perfectly.",
    },
    {
      mark: "P&L",
      title: "Built for the P&L",
      body: "Campaigns wire completely to the first_deposit_complete and subscription_started events finance tracks, entirely bypassing install vanity.",
    },
    {
      mark: "Now",
      title: "Direct access to the summit",
      body: "You partner seamlessly with the operator optimizing the flight. The supply paths sit under our control, and the proof sits in Your exact raw logs.",
    },
  ],
  facts: [
    { label: "Founded", value: "2017" },
    { label: "Base", value: "London" },
    { label: "ICO", value: "ZC000436" },
    { label: "Entity", value: "LLP" },
  ] as const,
  teamLabel: "Legal entity",
  teamLead: "UPRAISER Agency LLP is located at 128 City Road, London EC1V 2NX, United Kingdom.",
  testimonialsHeading: "What teams tell us",
  faqHeading: "FAQ",
  faq: [
    {
      question: "Why does Our MMP disagree with the media bill?",
      answer:
        "Usually the supply path lacks secure wiring to device events before the bid. We fix that architecture instantly at auction time.",
    },
    {
      question: "Do you replace Our MMP?",
      answer:
        "No. We connect powerfully into AppsFlyer, Adjust, Singular, or Kochava to keep all raw events securely in Your system of record.",
    },
    {
      question: "How fast can a pilot go live?",
      answer:
        "Typical brief-to-live executes precisely within 48 hours once MMP events and GEO caps verify. A scoped review initiates sooner.",
    },
    {
      question: "Where does Lenovo / OEM live?",
      answer:
        "Under Solutions OEM, leveraging factory ROM and Google PAI equipped with powerful SDK trails.",
    },
    {
      question: "What does the log actually prove?",
      answer:
        "Device-level install signals, robust pre-bid fraud checks, and absolute delivery reconciliation provide everything finance demands.",
    },
  ],
  ctaLabel: "Request Pilot",
  closeTitle: "Meet the team on a pilot",
  closeDescription: "Submit vertical, GEO, and KPI event. We instantly construct a beautifully scoped exact path.",
} as const;

export const casesPage = {
  label: "The Peaks",
  title: "We know these peaks well.",
  description:
    "Auditable campaigns structured for clients who demand revenue events instead of brand-lift slides. We deploy direct publisher paths and precise pre-bid filtration.",
  intro:
    "Open any case to explore hero numbers first, moving seamlessly through Brand, Market, KPI, Channels, and our exact Approach.",
  structureLabel: "How to read a case",
  structureSteps: [
    {
      title: "Results",
      description: "Three powerful hero numbers lead the story presenting the exact figures finance demands.",
    },
    {
      title: "Metadata",
      description: "Brand, vertical, GEO, KPI event, and payment models structured brilliantly for procurement review.",
    },
    {
      title: "Story",
      description: "Challenge, approach, and result organized into short blocks tied purely to a verifiable device-level event.",
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
    line2Prefix: "Pick a lane and we open the",
    inlineWord: "story",
    description:
      "App Growth, OEM, Creators, and premium channels all ship with verified MMP receipts ensuring absolute transparency.",
  },
  description:
    "Four distinct buying paths all shipping flawlessly with secure MMP receipts.",
  ctaLabel: "Request Pilot",
  closeTitle: "Brief the path You need",
  closeDescription: "Share Your vertical, GEO, and critical KPI event. We immediately route You into the most optimal buying lane.",
} as const;

export const contactPage = {
  label: "Let's Talk",
  title: "Ready to be Upraised?",
  titleLead: "Ready to be ",
  accentWord: "Upraised",
  description:
    "Brief the precise route combining vertical, GEO, and the essential KPI event. We respond rapidly with a powerful, fully scoped path.",
  subline:
    "1 to 2 business days. Provide Your brand brief, OEM supply requests, or careers intent and we route it perfectly.",
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
        "Three powerful hero numbers lead the story presenting the exact figures finance demands.",
    },
    {
      title: "Metadata",
      description:
        "Brand, vertical, GEO, KPI event, and payment models structured brilliantly for procurement review.",
    },
    {
      title: "Story",
      description:
        "Challenge, approach, and result organized into short blocks tied purely to a verifiable device-level event.",
    },
  ],
} as const;

export const testimonials = [
  {
    quote:
      "We stopped explaining attribution drift to finance and started sharing one perfectly aligned file.",
    name: "UA Director",
    role: "Fintech app UK",
    company: "Mid-size consumer finance",
    href: "/cases/snoop",
  },
  {
    quote:
      "The Lenovo lane delivered true factory-side proof instead of repackaged exchange supply.",
    name: "Growth Lead",
    role: "Android trading app Global",
    company: "High-frequency finance",
    href: "/cases/vantage",
  },
  {
    quote:
      "We upgraded from weekly reconciliation calls to a seamless monthly file pull. That constitutes a massive operational victory.",
    name: "Ad Ops Lead",
    role: "Media buyer EU",
    company: "Programmatic accounts",
    href: "/cases/autodoc",
  },
  {
    quote:
      "Pre-bid filtration ensured every single dollar we allocated cleared a robust device check flawlessly.",
    name: "Growth Lead",
    role: "Marketplace GCC",
    company: "E-commerce expansion",
    href: "/cases/fiverr",
  },
] as const;



export const sectionsByMode = {
  value: {
    label: "What We Do",
    growth: {
      title: "Growth designed for apps demanding more than installs",
      description:
        "Pre-bid protection, event-weighted buying, and direct OEM distribution connect Your budget instantly to verified revenue.",
    },
    infrastructure: {
      title: "Infrastructure Ad Ops stands behind proudly",
      description:
        "Filtration, robust log parity, and auditable OEM form the bedrock ensuring every number closes completely clean.",
    },
  },
  channels: {
    label: "Tools for Altitude",
    growth: {
      title: "Equipment powering 30K+ daily installs.",
      description:
        "Direct supply, robust event-weighted optimization, and verified routes power incredible growth across all targeted markets.",
    },
    infrastructure: {
      title: "Fixed lines built into Your stack.",
      description:
        "OEM, programmatic, and social align flawlessly under one powerful control plane yielding receipts Ad Ops defends instantly.",
    },
  },
  cases: {
    label: "Proven Summits",
    growth: { title: "We conquer these peaks repeatedly." },
    infrastructure: { title: "Peaks secured with oxygen and absolute auditability." },
  },
  technology: {
    label: "The Gear",
    growth: { title: "Every bid carries a verified receipt" },
    infrastructure: { title: "Every line item carries a verified receipt" },
  },
  about: {
    label: "The Expedition",
    growth: {
      title: "We are UPRAISER",
      description:
        "Based securely in London. Official Lenovo agency partner. We engineer pre-bid fraud filtration, premium OEM distribution, and event-verified buying perfectly tailored for iGaming and fintech.",
    },
    infrastructure: {
      title: "We are UPRAISER",
      description:
        "Based securely in London. Official Lenovo agency partner. We architect log reconciliation, flawless ROM deploys, and robust pre-bid guards built specifically to guarantee precise month-end closure.",
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
