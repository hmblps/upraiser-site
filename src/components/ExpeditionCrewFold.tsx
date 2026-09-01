import { useEffect, useRef,  } from "react";
import { motion, useMotionValueEvent, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ASCENT_PROTOCOLS, COMPANY_CONTENT } from "../data/innerPagesData";

import { smoothstep } from "../lib/clamp";
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
import { useSectionScrollProgress } from "../hooks/useSectionScrollProgress";
import { useScrollRunwayEnabled } from "../hooks/useScrollScene";
import { HeroFlyProgressBridge } from "../context/HeroFlyContext";

import { ExpeditionEverestSky } from "./ExpeditionEverestSky";
import { TheOperatorsSpec } from "./company/TheOperatorsSpec";
import { ScrollLink } from "./ScrollLink";

const { crewFold, camps, cta } = COMPANY_CONTENT.aboutExpedition;
const facts = COMPANY_CONTENT.facts;
const notes = ASCENT_PROTOCOLS;

function noteLead(text: string) {
  const parts = text.split("—");
  if (parts.length > 1) {
    return (
      <>
        <strong>{parts[0]}—</strong>
        {parts.slice(1).join("—")}
      </>
    );
  }
  return text;
}

/** Emil Kowalski Spring Configs */
const SPRING_SMOOTH = { stiffness: 60, damping: 18, mass: 0.8 };
const SPRING_BOUNCE = { type: "spring", stiffness: 420, damping: 28 };

function useBeatOpacity(progress: MotionValue<number>, in0: number, in1: number, out0: number, out1: number) {
  return useTransform(progress, (p) => {
    return smoothstep(p, in0, in1) * (1 - smoothstep(p, out0, out1));
  });
}

function AnimatedCampBlock({
  progress,
  camp,
  enter,
  leave,
  direction = "left",
}: {
  progress: MotionValue<number>;
  camp: { altitude: string; title: string; text: string };
  enter: [number, number];
  leave: [number, number];
  direction?: "left" | "right";
}) {
  const opacity = useBeatOpacity(progress, enter[0], enter[1], leave[0], leave[1]);
  
  const y = useTransform(progress, (p) => {
    const inPhase = smoothstep(p, enter[0], enter[1]);
    const outPhase = smoothstep(p, leave[0], leave[1]);
    if (p < enter[1]) return lerp(30, 0, inPhase);
    return lerp(0, -30, outPhase);
  });

  const filter = useTransform(progress, (p) => {
    const inPhase = smoothstep(p, enter[0], enter[1]);
    const outPhase = smoothstep(p, leave[0], leave[1]);
    if (p < enter[1]) return `blur(${lerp(8, 0, inPhase)}px)`;
    return `blur(${lerp(0, 8, outPhase)}px)`;
  });

  const alignClass = direction === "left" ? "text-left left-[10%] items-start" : "text-right right-[10%] items-end";

  return (
    <motion.div
      className={`absolute top-1/2 -translate-y-1/2 flex flex-col ${alignClass} pointer-events-none z-[5]`}
      style={{ opacity, y, filter }}
    >
      <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 dark:border-white/10 mb-3 shadow-xl">
        <p className="expedition-crew-card__role !m-0 !text-[11px]">{camp.altitude}</p>
      </div>
      <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--theme-text)] leading-none drop-shadow-md">
        {camp.title}
      </h3>
      <p className="mt-3 text-lg opacity-80 max-w-sm drop-shadow-md">{camp.text}</p>
    </motion.div>
  );
}

