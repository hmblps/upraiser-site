import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, ScanSearch, ShieldCheck, TrendingUp } from "lucide-react";
import { valueByMode, sectionsByMode } from "../data/liveContent";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { GlassIcon } from "./react-bits/GlassIcons";
import { SectionAmbience } from "./SectionAmbience";
import { SectionHeader, useMode } from "./SectionHeader";

const SPRING = { type: "spring", stiffness: 320, damping: 28 } as const;

const FEATURE_ICONS = {
  growth: [
    { kind: "shield", label: "Quality traffic", Icon: ShieldCheck },
    { kind: "trend", label: "Growth lift", Icon: TrendingUp },
  ],
  infrastructure: [
    { kind: "audit", label: "Traffic audit", Icon: ScanSearch },
    { kind: "parity", label: "Signal parity", Icon: RefreshCw },
  ],
} as const;

function ValueRing({ progress = 0.7, live }: { progress?: number; live?: boolean }) {
  const reduced = useReducedMotion();
  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference * (1 - Math.min(1, Math.max(0, progress)));
  const animated = live && !reduced;

  return (
    <svg className={`value-bento-ring${animated ? " live-ring" : ""}`} viewBox="0 0 88 88" aria-hidden>
      <circle className="value-bento-ring-track" cx="44" cy="44" r={36} />
      <motion.circle
        className="value-bento-ring-fill"
        cx="44"
        cy="44"
        r={36}
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: animated || reduced ? dashOffset : circumference }}
        transition={SPRING}
      />
      <circle className={`value-bento-ring-dot${animated ? " live-ring-dot" : ""}`} cx="44" cy="8" r="3.5" />
    </svg>
  );
}

function ValuePulse({ live }: { live: boolean }) {
  const reduced = useReducedMotion();
  if (reduced || !live) return <div className="value-bento-pulse value-bento-pulse--static" aria-hidden />;

  return (
    <div className="value-bento-pulse" aria-hidden>
      <span className="value-bento-pulse-core" />
      <span className="value-bento-pulse-ring" />
      <span className="value-bento-pulse-bars">
        {[0.42, 0.78, 0.55, 0.92, 0.62, 0.84, 0.5, 0.7].map((value, index) => (
          <i key={index} style={{ height: `${value * 100}%`, animationDelay: `${index * 0.1}s` }} />
        ))}
      </span>
    </div>
  );
}

function FeatureIcon({
  label,
  Icon,
}: {
  label: string;
  Icon: (typeof FEATURE_ICONS)["growth"][number]["Icon"];
}) {
  return (
    <div className="value-bento-icon value-bento-icon--glass" aria-hidden>
      <GlassIcon icon={<Icon strokeWidth={2.25} />} label={label} color="gold" size="sm" />
    </div>
  );
}

function ValueTile({
  children,
  className = "",
  maxTilt = 6,
  spotlight = false,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  spotlight?: boolean;
}) {
  return (
    <div className={`value-bento-tile h-full ${className}`.trim()} data-max-tilt={maxTilt} data-spotlight={spotlight}>
      {children}
    </div>
  );
}

function ValueMetric({
  value,
  label,
  progress,
  counted,
  live,
  slot,
}: {
  value: string;
  label: string;
  progress: number;
  counted: boolean;
  live: boolean;
  slot: "a" | "b";
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (counted) setVisible(true);
  }, [counted]);

  return (
    <ValueTile className={`value-bento-tile--metric value-bento-tile--metric-${slot}`} maxTilt={8}>
      <div className="value-bento-metric-row">
        <div>
          <p className="stat-value">{value}</p>
          <p className="stat-label mt-1 text-muted-light">{label}</p>
        </div>
        <ValueRing progress={progress} live={live && visible} />
      </div>
    </ValueTile>
  );
}

export function ValueProps() {
  const { mode } = useMode();
  const content = valueByMode[mode];
  const section = sectionsByMode.value[mode];
  const icons = FEATURE_ICONS[mode];
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const iconsLive = !reduced;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { threshold: 0.15 },
    );
    const node = document.getElementById("value");
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="value"
      className={`section-band section-band--dense scroll-mt-24${mode === "infrastructure" ? " section-band--ambience" : ""}`}
    >
      {mode === "infrastructure" ? <SectionAmbience tone="cool" /> : null}
      <div className="relative z-[1] mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          animated={false}
          label={sectionsByMode.value.label}
          title={section.title}
          description={section.description}
        />

        <div className={`value-bento section-stack${iconsLive ? " value-bento--live" : ""}`}>
          <ValueTile className="value-bento-tile--hero" maxTilt={5} spotlight>
            <div className="value-bento-hero-inner">
              <div className="value-bento-hero-copy">
                <p className="card-kicker">{content.hero.kicker}</p>
                <h3 className="value-bento-hero-title">{content.hero.title}</h3>
                <p className="copy mt-3 max-w-md">{content.hero.description}</p>
              </div>
              <ValuePulse live={iconsLive} />
            </div>
          </ValueTile>

          <ValueMetric {...content.metrics[0]} counted={active} live={iconsLive} slot="a" />
          <ValueMetric {...content.metrics[1]} counted={active} live={iconsLive} slot="b" />

          {content.features.map((item, index) => {
            const icon = icons[index];
            return (
              <ValueTile
                key={item.title}
                className={`value-bento-tile--feature value-bento-tile--feature-${index === 0 ? "a" : "b"}`}
              >
                <FeatureIcon label={icon.label} Icon={icon.Icon} />
                <h3 className="card-title">{item.title}</h3>
                <p className="copy mt-2">{item.description}</p>
              </ValueTile>
            );
          })}

          <ValueTile className="value-bento-tile--brand" spotlight>
            <p className="stat-label text-orange">{content.brand.badge}</p>
            <h3 className="card-title mt-2">{content.brand.title}</h3>
            <p className="copy mt-2 max-w-[16ch]">{content.brand.description}</p>
            <div className={`value-bento-brand-mark${iconsLive ? " live-mark" : ""}`} aria-hidden>
              <span>L</span>
            </div>
          </ValueTile>
        </div>
      </div>
    </section>
  );
}
