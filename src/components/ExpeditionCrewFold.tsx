import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { motion, useMotionValueEvent, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ASCENT_PROTOCOLS, COMPANY_CONTENT } from "../data/innerPagesData";
import { accentScrollHeroWordClass } from "../lib/accent";
import { clamp, smoothstep } from "../lib/clamp";
import { useSectionScrollProgress } from "../hooks/useSectionScrollProgress";
import { useScrollRunwayEnabled } from "../hooks/useScrollScene";
import { HeroFlyProgressBridge } from "../context/HeroFlyContext";
import { useMode } from "./SectionHeader";
import { ExpeditionEverestSky } from "./ExpeditionEverestSky";
import { TheOperatorsSpec } from "./company/TheOperatorsSpec";
import { ScrollLink } from "./ScrollLink";

type Point = { x: number; y: number };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function noteLead(answer: string) {
  const parts = answer.match(/[^.!?]+[.!?]+/g)?.map((part) => part.trim()) ?? [answer];
  if (parts[0] && parts[0].length < 28 && parts[1]) return `${parts[0]} ${parts[1]}`;
  return parts[0] ?? answer;
}

function windowOpacity(p: number, enter0: number, enter1: number, leave0: number, leave1: number) {
  return smoothstep(p, enter0, enter1) * (1 - smoothstep(p, leave0, leave1));
}



function useBeatOpacity(progress: MotionValue<number>, enter0: number, enter1: number, leave0: number, leave1: number) {
  return useTransform(progress, (p) => windowOpacity(p, enter0, enter1, leave0, leave1));
}

function useCrewPoints({
  stageRef,
  inlineRef,
  heroMeasureRef,
  dockRef,
}: {
  stageRef: RefObject<HTMLElement | null>;
  inlineRef: RefObject<HTMLElement | null>;
  heroMeasureRef: RefObject<HTMLElement | null>;
  dockRef: RefObject<HTMLElement | null>;
}) {
  const [points, setPoints] = useState<{
    inline: Point;
    giant: Point;
    dock: Point;
    inlineScale: number;
    dockScale: number;
  } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const inline = inlineRef.current;
      const hero = heroMeasureRef.current;
      const dock = dockRef.current;
      if (!stage || !inline || !hero || !dock) return;
      if (inline.offsetWidth <= 0 || hero.offsetWidth <= 0 || dock.offsetWidth <= 0) return;

      const stageBox = stage.getBoundingClientRect();
      const inlineBox = inline.getBoundingClientRect();
      const dockBox = dock.getBoundingClientRect();

      setPoints({
        inline: {
          x: inlineBox.left - stageBox.left + inlineBox.width * 0.5,
          y: inlineBox.top - stageBox.top + inlineBox.height * 0.5,
        },
        giant: { x: stageBox.width * 0.36, y: stageBox.height * 0.3 },
        dock: {
          x: dockBox.left - stageBox.left + dockBox.width * 0.5,
          y: dockBox.top - stageBox.top + dockBox.height * 0.5,
        },
        inlineScale: clamp(inlineBox.width / hero.offsetWidth, 0.08, 0.55),
        dockScale: clamp(dockBox.width / hero.offsetWidth, 0.18, 0.72),
      });
    };

    const frame = window.requestAnimationFrame(() => {
      measure();
      window.requestAnimationFrame(measure);
    });
    const observer = new ResizeObserver(measure);
    if (stageRef.current) observer.observe(stageRef.current);
    if (inlineRef.current) observer.observe(inlineRef.current);
    if (heroMeasureRef.current) observer.observe(heroMeasureRef.current);
    if (dockRef.current) observer.observe(dockRef.current);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(() => window.requestAnimationFrame(measure));
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [stageRef, inlineRef, heroMeasureRef, dockRef]);

  return points;
}

function CampCard({
  altitude,
  title,
  text,
}: {
  altitude: string;
  title: string;
  text: string;
}) {
  return (
    <>
      <p className="section-label">{altitude}</p>
      <h2 className="expedition-beat__title mt-2">{title}</h2>
      <p className="copy mt-3 max-w-xl">{text}</p>
    </>
  );
}

