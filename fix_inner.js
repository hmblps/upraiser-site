import fs from 'fs';
const tsxFile = 'src/components/channel-visuals/Tv3D.tsx';
let tsx = fs.readFileSync(tsxFile, 'utf8');

tsx = tsx.replace(/w: 3\.58 \* ratio,\n\s*h: 1\.99 \* ratio,\n\s*y: 0\.046 \* ratio,/, `w: 3.68 * ratio,
    h: 2.10 * ratio,
    y: -0.02 * ratio,`);

fs.writeFileSync(tsxFile, tsx);
console.log('Fixed plane fitting');
