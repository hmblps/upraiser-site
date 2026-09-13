import fs from 'fs';

// Phone
const phoneFile = 'src/components/solutions/Phone3D.tsx';
let phoneTsx = fs.readFileSync(phoneFile, 'utf8');
phoneTsx = phoneTsx.replace(/camera=\{\{ position: \[0, -0\.08, flat \? 3\.15 : 3\.48\], fov: 28, near: 0\.05, far: 80 \}\}/, `camera={{ position: [0, -0.08, flat ? 3.65 : 4.05], fov: 28, near: 0.05, far: 80 }}`);
fs.writeFileSync(phoneFile, phoneTsx);

// Tablet
const tabletFile = 'src/components/channel-visuals/Tablet3D.tsx';
let tabletTsx = fs.readFileSync(tabletFile, 'utf8');
tabletTsx = tabletTsx.replace(/camera=\{\{ position: \[0, 0\.15, flat \? 3\.15 : 3\.48\], fov: 28, near: 0\.1, far: 80 \}\}/, `camera={{ position: [0, 0.15, flat ? 3.65 : 4.05], fov: 28, near: 0.1, far: 80 }}`);
fs.writeFileSync(tabletFile, tabletTsx);

console.log('Scaled down phone and tablet');
