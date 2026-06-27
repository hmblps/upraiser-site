import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionStyle } from "framer-motion";
import { audience, primaryCta } from "../data/content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { accentLink } from "../lib/accent";
import { SectionHeader } from "./SectionHeader";

type Point = { x: number; y: number };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function GrowthWordInline() {
  return <span className="growth-word-inline">{audience.growthWord}</span>;
}

function AudienceCta() {
  return (
    <a href={primaryCta.href} className={`link-caps inline-flex ${accentLink("red")}`}>
      {audience.cta} →
    </a>
  );
}

function AudienceLine({ children, style }: { children: ReactNode; style?: MotionStyle }) {
  if (style) {
    return (
      <motion.p className="section-lead" style={style}>
        {children}
      </motion.p>
    );
  }

  return <p className="section-lead">{children}</p>;
}

function GrowthScrollStatic() {
  return (
    <section id="audience" className="section-band scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader label={audience.label} title={audience.title} />
        <div className="mt-10 flex max-w-3xl flex-col gap-6 md:mt-14">
          <AudienceLine>{audience.line1}</AudienceLine>
          <AudienceLine>
            {audience.line2Prefix} <GrowthWordInline />
          </AudienceLine>
          <AudienceCta />
        </div>
      </div>
    </section>
  );
}

function GrowthScrollAnimated() {
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
  const line1Opacity = useTransform(progress, [0.48, 0.62], [0, 1]);
  const line1X = useTransform(progress, [0.48, 0.62], [-14, 0]);
  const line2Opacity = useTransform(progress, [0.58, 0.72], [0, 1]);
  const line2X = useTransform(progress, [0.58, 0.72], [-14, 0]);
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

  const line2Motion = { opacity: line2Opacity, x: line2X };

  return (
    <section
      id="audience"
      ref={sectionRef}
      className="accent-scroll-section accent-scroll-section--lite section-band scroll-mt-24"
    >
      <div className="accent-scroll-sticky mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader label={audience.label} title={audience.title} />

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
              <span className="accent-scroll-hero-word accent-scroll-hero-word-red">{audience.scrollHeroWord}</span>
            </motion.div>
          ) : (
            <div className="accent-scroll-float-placeholder" aria-hidden>
              <span className="accent-scroll-hero-word accent-scroll-hero-word-red">{audience.scrollHeroWord}</span>
            </div>
          )}

          <div className="accent-scroll-copy accent-scroll-copy--lite">
            <AudienceLine style={{ opacity: line1Opacity, x: line1X }}>{audience.line1}</AudienceLine>

            <p className="section-lead">
              <motion.span style={line2Motion} className="inline">
                {audience.line2Prefix}{" "}
              </motion.span>
              <span ref={inlineRef} className="relative inline-block min-w-[6.5ch]">
                <motion.span style={{ opacity: inlineOpacity }} className="inline">
                  <GrowthWordInline />
                </motion.span>
              </span>
            </p>

            <motion.div style={line2Motion}>
              <AudienceCta />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GrowthScrollBlock() {
  const reduced = useReducedMotion();
  return reduced ? <GrowthScrollStatic /> : <GrowthScrollAnimated />;
}
