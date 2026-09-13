import fs from 'fs';
const tsxFile = 'src/components/channel-visuals/Tv3D.tsx';
let tsx = fs.readFileSync(tsxFile, 'utf8');

tsx = tsx.replace(/w: 3\.44 \* ratio,\n\s*h: 1\.94 \* ratio,\n\s*y: 0\.048 \* ratio,/, `w: 3.58 * ratio,
    h: 1.99 * ratio,
    y: 0.046 * ratio,`);

fs.writeFileSync(tsxFile, tsx);
console.log('Fixed plane size');
