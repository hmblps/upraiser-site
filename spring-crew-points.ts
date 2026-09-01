import fs from "fs";
let content = fs.readFileSync("src/components/ExpeditionCrewFold.tsx", "utf-8");

const oldPointsLogic = `  const x = useTransform(progress, (p) => {
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
  });`;

const newPointsLogic = `  // Apply spring to CREW float animation as well
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
  });`;

content = content.replace(oldPointsLogic, newPointsLogic);
fs.writeFileSync("src/components/ExpeditionCrewFold.tsx", content);
