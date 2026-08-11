export type AdFormat = {
  id: string;
  label: string;
  tagline: string;
  description: string;
  points: readonly string[];
  /** All formats use the live full-feed UI; id maps to a section. */
  screen: { type: "live" };
};

export const AD_FORMATS: AdFormat[] = [
  {
    id: "banner",
    label: "Banner",
    tagline: "Scale inside 100K+ apps",
    description:
      "In-app banners bought on behavioral signals. Every impression clears pre-bid filtration, with a supply path Ad Ops can defend in review.",
    points: [
      "100K+ app graph with behavioral bid signals",
      "Pre-bid fraud screen before auction close",
      "Caps wired to MMP events: FTD, reg, subscription",
    ],
    screen: { type: "live" },
  },
  {
    id: "native",
    label: "Native",
    tagline: "Intent-matched, not interruptive",
    description:
      "Native units blend into the feed without the interruption penalty. Session-depth targeting so installs arrive with intent already primed.",
    points: [
      "Feed-integrated units matched to app design",
      "Session-depth and engagement-peak targeting",
      "CPC / CPM with MMP conversion attribution",
    ],
    screen: { type: "live" },
  },
  {
    id: "interstitial",
    label: "Interstitial",
    tagline: "Full-screen impact at natural breaks",
    description:
      "Full-screen at natural breaks like level load, article end, or checkout. Scored pre-bid so high-bounce slots never clear the cap.",
    points: [
      "Natural-break timing, not random interrupts",
      "Placement quality scored before bid",
      "Device-level frequency caps",
    ],
    screen: { type: "live" },
  },
  {
    id: "rich",
    label: "Rich Media",
    tagline: "Interactive formats that earn attention",
    description:
      "Expandable and playable units that stay in-app. 3–5× engagement vs standard display, whitelist-only for brand safety.",
    points: [
      "Expandable, animated, and playable units",
      "3–5× engagement vs standard display",
      "Whitelist-only, MRAID-compliant supply",
    ],
    screen: { type: "live" },
  },
  {
    id: "video",
    label: "Video",
    tagline: "Rewarded and skippable",
    description:
      "Rewarded and skippable video under one bid strategy with shared MMP attribution. Compare format spend apples to apples.",
    points: [
      "Rewarded: opt-in, near-100% completion",
      "Skippable pre-roll with quality controls",
      "Shared MMP attribution across both types",
    ],
    screen: { type: "live" },
  },
];

/** OEM & CTV lane. Same scroll UX, different proof story. */
export const OEM_CTV_FORMATS: AdFormat[] = [
  {
    id: "banner",
    label: "Pre-install",
    tagline: "On-device before the store",
    description:
      "OEM placements reach devices at unboxing and first boot. Install trails that survive procurement questions.",
    points: [
      "Factory / first-boot placement inventory",
      "Install and activation postback trails",
      "Reconciliation file finance can read",
    ],
    screen: { type: "live" },
  },
  {
    id: "native",
    label: "OEM Store",
    tagline: "Lenovo and partner storefronts",
    description:
      "Featured and recommended slots inside OEM app stores. Intent already high, fraud filtered before delivery.",
    points: [
      "Partner storefront featured slots",
      "Pre-bid filtration on every clear",
      "MMP-aligned activation events",
    ],
    screen: { type: "live" },
  },
  {
    id: "interstitial",
    label: "System UI",
    tagline: "OS-level moments that convert",
    description:
      "System surfaces at natural device moments like setup complete or update done. Without random interrupt spam.",
    points: [
      "Natural OS transition timing",
      "Device-level frequency control",
      "Brand-safe whitelist inventory",
    ],
    screen: { type: "live" },
  },
  {
    id: "rich",
    label: "CTV Spot",
    tagline: "Living-room scale, measured",
    description:
      "Connected TV spots with household reach and post-flight proof. Same reconciliation language as mobile OEM.",
    points: [
      "Premium CTV publisher whitelist",
      "Household reach with frequency caps",
      "Post-flight file for finance review",
    ],
    screen: { type: "live" },
  },
  {
    id: "video",
    label: "CTV Video",
    tagline: "Long-form attention, short proof path",
    description:
      "CTV video bought to the same outcome stack as OEM. Activation trails and month-end that close cleanly.",
    points: [
      "Completion and viewability controls",
      "Shared outcome taxonomy with OEM",
      "One finance-readable reconciliation",
    ],
    screen: { type: "live" },
  },
];
