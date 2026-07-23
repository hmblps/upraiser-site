import { primaryCta } from "../data/liveContent";
import { Magnetic } from "./motion-preview/Magnetic";
import { ScrollLink } from "./ScrollLink";
import { Reveal } from "./motion/Reveal";

export function HomePilotCta() {
  return (
    <section id="pilot" className="section-band section-band--dense">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 border-t border-border/70 pt-10 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <p className="section-label">Next step</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                Request a pilot on Your stack
              </h2>
              <p className="copy mt-3 text-muted">
                Tell us the vertical, GEO, and KPI event — we reply with a scoped path, not a deck.
              </p>
            </div>
            <Magnetic>
              <ScrollLink
                href={primaryCta.href}
                data-cursor="cta"
                className="btn-caps inline-block shrink-0 rounded-full bg-orange px-7 py-3.5 text-sm font-semibold text-on-accent hover:bg-orange-light"
              >
                {primaryCta.label}
              </ScrollLink>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
