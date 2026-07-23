import { lazy, useEffect } from "react";
import { solutionsPage, primaryCta } from "../data/liveContent";
import { LazySection } from "../layouts/SiteLayout";
import { Magnetic } from "../components/motion-preview/Magnetic";
import { ScrollLink } from "../components/ScrollLink";
import { SectionHeader } from "../components/SectionHeader";

const ValueProps = lazy(() => import("../components/ValueProps").then((m) => ({ default: m.ValueProps })));
const TrafficChannels = lazy(() =>
  import("../components/TrafficChannels").then((m) => ({ default: m.TrafficChannels })),
);
const Process = lazy(() => import("../components/Process").then((m) => ({ default: m.Process })));

/** Solutions depth: page intro + value stack, channel taxonomy, how we work. */
export function SolutionsPage() {
  useEffect(() => {
    const run = () => {
      void import("../components/ValueProps");
      void import("../components/TrafficChannels");
      void import("../components/Process");
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(run, 500);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <main className="site-main pt-[var(--site-header-height)]">
      <section className="section-band section-band--dense border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            animated={false}
            label={solutionsPage.label}
            title={solutionsPage.title}
            description={solutionsPage.description}
          />
          <Magnetic>
            <ScrollLink
              href={primaryCta.href}
              data-cursor="cta"
              className="btn-caps mt-8 inline-block rounded-full bg-orange px-7 py-3.5 text-sm font-semibold text-on-accent hover:bg-orange-light"
            >
              {solutionsPage.ctaLabel}
            </ScrollLink>
          </Magnetic>
        </div>
      </section>
      <LazySection>
        <ValueProps />
      </LazySection>
      <LazySection minHeight="44vh">
          <TrafficChannels variant="full" />
      </LazySection>
      <LazySection>
        <Process />
      </LazySection>
    </main>
  );
}