function FlightCopy() {
  const { crewFold, camps, cta } = COMPANY_CONTENT.aboutExpedition;
  const { facts } = COMPANY_CONTENT;
  const notes = ASCENT_PROTOCOLS.slice(0, 4);
  const wordClass = accentScrollHeroWordClass("growth");

  return (
    <>
      <div className="expedition-fold__copy">
        <p className="section-label">{crewFold.label}</p>
        <p className="section-lead mt-3 max-w-xl">{crewFold.lead}</p>
        <p className="section-description mt-4 max-w-xl">
          {crewFold.before}
          <span className={`growth-word-inline ${wordClass}`}>{crewFold.word}</span>
          {crewFold.after}
        </p>
      </div>
      {camps.slice(1).map((camp) => (
        <div key={camp.id} className="expedition-beat expedition-beat--static">
          <CampCard altitude={camp.altitude} title={camp.title} text={camp.text} />
        </div>
      ))}
      <div className="expedition-crew-dock mt-12">
        <p className="section-label">{crewFold.operatorsLabel}</p>
        <h2 className={`expedition-crew-heading mt-2 ${wordClass}`}>{crewFold.word}</h2>
        <p className="copy mt-3 max-w-xl">{crewFold.operatorsLead}</p>
        <TheOperatorsSpec immediate />
      </div>
      <div className="expedition-beat expedition-beat--static mt-12">
        <p className="section-label">Trail notes</p>
        <ul className="expedition-notes mt-4">
          {notes.map((note) => (
            <li key={note.protocolNumber}>
              <p className="expedition-notes__q">{note.question}</p>
              <p className="copy mt-1">{noteLead(note.answer)}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="expedition-beat expedition-beat--static mt-12">
        <p className="section-label">Registered desk</p>
        <div className="expedition-facts mt-5">
          {facts.map((item) => (
            <div key={item.label}>
              <p className="card-kicker text-muted-light">{item.label}</p>
              <p className="card-title mt-1">{item.value}</p>
            </div>
          ))}
        </div>
        <p className="copy mt-6 max-w-md">
          UPRAISER Agency LLP · 128 City Road, London EC1V 2NX · ICO ZC000436
        </p>
        <p className="section-heading section-heading--sm mt-10">{cta.title}</p>
        <p className="copy mt-2 max-w-xl">{cta.text}</p>
        <motion.div
          className="mt-5 inline-flex"
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
        >
          <ScrollLink
            href="/contact"
            data-cursor="cta"
            className="btn-caps btn-caps--primary inline-flex min-h-[44px] select-none items-center justify-center rounded-full px-7 py-3 touch-manipulation"
          >
            {cta.button}
          </ScrollLink>
        </motion.div>
      </div>
    </>
  );
}

function CrewStatic() {
  return (
    <section className="expedition-fold expedition-fold--static">
      <div className="expedition-fold__pin">
        <ExpeditionEverestSky />
        <div className="expedition-fold__stage section-inner">
          <FlightCopy />
        </div>
      </div>
    </section>
  );
}


function AnimatedCampBlock({ 
  progress, 
  camp, 
  enter, 
  leave, 
  direction 
}: { 
  progress: MotionValue<number>; 
  camp: { altitude: string; title: string; text: string; };
  enter: [number, number];
  leave: [number, number];
  direction: 'left' | 'right';
}) {
  // Spring physics for Emil Kowalski butteriness
  const smoothP = useSpring(progress, { stiffness: 60, damping: 18, mass: 0.8 });
  
  const opacity = useTransform(smoothP, [enter[0], enter[1], leave[0], leave[1]], [0, 1, 1, 0]);
  
  const xOffset = direction === 'left' ? -100 : 100;
  const x = useTransform(smoothP, [enter[0], enter[1], leave[0], leave[1]], [xOffset, 0, 0, -xOffset]);
  
  // Slight float up
  const y = useTransform(smoothP, [enter[0], enter[1], leave[0], leave[1]], [40, 0, 0, -40]);
  
  // Dimensional scale
  const scale = useTransform(smoothP, [enter[0], enter[1], leave[0], leave[1]], [0.92, 1, 1, 0.92]);
  
  // Apple-like blur reveal
  const filter = useTransform(smoothP, [enter[0], enter[1], leave[0], leave[1]], ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"]);

  const alignmentClass = direction === 'right' ? 'ml-auto text-left md:text-right right-0 left-auto' : '';

  return (
    <motion.div 
      className={`expedition-beat ${alignmentClass}`} 
      style={{ opacity, x, y, scale, filter }}
    >
      <CampCard altitude={camp.altitude} title={camp.title} text={camp.text} />
    </motion.div>
  );
}

function CrewAnimated() {

  const { mode } = useMode();
  const { crewFold, camps, cta } = COMPANY_CONTENT.aboutExpedition;
  const { facts } = COMPANY_CONTENT;
  const notes = ASCENT_PROTOCOLS.slice(0, 4);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inlineRef = useRef<HTMLSpanElement>(null);
  const heroMeasureRef = useRef<HTMLSpanElement>(null);
  const dockRef = useRef<HTMLSpanElement>(null);
  const progress = useSectionScrollProgress(sectionRef, mode);
  const points = useCrewPoints({ stageRef, inlineRef, heroMeasureRef, dockRef });
  const wordClass = accentScrollHeroWordClass(mode);
  
  const baseCamp = camps[0];
  const campI = camps[1];
  const campII = camps[2];
  const summit = camps[3];

  const lift0 = 0.08, lift1 = 0.16;
  const settle0 = 0.74, settle1 = 0.82;

  // Apply spring to CREW float animation as well
  const floatP = useSpring(progress, { stiffness: 60, damping: 20, mass: 0.8 });
  
  const x = useTransform(floatP, (p) => {
    if (!points) return 0;
    const lift = smoothstep(p, lift0, lift1);
    const settle = smoothstep(p, settle0, settle1);
    const fromX = lerp(points.inline.x, points.giant.x, lift);
    return lerp(fromX, points.dock.x, settle) - points.inline.x;
  });
  const y = useTransform(floatP, (p) => {
    if (!points) return 0;
    const lift = smoothstep(p, lift0, lift1);
    const settle = smoothstep(p, settle0, settle1);
    const fromY = lerp(points.inline.y, points.giant.y, lift);
    return lerp(fromY, points.dock.y, settle) - points.inline.y;
  });
  const scale = useTransform(floatP, (p) => {
    if (!points) return 0.2;
    const lift = smoothstep(p, lift0, lift1);
    const settle = smoothstep(p, settle0, settle1);
    const grown = lerp(points.inlineScale, 1, lift);
    return lerp(grown, points.dockScale, settle);
  });
  
  
  // The camps will be rendered using AnimatedCampBlock so we don't need these hooks
  const smoothP = useSpring(progress, { stiffness: 60, damping: 18, mass: 0.8 });
  const copyOpacity = useTransform(smoothP, (p) => 1 - smoothstep(p, 0.08, 0.12));
  const floatOpacity = useTransform(smoothP, (p) => 1 - smoothstep(p, 0.94, 0.98));

  
  

  
  const dockOpacity = useBeatOpacity(smoothP, 0.76, 0.80, 0.86, 0.88);
  const notesOpacity = useBeatOpacity(smoothP, 0.84, 0.88, 0.93, 0.95);
  const deskOpacity = useBeatOpacity(smoothP, 0.93, 0.96, 1.1, 1.2);
  
  const deskPointer = useTransform(progress, (p) => (p >= 0.91 ? "auto" : "none"));
  const settle = useTransform(progress, (p) => 0.04 + smoothstep(p, 0.9, 1) * 0.16);
  
  const veil = useTransform(progress, (p) => {
    const open = 1 - smoothstep(p, 0.06, 0.14) * 0.55;
    const desk = smoothstep(p, 0.9, 0.96) * 0.2;
    return Math.min(1, open + desk);
  });
  
  const flyRef = useRef(0);
  useMotionValueEvent(progress, "change", (p) => {
    flyRef.current = p;
  });

  return (
    <section
      ref={sectionRef}
      className="expedition-fold expedition-fold--flight accent-scroll-section accent-scroll-section--lite scroll-scene scroll-scene--fold"
    >
      <div className="expedition-fold__pin">
        <HeroFlyProgressBridge progressRef={flyRef}>
          <ExpeditionEverestSky veil={veil} settle={settle} />
        </HeroFlyProgressBridge>
        <div ref={stageRef} className="expedition-fold__stage section-inner relative">
          <span ref={heroMeasureRef} className={`accent-scroll-hero-word ${wordClass} expedition-crew-measure`} aria-hidden>
            {crewFold.word}
          </span>

          <motion.div className="expedition-fold__copy" style={{ opacity: copyOpacity }}>
            <p className="section-label">{crewFold.label}</p>
            <p className="section-lead mt-3 max-w-xl">{crewFold.lead}</p>
            <p className="section-description mt-4 max-w-xl">
              {crewFold.before}
              <span
                ref={inlineRef}
                className={`growth-word-inline${points ? " expedition-crew-inline--ghost" : ""}`}
              >
                {crewFold.word}
              </span>
              {crewFold.after}
            </p>
          </motion.div>

          {points ? (
            <motion.div
              aria-hidden
              className="expedition-fold__float accent-scroll-float pointer-events-none absolute z-10 origin-center"
              style={{
                left: points.inline.x,
                top: points.inline.y,
                x,
                y,
                scale,
                opacity: floatOpacity,
              }}
            >
              <span className={`accent-scroll-hero-word ${wordClass}`}>{crewFold.word}</span>
            </motion.div>
          ) : null}

          {baseCamp ? (
            <AnimatedCampBlock progress={progress} camp={baseCamp} enter={[0.14, 0.18]} leave={[0.26, 0.30]} direction="left" />
          ) : null}

          {campI ? (
            <AnimatedCampBlock progress={progress} camp={campI} enter={[0.30, 0.34]} leave={[0.42, 0.46]} direction="right" />
          ) : null}

          {campII ? (
            <AnimatedCampBlock progress={progress} camp={campII} enter={[0.46, 0.50]} leave={[0.58, 0.62]} direction="left" />
          ) : null}
          
          {summit ? (
            <AnimatedCampBlock progress={progress} camp={summit} enter={[0.62, 0.66]} leave={[0.74, 0.78]} direction="right" />
          ) : null}

          <div className="expedition-fold__dock">
            <motion.div style={{ opacity: dockOpacity }}>
              <p className="section-label">{crewFold.operatorsLabel}</p>
              <h2 className="expedition-crew-heading mt-2">
                <span ref={dockRef} className="expedition-crew-dock-word" aria-hidden>
                  {crewFold.word}
                </span>
                <span className="sr-only">{crewFold.word}</span>
              </h2>
              <p className="copy mt-3 max-w-xl">{crewFold.operatorsLead}</p>
              <TheOperatorsSpec immediate />
            </motion.div>

            <motion.div className="expedition-beat expedition-beat--dock" style={{ opacity: notesOpacity }}>
              <p className="section-label">Trail notes</p>
              <ul className="expedition-notes mt-4">
                {notes.map((note) => (
                  <li key={note.protocolNumber}>
                    <p className="expedition-notes__q">{note.question}</p>
                    <p className="copy mt-1">{noteLead(note.answer)}</p>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="expedition-beat expedition-beat--dock expedition-beat--cta"
              style={{ opacity: deskOpacity, pointerEvents: deskPointer }}
            >
              <p className="section-label">Registered desk</p>
              <div className="expedition-facts mt-5">
                {facts.map((item) => (
                  <div key={item.label}>
                    <p className="card-kicker text-muted-light">{item.label}</p>
                    <p className="card-title mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
              <p className="copy mt-5 max-w-md">
                UPRAISER Agency LLP · 128 City Road, London EC1V 2NX · ICO ZC000436
              </p>
              <p className="section-heading section-heading--sm mt-8">{cta.title}</p>
              <p className="copy mt-2 max-w-xl">{cta.text}</p>
              <motion.div
                className="mt-5 inline-flex"
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
              >
                <ScrollLink
                  href="/contact"
                  data-cursor="cta"
                  className="btn-caps btn-caps--primary inline-flex min-h-[44px] select-none items-center justify-center rounded-full px-7 py-3 touch-manipulation"
                >
                  {cta.button}
                </ScrollLink>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ExpeditionCrewFold() {
  const runway = useScrollRunwayEnabled();
  if (!runway) return <CrewStatic />;
  return <CrewAnimated />;
}
