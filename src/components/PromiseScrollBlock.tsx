import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { promise } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { accentLink } from "../lib/accent";
import { AccentWord } from "./AccentWord";
import { SectionHeader } from "./SectionHeader";

type Point = { x: number; y: number };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function PromiseAccentStatic() {
  return (
    <section id="promise" className="section-band scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader label={promise.label} labelAccent="gold" />
        <h2 className="section-title max-w-3xl">
          {promise.titleLead}
          <AccentWord tone="red">{promise.accentWord}</AccentWord>.
        </h2>
        <p className="section-description">{promise.description}</p>
        <a href="#contact" className={`link-caps mt-8 inline-flex ${accentLink("gold")}`}>
          Start a Conversation →
        </a>
      </div>
    </section>
  );
}

function PromiseScrollAnimated() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inlineRef = useRef<HTMLSpanElement>(null);
  const [points, setPoints] = useState<{ start: Point; end: Point } | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const inline = inlineRef.current;
      if (!stage || !inline) return;

      const stageRect = stage.getBoundingClientRect();
      const inlineRect = inline.getBoundingClientRect();

      setPoints({
        start: { x: stageRect.width * 0.5, y: stageRect.height * 0.34 },
        end: {
          x: inlineRect.left - stageRect.left + inlineRect.width * 0.5,
          y: inlineRect.top - stageRect.top + inlineRect.height * 0.5,
        },
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (stageRef.current) observer.observe(stageRef.current);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const floatOpacity = useTransform(progress, [0, 0.1, 0.62, 0.74], [1, 1, 1, 0]);
  const inlineOpacity = useTransform(progress, [0, 0.66, 0.8], [0, 0, 1]);
  const titleLeadOpacity = useTransform(progress, [0.48, 0.62], [0, 1]);
  const titleLeadX = useTransform(progress, [0.48, 0.62], [-14, 0]);
  const bodyOpacity = useTransform(progress, [0.58, 0.72], [0, 1]);
  const bodyX = useTransform(progress, [0.58, 0.72], [-14, 0]);
  const floatScale = useTransform(progress, [0.06, 0.68], [1, 0.22]);

  const floatX = useTransform(progress, (value: number) => {
    if (!points) return 0;
    const t = clamp((value - 0.08) / 0.58, 0, 1);
    return lerp(points.start.x, points.end.x, t) - points.start.x;
  });

  const floatY = useTransform(progress, (value: number) => {
    if (!points) return 0;
    const t = clamp((value - 0.08) / 0.58, 0, 1);
    return lerp(points.start.y, points.end.y, t) - points.start.y;
  });

  return (
    <section
      id="promise"
      ref={sectionRef}
      className="accent-scroll-section accent-scroll-section--lite section-band scroll-mt-24"
    >
      <div className="accent-scroll-sticky mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader label={promise.label} labelAccent="gold" />

        <div ref={stageRef} className="accent-scroll-stage relative mt-8 md:mt-10">
          {points ? (
            <motion.div
              aria-hidden
              className="accent-scroll-float pointer-events-none absolute z-10 origin-center"
              style={{
                left: points.start.x,
                top: points.start.y,
                x: floatX,
                y: floatY,
                scale: floatScale,
                opacity: floatOpacity,
              }}
            >
              <span className="accent-scroll-hero-word accent-scroll-hero-word-red">{promise.scrollHeroWord}</span>
            </motion.div>
          ) : (
            <div className="accent-scroll-float-placeholder" aria-hidden>
              <span className="accent-scroll-hero-word accent-scroll-hero-word-red">{promise.scrollHeroWord}</span>
            </div>
          )}

          <div className="accent-scroll-copy accent-scroll-copy--lite">
            <h2 className="section-title max-w-3xl">
              <motion.span style={{ opacity: titleLeadOpacity, x: titleLeadX }} className="inline">
                {promise.titleLead}
              </motion.span>
              <span ref={inlineRef} className="relative inline-block min-w-[6.5ch]">
                <motion.span style={{ opacity: inlineOpacity }} className="inline">
                  <AccentWord tone="red">{promise.accentWord}</AccentWord>
                </motion.span>
              </span>
              <motion.span style={{ opacity: titleLeadOpacity, x: titleLeadX }} className="inline">
                .
              </motion.span>
            </h2>

            <motion.p style={{ opacity: bodyOpacity, x: bodyX }} className="section-description">
              {promise.description}
            </motion.p>

            <motion.div style={{ opacity: bodyOpacity, x: bodyX }}>
              <a href="#contact" className={`link-caps mt-8 inline-flex ${accentLink("gold")}`}>
                Start a Conversation →
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PromiseScrollBlock() {
  const reduced = useReducedMotion();
  return reduced ? <PromiseAccentStatic /> : <PromiseScrollAnimated />;
}
