import { CRAFT_CONTENT } from "../data/innerPagesData";
import { ScrollLink } from "./ScrollLink";
import { StudioCraftVisual, studioCraftKind } from "./StudioCraftVisual";
import { BentoGrid, BentoGridItem } from "./magicui/BentoGrid";
import { useMode } from "./SectionHeader";
import { ModeContentTransition } from "./motion/ModeContentTransition";

/**
 * The Craft — full-spectrum: Creative Lab + Proprietary Layer.
 * Growth → conversion / closed loop · Infrastructure → audit / invoice defense.
 */
export function Craft() {
  const { mode } = useMode();
  const lead = CRAFT_CONTENT.byMode[mode].lead;

  return (
    <div className="depth-page depth-page--craft pb-32">
      <div className="section-inner flex flex-col pt-8 lg:pt-16">
        <header className="viewport-page__intro shrink-0 max-w-2xl">
          <p className="section-label text-accent">{CRAFT_CONTENT.hero.badge}</p>
          <h1 className="section-title mt-2 lg:mt-4 text-4xl lg:text-5xl tracking-tight leading-[1.1]">{CRAFT_CONTENT.hero.h1}</h1>
          <ModeContentTransition mode={mode}>
            <p className="section-description mt-4 lg:mt-6 text-lg text-muted-light">{lead}</p>
          </ModeContentTransition>
        </header>

        <div className="flex flex-col gap-24 lg:gap-32 mt-16 lg:mt-24">
          
          {/* Creative Lab Section */}
          <section className="flex flex-col gap-6">
            <header className="max-w-2xl">
              <p className="stat-label text-accent">{CRAFT_CONTENT.creativeLab.metaphor}</p>
              <p className="panel-lede mt-3 text-2xl lg:text-3xl leading-tight">
                {CRAFT_CONTENT.creativeLab.byMode[mode].lead}
              </p>
            </header>
            
            <BentoGrid className="mt-8 md:grid-cols-3 md:gap-4 lg:gap-6">
              {CRAFT_CONTENT.creativeLab.items.map((item) => (
                <BentoGridItem
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  className="p-6 bg-bg-card border-border/10 hover:border-accent/20 transition-colors"
                  header={<StudioCraftVisual kind={studioCraftKind(item.title)} />}
                />
              ))}
            </BentoGrid>
          </section>

          {/* Proprietary Layer Section */}
          <section className="flex flex-col gap-6 pt-16 border-t border-border/10">
            <header className="max-w-2xl">
              <p className="stat-label text-accent">{CRAFT_CONTENT.proprietary.metaphor}</p>
              <p className="panel-lede mt-3 text-2xl lg:text-3xl leading-tight">
                {CRAFT_CONTENT.proprietary.byMode[mode].lead}
              </p>
            </header>

            <ul className="depth-feature-list mt-8 flex flex-col gap-6 lg:gap-10">
              {CRAFT_CONTENT.proprietary.points.map((point, index) => (
                <li key={point.title} className="depth-feature-row group relative pl-12 lg:pl-16">
                  <span className="depth-feature-row__index absolute left-0 top-1 text-accent/50 font-mono text-lg transition-colors group-hover:text-accent" aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="depth-feature-row__body">
                    <p className="depth-feature-row__title text-xl font-medium tracking-tight mb-2">{point.title}</p>
                    <p className="depth-feature-row__text text-muted max-w-3xl leading-relaxed">{point.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Close Section */}
          <div className="pt-16 border-t border-border/20 max-w-xl">
            <ScrollLink
              href={`/contact?intent=${CRAFT_CONTENT.close.contactIntent}`}
              data-cursor="cta"
              className="btn-caps btn-caps--primary"
            >
              {CRAFT_CONTENT.close.ctaLabel}
            </ScrollLink>
            <p className="viewport-page__footnote mt-6 text-muted-light">
              {CRAFT_CONTENT.close.footnote}{" "}
              <ScrollLink href="/solutions" className="text-accent hover:text-accent/80 transition-colors">The Routes →</ScrollLink>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
