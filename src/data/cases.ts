export interface CaseStudy {
  id: string;
  client: string;
  category: string;
  headline: string;
  overview: string;
  channels: string[];
  challenges: string[];
  approach: string[];
  results: { value: string; label: string }[];
  /** Normalized trend points for sparkline visualization */
  trend: number[];
  outcome: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "fanatics",
    client: "Fanatics",
    category: "iGaming",
    headline: "Compliant sportsbook growth at scale",
    overview:
      "We scaled paid acquisition for a real-money sportsbook and casino app across iOS and Android — with strict 18+ compliance and state-level regulatory requirements.",
    channels: ["Programmatic", "High-intent display", "Behavioral targeting"],
    challenges: [
      "Differentiated positioning in a promo-saturated market",
      "Geo and age compliance across regulated US states",
      "Driving quality bettors, not vanity install volume",
    ],
    approach: [
      "Curated whitelist of verified, age-gated inventory",
      "Continuous creative and messaging tests on high-intent placements",
      "Daily bid and budget tuning against deposit and LTV signals",
      "Segmentation by sports vs. casino user intent",
    ],
    results: [
      { value: "8,000", label: "Verified installs" },
      { value: "500", label: "First-time deposits" },
      { value: "$250K+", label: "Revenue attributed" },
      { value: "7+", label: "Extra bets per active user" },
    ],
    trend: [20, 26, 32, 38, 44, 50, 56, 62, 68, 74, 80, 86],
    outcome: "Scaled acquisition while keeping fraud at zero and compliance intact across regulated markets.",
  },
  {
    id: "snoop",
    client: "Snoop",
    category: "Fintech",
    headline: "CTV-driven installs with deep activation",
    overview:
      "For a UK budget-planning app, we built a connected-TV strategy focused on installs and the critical post-install step: linking a bank account.",
    channels: ["CTV / Roku", "Performance UA", "Full-funnel optimization"],
    challenges: [
      "Breaking through noise in UK personal finance",
      "Moving users from install to account connection",
      "Maintaining efficient CPA on a premium funnel event",
    ],
    approach: [
      "Roku TV campaigns timed to peak viewing windows",
      "Creative and placement tests aligned with UK audience behavior",
      "Weekly performance reviews and targeting refinements over four months",
      "Post-install messaging strategy to lift account-link rates",
    ],
    results: [
      { value: "14,308", label: "Installs" },
      { value: "4,580", label: "Accounts connected" },
      { value: "32%", label: "Install-to-connect rate" },
      { value: "4 mo", label: "Sustained growth window" },
    ],
    trend: [8, 9, 11, 13, 16, 21, 28, 38, 52, 66, 78, 90],
    outcome: "Proved CTV can drive both reach and meaningful downstream activation — not just top-of-funnel volume.",
  },
  {
    id: "vantage",
    client: "Vantage",
    category: "Fintech",
    headline: "OEM-powered trading app acquisition",
    overview:
      "We leveraged Lenovo OEM inventory to grow first-time deposits for an Android trading app in competitive fintech markets.",
    channels: ["OEM pre-install", "Lenovo Ad Exchange", "Event-based CPA"],
    challenges: [
      "Standing out in a crowded trading app category",
      "Scaling FTDs without inflating acquisition costs",
      "Sustaining engagement after the install",
    ],
    approach: [
      "Distribution via Lenovo exchange and premium direct supply",
      "Campaigns optimized around deposit and FTD events, not CPI alone",
      "Rapid geo and device-model targeting — live in 1–2 days",
      "Post-install activation workflows tied to revenue events",
    ],
    results: [
      { value: "800+", label: "First-time deposits" },
      { value: "$150+", label: "Average user value" },
      { value: "120+", label: "Markets reached" },
      { value: "1–2 days", label: "Typical launch time" },
    ],
    trend: [14, 15, 16, 17, 18, 20, 52, 60, 68, 76, 86, 94],
    outcome: "Delivered high-value traders through OEM channels where standard programmatic alone underperforms.",
  },
  {
    id: "wsj",
    client: "Wall Street Journal",
    category: "Media",
    headline: "High-intent subscribers at target CPA",
    overview:
      "We ran performance campaigns for a leading US financial news app — prioritizing paid subscriptions over raw install volume.",
    channels: ["Native & editorial", "Finance-intent inventory", "CPA optimization"],
    challenges: [
      "High competition and rising CPAs in financial media",
      "Converting installs into paying subscribers",
      "Finding inventory that matches brand and compliance standards",
    ],
    approach: [
      "Placements on business, finance, and news environments with proven purchase intent",
      "Strict inventory filtering against CPA and quality thresholds",
      "Continuous media-mix testing and budget reallocation from live data",
    ],
    results: [
      { value: "3,000", label: "New purchases / month" },
      { value: "16,515", label: "Installs in period" },
      { value: "650", label: "Purchase events tracked" },
      { value: "On-target", label: "CPA vs. goal" },
    ],
    trend: [24, 32, 38, 42, 41, 43, 46, 54, 63, 72, 82, 91],
    outcome: "Consistent subscription volume at scale while protecting unit economics in a premium vertical.",
  },
];
