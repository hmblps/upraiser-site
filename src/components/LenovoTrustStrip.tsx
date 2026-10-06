import { lenovoPartnership } from "../data/liveContent";
import { GradientTraceBorder } from "./GradientTraceBorder";
import { LenovoPartnershipCopy } from "./LenovoPartnershipCopy";
import { LenovoPartnershipLogo } from "./LenovoPartnershipLogo";
import { useEffect, useRef } from "react";

/**
 * Lenovo partnership — flush dock on the sticky hero bottom edge.
 * Reveal is driven by HeroFly CSS vars (--hero-lenovo-*), not whileInView.
 */
export function LenovoTrustStrip() {
  const dockRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const publish = () => {
      const stage = dock.closest(".hero-stage--fly") as HTMLElement | null;
      if (!stage) return;
      const h = Math.ceil(dock.getBoundingClientRect().height);
      if (h > 0) stage.style.setProperty("--hero-lenovo-dock-h", `${h}px`);
    };

    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(dock);
    window.addEventListener("resize", publish, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", publish);
    };
  }, []);

  return (
    <aside
      ref={dockRef}
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
          <div className="relative z-[1] rail-strip__inner page-container flex items-center justify-center md:justify-between gap-4 py-3 sm:py-4 md:py-5 antialiased [transform:translateZ(0)]">
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <LenovoPartnershipLogo className="h-7 w-auto shrink-0 sm:h-9 md:h-10" />
              <div className="text-left">
                <p className="stat-label text-[10px] sm:text-xs text-accent leading-none">{lenovoPartnership.badge}</p>
                <p className="mt-1 card-title text-[13px] sm:text-sm md:text-base normal-case tracking-normal leading-none">{lenovoPartnership.title}</p>
              </div>
            </div>
            <LenovoPartnershipCopy className="hidden md:block w-full max-w-xl ml-auto pl-8 lg:max-w-lg xl:max-w-2xl" />
          </div>
        </div>
      </div>
    </aside>
  );
}
