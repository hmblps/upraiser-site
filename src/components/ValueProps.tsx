import { valueByMode, sectionsByMode } from "../data/liveContent";
import { ModeContentTransition } from "./motion/ModeContentTransition";
import { SectionAmbience } from "./SectionAmbience";
import { SectionHeader, useMode } from "./SectionHeader";
import { ValueBentoIcon } from "./ValueBentoIcon";

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

function ValueCard({
  icon,
  children,
  variant = "default",
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  variant?: "default" | "hero" | "metric";
}) {
  return (
    <div className={`value-bento-card value-bento-card--${variant}`}>
      {icon}
      <div className="value-bento-card-body">{children}</div>
    </div>
  );
}

export function ValueProps() {
  const { mode } = useMode();
  const content = valueByMode[mode];
  const section = sectionsByMode.value[mode];

  return (
    <section
      id="value"
      className={`section-band section-band--dense${mode === "infrastructure" ? " section-band--ambience" : ""}`}
    >
      {mode === "infrastructure" ? <SectionAmbience tone="cool" /> : null}
      <ModeContentTransition mode={mode} className="relative z-[1] mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          animated={false}
          label={sectionsByMode.value.label}
          title={section.title}
          description={section.description}
        />

        <div className="value-bento section-stack">
          <ValueTile className="value-bento-tile--hero" maxTilt={5} spotlight>
            <ValueCard variant="hero" icon={<ValueBentoIcon slot="hero" mode={mode} />}>
              <p className="card-kicker">{content.hero.kicker}</p>
              <h3 className="value-bento-hero-title">{content.hero.title}</h3>
              <p className="copy value-bento-copy">{content.hero.description}</p>
            </ValueCard>
          </ValueTile>

          <ValueTile className="value-bento-tile--metric value-bento-tile--metric-a" maxTilt={8}>
            <ValueCard variant="metric" icon={<ValueBentoIcon slot="metric-a" mode={mode} />}>
              <p className="stat-value">{content.metrics[0].value}</p>
              <p className="stat-label mt-1 text-muted-light">{content.metrics[0].label}</p>
            </ValueCard>
          </ValueTile>

          <ValueTile className="value-bento-tile--metric value-bento-tile--metric-b" maxTilt={8}>
            <ValueCard variant="metric" icon={<ValueBentoIcon slot="metric-b" mode={mode} />}>
              <p className="stat-value">{content.metrics[1].value}</p>
              <p className="stat-label mt-1 text-muted-light">{content.metrics[1].label}</p>
            </ValueCard>
          </ValueTile>

          {content.features.map((item, index) => {
            const slot = index === 0 ? "feature-a" : "feature-b";
            return (
              <ValueTile
                key={item.title}
                className={`value-bento-tile--feature value-bento-tile--feature-${index === 0 ? "a" : "b"}`}
              >
                <ValueCard icon={<ValueBentoIcon slot={slot} mode={mode} />}>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="copy value-bento-copy">{item.description}</p>
                </ValueCard>
              </ValueTile>
            );
          })}

          <ValueTile className="value-bento-tile--brand" spotlight>
            <ValueCard icon={<ValueBentoIcon slot="brand" mode={mode} />}>
              <p className="stat-label text-orange">{content.brand.badge}</p>
              <h3 className="card-title mt-1.5">{content.brand.title}</h3>
              <p className="copy value-bento-copy">{content.brand.description}</p>
            </ValueCard>
          </ValueTile>
        </div>
      </ModeContentTransition>
    </section>
  );
}
