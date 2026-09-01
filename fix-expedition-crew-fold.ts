import fs from "fs";

let content = fs.readFileSync("src/components/ExpeditionCrewFold.tsx", "utf-8");

const replacement = `function CrewAnimated() {
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

  const x = useTransform(progress, (p) => {
    if (!points) return 0;
    const lift = smoothstep(p, lift0, lift1);
    const settle = smoothstep(p, settle0, settle1);
    const fromX = lerp(points.inline.x, points.giant.x, lift);
    return lerp(fromX, points.dock.x, settle) - points.inline.x;
  });
  const y = useTransform(progress, (p) => {
    if (!points) return 0;
    const lift = smoothstep(p, lift0, lift1);
    const settle = smoothstep(p, settle0, settle1);
    const fromY = lerp(points.inline.y, points.giant.y, lift);
    return lerp(fromY, points.dock.y, settle) - points.inline.y;
  });
  const scale = useTransform(progress, (p) => {
    if (!points) return 0.2;
    const lift = smoothstep(p, lift0, lift1);
    const settle = smoothstep(p, settle0, settle1);
    const grown = lerp(points.inlineScale, 1, lift);
    return lerp(grown, points.dockScale, settle);
  });
  
  const copyOpacity = useTransform(progress, (p) => 1 - smoothstep(p, 0.08, 0.12));
  const floatOpacity = useTransform(progress, (p) => 1 - smoothstep(p, 0.94, 0.98));
  
  const baseCampOpacity = useBeatOpacity(progress, 0.14, 0.18, 0.26, 0.30);
  const baseCampX = useBeatX(progress, 0.14, 0.18, 0.26, 0.30, 'left');
  
  const campIOpacity = useBeatOpacity(progress, 0.30, 0.34, 0.42, 0.46);
  const campIX = useBeatX(progress, 0.30, 0.34, 0.42, 0.46, 'right');
  
  const campIIOpacity = useBeatOpacity(progress, 0.46, 0.50, 0.58, 0.62);
  const campIIX = useBeatX(progress, 0.46, 0.50, 0.58, 0.62, 'left');
  
  const summitOpacity = useBeatOpacity(progress, 0.62, 0.66, 0.74, 0.78);
  const summitX = useBeatX(progress, 0.62, 0.66, 0.74, 0.78, 'right');
  
  const dockOpacity = useBeatOpacity(progress, 0.76, 0.80, 0.86, 0.88);
  const notesOpacity = useBeatOpacity(progress, 0.84, 0.88, 0.93, 0.95);
  const deskOpacity = useBeatOpacity(progress, 0.93, 0.96, 1.1, 1.2);
  
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
          <span ref={heroMeasureRef} className={\`accent-scroll-hero-word \${wordClass} expedition-crew-measure\`} aria-hidden>
            {crewFold.word}
          </span>

          <motion.div className="expedition-fold__copy" style={{ opacity: copyOpacity }}>
            <p className="section-label">{crewFold.label}</p>
            <p className="section-lead mt-3 max-w-xl">{crewFold.lead}</p>
            <p className="section-description mt-4 max-w-xl">
              {crewFold.before}
              <span
                ref={inlineRef}
                className={\`growth-word-inline\${points ? " expedition-crew-inline--ghost" : ""}\`}
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
              <span className={\`accent-scroll-hero-word \${wordClass}\`}>{crewFold.word}</span>
            </motion.div>
          ) : null}

          {baseCamp ? (
            <motion.div className="expedition-beat" style={{ opacity: baseCampOpacity, x: baseCampX }}>
              <CampCard altitude={baseCamp.altitude} title={baseCamp.title} text={baseCamp.text} />
            </motion.div>
          ) : null}

          {campI ? (
            <motion.div className="expedition-beat text-right" style={{ opacity: campIOpacity, x: campIX, marginLeft: 'auto', right: 0, left: 'auto' }}>
              <CampCard altitude={campI.altitude} title={campI.title} text={campI.text} />
            </motion.div>
          ) : null}

          {campII ? (
            <motion.div className="expedition-beat" style={{ opacity: campIIOpacity, x: campIIX }}>
              <CampCard altitude={campII.altitude} title={campII.title} text={campII.text} />
            </motion.div>
          ) : null}
          
          {summit ? (
            <motion.div className="expedition-beat text-right" style={{ opacity: summitOpacity, x: summitX, marginLeft: 'auto', right: 0, left: 'auto' }}>
              <CampCard altitude={summit.altitude} title={summit.title} text={summit.text} />
            </motion.div>
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
}`;

content = content.replace(/function CrewAnimated\(\) \{[\s\S]*\}\n\nexport function ExpeditionCrewFold/, replacement + "\n\nexport function ExpeditionCrewFold");
fs.writeFileSync("src/components/ExpeditionCrewFold.tsx", content);
