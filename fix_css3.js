import fs from 'fs';
const cssFile = 'src/styles/programmatic-scroll-section.css';
let css = fs.readFileSync(cssFile, 'utf8');

css = css.replace(/\.prog-device-slot--tv \.tv-glb-canvas \{[\s\S]*?\n\}/, `.prog-device-slot--tv .tv-glb-canvas {
  width: 130% !important;
  height: 130% !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  overflow: visible !important;
}`);

fs.writeFileSync(cssFile, css);
console.log('CSS centered');
