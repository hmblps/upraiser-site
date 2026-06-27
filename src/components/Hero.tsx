import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { EASE_OUT } from "../lib/motion";
import { useCountUp } from "../hooks/useCountUp";
import { useApplePreview } from "../hooks/useApplePreview";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { Stagger, StaggerItem } from "./motion/Stagger";
import { Magnetic } from "./motion-preview/Magnetic";
import { HeroHighlights } from "./apple-preview/HeroHighlights";
import { highlights, primaryCta } from "../data/content";
import { HeroAtmosphere } from "./HeroAtmosphere";

const headlineLines = ["We see how stunning", "Your rise to the top", "can be."];

function StatCard({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const display = useCountUp(value, active);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      className="hero-stat-card card-lift h-full rounded-2xl border border-border bg-bg-card p-6 hover:border-orange/30 lg:p-8"
    >
      <div className="text-2xl font-bold text-orange">{display}</div>
      <p className="stat-label mt-2 text-muted-light">{label}</p>
    </article>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  const { isActive } = useApplePreview();

  return (
    <section className="relative flex flex-1 flex-col overflow-hidden pt-24 pb-8 lg:pt-32 lg:pb-12">
      <HeroAtmosphere />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-end gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="section-label section-label-red mb-4"
            >
              UPRAISER · Charting the Ascent
            </motion.p>

            <h1 className="hero-title max-w-3xl text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
              {headlineLines.map((line, index) => (
                <motion.span
                  key={line}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.12 + index * 0.1, ease: EASE_OUT }}
                  className="block"
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.45, ease: EASE_OUT }}
              className="section-description mt-6 max-w-xl text-lg"
            >
              Revolutionary technical solutions and smart marketing strategy — built to acquire, retain, and monetize
              high-value users across iGaming, Fintech, and premium media.
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.58, ease: EASE_OUT }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Magnetic>
                <a
                  href={primaryCta.href}
                  data-cursor="cta"
                  className="btn-caps inline-block rounded-full bg-orange px-7 py-3 text-sm font-semibold text-on-accent transition hover:bg-orange-light hover:shadow-[0_8px_24px_rgba(253,216,53,0.25)]"
                >
                  {primaryCta.label}
                </a>
              </Magnetic>
              <Magnetic strength={0.22}>
                <a
                  href="#cases"
                  className="btn-caps inline-block rounded-full border border-border px-7 py-3 text-sm font-semibold transition hover:border-fg/30 hover:bg-bg-card"
                >
                  View Case Studies
                </a>
              </Magnetic>
            </motion.div>

            {isActive("highlights") ? <HeroHighlights /> : null}
          </div>

          <Stagger
            className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
            stagger={0.08}
          >
            {highlights.map((item) => (
              <StaggerItem key={item.label} className="w-[min(68vw,11.5rem)] shrink-0 snap-start md:w-auto">
                <StatCard value={item.value} label={item.label} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
