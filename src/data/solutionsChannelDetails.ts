import type { SiteMode } from "./liveContent";

export type SolutionsChannelDetail = {
  description: string;
  points: readonly string[];
};

/** Long-form Solutions panel copy — ThingOrTwo-style depth, UPRAISER voice. */
export const solutionsChannelDetailsByMode = {
  growth: {
    programmatic: {
      description:
        "In-app programmatic is SDK inventory across 100K+ apps — games, utilities, content — bought on behavioral signals, not open-exchange leftovers. We run display, interstitial, native, and rich media inside apps where session depth and engagement peaks matter. Every impression clears pre-bid filtration before Your cap moves. Supply path stays visible enough for Ad Ops to defend in a finance review.",
      points: [
        "100K+ app graph with behavioral bid signals — session depth, reward completion, engagement peaks",
        "Rewarded video, interstitial, native, and rich media in one accountable mix",
        "Pre-bid fraud screen on every in-app impression before auction close",
        "Caps wired to downstream MMP events — FTD, registration, subscription",
        "PMP and programmatic lanes under one reconciliation file",
        "Supply chosen by unit economics for Your vertical — not network politics",
      ],
    },
    oem: {
      description:
        "On-device traffic through our official Lenovo agency partnership: factory ROM and Google PAI — system recommendations and pre-installs, not exchange interstitials dressed up as OEM. Users meet Your app where trust already lives. SDK trails run from factory floor to MMP postback so compliance, UA, and finance share one auditable log.",
      points: [
        "Direct Lenovo ROM and Google PAI — not resold open-exchange supply",
        "Factory-side presence before day one — launches and emerging markets",
        "Device-level SDK trail from install to revenue event",
        "Pre-bid filtration on every OEM impression — on-device is not a fraud free pass",
        "Operator-grade authenticity vs auction leftovers",
        "Exportable proof for regulated and enterprise procurement",
      ],
    },
    performance: {
      description:
        "Performance marketing priced on outcomes finance already tracks: CPI, CPA, CPL wired to first deposit, funded account, or paid subscription. We buy display, video, and in-app under one optimization loop with real-time fraud filtering. iGaming, fintech, gaming, and subscription apps — verticals where a cheap install that never converts is worse than no install.",
      points: [
        "Event-priced models: FTD, registration, subscription — not vanity CPI",
        "Cross-format buying: display, video, in-app, social retargeting",
        "Pre-bid filtration before the impression clears the cap",
        "Unit economics held flat when budget scales",
        "MMP reconciliation before the flight closes — not post-campaign theater",
        "Creative and bid loops tied to revenue KPIs Your board already uses",
      ],
    },
    social: {
      description:
        "Paid social and search catch intent in motion — Meta, TikTok, and Google campaigns mapped to funnel stages with same-day MMP conversion wiring. No black-box lag. Creatives and bids iterate against deposits and subscriptions, not estimated reach. When platform reports disagree with the MMP, You have the event trail before invoice cycle.",
      points: [
        "Meta, TikTok, and Google under one event schema",
        "Funnel-stage segments — prospecting, consideration, conversion",
        "Same-day MMP conversion wiring for installs and deep events",
        "Search CPA and paid social in the same reconciliation file as programmatic",
        "Creative testing loops tied to deposit and subscription KPIs",
        "Spend You can defend in a weekly performance review",
      ],
    },
    rewarded: {
      description:
        "Rewarded traffic is opt-in inventory — users choose to watch, play, or complete an action for in-app currency or access. We buy rewarded video and offerwall units inside high-engagement apps where completion signals beat accidental taps. Bids weight completion quality and downstream LTV, not raw impression volume.",
      points: [
        "Rewarded video and offerwalls inside games and utilities",
        "Completion-based optimization — not click-chasing interstitials",
        "Pre-bid filtration on every rewarded impression",
        "Caps tied to install and deep events in the MMP",
        "High-engagement CPI and CPA models for gaming and consumer apps",
        "Supply path visible enough for Ad Ops month-end review",
      ],
    },
    ctv: {
      description:
        "Connected TV is household reach with a performance mandate. We run Roku and premium streaming with pre-bid household and device scoring. Activation events — app install, account link, first deposit — match post-flight to delivery logs. No view-through black holes when finance asks what CTV spend actually bought.",
      points: [
        "Roku and premium streaming inventory",
        "Pre-bid household and device scoring",
        "Built for deep events — installs, registrations, deposits",
        "Activation matched to delivery logs post-flight",
        "Clean measurement paths for UK/US performance teams",
        "Brand reach that still earns a line on the P&L",
      ],
    },
    retargeting: {
      description:
        "Retargeting brings back users who already showed intent — trial starts, cart views, deposit abandoners — from MMP event pools, not brittle pixel segments. Bids weight LTV and likelihood to convert. Every win-back flight traces to a device-level event Your team can pull when the month closes.",
      points: [
        "MMP event pools — trial, cart, deposit abandoners",
        "LTV-weighted bids on real intent cohorts",
        "Cross-channel reactivation: programmatic, social, in-app",
        "Device-level proof for every win-back dollar",
        "Lifecycle UA that finance reads without a translator",
        "No approximated audiences that rot overnight",
      ],
    },
    native: {
      description:
        "Native and editorial placements inside high-authority finance and tech publishers — context that earns trust before the click. We run brand-safe inventory with pre-flight compliance checks for fintech, iGaming, and premium subscriptions. Deposits from readers already evaluating a category, not drive-by clickbait.",
      points: [
        "Curated finance and tech publisher whitelist",
        "Pre-flight brand and compliance checks before spend clears",
        "Editorial context that supports conversion",
        "Placements legal and brand teams can accept",
        "Event tracking aligned to deposit and subscription KPIs",
        "Premium media that reconciles like performance channels",
      ],
    },
    influencer: {
      description:
        "Creator and influencer placements with MMP-tracked links — social reach that closes into installs, deposits, and subscriptions. Voices matched to vertical trust, not follower counts alone. Creator spend lives in the same reconciliation file as paid media, so the board sees one story.",
      points: [
        "MMP-tracked creator and UGC placements",
        "Event KPIs: installs, deposits, subs — not vanity views",
        "Meta, TikTok, and creator bundles under one schema",
        "Creator spend reconciled with programmatic and social",
        "Compliance-ready briefs for regulated verticals",
        "Trusted voices with outcomes finance can audit",
      ],
    },
  },
  infrastructure: {
    programmatic: {
      description:
        "In-app programmatic at infrastructure grade: 100K+ apps, 180+ pre-bid signals, full path visibility from impression to postback. Bots, emulators, and hijacked installs drop before auction close. Month-end is a file pull, not a war room.",
      points: [
        "180+ signals scored before the bid clears",
        "Full path visibility — impression to postback",
        "Raw logs exportable to Your MMP anytime",
        "Rewarded and high-telemetry units on compliance-approved whitelists",
        "PMP and open auction under one control plane",
        "Volume without open-ended fraud exposure",
      ],
    },
    oem: {
      description:
        "Lenovo ROM and Google PAI with SDK trails from factory floor to postback. One shared log for compliance, UA, and finance. Pre-bid filtration still runs on every OEM impression.",
      points: [
        "Factory-side ROM and PAI with device-level trails",
        "One auditable log — compliance, UA, finance",
        "No open-exchange supply marketed as pre-install",
        "Exportable proof for enterprise and regulated reviews",
        "Pre-bid fraud screen on OEM lanes",
        "SDK compliance monitoring through flight life",
      ],
    },
    performance: {
      description:
        "Event-verified App Growth: FTD and CPA models where every paid action reconciles to a device log before flight close. Caps and bids wire to MMP events — not CPI vanity.",
      points: [
        "Pre-auction filtration on every performance buy",
        "Caps and bids wired to MMP events",
        "Device-log reconciliation before flight close",
        "FTD/CPA models with finance-grade reporting",
        "One story for UA, Ad Ops, and finance",
        "Dispute-ready exports at month-end",
      ],
    },
    social: {
      description:
        "Social and search paths logged the same day they convert. Meta, TikTok, and Google fire into Your MMP without black-box lag. Platform vs MMP gaps closed before invoice.",
      points: [
        "Same-day MMP conversion wiring",
        "Event-justified spend — not estimated reach",
        "Intent cohorts with clear log paths",
        "Search and social under one reconciliation schema",
        "Platform discrepancy resolution before billing",
        "Audit-ready campaign structure",
      ],
    },
    rewarded: {
      description:
        "Rewarded inventory with completion telemetry scored pre-bid. High-engagement units whitelisted for regulated buyers. Every completion traceable to device log.",
      points: [
        "Completion signals scored pre-bid",
        "Whitelist-ready rewarded supply",
        "Device-level completion trails",
        "Caps tied to MMP events",
        "Offerwall and rewarded video under one log format",
        "Finance-readable completion metrics",
      ],
    },
    ctv: {
      description:
        "Verified CTV paths: streaming inventory with pre-bid device signals. Activation matched to delivery logs — no view-through measurement holes.",
      points: [
        "Pre-bid device and household scoring",
        "Activation matched to delivery logs",
        "Roku and premium streaming paths",
        "Clean exports for month-end review",
        "CTV + app measurement parity",
        "No black-box view-through reporting",
      ],
    },
    retargeting: {
      description:
        "Retargeting from MMP event pools — not approximated pixels. Device-level proof for every win-back campaign. Lifecycle spend that closes clean.",
      points: [
        "MMP event pools instead of brittle pixels",
        "Behavior-based reactivation bids",
        "Device-level proof per win-back dollar",
        "LTV cohorts with exportable trails",
        "Cross-channel pools under one file",
        "Month-end reconciliation without war rooms",
      ],
    },
    native: {
      description:
        "Whitelist-only native and editorial inventory. Compliance filters before spend clears. Audit-ready placement records aligned to revenue KPIs.",
      points: [
        "Whitelist-only finance and news publishers",
        "Compliance filters pre-flight",
        "Brand-safe editorial context",
        "Event KPIs aligned to the mix",
        "Audit-ready placement records",
        "Regulated vertical safe harbors",
      ],
    },
    influencer: {
      description:
        "Creator placements with MMP-tracked outcomes. Creator spend in the same reconciliation file as paid media. Event trails finance can pull.",
      points: [
        "MMP-tracked creator links",
        "Event KPIs — not vanity views",
        "Creator spend reconciled with paid media",
        "Compliance-ready creator briefs",
        "Device-level attribution trails",
        "One file for board reporting",
      ],
    },
  },
} satisfies Record<SiteMode, Partial<Record<string, SolutionsChannelDetail>>>;

export function getSolutionsChannelDetail(
  mode: SiteMode,
  channelId: string,
): SolutionsChannelDetail | undefined {
  const copyMode = channelId === "programmatic" ? "growth" : mode;
  const bucket = solutionsChannelDetailsByMode[copyMode] as Partial<
    Record<string, SolutionsChannelDetail>
  >;
  return bucket[channelId];
}
