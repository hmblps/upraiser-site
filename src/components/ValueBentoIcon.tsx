import type { SiteMode } from "../data/liveContent";
import { LucideAnimatedGlyph } from "./LucideAnimatedGlyph";
import { ChartColumnIncreasingIcon } from "./lucide-animated/chart-column-increasing";
import { CircleCheckIcon } from "./lucide-animated/circle-check";
import { ClockIcon } from "./lucide-animated/clock";
import { CpuIcon } from "./lucide-animated/cpu";
import { FileTextIcon } from "./lucide-animated/file-text";
import { GaugeIcon } from "./lucide-animated/gauge";
import { GitCompareArrowsIcon } from "./lucide-animated/git-compare-arrows";
import { LinkIcon } from "./lucide-animated/link";
import { SearchIcon } from "./lucide-animated/search";
import { ShieldCheckIcon } from "./lucide-animated/shield-check";
import { TrendingUpIcon } from "./lucide-animated/trending-up";
import type { LucideAnimatedHandle } from "./LucideAnimatedGlyph";
import type { ComponentType, RefAttributes } from "react";

export type ValueBentoSlot = "hero" | "metric-a" | "metric-b" | "feature-a" | "feature-b" | "brand";

type AnimatedIconComponent = ComponentType<
  { size?: number; className?: string } & RefAttributes<LucideAnimatedHandle>
>;

type BentoIconDef = {
  label: string;
  Icon: AnimatedIconComponent;
};

export const VALUE_BENTO_ICONS: Record<SiteMode, Record<ValueBentoSlot, BentoIconDef>> = {
  growth: {
    hero: { label: "Event-weighted buying", Icon: ChartColumnIncreasingIcon },
    "metric-a": { label: "Fraud blocked pre-bid", Icon: ShieldCheckIcon },
    "metric-b": { label: "Brief to live bids", Icon: ClockIcon },
    "feature-a": { label: "Spend scrutiny", Icon: CircleCheckIcon },
    "feature-b": { label: "CPA at scale", Icon: TrendingUpIcon },
    brand: { label: "Lenovo OEM partner", Icon: CpuIcon },
  },
  infrastructure: {
    hero: { label: "Log-native buying", Icon: FileTextIcon },
    "metric-a": { label: "Post-flight log drift", Icon: GitCompareArrowsIcon },
    "metric-b": { label: "p99 bid scoring", Icon: GaugeIcon },
    "feature-a": { label: "Traffic audit", Icon: SearchIcon },
    "feature-b": { label: "Numbers that match", Icon: LinkIcon },
    brand: { label: "Lenovo OEM partner", Icon: CpuIcon },
  },
};

type ValueBentoIconProps = {
  slot: ValueBentoSlot;
  mode: SiteMode;
  className?: string;
};

export function ValueBentoIcon({ slot, mode, className = "" }: ValueBentoIconProps) {
  const { label, Icon } = VALUE_BENTO_ICONS[mode][slot];

  return <LucideAnimatedGlyph Icon={Icon} label={label} className={className} />;
}
