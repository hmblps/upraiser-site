export interface CaseFocus {
  overview: string;
  outcome: string;
}

export interface CaseStudy {
  id: string;
  client: string;
  category: string;
  headline: string;
  channels: string[];
  /** Primary metric highlighted on the case card */
  heroMetric: { value: string; label: string };
  /** Normalized trend points for sparkline visualization */
  trend: number[];
  growthFocus: CaseFocus;
  optimizationFocus: CaseFocus;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "igaming",
    client: "Fanatics",
    category: "iGaming",
    headline: "Sportsbook growth in regulated markets",
    channels: ["Programmatic", "High-intent display", "Behavioral"],
    heroMetric: { value: "$250K+", label: "Attributed Revenue" },
    trend: [20, 30, 45, 60, 75, 85, 90, 95, 98, 99, 100, 100],
    growthFocus: {
      overview: "Fanatics needed to capture the sports-betting market without hitting a compliance wall. We built a growth engine that treated inventory safety with the same rigor as Your LTV.",
      outcome: "We helped You scale into regulated territory while keeping legal and finance happy. Pure, reportable growth for You."
    },
    optimizationFocus: {
      overview: "A single bad placement in this sector is a legal nightmare. We implemented hard filters to kill fraud and wasted impressions before the spend ever hit the exchange.",
      outcome: "We fortified Your UA stack against waste. No compliance flags, just high-value bettors who play and stay."
    }
  },
  {
    id: "ecommerce",
    client: "D2C Brand",
    category: "E-commerce",
    headline: "Global storefront expansion",
    channels: ["Social", "Influencer", "Display"],
    heroMetric: { value: "140%", label: "Order Growth" },
    trend: [10, 15, 25, 40, 55, 70, 85, 90, 92, 95, 97, 100],
    growthFocus: {
      overview: "A premium brand needed to scale orders in new GEOs without killing their margins. We shifted the focus from 'installs' to 'conversion-ready' users.",
      outcome: "We doubled Your reach while Your CPA actually dropped as we hit scale. Results that speak for themselves."
    },
    optimizationFocus: {
      overview: "You were bleeding 20% of Your budget to bots masquerading as shoppers. We re-engineered the funnel to prioritize verified checkout intent.",
      outcome: "We slashed Your wasted ad-spend by 30%, shifting that capital straight into high-value acquisition. Your ROAS now reflects reality."
    }
  },
  {
    id: "streaming",
    client: "Global OTT",
    category: "Streaming",
    headline: "From viewer to subscriber",
    channels: ["CTV", "Performance UA", "Full-funnel"],
    heroMetric: { value: "32%", label: "Conversion Lift" },
    trend: [5, 10, 20, 35, 50, 65, 75, 85, 90, 95, 98, 100],
    growthFocus: {
      overview: "You needed to turn casual CTV viewers into paying subscribers. We mapped the path from screen-time to signup, finding the 'Aha!' moment in Your app.",
      outcome: "We delivered a surge in paid subs that shows up in Your product revenue, not just a weekly vanity report."
    },
    optimizationFocus: {
      overview: "Churn was eating Your trial growth. We audited the signup flow to identify exactly where You were losing potential long-term subscribers.",
      outcome: "We tightened the funnel, keeping more of Your audience engaged and turning more trials into lifetime members."
    }
  },
  {
    id: "lifestyle",
    client: "Community App",
    category: "Lifestyle",
    headline: "Viral loop mechanics",
    channels: ["Organic-style UA", "Referral"],
    heroMetric: { value: "4.2x", label: "Viral K-Factor" },
    trend: [15, 20, 30, 45, 60, 75, 85, 90, 95, 97, 99, 100],
    growthFocus: {
      overview: "You wanted to grow Your community through advocacy, not just paid ads. We integrated viral mechanics that made Your users Your best growth partners.",
      outcome: "We turned Your community into a self-perpetuating engine. Growth that pays for itself."
    },
    optimizationFocus: {
      overview: "Paid creative was burning out too fast. We analyzed Your data to find which creative hooks were actually driving retention versus just cheap clicks.",
      outcome: "We stabilized Your creative output, ensuring every ad dollar You spend drives Your business forward, not just a temporary spike."
    }
  },
  {
    id: "news",
    client: "Premium Publisher",
    category: "News",
    headline: "Subscription intent at scale",
    channels: ["Native", "Editorial", "Intent-based"],
    heroMetric: { value: "3,000", label: "Paid Subs /mo" },
    trend: [20, 25, 35, 45, 55, 65, 75, 80, 85, 90, 95, 100],
    growthFocus: {
      overview: "You needed paying subscribers in a market where CPAs only move one way: up. We identified the high-intent inventory where Your readers actually live.",
      outcome: "Steady, predictable subscription volume. Your unit economics are finally protected."
    },
    optimizationFocus: {
      overview: "Your bounce rates were spiking on 'news' sites that were really just ad-farms. We applied hard inventory quality filters.",
      outcome: "We cleaned Your inventory and weeded out the bots. Your subscription volume increased because Your ads finally reached humans."
    }
  }
];
