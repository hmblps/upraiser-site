import { CLIENTS_CONTENT } from "../data/innerPagesData";
import { clientBrands } from "../data/clients";
import { ScrollLink } from "./ScrollLink";
import { AutoScaledLogo } from "./AutoScaledLogo";

/**
 * Clients — Saatchi-style proof board in a continuous vertical flow.
 */
export function Clients() {
  return (
    <div className="depth-page depth-page--clients pb-32">
      <div className="section-inner flex flex-col pt-8 lg:pt-16">
        <header className="viewport-page__intro shrink-0 max-w-2xl">
          <p className="section-label text-accent">{CLIENTS_CONTENT.hero.badge}</p>
          <h1 className="section-title section-title--compact mt-2 lg:mt-4">{CLIENTS_CONTENT.hero.h1}</h1>
          <p className="section-description mt-4 lg:mt-6">{CLIENTS_CONTENT.lead}</p>
        </header>

        <div className="mt-16 lg:mt-24">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:gap-4">
            {clientBrands.map((brand) => (
              <li
                key={brand.slug}
                className="group flex h-24 lg:h-32 items-center justify-center rounded-xl border border-border/20 bg-bg-card/40 px-4 py-4 hover:border-accent/30 transition-colors"
              >
                {brand.logo ? (
                  <AutoScaledLogo
                    src={brand.logo}
                    alt={brand.name}
                    baseScale={brand.scale}
                    className="max-h-12 max-w-full object-contain opacity-70 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  />
                ) : (
                  <span className="text-center text-caption text-fg/80">
                    {brand.name}
                  </span>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-16 pt-8 border-t border-border/20 max-w-xl">
            <ScrollLink
              href="/contact"
              data-cursor="cta"
              className="btn-caps btn-caps--primary"
            >
              {CLIENTS_CONTENT.ctaLabel}
            </ScrollLink>
            <p className="viewport-page__footnote mt-6 text-muted-light">
              {clientBrands.length} brands total
              {" · "}
              <ScrollLink href="/solutions" className="text-accent hover:text-accent/80 transition-colors">The Routes</ScrollLink>
              {" · "}
              <ScrollLink href="/#cases" className="text-accent hover:text-accent/80 transition-colors">The Peaks</ScrollLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
