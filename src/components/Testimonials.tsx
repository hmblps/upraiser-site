import { sections, testimonials } from "../data/content";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./motion/Reveal";

export function Testimonials() {
  return (
    <section id="testimonials" className="section-band">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <SectionHeader label={sections.testimonials.label} title={sections.testimonials.title} />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="carousel-fade relative mt-8 md:mt-12">
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
              {testimonials.map((item) => (
                <blockquote
                  key={item.id}
                  className="card-lift flex w-[min(85vw,320px)] shrink-0 snap-center flex-col rounded-2xl border border-border bg-bg-card p-5 md:w-auto md:shrink md:p-6"
                >
                  <span className="rounded-full bg-orange/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-orange">
                    {item.vertical}
                  </span>
                  <p className="copy mt-4 flex-1 text-sm leading-relaxed text-fg">&ldquo;{item.quote}&rdquo;</p>
                  <footer className="mt-5 border-t border-border pt-4 md:mt-6">
                    <cite className="not-italic">
                      <div className="text-sm font-semibold text-fg">{item.role}</div>
                      <div className="mt-0.5 text-xs text-muted-light">{item.company}</div>
                    </cite>
                  </footer>
                </blockquote>
              ))}
            </div>
            <p className="scroll-hint mt-2 text-xs text-muted md:hidden">
              Swipe for more <span aria-hidden>→</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
