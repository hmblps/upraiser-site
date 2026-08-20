export interface CaseMetric {
  value: string;
  label: string;
}

export interface CaseBrand {
  icon: string;
  accent: string;
  surface: string;
}

export interface CaseFocus {
  challenge: string;
  approach: string;
  result: string;
}

export interface CaseStudy {
  id: string;
  client: string;
  vertical: string;
  paymentModel: string;
  geos: string;
  kpiEvent: string;
  headline: string;
  channels: string[];
  brand: CaseBrand;
  metrics: [CaseMetric, CaseMetric, CaseMetric];
  trend: number[];
  growthFocus: CaseFocus;
  optimizationFocus: CaseFocus;
}

export const CASE_TREND_CAPTION = "12-week volume index";

export function getCaseById(id: string): CaseStudy | undefined {
  return caseStudies.find((item) => item.id === id);
}

export const caseStudies: CaseStudy[] = [
  {
    id: "fanatics",
    client: "Fanatics",
    vertical: "iGaming",
    paymentModel: "CPI",
    geos: "US legal states",
    kpiEvent: "FTD",
    headline: "Compliant sportsbook scale with verified device activation trails",
    channels: ["Programmatic", "High-intent display", "Behavioral targeting"],
    brand: {
      icon: "/cases/logos/fanatics.png",
      accent: "#E31837",
      surface: "#1a0508",
    },
    metrics: [
      { value: "$25M+", label: "Revenue" },
      { value: "50K", label: "FTDs" },
      { value: "800K", label: "Installs" },
    ],
    trend: [22, 28, 34, 40, 46, 52, 58, 64, 70, 76, 82, 88],
    growthFocus: {
      challenge: "Real-money sportsbook in a bonus-saturated US market. Required strict MMP tracking and S2S postbacks without breaching 18+ or state geo rules.",
      approach: "Whitelisted adult inventory with sub-second latency limits, state-level targeting, and creative QA tied directly to FTD payload instead of install volume.",
      result: "800K installs, 50K FTDs, $25M+ revenue. Seven additional bets per bettor. $500+ revenue per FTD on average.",
    },
    optimizationFocus: {
      challenge: "TikTok and Snapchat off-limits for 18+ gaming. Every placement needed a compliance receipt and clean event mapping.",
      approach: "Geo-compliant whitelists only. Daily placement audit and SDK postback validation before spend cleared your cap.",
      result: "Zero disputed inventory at month-end. MMP logs, server events, and UA data aligned into one auditable record per state.",
    },
  },
  {
    id: "block-blast-pai",
    client: "Block Blast",
    vertical: "Gaming",
    paymentModel: "CPI",
    geos: "WW · 15 GEOs",
    kpiEvent: "Install",
    headline: "Factory-side pre-install at global daily scale",
    channels: ["OEM Pre-install", "PAI", "CPI"],
    brand: {
      icon: "/cases/logos/block-blast.png",
      accent: "#7C3AED",
      surface: "#1a1030",
    },
    metrics: [
      { value: "32K+", label: "Daily installs" },
      { value: "0%", label: "Attribution drift" },
      { value: "50%", label: "Day-7 retention" },
    ],
    trend: [8, 18, 32, 48, 58, 66, 72, 78, 84, 90, 95, 100],
    growthFocus: {
      challenge: "Puzzle title needed global CPI scale and post-install quality retention.",
      approach: "Lenovo PAI worldwide. Retention floors (D1 40%, D7 25%, D30 10%) gated every bid increase.",
      result: "32,000+ daily installs across PL, UK, DE and 12 more GEOs. D1 ROAS 20%, D7 retention 50%.",
    },
    optimizationFocus: {
      challenge: "Open-exchange ambiguity on factory installs. Finance needed package-level proof.",
      approach: "Every install tied to factory log. Low-retention cohorts cut before MMP ingest.",
      result: "MMP counts matched Lenovo delivery. Zero fraud or retention surprises at invoice.",
    },
  },
  {
    id: "fiverr",
    client: "Fiverr",
    vertical: "Marketplace",
    paymentModel: "CPI",
    geos: "KW · SA · AE",
    kpiEvent: "Install",
    headline: "GCC app scale after US proof-of-concept",
    channels: ["Programmatic", "Gaming vertical", "Creative testing"],
    brand: {
      icon: "/cases/logos/fiverr.png",
      accent: "#1DBF73",
      surface: "#081a12",
    },
    metrics: [
      { value: "1B+", label: "Impressions" },
      { value: "10M", label: "Clicks" },
      { value: "0.2%", label: "CVR" },
    ],
    trend: [30, 32, 34, 36, 38, 42, 50, 58, 66, 74, 82, 90],
    growthFocus: {
      challenge: "Freelance marketplace expanding into Kuwait, Saudi Arabia, and UAE. New cultures and new CPI baselines.",
      approach: "Tested 20 platforms per geo and locked top three performers. Gaming-industry creatives for freelancer demand.",
      result: "Generated 1B+ impressions with perfect ledger reconciliation. Volumes and user quality exceeded initial geo benchmarks.",
    },
    optimizationFocus: {
      challenge: "US performance data misled early GCC bids. Conversion rates looked fine until geo-native tests ran.",
      approach: "Geo-specific platform whitelists. Creative variants targeted gaming and pro-services segments separately.",
      result: "Platform-level CVR proof per geo before caps increased. Eliminated cross-region budget bleed.",
    },
  },
  {
    id: "shopee",
    client: "Shopee",
    vertical: "Marketplace",
    paymentModel: "CPI",
    geos: "PH · BR",
    kpiEvent: "OrderPlaced",
    headline: "Install-to-order funnel across SEA and LATAM",
    channels: ["App Growth", "In-App", "OEM"],
    brand: {
      icon: "/cases/logos/shopee.png",
      accent: "#EE4D2D",
      surface: "#2a0f0a",
    },
    metrics: [
      { value: "7.2%", label: "Order rate · PH" },
      { value: "250K+", label: "Installs · PH" },
      { value: "10.7%", label: "Order rate · BR" },
    ],
    trend: [35, 38, 40, 42, 44, 45, 46, 52, 60, 68, 75, 82],
    growthFocus: {
      challenge: "Marketplace UA prioritizing Register and OrderPlaced over raw install CPI via granular MMP postbacks.",
      approach: "Caps tied to OrderPlaced on com.shopee.ph and com.shopee.br. Funnel event latency minimized in the bid loop.",
      result: "PH: 250K+ installs, 22% register, 7.2% order rate. BR: 80K+ installs, 10.7% order rate.",
    },
    optimizationFocus: {
      challenge: "750K+ conversions on PH required bot and hijacking mitigation via SDK checks to protect billing.",
      approach: "Pre-bid filter on reject_bots, reject_install_hijacking, reject_ctit_anomalies against MMP logs.",
      result: "Bad installs cut before cap cleared. Defensible 0.08% CVR on high-volume PH traffic.",
    },
  },
  {
    id: "banco-azteca",
    client: "Banco Azteca",
    vertical: "Fintech",
    paymentModel: "Programmatic",
    geos: "MX",
    kpiEvent: "ROAS",
    headline: "Programmatic ROAS on full portfolio sales in Mexico",
    channels: ["DSP", "Programmatic", "Creative optimization"],
    brand: {
      icon: "/cases/logos/banco-azteca.png",
      accent: "#00843D",
      surface: "#061a0e",
    },
    metrics: [
      { value: "500%", label: "ROAS · month 10" },
      { value: "200%", label: "ROAS · month 6" },
      { value: "MX", label: "Market" },
    ],
    trend: [20, 24, 28, 32, 38, 46, 55, 64, 72, 80, 88, 94],
    growthFocus: {
      challenge:
        "Retail bank in Mexico needed to acquire users and cross-sell across its full product portfolio. Long-term MAU ambition required near-term proof on ROAS via DSP logs.",
      approach:
        "Segment-level creative via programmatic DSPs. Spend dynamically concentrated on best-performing SSP placements through algorithmic bidding optimization.",
      result:
        "Verified 200% ROAS by month six and 500% ROAS by month ten. Portfolio sales and awareness scaled independently of vanity MAU numbers based on server-side event pings.",
    },
    optimizationFocus: {
      challenge:
        "Financial inclusion audiences span wide segments. Generic creatives burn reach and distort ROAS by cohort unless mapped strictly in the MMP.",
      approach:
        "Personalized promotion per segment. Placement-level ROAS gates verified via S2S postbacks before budget cleared each week.",
      result:
        "Every creative asset ranked by verified ROAS. Finance traced spend to specific placement IDs and postback payloads instead of blended averages.",
    },
  },
  {
    id: "azar",
    client: "Azar",
    vertical: "Social",
    paymentModel: "CPE",
    geos: "UK · DE · FR · ES",
    kpiEvent: "Install",
    headline: "TikTok creator scale for organic install quality",
    channels: ["TikTok", "Influencer", "UGC"],
    brand: {
      icon: "/cases/logos/azar.png",
      accent: "#FF4D6D",
      surface: "#1a0810",
    },
    metrics: [
      { value: "150M+", label: "Impressions" },
      { value: "1.2M", label: "Interactions" },
      { value: "180", label: "Creators" },
    ],
    trend: [10, 12, 14, 18, 28, 42, 58, 68, 78, 86, 92, 97],
    growthFocus: {
      challenge: "Match Group video-chat app needed EU brand lift and quality organic installs.",
      approach: "180 macro/mid/micro creators across UK, DE, FR, ES, NL, IT. #funwithazar on TikTok over three months.",
      result: "150M+ impressions, 1.2M interactions, 1.1M likes. Organic download quality improved in target GEOs.",
    },
    optimizationFocus: {
      challenge: "Creator campaigns bleed budget when content formats lack tracking to install cohorts.",
      approach: "Platform mix scored by engagement quality. Underperforming creator tiers cut mid-flight.",
      result: "Every creator line item mapped to reach and interaction logs. Eliminated black-box influencer spend.",
    },
  },
  {
    id: "vantage",
    client: "Vantage",
    vertical: "Fintech",
    paymentModel: "CPI",
    geos: "Global · OEM",
    kpiEvent: "deposit_crm_ftd",
    headline: "Lenovo OEM traffic into first-time deposits",
    channels: ["Lenovo Exchange", "OEM Pre-install", "CPI"],
    brand: {
      icon: "/cases/logos/vantage.png",
      accent: "#F97316",
      surface: "#0a2e2a",
    },
    metrics: [
      { value: "15K+", label: "FTDs" },
      { value: "$150+", label: "Avg user value" },
      { value: "1–2d", label: "Go-live" },
    ],
    trend: [18, 20, 22, 24, 26, 28, 30, 32, 58, 68, 78, 85],
    growthFocus: {
      challenge: "Android trading app in a crowded market needed FTDs over anonymous install volume mapped strictly via MMP.",
      approach: "Lenovo Exchange OEM lanes. deposit_crm_ftd wired into the algorithmic bid via S2S postbacks before caps cleared.",
      result: "15K+ FTDs at $150+ average user value. Live in 1–2 days via factory-side distribution and clean API handshakes.",
    },
    optimizationFocus: {
      challenge: "OEM supply spans 120+ GEOs. Bad cohorts required algorithmic filtering from open-exchange lanes based on latency and CVR.",
      approach: "Model-level targeting. Event parity on deposit_crm_ftd and watch_amount_click pre-flight verified through SDK audits.",
      result: "Maintained absolute alignment between Lenovo delivery and dashboard reporting at month-end via deterministic tracking.",
    },
  },
  {
    id: "snoop",
    client: "Snoop",
    vertical: "Fintech",
    paymentModel: "CPI",
    geos: "UK",
    kpiEvent: "first_account_connected",
    headline: "CTV installs with post-install account activation",
    channels: ["CTV", "Roku", "Retargeting"],
    brand: {
      icon: "/cases/logos/snoop.png",
      accent: "#0E7C86",
      surface: "#0c2a2e",
    },
    metrics: [
      { value: "150K+", label: "Installs" },
      { value: "45K+", label: "Accounts linked" },
      { value: "32%", label: "Activation rate" },
    ],
    trend: [12, 13, 14, 15, 17, 21, 28, 40, 58, 72, 86, 96],
    growthFocus: {
      challenge: "UK finance app on iOS. Installs were cheap, but account connections remained the critical KPI.",
      approach: "Roku CTV at peak viewing windows. Retargeted post-install prompts for first_account_connected.",
      result: "150K+ installs and 45K+ account links over four months. Activation rate held above 30%.",
    },
    optimizationFocus: {
      challenge: "CTV waste in non-UK regions inflates CPI without moving activation.",
      approach: "UK geo concentration enforced. Activation event mapped in MMP before cap went live.",
      result: "150K+ UK installs with a clean activation trail. Month-end matched the Roku delivery log.",
    },
  },
  {
    id: "autodoc",
    client: "AutoDoc",
    vertical: "E-commerce",
    paymentModel: "CPI",
    geos: "EU · 5 markets",
    kpiEvent: "af_purchase",
    headline: "Purchase events at CPI scale across the EU",
    channels: ["App Growth", "CPI", "Programmatic"],
    brand: {
      icon: "/cases/logos/autodoc.png",
      accent: "#F97316",
      surface: "#1c1208",
    },
    metrics: [
      { value: "25K+", label: "Daily installs" },
      { value: ">2%", label: "Purchase / install" },
      { value: "5", label: "EU markets" },
    ],
    trend: [25, 30, 38, 45, 50, 54, 58, 62, 68, 74, 80, 86],
    growthFocus: {
      challenge: "Automotive parts marketplace requiring scale on revenue events instead of proxy clicks.",
      approach: "EU CPI with purchase/install floor >2%. af_purchase and af_add_to_cart in the bid loop.",
      result: "25K+ daily installs across UK, FR, ES, IT, DE. ROAS tied directly to checkout.",
    },
    optimizationFocus: {
      challenge: "AppsFlyer classic attribution had to match invoice lines on adxreportwa_int.",
      approach: "af_search through af_purchase mapped pre-flight. Weekly reconciliation cadence.",
      result: "Purchase trail auditable on demand. Month-end reporting executed flawlessly.",
    },
  },
];

export function getPrimaryMetric(study: CaseStudy): CaseMetric {
  return study.metrics[0];
}
