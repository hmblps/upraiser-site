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
  { value: "brand", label: "Brand Partnership" },
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
  growth: "We run global performance campaigns requiring absolute attribution proof. We manage Your media spend across direct OEM and programmatic exchanges.",
  infrastructure: "We build transparent trading infrastructure delivering absolute attribution proof. We verify Your media spend through raw device logs and direct OEM integrations.",
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
    { value: "97.3%", label: "Fraud Blocked Pre-Bid" },
    { value: "0%", label: "Post-Flight Log Drift" },
    { value: "0.4ms", label: "p99 Bid Scoring" },
    { value: "180+", label: "Device Signals" },
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
      "You are the user acquisition lead or marketing director who needs to scale active player bases without breaking unit economics. Your campaigns target deep in-app conversions, from level completions to first deposits. We buy media based on real player lifetime value, deploying on-demand Creator-Generated Content (CGC) that out-converts static banner ads. We scale only the routes that deliver real revenue.",
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
      "You are the Ad Ops manager, finance controller, or UA director who has explained attribution drift to stakeholders too many times. Your programmatic and OEM campaigns run on Adjust, AppsFlyer, Singular, or Kochava. You require a direct supply path where every KPI event traces back to a raw device log. We leave opaque PDF reporting to traditional vendors. We build clean, verified supply lines so You can defend Your media spend in any financial review.",
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
      badge: "Official Lenovo Agency Partner",
      title: "Direct factory pre-installs at global daily scale.",
      description: "We place Your application directly onto premium Android devices at the moment of first activation. As an official Lenovo agency partner, we secure pre-installs and Pre-Activated Install (PAI) campaigns across Tier-1, GCC, and global markets. Your team secures direct, factory-level placement with zero reseller markups.",
    },
  },
  infrastructure: {
    hero: {
      kicker: "Log-native buying",
      title: "Verify the event Your board tracks",
      description:
        "Server logs wire directly to Adjust and AppsFlyer before the month closes, ensuring absolute alignment with Your data.",
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
      badge: "Official Lenovo Agency Partner",
      title: "Procurement-grade OEM access backed by certified SDK trails.",
      description: "We wire Lenovo ROM and PAI lanes directly to Your Adjust, AppsFlyer, Singular, or Kochava endpoints. Our engineers document and verify the entire technical trail before we buy the first impression. You audit the raw hardware logs to verify every installation before You pay the invoice.",
    },
  },
} satisfies Record<SiteMode, unknown>;

