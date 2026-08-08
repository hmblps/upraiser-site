import { COMPANY_CONTENT } from "../data/innerPagesData";
import { useTheme } from "../context/ThemeContext";
import { WorldMap, type WorldMapDot } from "./ui/WorldMap";
import { cn } from "../lib/cn";

const LND = { lat: 51.5074, lng: -0.1278, label: "London HQ" };

/** Hub-and-spoke from London to live traffic markets (not fake offices). */
const TRAFFIC_ARCS: WorldMapDot[] = [
  { start: LND, end: { lat: 40.7128, lng: -74.006, label: "US" } },
  { start: LND, end: { lat: 25.2048, lng: 55.2708, label: "GCC" } },
  { start: LND, end: { lat: 52.52, lng: 13.405, label: "EU" } },
  { start: LND, end: { lat: 19.4326, lng: -99.1332, label: "MX" } },
  { start: LND, end: { lat: -23.5505, lng: -46.6333, label: "BR" } },
  { start: LND, end: { lat: 14.5995, lng: 120.9842, label: "PH" } },
  { start: LND, end: { lat: 1.3521, lng: 103.8198, label: "OEM" } },
];

type CompanyFootprintProps = {
  /** Fits Company viewport tab — map + stats, no page runway */
  embedded?: boolean;
  /** Layout rendering style */
  variant?: "embedded" | "flat" | "section";
};

/**
 * Footprint — Aceternity WorldMap as the widget; copy stays thin.
 * Arc color follows theme (ink-gold on white, bright gold on dark).
 */
export function CompanyFootprint({
  embedded,
  variant = embedded ? "embedded" : "section",
}: CompanyFootprintProps) {
  const { footprint } = COMPANY_CONTENT;
  const { theme } = useTheme();
  const lineColor = theme === "light" ? "#b8860b" : "#ffcc00";
  const pulseColor = theme === "light" ? "#ff003b" : "#ffe066";

  const isEmbedded = variant === "embedded";
  const isFlat = variant === "flat";

  const body = (
    <div
      className={cn(
        "company-footprint",
        isEmbedded && "company-footprint--embedded h-full min-h-0 overflow-hidden",
        theme === "light" && "company-footprint--light",
      )}
    >
      <div className={cn((isFlat || !isEmbedded) && "section-inner")}>
        {isFlat || isEmbedded ? (
          <div className="mb-3 shrink-0">
            <p className="stat-label text-accent">{footprint.label}</p>
            <p className="company-footprint__hq-line mt-1.5 text-xs sm:text-sm">
              <span className="company-footprint__hq-code">{footprint.hq.code}</span>
              <span className="company-footprint__hq-sep" aria-hidden>
                ·
              </span>
              <span>
                <strong className="text-fg">{footprint.hq.name}</strong>
                <span className="text-muted"> — {footprint.hq.role}</span>
              </span>
            </p>
          </div>
        ) : (
          <div className="company-footprint__intro">
            <p className="section-label">{footprint.label}</p>
            <h2 className="section-title mt-3 max-w-xl">{footprint.title}</h2>
            <p className="copy mt-3 max-w-xl text-sm text-muted">{footprint.lead}</p>
            <p className="company-footprint__hq-line mt-4">
              <span className="company-footprint__hq-code">{footprint.hq.code}</span>
              <span className="company-footprint__hq-sep" aria-hidden>
                ·
              </span>
              <span>
                <strong className="text-fg">{footprint.hq.name}</strong>
                <span className="text-muted"> — {footprint.hq.detail}</span>
              </span>
            </p>
          </div>
        )}

        <div
          className={cn(
            "company-footprint__map",
            isEmbedded ? "min-h-0 flex-1 overflow-hidden" : "mt-8",
          )}
        >
          <WorldMap
            dots={TRAFFIC_ARCS}
            lineColor={lineColor}
            pulseColor={pulseColor}
            className={isEmbedded ? "aspect-[2.4/1] max-h-[min(280px,32vh)]" : undefined}
          />
        </div>

        <dl className={cn("company-footprint__stats", isEmbedded ? "mt-3 shrink-0" : "mt-8")}>
          {footprint.stats.map((stat) => (
            <div key={stat.label} className="company-footprint__stat">
              <dt className="company-footprint__stat-value">{stat.value}</dt>
              <dd className="company-footprint__stat-label">{stat.label}</dd>
            </div>
          ))}
        </dl>

        {isFlat || isEmbedded ? null : (
          <ul className="company-footprint__chips mt-8" aria-label="Traffic markets">
            {footprint.trafficPoints.map((point) => (
              <li key={point.code} className="company-footprint__chip">
                <span className="company-footprint__chip-code">{point.code}</span>
                <span className="company-footprint__chip-name">{point.name}</span>
                <span className="company-footprint__chip-detail">{point.detail}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  if (isEmbedded) {
    return <div className="flex h-full min-h-0 flex-col overflow-hidden">{body}</div>;
  }
  if (isFlat) {
    return <div>{body}</div>;
  }

  return <section className="section-band border-y border-border/40">{body}</section>;
}