function CrewAnimated() {
  
  // unused
  const sectionRef = useRef<HTMLElement>(null);
  const rawProgress = useSectionScrollProgress(sectionRef);
  const progress = useSpring(rawProgress, SPRING_SMOOTH);

  const [baseCamp, campI, campII, summit] = camps;

  // Timings
  const copyOpacity = useTransform(progress, (p) => 1 - smoothstep(p, 0.04, 0.08));
  
  const dockOpacity = useBeatOpacity(progress, 0.72, 0.76, 0.82, 0.86);
  const notesOpacity = useBeatOpacity(progress, 0.80, 0.84, 0.90, 0.93);
  const deskOpacity = useBeatOpacity(progress, 0.88, 0.92, 1.1, 1.2);
  
  const deskPointer = useTransform(progress, (p) => (p >= 0.88 ? "auto" : "none"));
  
  // Settle pushes the 3D scene up so the desk can slide in underneath
  const settle = useTransform(progress, (p) => smoothstep(p, 0.85, 0.95) * 0.25);
  
  // Veil logic (fog clearing)
  const veil = useTransform(progress, (p) => {
    const open = 1 - smoothstep(p, 0.05, 0.15) * 0.6; // initial fade
    const deskFade = smoothstep(p, 0.85, 0.95) * 0.3; // darkens as we read desk
    return Math.min(1, open + deskFade);
  });
  
  const flyRef = useRef(0);
  useMotionValueEvent(progress, "change", (p) => {
    flyRef.current = p;
    // Fade out global blizzard css variable as we ascend
    const snowOpacity = 1 - Math.min(1, Math.max(0, (p - 0.15) / 0.3));
    document.documentElement.style.setProperty("--global-snow-opacity", snowOpacity.toString());
  });
  
  useEffect(() => {
    return () => {
      document.documentElement.style.removeProperty("--global-snow-opacity");
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="expedition-fold expedition-fold--flight accent-scroll-section accent-scroll-section--lite scroll-scene scroll-scene--fold"
    >
      <div className="expedition-fold__pin">
        <HeroFlyProgressBridge progressRef={flyRef}>
          <ExpeditionEverestSky veil={veil} settle={settle} />
        </HeroFlyProgressBridge>
        
        <div className="expedition-fold__stage section-inner relative pointer-events-none">
          
          <motion.div className="expedition-fold__copy" style={{ opacity: copyOpacity }}>
            <p className="section-label">{crewFold.label}</p>
            <p className="section-lead mt-3 max-w-xl">{crewFold.lead}</p>
            <p className="section-description mt-4 max-w-xl">
              {crewFold.before}
              <span className="font-bold">{crewFold.word}</span>
              {crewFold.after}
            </p>
          </motion.div>

          <AnimatedCampBlock progress={progress} camp={baseCamp} enter={[0.12, 0.16]} leave={[0.26, 0.30]} direction="right" />
          <AnimatedCampBlock progress={progress} camp={campI} enter={[0.32, 0.36]} leave={[0.46, 0.50]} direction="left" />
          <AnimatedCampBlock progress={progress} camp={campII} enter={[0.52, 0.56]} leave={[0.66, 0.70]} direction="right" />
          <AnimatedCampBlock progress={progress} camp={summit} enter={[0.72, 0.76]} leave={[0.86, 0.90]} direction="left" />

          <div className="expedition-fold__dock absolute bottom-0 left-0 right-0 z-10 w-full px-[var(--site-pad)] pb-[max(2rem,env(safe-area-inset-bottom))]">
            <motion.div style={{ opacity: dockOpacity }}>
              <p className="section-label">{crewFold.operatorsLabel}</p>
              <h2 className="expedition-crew-heading mt-2">{crewFold.word}</h2>
              <p className="copy mt-3 max-w-xl">{crewFold.operatorsLead}</p>
              <TheOperatorsSpec immediate />
            </motion.div>

            <motion.div className="expedition-beat expedition-beat--dock absolute bottom-0 w-full pb-[max(2rem,env(safe-area-inset-bottom))]" style={{ opacity: notesOpacity }}>
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
              className="expedition-beat expedition-beat--dock absolute bottom-0 w-full pb-[max(2rem,env(safe-area-inset-bottom))]"
              style={{ opacity: deskOpacity, pointerEvents: deskPointer }}
            >
              <p className="section-label">Registered desk</p>
              <div className="expedition-facts mt-5">
                {facts.map((item: any) => (
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
              <motion.div className="mt-5 inline-flex pointer-events-auto" {...SPRING_BOUNCE}>
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

function CrewStatic() {
  return (
    <section className="expedition-fold expedition-fold--static">
      <div className="expedition-sky">
        <div className="expedition-sky__veil"></div>
      </div>
      <div className="expedition-fold__stage section-inner">
        <div className="expedition-fold__copy">
          <p className="section-label">{crewFold.label}</p>
          <p className="section-lead mt-3 max-w-xl">{crewFold.lead}</p>
          <p className="section-description mt-4 max-w-xl">
            {crewFold.before}
            <span className="font-bold">{crewFold.word}</span>
            {crewFold.after}
          </p>
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
