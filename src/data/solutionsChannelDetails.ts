import type { SiteMode } from "./liveContent";

export type SolutionsChannelDetail = {
  description: string;
  points: readonly string[];
};

/** Long-form Solutions panel copy. */
export const solutionsChannelDetailsByMode = {
  growth: {
    programmatic: {
      description:
        "Programmatic Scale: Target high-spending audiences using predictive event optimization. We run programmatic campaigns across curated global exchanges, bypassing the noise of public bidding. Our system optimizes Your spend for downstream events, including level completions, registrations, and subscription renewals. We buy media based on real player lifetime value rather than cheap clicks. You achieve ROI-focused growth across premium ad networks.",
      points: [
        "100K+ app graph with behavioral bid signals like session depth and reward completion",
        "Rewarded video, interstitial, native, and rich media in one accountable mix",
        "Pre-bid fraud screen on every in-app impression before auction close",
        "Caps wired directly to downstream SDK events like first_deposit_complete and subscription_started",
        "PMP and programmatic lanes under one reconciliation file",
        "Supply chosen strictly by unit economics for Your vertical",
      ],
    },
    oem: {
      description:
        "Direct OEM Discovery: Launch campaigns on new Android devices at the moment of first activation. We deliver direct, factory-level placement across premium global devices. As an official Lenovo agency partner, we secure pre-installs and device activation campaigns with certified SDK trails. We bypass traditional resellers and competitive bidding to place Your application directly in front of new users. You scale Your user base with direct device access and verified installation logs.",
      points: [
        "Direct Lenovo ROM and Google PAI factory integrations",
        "Factory-side presence for global launches and emerging markets",
        "Device-level SDK trail from install to revenue event",
        "Pre-bid filtration on every OEM impression ensures absolute quality",
        "Operator-grade authenticity built natively into the user experience",
        "Exportable proof for regulated and enterprise procurement",
      ],
    },
    performance: {
      description:
        "CGC Media Amplification: Convert user attention into measurable revenue using authentic creators. We combine high-performing Creator-Generated Content (CGC) with algorithmic paid distribution. Our creative studio sources creators to design visual hooks tailored for competitive verticals, including iGaming and Fintech. We test hundreds of video variations and scale only the formats that convert. You watch Your average revenue per user climb.",
      points: [
        "Event-priced models tied to first_deposit_complete and subscription_started",
        "Cross-format buying across display, video, in-app, and social retargeting",
        "Pre-bid filtration before the impression clears the cap",
        "Unit economics held flat when budget scales",
        "MMP reconciliation completed seamlessly before the flight closes",
        "Creative and bid loops tied directly to revenue KPIs Your board already uses",
      ],
    },
    social: {
      description:
        "Paid social and search catch intent in motion. We map Meta, TikTok, and Google campaigns to funnel stages with same-day MMP conversion wiring. Creatives and bids iterate constantly against first_deposit_complete and subscription_started events. Our boutique agency ensures You have the exact event trail before the invoice cycle begins.",
      points: [
        "Meta, TikTok, and Google under one unified event schema",
        "Funnel-stage segments for prospecting, consideration, and conversion",
        "Same-day MMP conversion wiring for installs and deep SDK events",
        "Search CPA and paid social combined in the same reconciliation file as programmatic",
        "Creative testing loops tied directly to deposit and subscription KPIs",
        "Spend You can defend confidently in a weekly performance review",
      ],
    },
    rewarded: {
      description:
        "Rewarded traffic secures opt-in inventory where users choose to watch, play, or complete an action for in-app access. We buy rewarded video and offerwall units inside high-engagement apps based on strong completion signals. Our team weights bids by completion quality and downstream LTV to guarantee authentic installs and registrations.",
      points: [
        "Rewarded video and offerwalls integrated smoothly inside games and utilities",
        "Completion-based optimization focused on genuine user engagement",
        "Pre-bid filtration on every rewarded impression",
        "Caps tied strictly to install and deep SDK events in the MMP",
        "High-engagement CPI and CPA models for gaming and consumer apps",
        "Supply path completely visible for Ad Ops month-end review",
      ],
    },
    ctv: {
      description:
        "Connected TV delivers household reach with a strict performance mandate. We run Roku and premium streaming campaigns using pre-bid household and device scoring. Our operators match activation events like app install, account link, and first_deposit_complete directly to delivery logs post-flight. We provide total clarity when finance reviews CTV spend.",
      points: [
        "Roku and premium streaming inventory access",
        "Pre-bid household and device scoring models",
        "Built specifically for deep events like installs, registrations, and deposits",
        "Activation matched precisely to delivery logs post-flight",
        "Clean measurement paths for UK and US performance teams",
        "Brand reach that earns a measurable line on the P&L",
      ],
    },
    retargeting: {
      description:
        "Retargeting brings back users who already showed intent. We leverage MMP event pools of trial starts, cart views, and deposit abandoners. Our team weights bids by LTV and likelihood to convert. Every win-back flight traces to a specific device-level event Your team can export when the month closes.",
      points: [
        "MMP event pools built from genuine trial, cart, and deposit abandoners",
        "LTV-weighted bids focused on real intent cohorts",
        "Cross-channel reactivation across programmatic, social, and in-app environments",
        "Device-level proof for every single win-back dollar",
        "Lifecycle UA that finance reads clearly without a translator",
        "Fresh and validated audiences that maintain high conversion rates",
      ],
    },
    native: {
      description:
        "Native and editorial placements run inside high-authority finance and tech publishers. This context earns user trust before the click. We run brand-safe inventory equipped with pre-flight compliance checks tailored for fintech, iGaming, and premium subscriptions. We generate registrations and deposits from readers already actively evaluating the category.",
      points: [
        "Curated finance and tech publisher whitelist",
        "Pre-flight brand and compliance checks before spend clears",
        "Editorial context that directly supports conversion rates",
        "Placements fully approved by legal and brand teams",
        "Event tracking aligned to deposit and subscription KPIs",
        "Premium media that reconciles identically to performance channels",
      ],
    },
    influencer: {
      description:
        "Creator and influencer placements utilize MMP-tracked links to turn social reach into installs, registrations, and subscriptions. Our boutique agency matches voices to vertical trust and audience relevance. We organize creator spend in the same reconciliation file as paid media so Your board sees one unified growth story.",
      points: [
        "MMP-tracked creator and UGC placements",
        "Event KPIs driven by installs, first_deposit_complete, and subscription_started",
        "Meta, TikTok, and creator bundles unified under one schema",
        "Creator spend reconciled seamlessly with programmatic and social",
        "Compliance-ready briefs tailored for regulated verticals",
        "Trusted voices delivering outcomes finance can audit",
      ],
    },
  },
  infrastructure: {
    programmatic: {
      description:
        "Verified Programmatic Pipe: Filter out bot traffic in 0.4 milliseconds before the bid occurs. We enforce absolute pipeline cleanliness. Our proprietary engine analyzes 180 device signals in 0.4 milliseconds to block fraud before we spend Your budget. We maintain a rigorously vetted safelist of direct exchanges, ensuring a clean supply path. Your media buyers work with transparent data, and Your accounting ledgers match Your media invoices perfectly.",
      points: [
        "180+ signals scored accurately before the bid clears",
        "Full path visibility from impression to postback",
        "Raw logs exportable to Your MMP anytime",
        "Rewarded and high-telemetry units on compliance-approved whitelists",
        "PMP and open auction unified under one control plane",
        "Secure volume scaling with comprehensive fraud protection",
      ],
    },
    oem: {
      description:
        "Procurement-Grade OEM Access: Audit every factory pre-install down to the raw hardware log. Opaque attribution models have no place in Your marketing sheets. We secure direct Lenovo ROM and PAI lanes with complete SDK trails for absolute compliance. Our engineers connect device logs directly to Your Adjust or AppsFlyer endpoints. You verify every device activation before You pay the invoice, protecting Your media budget from resale fraud.",
      points: [
        "Factory-side ROM and PAI with detailed device-level trails",
        "One auditable log shared among compliance, UA, and finance",
        "Exclusive inventory directly from the manufacturer",
        "Exportable proof built for enterprise and regulated reviews",
        "Pre-bid fraud screen actively protecting OEM lanes",
        "SDK compliance monitoring maintained through flight life",
      ],
    },
    performance: {
      description:
        "Traceable Creative Performance: Connect every visual asset to a raw device receipt. Traditional agencies sell beautiful banners but hide performance gaps. We treat creative production as data science. Our traders trace every creative asset directly to Your raw install logs, showing You exactly which video generated real lifetime value. We remove the guesswork from Your creative testing, ensuring every ad dollar works for Your ledger.",
      points: [
        "Pre-auction filtration on every performance buy",
        "Caps and bids wired directly to MMP events",
        "Device-log reconciliation finalized before flight close",
        "FTD and CPA models backed by finance-grade reporting",
        "One unified story for UA, Ad Ops, and finance",
        "Dispute-ready exports available at month-end",
      ],
    },
    social: {
      description:
        "Social and search paths are logged the same day they convert. Meta, TikTok, and Google fire into Your MMP instantly. Our operators ensure platform and MMP gaps are fully closed before the invoice is issued.",
      points: [
        "Same-day MMP conversion wiring",
        "Spend fully justified by verified events",
        "Intent cohorts tracked with clear log paths",
        "Search and social united under one reconciliation schema",
        "Platform discrepancy resolution executed before billing",
        "Audit-ready campaign structure",
      ],
    },
    rewarded: {
      description:
        "Rewarded inventory includes completion telemetry scored pre-bid. We whitelist high-engagement units specifically for regulated buyers. Every completion remains fully traceable to the device log.",
      points: [
        "Completion signals scored definitively pre-bid",
        "Whitelist-ready rewarded supply",
        "Device-level completion trails",
        "Caps tied securely to MMP events",
        "Offerwall and rewarded video combined under one log format",
        "Finance-readable completion metrics",
      ],
    },
    ctv: {
      description:
        "Verified CTV paths utilize streaming inventory backed by pre-bid device signals. Our team matches activation to delivery logs to ensure absolute measurement clarity.",
      points: [
        "Pre-bid device and household scoring",
        "Activation matched directly to delivery logs",
        "Roku and premium streaming paths fully supported",
        "Clean exports prepared for month-end review",
        "CTV and app measurement parity guaranteed",
        "Total transparency in view-through reporting",
      ],
    },
    retargeting: {
      description:
        "Retargeting leverages precise MMP event pools. We deliver device-level proof for every win-back campaign. Our operators ensure lifecycle spend closes clean and completely verified.",
      points: [
        "MMP event pools built from highly specific user actions",
        "Behavior-based reactivation bids",
        "Device-level proof secured per win-back dollar",
        "LTV cohorts equipped with exportable trails",
        "Cross-channel pools consolidated under one file",
        "Month-end reconciliation executed smoothly and definitively",
      ],
    },
    native: {
      description:
        "Whitelist-only native and editorial inventory passes strict compliance filters before spend clears. We maintain audit-ready placement records aligned exactly to Your revenue KPIs.",
      points: [
        "Whitelist-only finance and news publishers",
        "Compliance filters deployed pre-flight",
        "Brand-safe editorial context",
        "Event KPIs aligned precisely to the mix",
        "Audit-ready placement records",
        "Regulated vertical safe harbors",
      ],
    },
    influencer: {
      description:
        "Creator placements secure MMP-tracked outcomes. We reconcile creator spend in the identical file as paid media. Our boutique agency delivers event trails that finance can pull instantly.",
      points: [
        "MMP-tracked creator links",
        "Event KPIs verified by registration and first_deposit_complete",
        "Creator spend reconciled directly with paid media",
        "Compliance-ready creator briefs",
        "Device-level attribution trails",
        "One comprehensive file for board reporting",
      ],
    },
  },
} satisfies Record<SiteMode, Partial<Record<string, SolutionsChannelDetail>>>;

export function getSolutionsChannelDetail(
  mode: SiteMode,
  channelId: string,
): SolutionsChannelDetail | undefined {
  const bucket = solutionsChannelDetailsByMode[mode] as Partial<
    Record<string, SolutionsChannelDetail>
  >;
  return bucket[channelId];
}
