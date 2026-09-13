import fs from 'fs';
const tsxFile = 'src/components/channel-visuals/Tv3D.tsx';
let tsx = fs.readFileSync(tsxFile, 'utf8');

tsx = tsx.replace(/w: 3\.68 \* ratio,\n\s*h: 2\.10 \* ratio,\n\s*y: -0\.02 \* ratio,/, `w: 3.66 * ratio,
    h: 2.06 * ratio,
    y: 0.01 * ratio,`);

fs.writeFileSync(tsxFile, tsx);
console.log('Fixed plane fitting again');