export const promiseByMode = {
  growth: {
    label: "Raw logs Your team can audit on demand",
    title: "Our Commitment",
    scrollHeroWord: "PARITY",
    line1: "We match every media invoice line item directly against raw device logs.",
    line2Prefix: "We guarantee",
    inlineWord: "PARITY",
    titleLead: "We guarantee ",
    accentWord: "PARITY",
    description:
      "Your team can pull and verify Your dataset at any time. Our raw log validation resolves attribution disputes before Your traders open the flight. We provide raw logs, real-time reconciliation, and pre-bid filtration so Your media buyers and finance directors work with the same data. Your reconciliation process remains completely clean.",
  },
  infrastructure: {
    label: "Raw logs Your team can audit on demand",
    title: "Our Commitment",
    scrollHeroWord: "PARITY",
    line1: "We match every media invoice line item directly against raw device logs.",
    line2Prefix: "We guarantee",
    inlineWord: "PARITY",
    titleLead: "We guarantee ",
    accentWord: "PARITY",
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
      tagline: "First-activation pre-installs on direct factory ROMs.",
      teaser: "Launch campaigns on new Android devices at the moment of first activation.",
      description: "We place Your app directly onto premium global Android devices during manufacturing. Your app launches on the first device setup, capturing high-intent users during their initial device configuration.",
      bestFor: "Direct Access · Factory ROM · Verified Logs",
      points: ["Lenovo agency partner", "Pre-installs", "SDK trails"]
    },
    {
      id: "programmatic",
      title: "Programmatic Media Buying",
      tagline: "Event-optimized campaigns across premium global exchanges.",
      teaser: "Target high-spending audiences using predictive event optimization.",
      description: "Our demand-side platform (DSP) optimizes bidding in real time, focusing spend on users predicted to complete registrations, make first deposits (EFTD), or complete in-game transactions.",
      bestFor: "Curated Exchanges · ROI Focus · Event Optimization",
      points: ["Predictive optimization", "Downstream events", "Lifetime value bidding"]
    },
    {
      id: "performance",
      title: "CGC Studio & Paid Distribution",
      tagline: "Creator-Generated Content built to convert complex verticals.",
      teaser: "Convert user attention into measurable revenue using authentic creators.",
      description: "Our creative studio produces high-performance video assets specifically for competitive niches (iGaming, Fintech). We test hundreds of hooks and scale paid distribution across TikTok, YouTube, and Meta.",
      bestFor: "Authentic Creators · iGaming & Fintech · Measurable Revenue",
      points: ["Algorithmic distribution", "High-volume testing", "LTV scaling"]
    }
  ],
  infrastructure: [
    {
      id: "oem",
      title: "OEM & On-Device Discovery",
      tagline: "Vetted PAI lanes with verified hardware-level receipts.",
      teaser: "Audit every factory pre-install down to the raw hardware log.",
      description: "We secure direct Lenovo ROM and PAI lanes with certified SDK trails. We bypass intermediate ad networks, allowing Your developers to verify installation footprints directly from device hardware logs.",
      bestFor: "Absolute Compliance · Raw Hardware Logs · SDK Trails",
      points: ["Lenovo ROM & PAI", "Adjust/AppsFlyer endpoints", "Resale fraud protection"]
    },
    {
      id: "programmatic",
      title: "Programmatic Media Buying",
      tagline: "Pre-bid fraud filtration executed in 0.4 milliseconds.",
      teaser: "Filter out bot traffic in 0.4 milliseconds before the bid occurs.",
      description: "Our proprietary scoring engine analyzes 180 device signals in 0.4 milliseconds, blocking bot traffic before the bid occurs. We maintain a vetted supply path, protecting Your programmatic budget from spoofed inventory.",
      bestFor: "Clean Supply Path · 0.4ms Filtration · Transparent Data",
      points: ["180 device signals", "Direct exchange safelist", "Ledger matching"]
    },
    {
      id: "performance",
      title: "CGC Studio & Paid Distribution",
      tagline: "Traceable creative performance mapped to install receipts.",
      teaser: "Connect every visual asset to a raw device receipt.",
      description: "We treat creative production as data science. Our traders trace every creative asset directly to Your raw install logs, showing You which specific video variation generates real lifetime value.",
      bestFor: "Data Science · Install Logs · Ad Dollar Tracing",
      points: ["Raw device receipts", "Performance mapping", "Ledger verification"]
    }
  ],
} satisfies Record<SiteMode, unknown>;

