import { measurementPage } from "../data/liveContent";
import { AnimatedList } from "./magicui/AnimatedList";
import { cn } from "../lib/cn";

type ClarityReconcileProps = {
  /** Viewport mode — feed only, no wire runway / module stack */
  compact?: boolean;
};

/**
 * Clarity widget — wire steps + live feed.
 * `compact` fits Expertise viewport without scrolling.
 */
export function ClarityReconcile({ compact = false }: ClarityReconcileProps) {
  const { panel, steps, modules } = measurementPage;

  if (compact) {
    return (
      <div className="clarity-live clarity-live--compact h-full min-h-0 overflow-hidden">
        <div className="clarity-feed h-full min-h-0 overflow-hidden" aria-label="Live reconciliation feed">
          <div className="clarity-feed__chrome">
            <span className="clarity-feed__dot" aria-hidden />
            <span className="clarity-feed__label">Reconcile · live</span>
            <span className="clarity-feed__meta">bid ↔ bill</span>
          </div>

          <AnimatedList delay={900} className="clarity-feed__list clarity-feed__list--compact">
            {panel.rows.slice(0, 5).map((row) => (
              <div
                key={row.event}
                className={cn(
                  "clarity-feed__row",
                  row.tone === "warn" && "clarity-feed__row--warn",
                )}
              >
                <span className="clarity-feed__event">{row.event}</span>
                <span className="clarity-feed__bid">{row.bid}</span>
                <span className="clarity-feed__rail" aria-hidden>
                  <span className="clarity-feed__tick" />
                </span>
                <span className="clarity-feed__bill">{row.bill}</span>
              </div>
            ))}
          </AnimatedList>
        </div>
      </div>
    );
  }

  return (
    <div className="clarity-live">
      <div className="clarity-live__copy">
        <ol className="clarity-wire" aria-label="How we wire Clarity">
          {steps.map((step) => (
            <li key={step.step} className="clarity-wire__step">
              <span className="clarity-wire__num" aria-hidden>
                {step.step}
              </span>
              <div>
                <p className="clarity-wire__title">{step.title}</p>
                <p className="clarity-wire__text">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="clarity-live__feed">
        <div className="clarity-feed" aria-label="Live reconciliation feed">
          <div className="clarity-feed__chrome">
            <span className="clarity-feed__dot" aria-hidden />
            <span className="clarity-feed__label">Reconcile · live</span>
            <span className="clarity-feed__meta">bid ↔ bill</span>
          </div>

          <AnimatedList delay={900} className="clarity-feed__list">
            {panel.rows.map((row) => (
              <div
                key={row.event}
                className={cn(
                  "clarity-feed__row",
                  row.tone === "warn" && "clarity-feed__row--warn",
                )}
              >
                <span className="clarity-feed__event">{row.event}</span>
                <span className="clarity-feed__bid">{row.bid}</span>
                <span className="clarity-feed__rail" aria-hidden>
                  <span className="clarity-feed__tick" />
                </span>
                <span className="clarity-feed__bill">{row.bill}</span>
              </div>
            ))}
          </AnimatedList>

          <ul className="clarity-feed__modules">
            {modules.map((mod) => (
              <li key={mod.title}>
                <span className="clarity-feed__module-title">{mod.title}</span>
                <span className="clarity-feed__module-text">{mod.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
