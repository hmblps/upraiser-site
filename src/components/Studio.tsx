import { GEAR_CONTENT } from "../data/innerPagesData";
import { ScrollLink } from "./ScrollLink";
import { useMode } from "./SectionHeader";
import { ModeContentTransition } from "./motion/ModeContentTransition";

/**
 * The Gear (/studio) — tech stack as expedition equipment.
 * Growth → scalability · Infrastructure → audit / precision.
 */
export function Studio() {
  const { mode } = useMode();
  const lead = GEAR_CONTENT.byMode[mode].lead;

  return (
    <div className="depth-page depth-page--studio depth-page--gear pb-32">
      <div className="section-inner flex flex-col pt-8 lg:pt-16">
        <header className="viewport-page__intro shrink-0 max-w-2xl">
          <p className="section-label text-accent">{GEAR_CONTENT.hero.badge}</p>
          <h1 className="section-title mt-2 lg:mt-4 text-4xl lg:text-5xl tracking-tight leading-[1.1]">{GEAR_CONTENT.hero.h1}</h1>
          <ModeContentTransition mode={mode}>
            <p className="section-description mt-4 lg:mt-6 text-lg text-muted-light">{lead}</p>
          </ModeContentTransition>
        </header>

        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16 mt-16 lg:mt-24 relative">
          
          {/* Sticky Visual Column */}
          <div className="lg:w-5/12 shrink-0 lg:sticky lg:top-32 hidden lg:block">
            <div className="gear-spec__blueprint aspect-square relative" aria-hidden>
              <span className="gear-spec__grid" />
              <span className="gear-spec__crosshair gear-spec__crosshair--tl" />
              <span className="gear-spec__crosshair gear-spec__crosshair--br" />
            </div>
            
            <div className="mt-8 pt-8 border-t border-border/20">
              <ScrollLink
                href={`/contact?intent=${GEAR_CONTENT.close.contactIntent}`}
                data-cursor="cta"
                className="btn-caps btn-caps--primary"
              >
                {GEAR_CONTENT.close.ctaLabel}
              </ScrollLink>
              <p className="viewport-page__footnote mt-4">
                {GEAR_CONTENT.close.footnote}{" "}
                <ScrollLink href="/solutions">The Routes →</ScrollLink>
              </p>
            </div>
          </div>

          {/* Scrolling Specs Column */}
          <div className="flex-1 flex flex-col gap-16 lg:gap-32">
            {GEAR_CONTENT.tabs.map((tab) => {
              const piece = GEAR_CONTENT.pieces[tab.id];
              const copy = piece[mode];
              
              return (
                <article key={tab.id} className="gear-spec flex flex-col">
                  {/* Mobile-only visual */}
                  <div className="gear-spec__blueprint aspect-square relative mb-6 lg:hidden" aria-hidden>
                    <span className="gear-spec__grid" />
                    <span className="gear-spec__crosshair gear-spec__crosshair--tl" />
                    <span className="gear-spec__crosshair gear-spec__crosshair--br" />
                  </div>

                  <div className="gear-spec__body">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="stat-label text-accent">{piece.mark}</span>
                      <span className="text-micro text-muted uppercase tracking-widest">{piece.kicker}</span>
                    </div>
                    <h2 className="card-title mt-2 text-2xl lg:text-3xl">{piece.title}</h2>
                    <p className="copy mt-3 max-w-2xl text-base lg:text-lg">{copy.body}</p>

                    <div className="gear-spec__sheet mt-6 bg-bg-card/40 border border-border/20 rounded-lg p-5">
                      <p className="text-micro text-accent mb-2">
                        {mode === "growth" ? "Scale spec" : "Audit spec"}
                      </p>
                      <p className="spec-mono font-mono text-sm leading-relaxed">{copy.spec}</p>
                    </div>
                  </div>
                </article>
              );
            })}

            {/* Mobile-only close CTA */}
            <div className="lg:hidden mt-8 pt-8 border-t border-border/20">
              <ScrollLink
                href={`/contact?intent=${GEAR_CONTENT.close.contactIntent}`}
                data-cursor="cta"
                className="btn-caps btn-caps--primary"
              >
                {GEAR_CONTENT.close.ctaLabel}
              </ScrollLink>
              <p className="viewport-page__footnote mt-4">
                {GEAR_CONTENT.close.footnote}{" "}
                <ScrollLink href="/solutions">The Routes →</ScrollLink>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