export const processByMode = {
  growth: [
    {
      step: "01",
      title: "Map the Funnel",
      description:
        "Our traders define Your target audience, map Your down-funnel KPI events, and establish Your target acquisition cost.",
    },
    {
      step: "02",
      title: "Deploy the Mix",
      description:
        "We launch a custom mix of direct OEM pre-installs, event-weighted programmatic buying, and native creator content.",
    },
    {
      step: "03",
      title: "Scale the Flight",
      description:
        "Our creative studio produces video variations weekly. We scale only the assets and traffic routes that drive positive ROAS.",
    },
  ],
  infrastructure: [
    {
      step: "01",
      title: "Map the Stack",
      description:
        "Our operators document Your MMP endpoints, raw log pipelines, and fraud vectors before we launch Your campaigns.",
    },
    {
      step: "02",
      title: "Connect and Wire",
      description:
        "We connect raw device logs directly to Your measurement endpoints, verifying reconciliation before buying the first impression.",
    },
    {
      step: "03",
      title: "Deploy and Monitor",
      description:
        "We launch programmatic and OEM lanes with verified SDK compliance. Our continuous monitoring prevents attribution drift.",
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
  title: "We helped shape the mobile advertising terrain.",
  chapter: {
    scrollHeroWord: "ASCENT",
    line1: "We helped shape the mobile advertising terrain.",
    line2Prefix: "We brought together operators from",
    inlineWord: "different technical worlds",
    description:
      "Upraiser operates from our basecamp in London. In 2017, we brought together operators from different technical worlds to form this performance desk. Our crew includes systems engineers, software developers, financial economists, and conversion creatives. Each operator built proprietary tools and managed traffic pipelines within the AdTech industry. This convergence of disciplines is our strength.",
  },
  positioningLead: "Built from logs.",
  positioningAccent: "Built for trust.",
  description:
    "London-based performance boutique. We execute and reconcile mobile growth so Ad Ops and finance share one file.",
  storySegments: [
    {
      mark: "Convergence",
      title: "Expertise from four disciplines working as one crew",
      body: "We exclude account managers and client-service layers to keep Your path direct. When You partner with Upraiser, You work with the operators who built Your tracking gear and trade Your media budgets.\n\nOur systems engineers write the pre-bid scoring engines. Our software developers maintain the SDK log tracing. Our economists balance Your unit economics. Our creatives design the visual hooks. This synergy allows us to see the data terrain with clarity. Your UA and finance teams sign off on the same numbers before the invoice is issued.",
    },
    {
      mark: "Terrain",
      title: "We helped shape the rules of this industry from its early days",
      body: "We choose direct, verified pathways over public exchanges and crowded bidding auctions. Our early work in AdTech allowed us to build custom data verification methods from the ground up. Because we understand how fraud vectors and attribution systems operate, we designed our own pre-bid scoring engine.\n\nWe built the pipelines that connect raw log files to Your measurement endpoints. We did not wait for the industry to offer transparency. We built our own verification tools to guarantee it.",
    },
    {
      mark: "Code",
      title: "Data transparency and voluntary compliance by design",
      body: "Technical precision requires trust. Upraiser follows the European Digital Advertising Alliance guidelines. We exclude summarized PDF charts that hide discrepancies.\n\nWe provide raw, unedited device logs on demand so Your team can verify every install back to a physical device. Your accounting ledger matches Your media invoice to the penny.",
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
      question: "Is Upraiser built to support in-house media teams?",
      answer:
        "Yes. We empower Your in-house team. We do not take ownership away from Your operators. We wire the SDK trails and clear the data pipelines so Your team can execute campaigns on clean, audit-ready logs. We secure the lines and ensure the data pipeline matches Your tracking platform perfectly.",
    },
    {
      question: "How does Upraiser ensure zero-drift data transparency?",
      answer:
        "We audit Your MMP endpoints and align log pipelines before going live. Every campaign matches Your MMP data to the penny. By verifying attribution at bid-time, we guarantee 0% post-flight log drift. Your finance directors and UA traders always read the same invoice.",
    },
    {
      question: "How do You block mobile fraud before the bid happens?",
      answer:
        "Our proprietary pre-bid scoring engine analyzes 180 device signals in 0.4 milliseconds. We filter out the fraudulent traffic at the source, ensuring You never pay for bot installations.",
    },
    {
      question: "What is CGC and how does it fit into Your routes?",
      answer:
        "Creator-Generated Content (CGC) is a performance asset. We source authentic creator media and amplify it across programmatic, social, and OEM routes. Our traders trace every creative asset down to the raw install log, optimizing for user LTV instead of simple clicks.",
    },
    {
      question: "Are You a SaaS tool or a full-spectrum performance desk?",
      answer:
        "We are a premium boutique performance desk. We write the code, wire the pipelines, and buy the media. You work directly with the operators who built Your gear and trade Your budgets. No account managers, no black boxes.",
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
  label: "The Routes",
  title: "We build four buying paths.",
  chapter: {
    scrollHeroWord: "PATHS",
    line1: "We build four buying paths.",
    line2Prefix: "Every path ships one",
    inlineWord: "reconciliation file",
    description:
      "App Growth, OEM, Creators, and programmatic channels operate on verified MMP receipts ensuring absolute transparency.",
  },
  description:
    "App Growth, OEM, Creators, and programmatic channels operate on verified MMP receipts ensuring absolute transparency.",
  ctaLabel: "Request Pilot",
  closeTitle: "Brief the path You need",
  closeDescription: "Share Your vertical, GEO, and critical KPI event. We immediately route You into the most optimal buying lane.",
} as const;

export const contactPage = {
  label: "[ Upraiser Briefing Room ]",
  title: "Intake & Pilot Briefing",
  titleLead: "Intake & Pilot ",
  accentWord: "Briefing",
  description:
    "Provide Your production parameters. Our operators review Your application and configure Your data pipelines within 24 hours. We bypass generic sales funnels to establish direct partner alignment.",
  subline:
    "1 to 2 business days. Provide Your brand brief, OEM supply requests, or careers intent and we route it perfectly.",
  office: "128 City Road, London EC1V 2NX, United Kingdom",
  email: "info@upraiser.co.uk",
  ctaLabel: "[ START ASCENT ]",
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
      "We upgraded from weekly reconciliation calls to a direct monthly file pull. That constitutes a massive operational victory.",
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
      title: "Infrastructure designed for teams demanding more than installs",
      description:
        "Pre-bid filtration, robust log parity, and direct OEM distribution secure Your budget instantly against ad fraud.",
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
      title: "Equipment powering transparent media buying.",
      description:
        "Direct supply, robust pre-bid filtration, and verified routes secure incredible performance across all targeted markets.",
    },
  },
  cases: {
    label: "Proven Summits",
    growth: { title: "We conquer these peaks repeatedly." },
    infrastructure: { title: "We secure these peaks repeatedly." },
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
        "Based securely in London. Official Lenovo agency partner. We architect log reconciliation, direct ROM deploys, and robust pre-bid guards perfectly tailored for transparent media buying.",
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
