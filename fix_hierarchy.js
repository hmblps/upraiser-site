import fs from 'fs';

// Restore cameras to maximize visual size inside the canvas
const phoneFile = 'src/components/solutions/Phone3D.tsx';
let phoneTsx = fs.readFileSync(phoneFile, 'utf8');
phoneTsx = phoneTsx.replace(/camera=\{\{ position: \[0, -0\.08, flat \? 3\.65 : 4\.05\], fov: 28, near: 0\.05, far: 80 \}\}/, `camera={{ position: [0, -0.08, flat ? 3.15 : 3.48], fov: 28, near: 0.05, far: 80 }}`);
fs.writeFileSync(phoneFile, phoneTsx);

const tabletFile = 'src/components/channel-visuals/Tablet3D.tsx';
let tabletTsx = fs.readFileSync(tabletFile, 'utf8');
tabletTsx = tabletTsx.replace(/camera=\{\{ position: \[0, 0\.15, flat \? 3\.65 : 4\.05\], fov: 28, near: 0\.1, far: 80 \}\}/, `camera={{ position: [0, 0.15, flat ? 3.15 : 3.48], fov: 28, near: 0.1, far: 80 }}`);
fs.writeFileSync(tabletFile, tabletTsx);

// Shrink CSS slots slightly to establish hierarchy without destroying readability
const cssFile = 'src/styles/programmatic-scroll-section.css';
let css = fs.readFileSync(cssFile, 'utf8');
css = css.replace(/width: min\(48%, 21\.5rem\);/, 'width: min(42%, 18.5rem);');
css = css.replace(/width: min\(85%, 32rem\);/, 'width: min(72%, 26rem);');

fs.writeFileSync(cssFile, css);
console.log('Fixed hierarchy');
