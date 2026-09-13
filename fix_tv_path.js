import fs from 'fs';
const tsxFile = 'src/components/channel-visuals/Tv3D.tsx';
let tsx = fs.readFileSync(tsxFile, 'utf8');

tsx = tsx.replace(/const MODEL_PATH = "\/channels\/oem\/tv\.glb";/, 'const MODEL_PATH = "/channels/oem/tv-draco.glb";');

fs.writeFileSync(tsxFile, tsx);
console.log('Fixed TV path');
