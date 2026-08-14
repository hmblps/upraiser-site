import { lenovoPartnership } from "../data/liveContent";
import { GradientTraceBorder } from "./GradientTraceBorder";
import { LenovoPartnershipCopy } from "./LenovoPartnershipCopy";
import { LenovoPartnershipLogo } from "./LenovoPartnershipLogo";

/**
 * Lenovo partnership — flush dock on the sticky hero bottom edge.
 * Reveal is driven by HeroFly CSS vars (--hero-lenovo-*), not whileInView.
 */
export function LenovoTrustStrip() {
  return (
    <aside
      id="partnership"
      className="lenovo-hero-dock"
      aria-label="Lenovo partnership"
    >
      <div className="lenovo-trust-strip overflow-hidden">
        <div className="strip-beam-wrap relative overflow-hidden">
          <GradientTraceBorder
            duration={3.2}
            strokeWidth={1.5}
            colorFrom="var(--theme-accent-light)"
            colorTo="var(--color-magenta)"
          />
          <div className="relative z-[1] rail-strip__inner page-container flex flex-col items-start gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-5">
            <div className="flex items-center gap-4">
              <LenovoPartnershipLogo className="h-9 w-auto shrink-0 sm:h-10" />
              <div>
                <p className="stat-label text-accent">{lenovoPartnership.badge}</p>
                <p className="mt-0.5 card-title normal-case tracking-normal">{lenovoPartnership.title}</p>
              </div>
            </div>
            <LenovoPartnershipCopy className="w-full max-w-xl sm:ml-auto sm:w-auto sm:pl-8 lg:max-w-md xl:max-w-xl" />
          </div>
        </div>
      </div>
    </aside>
  );
}
