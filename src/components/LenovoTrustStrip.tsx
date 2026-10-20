import { lenovoPartnership } from "../data/liveContent";
import { useTranslation } from "react-i18next";
import { GradientTraceBorder } from "./GradientTraceBorder";
import { LenovoPartnershipCopy } from "./LenovoPartnershipCopy";
import { LenovoPartnershipLogo } from "./LenovoPartnershipLogo";
import { useEffect, useRef } from "react";

/**
 * Lenovo partnership — flush dock on the sticky hero bottom edge.
 * Reveal is driven by HeroFly CSS vars (--hero-lenovo-*), not whileInView.
 */
export function LenovoTrustStrip() {
  const { t } = useTranslation();
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
          <div className="relative z-[1] rail-strip__inner page-container flex items-center justify-center md:justify-between gap-4 py-3 sm:py-3.5 md:py-4 lg:py-4.5 xl:py-5 antialiased [transform:translateZ(0)]">
            <div className="flex items-center gap-3.5 sm:gap-5 shrink-0">
              <LenovoPartnershipLogo className="h-7 w-auto shrink-0 sm:h-8 md:h-9 lg:h-10" />
              <div className="text-left">
                <p className="stat-label text-[11px] sm:text-xs text-accent leading-none font-bold tracking-wider uppercase">{t("lenovo.badge", lenovoPartnership.badge)}</p>
                <p className="mt-1 card-title text-sm sm:text-base md:text-lg lg:text-xl font-medium normal-case tracking-tight leading-tight">{t("lenovo.title", lenovoPartnership.title)}</p>
              </div>
            </div>
            <LenovoPartnershipCopy 
              className="hidden md:block w-full max-w-lg lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl ml-auto pl-6 lg:pl-10" 
              paragraphClassName="lenovo-copy-text text-sm md:text-[14.5px] lg:text-[15.5px] xl:text-base leading-relaxed text-pretty"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
