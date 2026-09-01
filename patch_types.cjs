const fs = require('fs');
const content = fs.readFileSync('src/components/hero-terrain/shared.ts', 'utf8');

const interfaceDef = `
export type AscentPath = {
  startPos: [number, number, number];
  midPos: [number, number, number];
  endPos: [number, number, number];
  startLook: [number, number, number];
  midLook: [number, number, number];
  endLook: [number, number, number];
  startFov: number;
  midFov: number;
  endFov: number;
  bankMax: number;
};
`;

let newContent = content.replace(
  'export type AscentPath = typeof HERO_ASCENT_DEFAULTS;', 
  interfaceDef
);

// Also fix ExpeditionCamera error: Property 'fov' does not exist on type '{ pos: number[]; look: number[]; }'
// wait, EXPEDITION_CLIMB.poses doesn't have fov! I put fovs: [46, 40, 34]. I need to put fov inside poses.

newContent = newContent.replace(
  /export const EXPEDITION_CLIMB = \{[\s\S]*?\};/,
  `export const EXPEDITION_CLIMB = {
  poses: [
    { pos: [-4, 12, 188], look: [18, 28, -28], fov: 46 },
    { pos: [-2, 38, 140], look: [14, 10, -40], fov: 40 },
    { pos: [-10, 72, 122], look: [12, 16, -68], fov: 34 }
  ],
  bankMax: -0.08,
};`
);

fs.writeFileSync('src/components/hero-terrain/shared.ts', newContent);
