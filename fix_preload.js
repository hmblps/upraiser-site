import fs from 'fs';

// Fix the preload: change tv.glb to tv-draco.glb
const preloadFile = 'src/lib/scrollPreload.ts';
let preload = fs.readFileSync(preloadFile, 'utf8');
preload = preload.replace('preloadFetch("/channels/oem/tv.glb");', 'preloadFetch("/channels/oem/tv-draco.glb");');
fs.writeFileSync(preloadFile, preload);

// Fix screen plane y offset - from screenshot content is too high, shift down
const tsxFile = 'src/components/channel-visuals/Tv3D.tsx';
let tsx = fs.readFileSync(tsxFile, 'utf8');
tsx = tsx.replace(/w: 3\.66 \* ratio,\n\s*h: 2\.06 \* ratio,\n\s*y: 0\.01 \* ratio,/, `w: 3.66 * ratio,
    h: 2.06 * ratio,
    y: 0.022 * ratio,`);
fs.writeFileSync(tsxFile, tsx);

console.log('Fixed preload path + y offset');
