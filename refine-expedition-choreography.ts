import fs from "fs";

let content = fs.readFileSync("src/components/ExpeditionCrewFold.tsx", "utf-8");

// We need to inject useSpring to the import if it's missing
if (!content.includes("useSpring")) {
  content = content.replace("useMotionValueEvent", "useMotionValueEvent, useSpring");
}

const customComponent = `
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
      className={\`expedition-beat \${alignmentClass}\`} 
      style={{ opacity, x, y, scale, filter }}
    >
      <CampCard altitude={camp.altitude} title={camp.title} text={camp.text} />
    </motion.div>
  );
}

function CrewAnimated() {
`;

content = content.replace("function CrewAnimated() {", customComponent);

// Remove the old beat blocks and replace with the new component
// We can use a regex or just substring replace.
// Let's rewrite the camps logic in CrewAnimated.

const originalCampsLogic = `  const baseCampOpacity = useBeatOpacity(progress, 0.14, 0.18, 0.26, 0.30);
  const baseCampX = useBeatX(progress, 0.14, 0.18, 0.26, 0.30, 'left');
  
  const campIOpacity = useBeatOpacity(progress, 0.30, 0.34, 0.42, 0.46);
  const campIX = useBeatX(progress, 0.30, 0.34, 0.42, 0.46, 'right');
  
  const campIIOpacity = useBeatOpacity(progress, 0.46, 0.50, 0.58, 0.62);
  const campIIX = useBeatX(progress, 0.46, 0.50, 0.58, 0.62, 'left');
  
  const summitOpacity = useBeatOpacity(progress, 0.62, 0.66, 0.74, 0.78);
  const summitX = useBeatX(progress, 0.62, 0.66, 0.74, 0.78, 'right');`;

const newCampsLogic = `
  // The camps will be rendered using AnimatedCampBlock so we don't need these hooks
  const smoothP = useSpring(progress, { stiffness: 60, damping: 18, mass: 0.8 });
  const copyOpacity = useTransform(smoothP, (p) => 1 - smoothstep(p, 0.08, 0.12));
  const floatOpacity = useTransform(smoothP, (p) => 1 - smoothstep(p, 0.94, 0.98));
`;

content = content.replace(originalCampsLogic, "");
// Replace the old copyOpacity/floatOpacity
content = content.replace("const copyOpacity = useTransform(progress, (p) => 1 - smoothstep(p, 0.08, 0.12));", newCampsLogic);
content = content.replace("const floatOpacity = useTransform(progress, (p) => 1 - smoothstep(p, 0.94, 0.98));", "");


const oldCampDivs = `          {baseCamp ? (
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
          ) : null}`;


const newCampDivs = `          {baseCamp ? (
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
          ) : null}`;

content = content.replace(oldCampDivs, newCampDivs);


// Also apply spring to the bottom blocks (Dock, Notes, CTA)
const oldBottomOpacities = `  const dockOpacity = useBeatOpacity(progress, 0.76, 0.80, 0.86, 0.88);
  const notesOpacity = useBeatOpacity(progress, 0.84, 0.88, 0.93, 0.95);
  const deskOpacity = useBeatOpacity(progress, 0.93, 0.96, 1.1, 1.2);`;

const newBottomOpacities = `  const dockOpacity = useBeatOpacity(smoothP, 0.76, 0.80, 0.86, 0.88);
  const notesOpacity = useBeatOpacity(smoothP, 0.84, 0.88, 0.93, 0.95);
  const deskOpacity = useBeatOpacity(smoothP, 0.93, 0.96, 1.1, 1.2);`;

content = content.replace(oldBottomOpacities, newBottomOpacities);


fs.writeFileSync("src/components/ExpeditionCrewFold.tsx", content);
