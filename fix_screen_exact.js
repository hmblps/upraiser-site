import fs from 'fs';
const tsxFile = 'src/components/channel-visuals/Tv3D.tsx';
let tsx = fs.readFileSync(tsxFile, 'utf8');

// The screen bleeds past right and bottom bezels.
// From the green lines: content goes ~5% too wide and ~4% too tall.
// Pull w down from 3.66→3.44, h from 2.06→1.96
// Raise y slightly so it sits symmetrically inside the frame.
tsx = tsx.replace(
  /w: 3\.66 \* ratio,\n\s*h: 2\.06 \* ratio,\n\s*y: 0\.022 \* ratio,\n\s*z: 0\.088 \* ratio,/,
  `w: 3.44 * ratio,
    h: 1.96 * ratio,
    y: 0.038 * ratio,
    z: 0.088 * ratio,`
);

fs.writeFileSync(tsxFile, tsx);
console.log('Fixed screen plane to fit inside bezels exactly');
