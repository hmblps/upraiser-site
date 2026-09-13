import fs from 'fs';

// Fix CSS
const cssFile = 'src/styles/programmatic-scroll-section.css';
let css = fs.readFileSync(cssFile, 'utf8');
css = css.replace(/\.prog-device-slot--tv \.prog-device-load,\n\.prog-device-slot--tv \.tv-glb-canvas \{[\s\S]*?\n\}/, `.prog-device-slot--tv .prog-device-load {
  width: 100% !important;
  height: 100% !important;
  overflow: visible !important;
}

.prog-device-slot--tv .tv-glb-canvas {
  width: 130% !important;
  height: 130% !important;
  position: absolute !important;
  top: -15% !important;
  left: -15% !important;
  overflow: visible !important;
}`);
fs.writeFileSync(cssFile, css);

// Fix TSX
const tsxFile = 'src/components/channel-visuals/Tv3D.tsx';
let tsx = fs.readFileSync(tsxFile, 'utf8');
tsx = tsx.replace(/camera=\{\{ position: \[0, 0\.02, flat \? 4\.75 : 5\.15\], fov: flat \? 30 : 31, near: 0\.1, far: 100 \}\}/, `camera={{ position: [0, 0.02, flat ? 5.7 : 6.05], fov: flat ? 30 : 31, near: 0.1, far: 100 }}`);
tsx = tsx.replace(/style=\{\{ width: "100%", height: "100%", display: "block", background: "transparent", pointerEvents: "none" \}\}/, `style={{ width: "130%", height: "130%", left: "-15%", top: "-15%", position: "absolute", display: "block", background: "transparent", pointerEvents: "none" }}`);
fs.writeFileSync(tsxFile, tsx);

console.log('Fixed');
