import { COMPANY_CONTENT } from "../data/innerPagesData";
import { WorldMap, type WorldMapDot } from "./ui/WorldMap";
import { Reveal } from "./motion/Reveal";

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

/**
 * Footprint — Aceternity WorldMap as the widget; copy stays thin.
 * One HQ line + stats + market chips. No duplicate essay beside the map.
 */
export function CompanyFootprint() {
  const { footprint } = COMPANY_CONTENT;

  return (
    <section className="section-band border-y border-border/40 company-footprint">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="company-footprint__intro">
          <Reveal>
            <p className="section-label">{footprint.label}</p>
            <h2 className="section-title mt-3 max-w-xl">{footprint.title}</h2>
            <p className="copy mt-3 max-w-xl text-sm text-muted">{footprint.lead}</p>
          </Reveal>

          <Reveal delay={0.06} className="company-footprint__hq-line">
            <span className="company-footprint__hq-code">{footprint.hq.code}</span>
            <span className="company-footprint__hq-sep" aria-hidden>
              ·
            </span>
            <span>
              <strong className="text-fg">{footprint.hq.name}</strong>
              <span className="text-muted"> — {footprint.hq.detail}</span>
            </span>
          </Reveal>
        </div>

        <Reveal delay={0.08} className="company-footprint__map mt-8">
          <WorldMap dots={TRAFFIC_ARCS} lineColor="#ffcc00" />
          <p className="company-footprint__map-caption">
            Arcs from London HQ to markets in the case file — not a franchise map
          </p>
        </Reveal>

        <dl className="company-footprint__stats mt-8">
          {footprint.stats.map((stat) => (
            <div key={stat.label} className="company-footprint__stat">
              <dt className="company-footprint__stat-value">{stat.value}</dt>
              <dd className="company-footprint__stat-label">{stat.label}</dd>
            </div>
          ))}
        </dl>

        <ul className="company-footprint__chips mt-8" aria-label="Traffic markets">
          {footprint.trafficPoints.map((point) => (
            <li key={point.code} className="company-footprint__chip">
              <span className="company-footprint__chip-code">{point.code}</span>
              <span className="company-footprint__chip-name">{point.name}</span>
              <span className="company-footprint__chip-detail">{point.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
